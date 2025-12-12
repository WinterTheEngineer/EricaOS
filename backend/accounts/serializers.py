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


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # email or phone
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        if not identifier or not password:
            raise serializers.ValidationError("Both identifier and password are required.")

        # Attempt to fetch user by email or phone
        try:
            if "@" in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(phone=identifier)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_active:
            raise serializers.ValidationError("User is inactive.")

        attrs["user"] = user
        return attrs