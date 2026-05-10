import json
from django.shortcuts import render, redirect # pyright: ignore[reportMissingModuleSource]
from django.http import JsonResponse # pyright: ignore[reportMissingModuleSource]
from django.views.decorators.csrf import csrf_exempt # pyright: ignore[reportMissingModuleSource]
from django.forms.models import model_to_dict # pyright: ignore[reportMissingModuleSource]
from .models import Job, Application, UserProfile

def home(request):
    return render(request, 'Home.html')

def index(request):
    return render(request, 'Index.html')

def login_view(request):
    return render(request, 'LogIn.html')

def signup(request):
    return render(request, 'SignUp.html')

def admin_main(request):
    return render(request, 'AdminMain.html')

def user_main(request):
    jobs = list(Job.objects.values(
        'jobId', 'jobTitle', 'companyName',
        'salary', 'experience', 'location',
        'status', 'description'
    ))
    return render(request, 'UserMain.html', {'jobs_json': json.dumps(jobs)})

def job_details(request):
    return render(request, 'JobDetails.html')

def apply_job(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        jobId = data.get('jobId')
        user_email = data.get('user_email')
        job = Job.objects.get(jobId=jobId)
        if Application.objects.filter(job=job, user_email=user_email).exists():
            return JsonResponse({'error': 'You have already applied for this job.'}, status=400)
        Application.objects.create(job=job, user_email=user_email)
        return JsonResponse({'success': True}, status=200)

def withdraw_application(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        jobId = data.get('jobId')
        user_email = data.get('user_email')
        job = Job.objects.get(jobId=jobId)
        Application.objects.filter(job=job, user_email=user_email).delete()
        return JsonResponse({'success': True}, status=200)

def applied_jobs(request):
    return render(request, 'AppliedJobs.html')

def get_applied_jobs(request):
    user_email = request.GET.get('user_email')
    applications = Application.objects.filter(user_email=user_email).select_related('job')
    applied_jobs_data = [
        {
            'jobId': application.job.jobId,
            'jobTitle': application.job.jobTitle,
            'companyName': application.job.companyName,
            'salary': application.job.salary,
            'experience': application.job.experience,
            'location': application.job.location,
            'status': application.job.status,
            'description': application.job.description,
        }
        for application in applications
    ]
    return JsonResponse({'applied_jobs': applied_jobs_data})

def edit_job(request):
    return render(request, 'EditJob.html')

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
    return render(request, 'AddJob.html')

def get_job(request):
    job = Job.objects.get(jobId=request.GET.get('id'))
    return JsonResponse(model_to_dict(job))

@csrf_exempt
def delete_job(request):
    data = json.loads(request.body)
    Job.objects.filter(jobId=data['jobId']).delete()
    return JsonResponse({'success': True})

def signup_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')

        if UserProfile.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'error': 'An account with this email already exists.'}, status=400)

        user = UserProfile.objects.create(
            username=data.get('username'),
            email=email,
            password=data.get('password'),
            isAdmin=data.get('isAdmin', False)
        )
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        try:
            user = UserProfile.objects.get(email=email, password=password)
            request.session['user_email'] = user.email
            request.session['is_admin'] = user.isAdmin
            return JsonResponse({'success': True, 'isAdmin': user.isAdmin})
        except UserProfile.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Invalid email or password.'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
