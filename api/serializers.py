from rest_framework import serializers
from .models import Hotel, Room, Booking
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

class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_contact = serializers.CharField(source='user.profile.contact_no', read_only=True)
    user_address = serializers.CharField(source='user.profile.address', read_only=True)
    user_nid = serializers.CharField(source='user.profile.nid_number', read_only=True)
    user_image = serializers.ImageField(source='user.profile.image', read_only=True)
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)
    hotel_location = serializers.CharField(source='hotel.location', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    room_type = serializers.CharField(source='room.type', read_only=True)
    room_guests = serializers.IntegerField(source='room.guests', read_only=True)
    room_bed_config = serializers.CharField(source='room.bed_config', read_only=True)
    room_price = serializers.DecimalField(source='room.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_nights = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'hotel', 'room', 'check_in_date', 'check_out_date', 
            'user_name', 'user_email', 'user_contact',
            'user_address', 'user_nid', 'user_image', 'hotel_name', 'hotel_location',
            'room_name', 'room_type', 'room_guests', 'room_bed_config', 'room_price',
            'total_price', 'total_nights'
        ]

    def get_total_price(self, obj):
        from datetime import datetime
        check_in = datetime.strptime(str(obj.check_in_date), '%Y-%m-%d')
        check_out = datetime.strptime(str(obj.check_out_date), '%Y-%m-%d')
        nights = (check_out - check_in).days
        return float(obj.room.price) * nights

    def get_total_nights(self, obj):
        from datetime import datetime
        check_in = datetime.strptime(str(obj.check_in_date), '%Y-%m-%d')
        check_out = datetime.strptime(str(obj.check_out_date), '%Y-%m-%d')
        return (check_out - check_in).days