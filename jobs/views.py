import json
from django.shortcuts import render, redirect
from .models import Job

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict

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