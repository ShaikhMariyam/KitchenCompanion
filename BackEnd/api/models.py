from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from .managers import *

class User (AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def profile(self):
        profile = Profile.objects.get(user=self)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.TextField(max_length=100)
    allergies = models.TextField(max_length=1000)
    allergylist = models.TextField(default=list)
    recipes = models.TextField(default=list)
    favorites = models.TextField(default=list)

    verified = models.BooleanField(default=False)

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, created, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)

class Recipe(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    Name = models.CharField(max_length=255)
    AuthorId = models.IntegerField(blank=True, null=True)
    AuthorName = models.CharField(max_length=255, blank=True)
    CookTime = models.CharField(max_length=50)
    PrepTime = models.CharField(max_length=50)
    TotalTime = models.CharField(max_length=50, blank=True, null=True)
    DatePublished = models.CharField(max_length=50)
    Description = models.TextField()
    ImageURLs = models.TextField()
    Images = models.ImageField(upload_to='recipe_images/', blank=True, null=True)   
    RecipeCategory = models.CharField(max_length=100)
    Keywords = models.TextField()
    RecipeIngredientQuantities = models.TextField(blank=True, null=True)
    RecipeIngredientParts = models.TextField(blank=True, null=True)
    AggregatedRating = models.CharField(max_length=50, blank=True, validators=[RegexValidator(regex=r'^\d+$|^NA$', message='Enter a valid number or NA.')])
    ReviewCount = models.CharField(max_length=50, blank=True, validators=[RegexValidator(regex=r'^\d+$|^NA$', message='Enter a valid number or NA.')])
    Calories = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    FatContent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    CarbohydrateContent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ProteinContent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    RecipeServings = models.CharField(max_length=50, validators=[RegexValidator(regex=r'^\d+$|^NA$', message='Enter a valid number or NA.')])
    RecipeYield = models.CharField(max_length=50)
    RecipeInstructions = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.Name
