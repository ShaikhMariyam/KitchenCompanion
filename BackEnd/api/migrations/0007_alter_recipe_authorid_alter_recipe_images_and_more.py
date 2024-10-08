# Generated by Django 5.0.4 on 2024-06-03 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_recipe_aggregatedrating_alter_recipe_authorid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='AuthorId',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='Images',
            field=models.ImageField(blank=True, null=True, upload_to='recipe_images/'),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='RecipeIngredientParts',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='RecipeIngredientQuantities',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='RecipeInstructions',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='TotalTime',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
