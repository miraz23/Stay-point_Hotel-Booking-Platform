from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import UserDetails, Hotel, Room, Booking
from .serializers import HotelSerializer, UserSerializer, RoomSerializer, BookingSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.contrib.auth.hashers import make_password
from .utils import generate_token
from django.conf import settings
from rest_framework import status
from django.views import View
import threading, json
from datetime import datetime

# Create your views here.

class EmailThread(threading.Thread):
    def __init__(self, email_message):
        self.email_message = email_message
        threading.Thread.__init__(self)

    def run(self):
        self.email_message.send()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer=UserSerializer(self.user).data
        for k,v in serializer.items():
            data[k]=v       
        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer


@api_view(['POST'])
def signin(request):
    data = request.data
    image = request.FILES.get('image')

    if User.objects.filter(email=data['email']).exists():
        return Response({"detail": "A user with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create(
            first_name=data['fname'],
            last_name=data['lname'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False
        )

        profile = user.profile
        profile.contact_no = data.get('contactNo')
        profile.nid_number = data.get('nid')
        profile.address = data.get('address')
        if image:
            profile.image = image

        profile.save()

        email_subject = "Activate Your Account"
        message = render_to_string(
            "activate.html",
            {
                'user': user,
                'domain': '127.0.0.1:8000',
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': generate_token.make_token(user)
            }
        )
        email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [data['email']])
        EmailThread(email_message).start()

        serialize = UserSerializer(user, many=False)
        return Response(serialize.data)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ActivateAccountView(View):
    def get(self,request,uidb64,token):
        try:
            uid=force_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=uid)
        except Exception as identifier:
            user=None
        if user is not None and generate_token.check_token(user,token):
            user.is_active=True
            user.save()
            return render(request,"activatesuccess.html")
        else:
            return render(request,"activatefail.html")


@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')

    try:
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:5173/auth/reset-password/{uid}/{token}/"

        email_subject = "Reset Your Password"
        message = render_to_string("password_reset_email.html", {'reset_link': reset_link})
        email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [email])
        EmailThread(email_message).start()

        return Response({"detail": "Password reset email sent!"}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def reset_password(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get('password')
        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password reset successful!"}, status=status.HTTP_200_OK)

    except (User.DoesNotExist, ValueError):
        return Response({"detail": "Error resetting password"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user

    serializer = UserSerializer(user, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data
    image = request.FILES.get('image')

    try:
        user.first_name = data.get('fname', user.first_name)
        user.last_name = data.get('lname', user.last_name)
        user.email = data.get('email', user.email)
        if data.get('password'):
            user.set_password(data['password'])

        profile = user.profile
        profile.contact_no = data.get('contactNo', profile.contact_no)
        profile.nid_number = data.get('nid', profile.nid_number)
        profile.address = data.get('address', profile.address)
        if image:
            profile.image = image

        user.save()
        profile.save()

        return Response(UserSerializer(user, context={'request': request}).data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Hotel functionality
@api_view(['GET'])
def getHotels(request):
    hotels = Hotel.objects.all()
    serializer = HotelSerializer(hotels, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def getHotel(request, pk):
    hotel = Hotel.objects.get(id=pk)
    serializer = HotelSerializer(hotel, many=False)

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addHotel(request):
    data = request.data
    image = request.FILES.get('image')

    try:
        amenities = json.loads(data.get('amenities', '[]'))

        hotel = Hotel.objects.create(
            user=request.user,
            name=data['name'],
            description=data['description'],
            location=data['location'],
            rating=data.get('rating', 0),
            image=image,
            check_in_time=data.get('checkIn', '12:00'),
            check_out_time=data.get('checkOut', '10:00'),
            amenities=amenities,
        )

        request.user.profile.is_host = True
        request.user.profile.save()

        serializer = HotelSerializer(hotel, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addRoom(request):
    data = request.data
    image = request.FILES.get('image')

    try:
        amenities = json.loads(data.get('amenities', '[]'))
        room = Room.objects.create(
            hotel_id=data['hotel_id'],
            name=data['name'],
            type=data['type'],
            bed_config=data['bedConfig'],
            guests=int(data['guests']),
            price=float(data['price']),
            num_rooms=int(data['numRooms']),
            description=data['description'],
            amenities=amenities,
            image=image,
        )

        serializer = RoomSerializer(room, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("Error:", str(e))
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateHotel(request, pk):
    try:
        hotel = Hotel.objects.get(id=pk)
        
        # Check if the user owns this hotel
        if hotel.user != request.user:
            return Response({"detail": "You don't have permission to update this hotel"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        image = request.FILES.get('image')

        hotel.name = data.get('name', hotel.name)
        hotel.description = data.get('description', hotel.description)
        hotel.location = data.get('location', hotel.location)
        hotel.rating = float(data.get('rating', hotel.rating))
        hotel.check_in_time = data.get('checkIn', hotel.check_in_time)
        hotel.check_out_time = data.get('checkOut', hotel.check_out_time)
        hotel.amenities = json.loads(data.get('amenities', '[]'))
        
        if image:
            hotel.image = image

        hotel.save()

        serializer = HotelSerializer(hotel, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Hotel.DoesNotExist:
        return Response({"detail": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateRoom(request, pk):
    try:
        room = Room.objects.get(id=pk)
        hotel = room.hotel
        
        # Check if the user owns this hotel
        if hotel.user != request.user:
            return Response({"detail": "You don't have permission to update this room"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        image = request.FILES.get('image')

        room.name = data.get('name', room.name)
        room.type = data.get('type', room.type)
        room.bed_config = data.get('bedConfig', room.bed_config)
        room.guests = int(data.get('guests', room.guests))
        room.price = float(data.get('price', room.price))
        room.num_rooms = int(data.get('numRooms', room.num_rooms))
        room.description = data.get('description', room.description)
        room.amenities = json.loads(data.get('amenities', '[]'))
        
        if image:
            room.image = image

        room.save()

        serializer = RoomSerializer(room, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Room.DoesNotExist:
        return Response({"detail": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteRoom(request, pk):
    try:
        room = Room.objects.get(id=pk)
        hotel = room.hotel
        
        # Check if the user owns this hotel
        if hotel.user != request.user:
            return Response({"detail": "You don't have permission to delete this room"}, status=status.HTTP_403_FORBIDDEN)

        room.delete()
        return Response({"detail": "Room deleted successfully"}, status=status.HTTP_200_OK)

    except Room.DoesNotExist:
        return Response({"detail": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteHotel(request, pk):
    try:
        hotel = Hotel.objects.get(id=pk)
        
        # Check if the user owns this hotel
        if hotel.user != request.user:
            return Response({"detail": "You don't have permission to delete this hotel"}, status=status.HTTP_403_FORBIDDEN)

        hotel.delete()
        return Response({"detail": "Hotel deleted successfully"}, status=status.HTTP_200_OK)

    except Hotel.DoesNotExist:
        return Response({"detail": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createBooking(request):
    try:
        data = request.data
        room = Room.objects.get(id=data['roomId'])
        hotel = Hotel.objects.get(id=data['hotelId'])

        # Check if dates are valid
        check_in = datetime.strptime(data['checkIn'], '%Y-%m-%d').date()
        check_out = datetime.strptime(data['checkOut'], '%Y-%m-%d').date()

        if check_in >= check_out:
            return Response({"detail": "Check-out date must be after check-in date"}, 
                          status=status.HTTP_400_BAD_REQUEST)

        if check_in < datetime.now().date():
            return Response({"detail": "Check-in date cannot be in the past"}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Create the booking
        booking = Booking.objects.create(
            user=request.user,
            hotel=hotel,
            room=room,
            check_in_date=check_in,
            check_out_date=check_out
        )

        serializer = BookingSerializer(booking, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except (Room.DoesNotExist, Hotel.DoesNotExist):
        return Response({"detail": "Room or Hotel not found"}, 
                      status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserBookings(request):
    try:
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)