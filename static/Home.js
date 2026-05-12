fetch('/api/session/')
.then(res => res.json())
.then(session => {
    const authLink = document.getElementById('authLink');
    const applicationsLink = document.getElementById('applicationsLink');

    if (session.is_logged_in) {
        authLink.innerHTML = '<a href="/index/">Logout</a>';
        if (session.is_admin) {
            applicationsLink.innerHTML = '<a href="/admin-main/">Manage Jobs</a> | ';
        } else {
            applicationsLink.innerHTML = '<a href="/applied-jobs/">My Applications</a> | <a href="/user-main/">Available Jobs</a> | ';
        }
    } else {
        authLink.innerHTML = '<a href="/login/">Sign in</a>';
        applicationsLink.innerHTML = '';
    }
});