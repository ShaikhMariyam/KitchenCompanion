from django.contrib.admin.views.decorators import staff_member_required
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status, generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q
from .serializers import *
from .models import *
from .validations import *
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import get_user_model, login, logout, authenticate
from django.views.generic import View
from django.views import View
from django.core.serializers import serialize
from django.core.exceptions import ObjectDoesNotExist
from collections import defaultdict

class RecipeSearchView(View):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        query = request.GET.get('query')

        if query:
            # Filter recipes by searching for query in Name field
            recipes = Recipe.objects.filter(Q(Name__icontains=query))
        else:
            recipes = Recipe.objects.all()

        recipes = recipes.order_by('id')[:20]  # Limit to top 20 results
        
        # Serialize the queryset into JSON response
        serialized_recipes = [
            {
                'id': recipe.id,
                'Name': recipe.Name,
                'AuthorName': recipe.AuthorName,
                'RecipeCategory': recipe.RecipeCategory,
                'ImageURLs': recipe.ImageURLs,
            } for recipe in recipes
        ]

        return JsonResponse(serialized_recipes, safe=False)
    

class recipes_by_category(View):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, category):
        try:
            recipes = Recipe.objects.filter(RecipeCategory__contains=category)
            serializer = RecipeSerializer(recipes, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Recipe.DoesNotExist:
            return Response({"message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

class ingredient_list(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        recipes = Recipe.objects.all()
        ingredient_counts = defaultdict(int)  # Initialize a dictionary to count occurrences
        
        # Count occurrences of each ingredient
        for recipe in recipes:
            ingredients = recipe.RecipeIngredientParts.split(', ')
            for ingredient in ingredients:
                ingredient_counts[ingredient] += 1
        
        sorted_ingredients = sorted(ingredient_counts.items(), key=lambda x: x[1], reverse=True)

        # ingredient_strings = [f"{ingredient[0]} ({ingredient[1]})" for ingredient in sorted_ingredients]
        ingredient_strings = [f"{ingredient[0]}" for ingredient in sorted_ingredients]

        return Response(ingredient_strings, status=status.HTTP_200_OK)

class CategoryListView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        recipes = Recipe.objects.all()
        category_counts = defaultdict(int)  
        
        for recipe in recipes:
            categories = recipe.RecipeCategory.split(', ')
            for category in categories:
                category_counts[category] += 1
        
        sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)

        category_strings = [f"{category[0]}" for category in sorted_categories]

        return Response(category_strings, status=status.HTTP_200_OK)

@api_view(['GET'])
def category_list(request):
    recipes = Recipe.objects.all()
    category_counts = defaultdict(int) 
    
    # Count occurrences of each category
    for recipe in recipes:
        categories = recipe.RecipeCategory.split(', ')
        for category in categories:
            category_counts[category] += 1
    
    # Sort categories by occurrences in ascending order
    sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)

    # Create a list of strings containing category name and count  ({category[1]})
    category_strings = [f"{category[0]}" for category in sorted_categories]

    return Response(category_strings, status=status.HTTP_200_OK)

class RecipePagination(PageNumberPagination):
    page_size = 50

class RecipeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny] 
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    pagination_class = RecipePagination

    def list(self, request):
        category = request.query_params.get('category') 
        keywords_str = request.query_params.get('Keywords')
        queryset = self.queryset
        if category: 
            queryset = queryset.filter(RecipeCategory=category)
        
        if keywords_str:
            keywords = self.parse_keywords(keywords_str)
            if keywords:
                keyword_filters = Q()
                for keyword in keywords:
                    keyword_filters |= Q(keywords__contains=keyword)
                queryset = queryset.filter(keyword_filters)


        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def parse_keywords(self, keywords_str):
        if keywords_str.startswith('c(') and keywords_str.endswith(')'):
            keywords_str = keywords_str[2:-1]  # Remove 'c(' and ')'
            keywords = [keyword.strip()[1:-1] for keyword in keywords_str.split(',')]  # Remove leading and trailing quotes
            return keywords
        return []

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            recipe = serializer.save()
            user = request.user  # Assuming you have authentication set up and user is available in request
            if user:
                profile = user.profile  # Get the profile associated with the user
                if profile:
                    if profile.recipes:  # Check if recipes field is not empty
                        recipe_ids = profile.recipes.split(',')  # Split existing recipe IDs
                    else:
                        recipe_ids = []
                    recipe_ids.append(str(recipe.id))  # Append new recipe ID as string
                    profile.recipes = ','.join(recipe_ids)  # Join back into a comma-separated string
                    profile.save()  # Save the profile to persist the changes

            return Response(serializer.data, status=201) 
        return Response(serializer.errors, status=400) 


    def retrieve(self, request, pk=None):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({"message": "Recipe not found"}, status=404)  
        serializer = self.serializer_class(recipe)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({"message": "Recipe not found"}, status=404) 

        serializer = self.serializer_class(recipe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400) 

    def partial_update(self, request, pk=None):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({"message": "Recipe not found"}, status=404)  

        serializer = self.serializer_class(recipe, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({"message": "Recipe not found"}, status=404) 
        
        id = recipe.id
        
        recipe.delete()
        
        if request.user:
            user = request.user  # Assuming you have authentication set up and user is available in request
            profile = user.profile  # Get the profile associated with the user
            if profile:
                if profile.recipes:
                    recipe_ids = profile.recipes.split(',')
                    if str(recipe.id) in recipe_ids:
                        recipe_ids.remove(str(id))
                        profile.recipes = ','.join(recipe_ids)
                        profile.save()

        return Response(status=204) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def IngredientRecipeSearchView(request):
    ingredients = request.GET.get('ingredients')
    if not ingredients:
        return JsonResponse({'message': 'Ingredients are required'}, status=400)

    ingredient_list = [ingredient.strip().lower() for ingredient in ingredients.split(',')]
    print(f"Input ingredients: {ingredient_list}")  # Print input ingredients

    recipes = Recipe.objects.all()

    user = request.user
    if user.is_authenticated:
        profile = user.profile  # Get the profile associated with the user
        if profile:
            allergies_str = profile.allergylist.strip()  # Remove any leading/trailing whitespace
            # Clean up allergies_str to remove unwanted characters
            allergies_str = allergies_str.replace("'", "").replace("[", "").replace("]", "")
            allergies = [allergy.strip().lower() for allergy in allergies_str.split(',')]
            print(f"User allergies: {allergies}")  # Print user's allergy list
    else:
        allergies = []
        print("User is not authenticated or has no allergies.")

    def recipe_matches_ingredients(recipe):
        recipe_ingredients = [ingredient.strip().lower() for ingredient in recipe.RecipeIngredientParts.split(', ')]
        return all(ingredient in recipe_ingredients for ingredient in ingredient_list)
    
    def recipe_contains_allergens(recipe):
        recipe_ingredients = [ingredient.strip().lower() for ingredient in recipe.RecipeIngredientParts.split(', ')]
        return any(allergen in recipe_ingredients for allergen in allergies)

    filtered_recipes = [recipe for recipe in recipes if recipe_matches_ingredients(recipe)]

    if user.is_authenticated:
        filtered_recipes = [recipe for recipe in filtered_recipes if not recipe_contains_allergens(recipe)]

    serialized_recipes = [{
        'id': recipe.id,
        'Name': recipe.Name,
        'AuthorName': recipe.AuthorName,
        'ImageURLs': recipe.ImageURLs,
        'RecipeCategory': recipe.RecipeCategory,
        'RecipeIngredientParts': recipe.RecipeIngredientParts
    } for recipe in filtered_recipes]

    return JsonResponse(serialized_recipes, safe=False)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserToken

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protectedView(request):
    output = f"Welcome {request.user}, Authentication Successful"
    return Response({'response':output}, status=status.HTTP_200_OK)

@api_view(['GET'])
def view_all_routes(request):
    data = [
        'api/token/refresh/',
        'api/register/',
        'api/token/'
    ]
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def save_allergies(request):
    new_allergies = request.data.get('allergies', [])
    allergylist = request.data.get('allergylist', [])

    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return Response({'message': 'Profile not found'}, status=404)
        
    profile.allergies = new_allergies  
    profile.save()

    profile.allergylist = allergylist 
    profile.save()

    return Response({'message': 'Allergies updated successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def userInfo(request):
    user = request.user
    serializer = UserWithProfileSerializer(user)
    return Response(serializer.data)

def get_top_rated_recipes(request):
    recipes = Recipe.objects.all().exclude(AggregatedRating='NA').order_by('-AggregatedRating') 
    
    serialized_recipes = [{
        'id': recipe.id,
        'Name': recipe.Name,
        'AuthorName': recipe.AuthorName,
        'ImageURLs': recipe.ImageURLs,
        'RecipeCategory': recipe.RecipeCategory,
        'Ratings': recipe.AggregatedRating  
    } for recipe in recipes]

    return JsonResponse(serialized_recipes, safe=False)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def addFavorite(request):
    new_favorite = request.data.get('recipeId', None)

    if new_favorite is None:
        return Response({'message': 'recipeId not provided'}, status=400)
    
    profile = request.user.profile
    
    if profile:
        if profile.favorites:
            favorites = profile.favorites.split(',')
        else:
            favorites = []
        
        # Append new favorite if it's not already in the list
        if str(new_favorite) not in favorites:
            favorites.append(str(new_favorite))
            profile.favorites = ','.join(favorites)
            profile.save()
    
    return Response({'message': 'Favorite added successfully'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def removeFavorite(request):
    remove_favorite = request.data.get('recipeId', None)
    
    if remove_favorite is None:
        return Response({'message': 'recipeId not provided'}, status=400)
    
    profile = request.user.profile
    
    if profile and profile.favorites:
        favorites = profile.favorites.split(',')
        
        if str(remove_favorite) in favorites:
            favorites.remove(str(remove_favorite))
            profile.favorites = ','.join(favorites)
            profile.save()
    
    return Response({'message': 'Favorite removed successfully'})

def user_registration_activity(request):
    registered_users = User.objects.all().count()
    active_users = User.objects.filter(last_login__isnull=False).count()
    return {
        'registered_users': registered_users,
        'active_users': active_users
    }

def toprecipes(request):
    recipes = Recipe.objects.all().exclude(AggregatedRating='NA').order_by('-AggregatedRating')[:10]
    
    serialized_recipes = [{
        'id': recipe.id,
        'Name': recipe.Name,
        'AuthorName': recipe.AuthorName,
        'ImageURLs': recipe.ImageURLs,
        'RecipeCategory': recipe.RecipeCategory,
        'Ratings': recipe.AggregatedRating  
    } for recipe in recipes]

    # Create a list of dictionaries with 'name' and 'rating' keys
    ingredient_list = [{'name': recipe['Name'], 'rating': recipe['Ratings']} for recipe in serialized_recipes]

    return ingredient_list


def ingredient_lists(request):
    recipes = Recipe.objects.all()
    ingredient_counts = defaultdict(int)
    
    # Count occurrences of each ingredient
    for recipe in recipes:
        ingredients = recipe.RecipeIngredientParts.split(', ')
        for ingredient in ingredients:
            ingredient_counts[ingredient.strip()] += 1  # strip to remove any leading/trailing whitespace

    # Sort ingredients by count in descending order
    sorted_ingredients = sorted(ingredient_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Return only the top 20 ingredients
    top_20_ingredients = sorted_ingredients[:10]
    
    # Prepare list of ingredient dictionaries with ingredient and count
    ingredient_list = [{'ingredient': ingredient[0], 'count': ingredient[1]} for ingredient in top_20_ingredients]
    
    return ingredient_list

def category_lists(request):
    recipes = Recipe.objects.all()
    category_counts = defaultdict(int)
    for recipe in recipes:
        categories = recipe.RecipeCategory.split(', ')
        for category in categories:
            category_counts[category.strip()] += 1  # strip to remove any leading/trailing whitespace

    sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
    
    top_20_categories = sorted_categories[:10]
    
    category_list = [{'category': category[0], 'count': category[1]} for category in top_20_categories]
    
    return category_list

def new_recipe_additions(request):
    new_recipes = Recipe.objects.order_by('-DatePublished')[:10]
    serialized_recipes = [{
        'id': recipe.id,
        'Name': recipe.Name,
        'AuthorName': recipe.AuthorName,
        'ImageURLs': recipe.ImageURLs,
        'RecipeCategory': recipe.RecipeCategory,
    } for recipe in new_recipes]
    return serialized_recipes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_reports(request):
    user_registration_activity_report = user_registration_activity(request)
    top_recipe_ratings_report = toprecipes(request)
    ingredients_usage_report = ingredient_lists(request)
    recipe_categories_report = category_lists(request)
    new_recipe_additions_report = new_recipe_additions(request)

    data = {
        'registered_users': user_registration_activity_report['registered_users'],
        'active_users': user_registration_activity_report['active_users'],
        'top_rated_recipes': top_recipe_ratings_report,
        'ingredients_usage': ingredients_usage_report,
        'recipe_categories': recipe_categories_report,
        'new_recipes': new_recipe_additions_report,
    }

    return Response(data)

def new_recipe_additions(request):
    new_recipes = Recipe.objects.order_by('-DatePublished')[:10]
    serialized_recipes = [{
        'id': recipe.id,
        'Name': recipe.Name,
        'AuthorName': recipe.AuthorName,
        'ImageURLs': recipe.ImageURLs,
        'RecipeCategory': recipe.RecipeCategory,
    } for recipe in new_recipes]
    return serialized_recipes

def update_recipe(pk, data):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return {"message": "Recipe not found"}, status.HTTP_404_NOT_FOUND
    
    serializer = RecipeSerializer(recipe, data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data, status.HTTP_200_OK
    return serializer.errors, status.HTTP_400_BAD_REQUEST

def delete_recipe(pk):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return {"message": "Recipe not found"}, status.HTTP_404_NOT_FOUND
    
    recipe.delete()
    return None, status.HTTP_204_NO_CONTENT

# @staff_member_required
# def admin_only_view(request):
#     if request.user.is_authenticated and request.user.is_staff:
#         # User is authenticated and is an admin (staff member)
#         if request.user.is_staff:
#             death = "ok"
#         print(f"Input ingredients: {death}")  # Print input ingredients
#         return JsonResponse({'message': 'You are authenticated as admin.'})
#     else:
#         # User is not authenticated or not an admin
#         return JsonResponse({'error': 'Unauthorized'}, status=401)
