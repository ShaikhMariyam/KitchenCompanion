# Generated by Django 5.0.4 on 2024-06-24 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_remove_user_birthday_remove_user_email_token_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='allergylist',
            field=models.CharField(default='', max_length=1000),
        ),
    ]
