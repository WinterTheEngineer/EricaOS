from .models import User
from .serializers import SignupSerializer

from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

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