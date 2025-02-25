from rest_framework import serializers
from .models import Hotel
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField(read_only=True)
    isAdmin=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=['id','username','email','name','isAdmin']
    
    def get_name(self,obj):
        firstname=obj.first_name
        lastname=obj.last_name
        name=firstname+' '+lastname
        if name==' ':
            name='Set Your Name'
        return name
    
    def get_id(self,obj):
        id=obj.id
    
    def get_isAdmin(self,obj):
        return obj.is_staff

class UserSerializerWithToken(UserSerializer):
    token=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=['id','username','email','name','isAdmin','token']

    def get_token(self,obj):
        token=RefreshToken.for_user(obj)
        return str(token.access_token)