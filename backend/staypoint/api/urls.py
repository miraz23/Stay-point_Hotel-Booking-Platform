from django.urls import path
from api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes,name="getRoutes"),
    path('hotels/', views.getHotels,name="getHotels"),
    path('hotels/<int:pk>/', views.getHotel,name="getHotel"),
    path('users/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]