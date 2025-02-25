from django.urls import path
from api import views

urlpatterns = [
    path('', views.getRoutes,name="getRoutes"),
    path('hotels/', views.getHotels,name="getHotels"),
    path('hotels/<int:pk>/', views.getHotel,name="getHotel"),
    path('users/', views.getUsers,name="getUsers"),
    path('users/profile/', views.getUserProfile, name="getUserProfile"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]