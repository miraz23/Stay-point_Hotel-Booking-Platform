from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Hotel
from .serializers import HotelSerializer, UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializerWithToken
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    return Response('Stay Point')

@api_view(['GET'])
def getHotels(request):
    hotels = Hotel.objects.all()
    serializer = HotelSerializer(hotels, many=True)

    print(serializer.data)

    return Response(serializer.data)

@api_view(['GET'])
def getHotel(request, pk):
    hotel = Hotel.objects.get(id=pk)
    serializer = HotelSerializer(hotel, many=False)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user=request.user
    serializer=UserSerializer(user, many=False)
    return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer=UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v       
        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer