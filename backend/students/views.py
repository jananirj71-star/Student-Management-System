from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """
    Full CRUD API for Student records.

    GET    /api/students/        -> list (supports ?search= and ?course=)
    POST   /api/students/        -> create
    GET    /api/students/{id}/   -> retrieve
    PUT    /api/students/{id}/   -> full update
    PATCH  /api/students/{id}/   -> partial update
    DELETE /api/students/{id}/   -> delete
    """

    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        course = self.request.query_params.get("course")
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(roll_no__icontains=search)
                | Q(email__icontains=search)
            )
        if course:
            qs = qs.filter(course=course)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Student deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
