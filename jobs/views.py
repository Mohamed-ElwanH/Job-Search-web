import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from .models import Job, Application

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
        data = json.loads(request.body)
        if Job.objects.filter(jobId=data['jobId']).exists():
            return JsonResponse({'error': 'Job with this ID already exists.'}, status=400)
        Job.objects.create(
            jobId=data['jobId'],
            jobTitle=data['jobTitle'],
            companyName=data['companyName'],
            salary=data['salary'],
            experience=data['experience'],
            location=data['location'],
            status=data['status'],
            description=data['description'],
        )
        return JsonResponse({'message': 'Job added successfully.'}, status=201)
    return render(request, 'jobs/AddJob.html')

def get_job(request):
    # GET /api/job/?id=J001  →  returns one job as JSON
    job = Job.objects.get(jobId=request.GET.get('id'))
    return JsonResponse(model_to_dict(job))

@csrf_exempt
def delete_job(request):
    # POST /api/delete-job/  →  deletes the job, returns success
    data = json.loads(request.body)
    Job.objects.filter(jobId=data['jobId']).delete()
    return JsonResponse({'success': True})