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
    path('api/applied-jobs/', views.get_applied_jobs, name='get_applied_jobs'),
    path('api/apply/', views.apply_job, name='apply_job'),
    path('api/withdraw/', views.withdraw_application, name='withdraw_application'),
    path('edit-job/', views.edit_job, name='edit_job'),
]