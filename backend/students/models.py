from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.db import models


class Student(models.Model):
    COURSE_CHOICES = [
        ("CSE", "Computer Science & Engineering"),
        ("ECE", "Electronics & Communication Engineering"),
        ("MECH", "Mechanical Engineering"),
        ("CIVIL", "Civil Engineering"),
        ("IT", "Information Technology"),
        ("OTHER", "Other"),
    ]

    roll_no = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(r"^[A-Za-z0-9\-]+$", "Roll number may only contain letters, digits and hyphens.")],
        help_text="Unique roll / registration number",
    )
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(
        max_length=15,
        blank=True,
        validators=[RegexValidator(r"^\+?\d{7,15}$", "Enter a valid phone number (7-15 digits, optional +).")],
    )
    course = models.CharField(max_length=10, choices=COURSE_CHOICES, default="OTHER")
    year = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Year of study (1-5)",
    )
    gpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        default=0,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.roll_no} - {self.name}"
