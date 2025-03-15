# Generated by Django 4.2.19 on 2025-03-15 11:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
        ("history", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="history",
            name="userid",
            field=models.ForeignKey(
                default=21, on_delete=django.db.models.deletion.CASCADE, to="users.user"
            ),
            preserve_default=False,
        ),
    ]
