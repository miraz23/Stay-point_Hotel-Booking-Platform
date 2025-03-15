from django.urls import path
from api import views

urlpatterns = [
    path('', views.getRoutes,name="getRoutes"),
    path('hotels/', views.getHotels,name="getHotels"),
    path('hotels/<int:pk>/', views.getHotel,name="getHotel"),
    path('users/', views.getUsers,name="getUsers"),
    path('users/profile/', views.getUserProfile, name="getUserProfile"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/signin/', views.signin, name='signin'),
    path('activate/<uidb64>/<token>',views.ActivateAccountView.as_view(),name='activate'),
    path('users/forgot-password/', views.forgot_password, name="forgot-password"),
    path('users/reset-password/<uidb64>/<token>/', views.reset_password, name="reset-password"),
    path('users/profile/', views.getUserProfile, name="getUserProfile"),
]