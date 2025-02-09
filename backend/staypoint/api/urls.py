from django.urls import path
from api import views

urlpatterns = [
    path('', views.getRoutes,name="getRoutes"),
    path('hotels/', views.getHotels,name="getHotels"),
    path('hotels/<int:pk>/', views.getHotel,name="getHotel"),
]