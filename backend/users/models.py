from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Story(models.Model):
    story_name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    section_size = models.PositiveIntegerField(default=0)

    genre = models.CharField(max_length=100)

    def __str__(self):
        return self.story_name

class Section(models.Model):
    section_name = models.CharField(max_length=255)
    story = models.ForeignKey(Story, related_name='sections', on_delete=models.CASCADE)
    branch_size = models.PositiveIntegerField(default=0)
    section_number = models.CharField(max_length=255)
    section_writing = models.TextField()

    class Meta:
        unique_together = ('story', 'section_number')  # Ensures uniqueness of section_number within a story

    def __str__(self):
        return f"Section {self.section_number}: {self.section_name}"

class Branch(models.Model):
    section = models.ForeignKey(Section, related_name='branches', on_delete=models.CASCADE)
    branch_option = models.CharField(max_length=255)
    branch_number = models.PositiveIntegerField()
    branch_writing = models.TextField()
    is_converted = models.BooleanField(default=False)  # New field
    is_clicked = models.PositiveIntegerField() # New field

    def __str__(self):
        return f"Branch {self.branch_number}: {self.branch_option}"
    
    class Meta:
        unique_together = ('section', 'branch_number')  # Ensures uniqueness of branch_number within a section

class UserInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, null=True, blank=True, on_delete=models.CASCADE)
    time_spent = models.PositiveIntegerField(default=0)  # Time spent in seconds
    timestamp = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.user} - {self.story} - {self.section} - {self.branch}"
