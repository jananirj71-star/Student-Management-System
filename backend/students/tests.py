from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Student


class StudentCRUDTests(APITestCase):
    def setUp(self):
        self.student = Student.objects.create(
            roll_no="CSE001", name="Asha Rao", email="asha@example.com",
            course="CSE", year=2, gpa=8.5,
        )
        self.list_url = reverse("student-list")

    def detail_url(self, pk):
        return reverse("student-detail", args=[pk])

    def test_create_student_valid(self):
        payload = {
            "roll_no": "CSE002", "name": "Ravi Kumar", "email": "ravi@example.com",
            "phone": "9876543210", "course": "CSE", "year": 1, "gpa": 7.2,
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)

    def test_create_student_missing_required_field(self):
        payload = {"roll_no": "CSE003", "email": "x@example.com", "year": 1}
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_student_duplicate_roll_no(self):
        payload = {
            "roll_no": "CSE001", "name": "Dup Student", "email": "dup@example.com",
            "year": 1, "gpa": 5,
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_student_invalid_email(self):
        payload = {
            "roll_no": "CSE004", "name": "Bad Email", "email": "not-an-email",
            "year": 1, "gpa": 5,
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_students(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(len(response.data["results"]), 1)

    def test_retrieve_student(self):
        response = self.client.get(self.detail_url(self.student.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["roll_no"], "CSE001")

    def test_retrieve_invalid_id(self):
        response = self.client.get(self.detail_url(9999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_student_valid(self):
        response = self.client.patch(self.detail_url(self.student.id), {"gpa": 9.1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(str(self.student.gpa), "9.10")

    def test_update_student_invalid_id(self):
        response = self.client.patch(self.detail_url(9999), {"gpa": 9.1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_student_valid(self):
        response = self.client.delete(self.detail_url(self.student.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)

    def test_delete_student_invalid_id(self):
        response = self.client.delete(self.detail_url(9999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_filter(self):
        response = self.client.get(self.list_url, {"search": "Asha"})
        self.assertEqual(response.data["count"], 1)
        response = self.client.get(self.list_url, {"search": "Nonexistent"})
        self.assertEqual(response.data["count"], 0)
