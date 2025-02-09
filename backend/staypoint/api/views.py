from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Hotel
from .serializers import HotelSerializer

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