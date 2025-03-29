from django.urls import path
from api import views

urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/signin/', views.signin, name='signin'),
    path('activate/<uidb64>/<token>',views.ActivateAccountView.as_view(),name='activate'),
    path('users/forgot-password/', views.forgot_password, name="forgot-password"),
    path('users/reset-password/<uidb64>/<token>/', views.reset_password, name="reset-password"),
    path('users/profile/', views.getUserProfile, name="getUserProfile"),
    path('users/update-profile/', views.updateUserProfile, name="update-user-profile"),
    path('users/bookings/', views.getUserBookings, name="getUserBookings"),

    path('hotels/', views.getHotels,name="getHotels"),
    path('hotels/<int:pk>/', views.getHotel,name="getHotel"),
    path('hotels/add-hotel/', views.addHotel, name="addHotel"),
    path('hotels/<int:pk>/update/', views.updateHotel, name="updateHotel"),
    path('hotels/<int:pk>/delete/', views.deleteHotel, name="deleteHotel"),
    path('rooms/add-room/', views.addRoom, name="addRoom"),
    path('rooms/<int:pk>/update/', views.updateRoom, name="updateRoom"),
    path('rooms/<int:pk>/delete/', views.deleteRoom, name="deleteRoom"),
    path('bookings/create/', views.createBooking, name="createBooking"),
]