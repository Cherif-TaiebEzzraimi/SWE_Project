from django.http import JsonResponse


def health_check(request):
    """
    Lightweight endpoint so the frontend/devops team can
    verify the Django app is running and connected properly.
    """
    return JsonResponse({"status": "ok"})
