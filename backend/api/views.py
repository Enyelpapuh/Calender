from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view # type: ignore

def home(request):
    return HttpResponse("<h1>Servidor Django funcionando correctamente ✅</h1><p>El backend está activo.</p>")


def reminders_list(request):
    data = [
        {"id": 1, "title": "Recordatorio A", "date": "2025-10-25"},
        {"id": 2, "title": "Recordatorio B", "date": "2025-10-26"},
    ]
    return JsonResponse(data, safe=False)
