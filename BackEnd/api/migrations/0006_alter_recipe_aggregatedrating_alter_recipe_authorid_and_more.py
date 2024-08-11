# Generated by Django 5.0.4 on 2024-06-03 18:12

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_recipe_imageurls_alter_recipe_images'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='AggregatedRating',
            field=models.CharField(blank=True, max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')]),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='AuthorId',
            field=models.IntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='AuthorName',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='Images',
            field=models.ImageField(blank=True, upload_to='recipe_images/'),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='RecipeIngredientParts',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='RecipeIngredientQuantities',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='RecipeInstructions',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='ReviewCount',
            field=models.CharField(blank=True, max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')]),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='TotalTime',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
