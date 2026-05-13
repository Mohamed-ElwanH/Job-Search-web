import json
from django.shortcuts import render, redirect # pyright: ignore[reportMissingModuleSource]
from django.http import JsonResponse # pyright: ignore[reportMissingModuleSource]
from django.views.decorators.csrf import csrf_exempt # pyright: ignore[reportMissingModuleSource]
from django.forms.models import model_to_dict # pyright: ignore[reportMissingModuleSource]
from .models import Job, Application, UserProfile

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
    jobs = list(Job.objects.values(
        'jobId', 'jobTitle', 'companyName',
        'salary', 'experience', 'location',
        'status', 'description'
    ))
    return render(request, 'jobs/UserMain.html', {'jobs_json': json.dumps(jobs)})

def job_details(request):
    return render(request, 'jobs/JobDetails.html')
def get_session(request):
    if request.session.get('user_email'):
        return JsonResponse({
            'isLoggedIn': True,
            'isAdmin': request.session.get('is_admin'),
            'email': request.session.get('user_email')
        })
    return JsonResponse({'isLoggedIn': False})
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
def logout_view(request):
    request.session.flush()
    return redirect('index')
def withdraw_application(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        jobId = data.get('jobId')
        user_email = data.get('user_email')
        job = Job.objects.get(jobId=jobId)
        Application.objects.filter(job=job, user_email=user_email).delete()
        return JsonResponse({'success': True}, status=200)

def applied_jobs(request):
    return render(request, 'jobs/AppliedJobs.html')

def get_applied_jobs(request):
    user_email = request.session.get('user_email')
    applications = Application.objects.filter(user_email=user_email).select_related('job')
    applied_jobs_data = [
        {
            'jobId': app.job.jobId,
            'jobTitle': app.job.jobTitle,
            'companyName': app.job.companyName,
            'salary': app.job.salary,
            'experience': app.job.experience,
            'location': app.job.location,
            'status': app.job.status,
            'description': app.job.description,
        }
        for app in applications
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

def get_jobs(request):
    jobs = list(Job.objects.values())
    return JsonResponse(jobs, safe=False)
def get_session(request):
    return JsonResponse({
        'is_logged_in': 'user_email' in request.session,
        'is_admin': request.session.get('is_admin', False),
        'user_email': request.session.get('user_email', ''),
    })
def logout_view(request):
    request.session.flush()
    return JsonResponse({'success': True})
def get_jobs(request):
    jobs = list(Job.objects.values(
        'jobId', 'jobTitle', 'companyName',
        'salary', 'experience', 'location',
        'status', 'description'
    ))
    return JsonResponse({'jobs': jobs})
def update_job(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        job_id = data.get('jobId')
        try:
            job = Job.objects.get(jobId=job_id)
            job.jobTitle = data.get('jobTitle')
            job.companyName = data.get('companyName')
            job.salary = data.get('salary')
            job.experience = data.get('experience')
            job.location = data.get('location')
            job.status = data.get('status')
            job.description = data.get('description')
            job.save()
            return JsonResponse({'success': True})
        except Job.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Job not found'}, status=404)
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)