# Generated by Django 5.1 on 2024-09-08 09:43

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section_name', models.CharField(max_length=255)),
                ('branch_size', models.PositiveIntegerField(default=0)),
                ('section_number', models.CharField(max_length=255)),
                ('section_writing', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Branch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('branch_option', models.CharField(max_length=255)),
                ('branch_number', models.PositiveIntegerField()),
                ('branch_writing', models.TextField()),
                ('is_converted', models.BooleanField(default=False)),
                ('is_clicked', models.PositiveIntegerField()),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='branches', to='users.section')),
            ],
            options={
                'unique_together': {('section', 'branch_number')},
            },
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('story_name', models.CharField(max_length=255)),
                ('section_size', models.PositiveIntegerField(default=0)),
                ('genre', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='section',
            name='story',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='users.story'),
        ),
        migrations.CreateModel(
            name='UserInteraction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_spent', models.PositiveIntegerField(default=0)),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('branch', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.branch')),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.section')),
                ('story', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.story')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='section',
            unique_together={('story', 'section_number')},
        ),
    ]
