from django.db import models

class UserProfile(models.Model):
    username = models.CharField(max_length=150)
    email = models.CharField(max_length=254, unique=True)
    password = models.CharField(max_length=255)
    isAdmin = models.BooleanField(default=False)

    def __str__(self):
        return self.email

class Job(models.Model):
    jobId = models.CharField(max_length=50, unique = True)
    jobTitle = models.CharField(max_length=100)
    companyName = models.CharField(max_length=100)
    salary = models.CharField(max_length=50)
    experience = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=[('Open', 'Open'), ('Closed', 'Closed')])
    description = models.TextField()
    
    def __str__(self):
        return self.jobTitle
    
    
class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, null=True, blank=True)
    user_email = models.CharField(max_length=100)
    
    class Meta:
        unique_together = ('job', 'user_email')
    
    def __str__(self):
        return f"{self.user_email} - {self.job.jobTitle}"
