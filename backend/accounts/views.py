import requests
from .models import User
from django.conf import settings
from google.oauth2 import id_token
from .serializers import SignupSerializer

from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from google.auth.transport import requests as google_requests
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken


# -------------------------
# SIGNUP
# -------------------------
class SignupView(generics.CreateAPIView):
    """
    Handles user registration.
    """
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "id": str(user.id),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# LOGIN (JWT)
# -------------------------
class MyTokenObtainPairView(APIView):
    """
    Custom email/password JWT login.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "email and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = email.lower().strip()

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"detail": "User is inactive"},
                status=status.HTTP_403_FORBIDDEN
            )

        if not user.check_password(password):
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)


# -------------------------
# FIELD VALIDATION (EMAIL ONLY)
# -------------------------
class ValidateFieldView(APIView):
    """
    Checks whether a user email already exists.
    """
    permission_classes = [AllowAny]

    def post(self, request, field):
        value = request.data.get("value", "").strip().lower()

        if not value:
            return Response(
                {"detail": "Value is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if field != "email":
            return Response(
                {"detail": "Unsupported field."},
                status=status.HTTP_400_BAD_REQUEST
            )

        exists = User.objects.filter(email=value).exists()

        return Response({
            "exists": exists,
            "available": not exists
        }, status=status.HTTP_200_OK)


class GoogleLogin(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        code = request.data.get("code")

        print(settings.GOOGLE_REDIRECT_URI)
        print(settings.GOOGLE_CLIENT_ID)

        try:
            response = requests.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": "postmessage",
                    "grant_type": "authorization_code",
                },
            )
        except requests.exceptions.RequestException:
            return Response(
                {"error": "Could not reach Google's servers"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        token_data = response.json()

        id_info = id_token.verify_oauth2_token(
            token_data["id_token"],
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

        user = User.objects.filter(email=id_info['email']).first()

        if user is not None:
            if user.profile.google_sub is None:
                user.profile.google_sub = id_info["sub"]
                user.profile.save()
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "exists": True,
                        "authorize": True,
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                    },
                    status=status.HTTP_200_OK,
                )
            elif user.profile.google_sub == id_info["sub"]:
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "exists": True,
                        "authorize": True,
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response({"exists": True, "authorize": False}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"exists": False, "authorize": False}, status=status.HTTP_404_NOT_FOUND)
    

class DisplayProfile(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response(request.user.profile.get_display_profile(request))