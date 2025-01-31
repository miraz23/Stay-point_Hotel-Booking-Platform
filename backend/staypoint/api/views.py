from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .hotels import hotels

# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    return Response('Stay Point')

@api_view(['GET'])
def getHotels(request):
    return Response(hotels)