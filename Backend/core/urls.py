"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_root(request):
    """
    Friendly landing page for http://127.0.0.1:8000/ so developers
    see a useful response instead of the default 404.
    """
    return JsonResponse(
        {
            "service": "Freelance Platform API",
            "status": "ok",
            "endpoints": {
                "health": "/api/health/",
                "admin": "/admin/",
            },
        }
    )

urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/", include("platform_api.urls")),
]
