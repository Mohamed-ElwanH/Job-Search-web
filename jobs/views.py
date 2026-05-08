from django.shortcuts import render, redirect
from .models import Job

def home(request):
    return render(request, 'jobs/Home.html')

def index(request):
    return render(request, 'jobs/Index.html')

def login_view(request):
    return render(request, 'jobs/LogIn.html')

def signup(request):
    return render(request, 'jobs/SignUp.html')

def admin_main(request):
    return render(request, 'jobs/AdminMain.html')

def user_main(request):
    return render(request, 'jobs/UserMain.html')

def job_details(request):
    return render(request, 'jobs/JobDetails.html')

def applied_jobs(request):
    return render(request, 'jobs/AppliedJobs.html')

def edit_job(request):
    return render(request, 'jobs/EditJob.html')

def add_job(request):
    if request.method == 'POST':
        Job.objects.create(
            jobId=request.POST['jobId'],
            jobTitle=request.POST['jobTitle'],
            companyName=request.POST['companyName'],
            salary=request.POST['salary'],
            experience=request.POST['experience'],
            location=request.POST['location'],
            status=request.POST['status'],
            description=request.POST['description'],
        )
        return redirect('add_job')
    return render(request, 'jobs/AddJob.html')