from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class UserDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    contact_no = models.CharField(max_length=11)
    nid_number = models.CharField(max_length=10)
    address = models.TextField()
    is_host = models.BooleanField(default=False)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    class Meta:
        verbose_name = "User Details"
        verbose_name_plural = "User Details"

    def __str__(self):
        return self.user.username
    

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserDetails.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Hotel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    rating = models.FloatField()
    image = models.ImageField(upload_to='hotel_images/', null=True, blank=True)
    check_in_time = models.TimeField(default="12:00")
    check_out_time = models.TimeField(default="10:00")
    amenities = models.JSONField(default=list)
    
    def __str__(self):
        return self.name


class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="rooms")
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    bed_config = models.CharField(max_length=50)
    guests = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_rooms = models.PositiveIntegerField(default=0)
    booked_rooms = models.PositiveIntegerField(default=0)
    description = models.TextField()
    amenities = models.JSONField(default=list)
    image = models.ImageField(upload_to='room_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.hotel.name}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    check_in_date = models.DateField()
    check_out_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.hotel.name} - {self.room.name}"