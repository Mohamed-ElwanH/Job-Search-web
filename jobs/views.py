import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
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