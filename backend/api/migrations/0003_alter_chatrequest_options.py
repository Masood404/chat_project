# Generated by Django 5.0.6 on 2024-10-11 12:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_chatrequest_unique_together'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chatrequest',
            options={'ordering': ('created_at',)},
        ),
    ]
