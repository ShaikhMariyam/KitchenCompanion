from django.contrib import admin
from .models import *

from import_export.admin import  ImportExportModelAdmin

class RecipeAdmin(ImportExportModelAdmin):
    list_display = ['Name', 'AuthorName', 'CookTime', 'TotalTime', 'DatePublished']  # Customize the fields displayed in the list view
    readonly_fields = ['Name', 'AuthorId', 'AuthorName', 'CookTime', 'PrepTime', 'TotalTime', 'DatePublished', 'Description', 'Images', 'RecipeCategory', 'Keywords', 'RecipeIngredientQuantities', 'RecipeIngredientParts', 'AggregatedRating', 'ReviewCount', 'Calories', 'FatContent', 'CarbohydrateContent', 'ProteinContent', 'RecipeServings', 'RecipeYield', 'RecipeInstructions']

admin.site.register(Recipe, RecipeAdmin)
# admin.site.register(User)

class UserAdmin(admin.ModelAdmin):
    list_display = ['email']

class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['full_name', 'user', 'verified']

admin.site.register(User,UserAdmin)
admin.site.register(Profile, ProfileAdmin)
