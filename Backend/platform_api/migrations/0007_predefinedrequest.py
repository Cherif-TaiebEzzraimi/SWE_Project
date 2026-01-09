# Generated migration for PredefinedRequest model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('platform_api', '0006_alter_help_status_alter_negotiation_status_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PredefinedRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('category', models.CharField(blank=True, max_length=120, null=True)),
                ('estimated_budget_min', models.DecimalField(blank=True, decimal_places=2, help_text='Estimated minimum budget', max_digits=10, null=True)),
                ('estimated_budget_max', models.DecimalField(blank=True, decimal_places=2, help_text='Estimated maximum budget', max_digits=10, null=True)),
                ('icon', models.CharField(blank=True, help_text='Icon name or emoji', max_length=50, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'predefined_requests',
                'ordering': ['category', 'title'],
            },
        ),
        migrations.AddIndex(
            model_name='predefinedrequest',
            index=models.Index(fields=['category', 'is_active'], name='predefined__category_is_ac_idx'),
        ),
        migrations.AddIndex(
            model_name='predefinedrequest',
            index=models.Index(fields=['is_active'], name='predefined__is_acti_idx'),
        ),
    ]
