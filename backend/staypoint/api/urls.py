from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes,name="getRoutes"),
    path('hotels/', views.getHotels,name="getHotels"),
]