const isLoggedIn = localStorage.getItem('is_admin') !== null;
const isAdmin = localStorage.getItem('is_admin') === 'true';
const authLink = document.getElementById('authLink');
const applicationsLink = document.getElementById('applicationsLink');

if (isLoggedIn) {
    authLink.innerHTML = '<a href="Index.html">Logout</a>';
    if (isAdmin) {
        applicationsLink.innerHTML = '<a href="AdminMain.html">Manage Jobs</a> | ';
    } else {
        applicationsLink.innerHTML = '<a href="AppliedJobs.html">My Applications</a> | <a href="UserMain.html">Available Jobs</a> | ';
    }
} else {
    authLink.innerHTML = '<a href="LogIn.html">Sign in</a>';
    applicationsLink.innerHTML = '';
}