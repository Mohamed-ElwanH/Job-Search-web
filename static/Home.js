const isLoggedIn = localStorage.getItem('is_admin') !== null;
const isAdmin = localStorage.getItem('is_admin') === 'true';
const authLink = document.getElementById('authLink');
const applicationsLink = document.getElementById('applicationsLink');

function logout() {
    localStorage.removeItem('is_admin');
    window.location.href = '/index/';
}

if (isLoggedIn) {
    authLink.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
    if (isAdmin) {
        applicationsLink.innerHTML = '<a href="/admin-main/">Manage Jobs</a> | ';
    } else {
        applicationsLink.innerHTML = '<a href="/applied-jobs/">My Applications</a> | <a href="/user-main/">Available Jobs</a> | ';
    }
} else {
    authLink.innerHTML = '<a href="/login/">Sign in</a>';
    applicationsLink.innerHTML = '';
}