from django.contrib import admin
from .models import UserDetails, Hotel, Room, Booking

# Register your models here.

admin.site.register(UserDetails)
admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(Booking)