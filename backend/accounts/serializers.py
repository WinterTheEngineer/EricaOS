from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField
from .models import User

class SignupSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    phone = PhoneNumberField(required=False, allow_null=True, region=None)  # allow any region
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "phone", "password"]

    def validate(self, attrs):
        # Check email uniqueness
        if User.objects.filter(email=attrs.get("email")).exists():
            raise serializers.ValidationError({"email": "Email already in use."})

        # Check phone uniqueness if provided
        if attrs.get("phone") and User.objects.filter(phone=attrs["phone"]).exists():
            raise serializers.ValidationError({"phone": "Phone number already in use."})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user
