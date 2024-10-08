# Generated by Django 5.0.4 on 2024-05-03 03:47

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Name', models.CharField(max_length=255)),
                ('AuthorId', models.IntegerField()),
                ('AuthorName', models.CharField(max_length=255)),
                ('CookTime', models.CharField(max_length=50)),
                ('PrepTime', models.CharField(max_length=50)),
                ('TotalTime', models.CharField(max_length=50)),
                ('DatePublished', models.CharField(max_length=50)),
                ('Description', models.TextField()),
                ('Images', models.TextField()),
                ('RecipeCategory', models.CharField(max_length=100)),
                ('Keywords', models.TextField()),
                ('RecipeIngredientQuantities', models.TextField()),
                ('RecipeIngredientParts', models.TextField()),
                ('AggregatedRating', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('ReviewCount', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('Calories', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('FatContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('SaturatedFatContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('CholesterolContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('SodiumContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('CarbohydrateContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('FiberContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('SugarContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('ProteinContent', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('RecipeServings', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator(message='Enter a valid number or NA.', regex='^\\d+$|^NA$')])),
                ('RecipeYield', models.CharField(max_length=50)),
                ('RecipeInstructions', models.TextField()),
            ],
        ),
    ]
