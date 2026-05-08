from django.db import models

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
    
    
    
