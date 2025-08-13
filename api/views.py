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
from datetime import datetime, timedelta

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
            total_rooms=int(data['totalRooms']),
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
        room.total_rooms = int(data.get('totalRooms', room.total_rooms))
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

        # Check if room is available
        if room.total_rooms <= 0:
            return Response({"detail": "No rooms available for booking"}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Create the booking
        booking = Booking.objects.create(
            user=request.user,
            hotel=hotel,
            room=room,
            check_in_date=check_in,
            check_out_date=check_out
        )

        # Update room availability
        room.total_rooms -= 1
        room.booked_rooms += 1
        room.save()

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

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteBooking(request, pk):
    try:
        booking = Booking.objects.get(id=pk)
        
        # Check if the user owns this booking
        if booking.user != request.user:
            return Response({"detail": "You don't have permission to delete this booking"}, status=status.HTTP_403_FORBIDDEN)

        # Restore room availability before deleting the booking
        room = booking.room
        room.total_rooms += 1
        room.booked_rooms -= 1
        room.save()

        booking.delete()
        return Response({"detail": "Booking deleted successfully"}, status=status.HTTP_200_OK)

    except Booking.DoesNotExist:
        return Response({"detail": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def searchHotels(request):
    location = request.GET.get('location', '')
    check_in = request.GET.get('checkIn', '')
    check_out = request.GET.get('checkOut', '')
    guests = request.GET.get('guests', 1)

    try:
        # Convert string dates to datetime objects
        check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
        check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()

        # Get hotels matching the location
        hotels = Hotel.objects.filter(location__icontains=location)
        
        # Filter hotels that have rooms available for the specified dates and guests
        available_hotels = []
        for hotel in hotels:
            # Get all rooms that can accommodate the requested number of guests
            potential_rooms = hotel.rooms.filter(guests__gte=guests)
            
            for room in potential_rooms:
                # Get all bookings for this room
                bookings = Booking.objects.filter(room=room)
                
                # Check if the room is available for the requested dates
                is_available = True
                for booking in bookings:
                    # If there's any overlap between the requested dates and existing bookings
                    if (check_in_date <= booking.check_out_date and check_out_date >= booking.check_in_date):
                        is_available = False
                        break
                
                if is_available:
                    available_hotels.append(hotel)
                    break  # Break once we find an available room for this hotel

        serializer = HotelSerializer(available_hotels, many=True)
        return Response(serializer.data)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getHotelBookings(request, pk):
    try:
        hotel = Hotel.objects.get(id=pk)
        
        # Check if the user owns this hotel
        if hotel.user != request.user:
            return Response({"detail": "You don't have permission to view these bookings"}, status=status.HTTP_403_FORBIDDEN)

        # Get all bookings for this hotel's rooms
        bookings = Booking.objects.filter(hotel=hotel)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Hotel.DoesNotExist:
        return Response({"detail": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getHotelAnalytics(request, pk):
    try:
        hotel = Hotel.objects.get(id=pk)
        
        # Check if the user owns this hotel
        if hotel.user != request.user:
            return Response({"detail": "You don't have permission to view these analytics"}, 
                          status=status.HTTP_403_FORBIDDEN)

        # Get all bookings for this hotel
        bookings = Booking.objects.filter(hotel=hotel)
        
        # Calculate total revenue
        total_revenue = sum(booking.room.price * (booking.check_out_date - booking.check_in_date).days 
                          for booking in bookings)
        
        # Get bookings from last year for comparison
        last_year = datetime.now() - timedelta(days=365)
        last_year_bookings = bookings.filter(check_in_date__gte=last_year)
        last_year_revenue = sum(booking.room.price * (booking.check_out_date - booking.check_in_date).days 
                              for booking in last_year_bookings)
        
        # Calculate revenue change percentage
        revenue_change = ((total_revenue - last_year_revenue) / last_year_revenue * 100 
                        if last_year_revenue > 0 else 0)
        
        # Calculate total bookings and change
        total_bookings = bookings.count()
        last_year_total_bookings = last_year_bookings.count()
        bookings_change = ((total_bookings - last_year_total_bookings) / last_year_total_bookings * 100 
                          if last_year_total_bookings > 0 else 0)
        
        # Calculate average occupancy
        total_rooms = sum(room.total_rooms for room in hotel.rooms.all())
        booked_rooms = sum(room.booked_rooms for room in hotel.rooms.all())
        avg_occupancy = (booked_rooms / total_rooms * 100) if total_rooms > 0 else 0
        
        # Calculate occupancy change (comparing with last month)
        last_month = datetime.now() - timedelta(days=30)
        last_month_bookings = bookings.filter(check_in_date__gte=last_month)
        last_month_booked_rooms = sum(1 for _ in last_month_bookings)
        last_month_occupancy = (last_month_booked_rooms / total_rooms * 100) if total_rooms > 0 else 0
        occupancy_change = ((avg_occupancy - last_month_occupancy) / last_month_occupancy * 100 
                          if last_month_occupancy > 0 else 0)
        
        # Get average rating and change
        avg_rating = hotel.rating or 0
        rating_change = 0.3  # Placeholder for rating change
        
        analytics_data = {
            'totalRevenue': float(total_revenue),
            'totalBookings': total_bookings,
            'avgOccupancy': round(avg_occupancy, 1),
            'avgRating': round(avg_rating, 1),
            'revenueChange': round(revenue_change, 1),
            'bookingsChange': round(bookings_change, 1),
            'occupancyChange': round(occupancy_change, 1),
            'ratingChange': rating_change
        }
        
        return Response(analytics_data, status=status.HTTP_200_OK)

    except Hotel.DoesNotExist:
        return Response({"detail": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)