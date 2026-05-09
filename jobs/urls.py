from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('index/', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup, name='signup'),
    path('add-job/', views.add_job, name='add_job'),
    path('admin-main/', views.admin_main, name='admin_main'),
    path('user-main/', views.user_main, name='user_main'),
    path('job-details/', views.job_details, name='job_details'),
    path('applied-jobs/', views.applied_jobs, name='applied_jobs'),
    path('edit-job/', views.edit_job, name='edit_job'),
    path('api/job/', views.get_job, name='get_job'),
path('api/delete-job/', views.delete_job, name='delete_job'),
]