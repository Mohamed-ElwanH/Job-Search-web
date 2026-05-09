from django.shortcuts import render, redirect
from .models import Job , Application
from django.shortcuts import render, redirect
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt



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
def apply_job(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        jobID = data.get('jobID')
        user_email = data.get('user_email')
        if(Application.objects.filter(Job_id=jobID, user_email=user_email).exists()):
            return JsonResponse({'message': 'You have already applied for this job.'}, status=400)
        else:  
             Application.objects.create(Job_id=jobID, user_email=user_email)
             return JsonResponse({'message': 'Application submitted successfully.'}, status=200)
        
def withdraw_application(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        jobID = data.get('jobID')
        user_email = data.get('user_email')
        application = Application.objects.filter(Job_id=jobID, user_email=user_email).delete()
        return JsonResponse({'message': 'Application withdrawn successfully.'}, status=200)     
def applied_jobs(request):
    return render(request, 'jobs/AppliedJobs.html')
def grt_applied_jobs(request):
    user_email = request.GET.get('user_email')
    applications = Application.objects.filter(user_email=user_email).select_related('Job')
    applied_jobs_data = [
        {
            'jobId': application.Job.jobId,
            'jobTitle': application.Job.jobTitle,
            'companyName': application.Job.companyName,
            'salary': application.Job.salary,
            'experience': application.Job.experience,
            'location': application.Job.location,
            'status': application.Job.status,
            'description': application.Job.description,
        }
        for application in applications
    ]
    return JsonResponse({'applied_jobs': applied_jobs_data})

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