from .models import User
from rest_framework.views import APIView
from .serializers import SignupSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

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
            "field": field,
            "value": value,
            "exists": exists
        })