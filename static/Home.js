fetch('/api/session/')
    .then(res => res.json())
    .then(data => {
        const authLink = document.getElementById('authLink');
        const applicationsLink = document.getElementById('applicationsLink');

        if (data.isLoggedIn) {
            authLink.innerHTML = '<a href="/index/">Logout</a>';
            if (data.isAdmin) {
                applicationsLink.innerHTML = '<a href="/admin-main/">Manage Jobs</a> | ';
            } else {
                applicationsLink.innerHTML = '<a href="/applied-jobs/">My Applications</a> | <a href="/user-main/">Available Jobs</a> | ';
            }
        } else {
            authLink.innerHTML = '<a href="/login/">Sign in</a>';
            applicationsLink.innerHTML = '';
        }
    });