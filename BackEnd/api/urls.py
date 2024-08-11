from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenRefreshView)
from . import views

urlpatterns = [
    path('search/', RecipeSearchView.as_view(), name='recipe_search'),
    path('ingredients/', ingredient_list.as_view(), name='ingredient-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('category/<str:category>/', recipes_by_category.as_view(), name='category-view'),
    path('search-by-ingredients/', views.IngredientRecipeSearchView, name='search_by_ingredients'),
    path('save_allergies/', views.save_allergies, name='save_allergies'),
    path('get_top_rated_recipes/', views.get_top_rated_recipes, name='get_top_rated_recipes'),
    path('addFavorite/', views.addFavorite, name='addFavorite'),
    path('removeFavorite/', views.removeFavorite, name='removeFavorite'),
    path('reports/', views.admin_reports, name='removeFavorite'),
    path('recipes/<int:pk>/update/', views.update_recipe, name='update_recipe'),
    path('recipes/<int:pk>/delete/', views.delete_recipe, name='delete_recipe'),


    path('token/', views.MyTokenObtainPairView.as_view(),name="token-obtain"),
    path('token/refresh/', TokenRefreshView.as_view(), name="refresh-token"),
    path('register/', views.RegisterView.as_view(), name="register-user"),
    path('test/', views.protectedView, name="test"),
    path('user/', views.userInfo, name="user"),
    path('', views.view_all_routes, name="all-routes")

]

router = DefaultRouter()
router.register('recipe', RecipeViewSet, basename='recipe')

urlpatterns += router.urls
