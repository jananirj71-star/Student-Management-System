from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "roll_no",
            "name",
            "email",
            "phone",
            "course",
            "year",
            "gpa",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()

    def validate_roll_no(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Roll number cannot be empty.")
        qs = Student.objects.filter(roll_no__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this roll number already exists.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        qs = Student.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this email already exists.")
        return value
