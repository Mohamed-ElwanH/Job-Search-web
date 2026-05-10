function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm_password');
    const pwError = document.getElementById('pwError');
    const formError = document.getElementById('formError');


    function validatePasswords() {
        if (!password || !confirm || !pwError)
            return true;
        if (password.value !== confirm.value) {
            pwError.textContent = 'Passwords do not match.';
            return false;
        }
        pwError.textContent = '';
        return true;
    }

    function validateRequiredFields() {
        if (!username || !email || !password || !confirm || !formError)
            return true;
        if (!username.value.trim() || !email.value.trim() || !password.value) {
            formError.textContent = 'Please fill in all required fields.';
            return false;
        }
        formError.textContent = '';
        return true;
    }

    if (username)
        username.addEventListener('input', validateRequiredFields);
    if (email)
        email.addEventListener('input', validateRequiredFields);
    if (password)
        password.addEventListener('input', function () { validateRequiredFields(); validatePasswords(); });
    if (confirm)
        confirm.addEventListener('input', function () { validateRequiredFields(); validatePasswords(); });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const okRequired = validateRequiredFields();
            const okPasswords = validatePasswords();
            if (!okRequired || !okPasswords) return;

            const isAdmin = document.getElementById('admin_checkbox').checked;

            fetch('/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    username: username.value.trim(),
                    email: email.value.trim(),
                    password: password.value,
                    isAdmin: isAdmin
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/login/';
                } else {
                    formError.textContent = data.error || 'An error occurred during signup.';
                }
            })
            .catch(err => {
                formError.textContent = 'An error occurred. Please try again.';
                console.error(err);
            });
        });
    }
});
