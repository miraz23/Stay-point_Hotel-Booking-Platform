from rest_framework import serializers
from .models import Hotel, Room
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    contact_no = serializers.SerializerMethodField()
    nid_number = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    is_host = serializers.SerializerMethodField(read_only=True)
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'contact_no', 'address', 'nid_number', 'image', 'is_host', 'token']

    def get_name(self, obj):
        firstname = obj.first_name
        lastname = obj.last_name
        name = f"{firstname} {lastname}".strip()
        return name if name else "Set Your Name"

    def get_contact_no(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.contact_no if profile else "N/A"

    def get_address(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.address if profile else "N/A"
    
    def get_nid_number(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.nid_number if profile else "N/A"

    def get_image(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile and profile.image:
            request = self.context.get('request')
            return request.build_absolute_uri(profile.image.url) if request else profile.image.url
        return "N/A"
    
    def get_is_host(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.is_host if profile else False

    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
class HotelSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "user",
            "name",
            "description",
            "location",
            "rating",
            "image",
            "check_in_time",
            "check_out_time",
            "amenities",
            "rooms",
        ]

    def get_rooms(self, obj):
        rooms = Room.objects.filter(hotel=obj)
        return RoomSerializer(rooms, many=True).data

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'