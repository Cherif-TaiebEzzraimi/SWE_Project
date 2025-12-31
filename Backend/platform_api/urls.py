from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static  import static
from rest_framework.routers import DefaultRouter
from . import views 

router = DefaultRouter()


urlpatterns = [
    path('users/', views.soft_get_user, name='soft_delete_user'),
    path('', views.getRoutes),

    path("admin/", admin.site.urls),

    path('auth/register/freelancer/', views.register_freelancer, name='register_freelancer'),
    path('auth/register/client/', views.register_client, name='register_client'),
    path('auth/register/company/', views.register_company, name='register_company'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/verify-email/<str:token>/', views.verify_email, name='verify_email'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),
    path('auth/reset-password/', views.reset_password, name='reset_password'),

    # Freelancers
    path('freelancers/<int:id>/', views.get_freelancer, name='get_freelancer'),
    path('freelancers/<int:id>/update/', views.update_freelancer, name='update_freelancer'),
    path('freelancers/<int:id>/password/', views.update_freelancer_password, name='update_freelancer_password'),
    path('freelancers/<int:id>/upload-photo/', views.upload_profile_photo_freelancer, name='upload_profile_photo_freelancer'),
    path('freelancers/<int:id>/photo/', views.delete_profile_photo_freelancer, name='delete_profile_photo_freelancer'),

    # Clients
    path('clients/<int:id>/', views.get_client, name='get_client'),
    path('clients/<int:id>/update/', views.update_client, name='update_client'),
    path('clients/<int:id>/password/', views.update_client_password, name='update_client_password'),
    path('clients/<int:id>/upload-photo/', views.upload_profile_photo_client, name='upload_profile_photo_client'),
    path('clients/<int:id>/photo/', views.delete_profile_photo_client, name='delete_profile_photo_client'),

    # Companies
    path('companies/<int:id>/', views.get_company, name='get_company'),
    path('companies/<int:id>/update/', views.update_company, name='update_company'),
    path('companies/<int:id>/password/', views.update_company_password, name='update_company_password'),

    # Users
    path('users/<int:id>/', views.soft_delete_user, name='soft_delete_user'),
    # Requests
    path('requests/', views.requests_list_create, name='requests_list_create'),
    path('requests/client/<int:client_id>/', views.list_client_requests, name='list_client_requests'),
    path('requests/<int:id>/', views.request_detail, name='request_detail'),
    # Negotiations
    path('negotiations/directhire/<int:freelancer_id>/', views.create_direct_hire, name='create_direct_hire'),
    path('negotiations/<int:request_id>/create/', views.create_from_request, name='create_from_request'),
    path('negotiations/<int:id>/', views.negotiation_detail, name='negotiation_detail'),
    path('negotiations/<int:id>/phases/', views.add_phase, name='add_phase'),
    path('negotiations/phases/<int:phase_id>/', views.negotiation_phase_detail, name='negotiation_phase_detail'),
    path('negotiations/<int:id>/agree/', views.agree_negotiation, name='agree_negotiation'),
    path('negotiations/<int:id>/decline/', views.decline_negotiation, name='decline_negotiation'),
    # Projects
    path('projects/user/<int:user_id>/', views.list_projects_for_user, name='list_projects_for_user'),
    path('projects/<int:id>/phases/', views.project_phases_list_create, name='project_phases_list_create'),
    path('projects/<int:id>/phases/<int:phase_id>/', views.project_phase_detail, name='project_phase_detail'),
    path('projects/phases/<int:phase_id>/start/', views.start_phase, name='start_phase'),
    path('projects/phases/<int:phase_id>/submit/', views.submit_phase, name='submit_phase'),
    path('projects/phases/<int:phase_id>/approve/', views.approve_phase, name='approve_phase'),
    path('projects/phases/<int:phase_id>/next/', views.next_phase, name='next_phase'),
    path('projects/<int:id>/', views.get_project_detail, name='get_project_detail'),
    path('projects/phases/<int:phase_id>/reject/', views.reject_phase, name='reject_phase'),
    # Comments
    path('negotiations/<int:id>/comments/', views.negotiation_comments, name='negotiation_comments'),
    path('comments/<int:id>/', views.update_or_delete_comment, name='update_or_delete_comment'),
    path('comments/<int:id>/resolve/', views.resolve_comment, name='resolve_comment'),
    path('comments/<int:id>/reply/', views.reply_to_comment, name='reply_to_comment'),

    # Media / Files
    path('media/upload/', views.upload_media, name='upload_media'),
    path('media/<str:entity_type>/<int:entity_id>/', views.list_media, name='list_media'),
    path('media/<int:id>/', views.delete_media, name='delete_media'),

    # FAQ
    path('faq/', views.get_faqs, name='get_faqs'),
    path('admin/faq/', views.admin_add_faq, name='admin_add_faq'),
    path('admin/faq/<int:id>/', views.admin_manage_faq, name='admin_manage_faq'),

    # Reviews
    path('reviews/', views.create_review, name='create_review'),
    path('reviews/freelancer/<int:freelancer_id>/', views.list_reviews_for_freelancer, name='list_reviews_for_freelancer'),
    path('reviews/<int:id>/', views.update_or_delete_review, name='update_or_delete_review'),

    # Help
    path('help/', views.create_help, name='create_help'),
    path('help/my/', views.my_help_requests, name='my_help_requests'),
    path('help/<int:id>/resolve/', views.resolve_help_request, name='resolve_help_request'),

    # Admin / Stats / Catalog
    path('admin/stats/users/', views.admin_stats_users, name='admin_stats_users'),
    path('admin/stats/posts/', views.admin_stats_posts, name='admin_stats_posts'),
    path('admin/stats/requests/', views.admin_stats_requests, name='admin_stats_requests'),
    path('admin/stats/negotiations/', views.admin_stats_negotiations, name='admin_stats_negotiations'),
    path('admin/stats/projects/', views.admin_stats_projects, name='admin_stats_projects'),

    path('admin/skills/', views.admin_add_skill, name='admin_add_skill'),
    path('admin/categories/', views.admin_add_category, name='admin_add_category'),
    path('skills/', views.list_skills, name='list_skills'),
    path('categories/', views.list_categories, name='list_categories'),

    path('admin/reports/', views.admin_list_reports, name='admin_list_reports'),
    path('admin/reports/<int:id>/resolve/', views.admin_resolve_report, name='admin_resolve_report'),

    # Community
    path('community/posts/', views.community_posts, name='community_posts'),
    path('community/posts/<int:post_id>/', views.community_post_detail, name='community_post_detail'),
    path('community/posts/<int:post_id>/comments/', views.community_comments, name='community_comments'),
    path('community/posts/<int:post_id>/comments/<int:comment_id>/', views.community_comment_detail, name='community_comment_detail'),
    path('community/comments/<int:comment_id>/reply/', views.community_comment_reply, name='community_comment_reply'),
    path('community/posts/<int:post_id>/like/', views.community_like, name='community_like'),
    path('community/posts/<int:post_id>/likes/', views.community_post_likes, name='community_post_likes'),

    # Offers
    path('offers/', views.offers_list_create, name='offers_list_create'),
    path('offers/<int:offer_id>/', views.offers_detail, name='offers_detail'),
    path('offers/company/<int:company_id>/', views.offers_by_company, name='offers_by_company'),

    # Reports
    path('reports/', views.reports_list_create, name='reports_list_create'),
    path('reports/<int:report_id>/', views.reports_detail, name='reports_detail'),
    path('reports/my/', views.reports_list_create, name='reports_my'),  # Same endpoint, filtered by authenticated user

    # Notifications
    path('notifications/', views.create_notification, name='create_notification'),
    path('notifications/my/', views.notifications_my, name='notifications_my'),
    path('notifications/<int:notification_id>/', views.notification_detail, name='notification_detail'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


