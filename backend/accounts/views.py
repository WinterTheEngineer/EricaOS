from .models import User
from rest_framework.views import APIView
from .serializers import SignupSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

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
                "phone": str(user.phone) if user.phone else None
            }, status=status.HTTP_201_CREATED)
        else:
            # Log the errors for debugging
            print("Signup serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        identifier = request.data.get("identifier")
        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {"detail": "Identifier and password required"},
                status=400
            )

        if "@" in identifier:
            user = User.objects.filter(email=identifier.lower()).first()
        else:
            user = User.objects.filter(phone=identifier).first()
        
        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=401
            )
        if not user.is_active:
            return Response(
                {"detail": "User is inactive"},
                status=403
            )

        if not user.check_password(password):
            return Response(
                {"detail": "Password is incorrect, try again."},
                status=401
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class ValidateFieldView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, field):
        value = request.data.get("value", "").strip()

        if not value:
            return Response(
                {"detail": "Value is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Select field
        if field == "email":
            exists = User.objects.filter(email=value).exists()

        elif field == "phone":
            exists = User.objects.filter(phone=value).exists()

        else:
            return Response(
                {"detail": "Invalid field."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "valid": exists
        })