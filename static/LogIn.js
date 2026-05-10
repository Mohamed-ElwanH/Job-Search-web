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
    const username = document.getElementById('email');
    const password = document.getElementById('password');
    const formError = document.getElementById('formError');

    function validateRequiredFields() {
        if (!username || !password || !formError)
            return true;
        if (!username.value.trim() || !password.value) {
            formError.textContent = 'Please fill in all required fields.';
            return false;
        }
        formError.textContent = '';
        return true;
    }

    if (username)
        username.addEventListener('input', validateRequiredFields);
    if (password)
        password.addEventListener('input', validateRequiredFields);

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateRequiredFields()) return;

            fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    email: username.value.trim(),
                    password: password.value
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.isAdmin ? '/admin-main/' : '/user-main/';
                } else {
                    formError.textContent = data.error || 'An error occurred during login.';
                }
            })
            .catch(err => {
                formError.textContent = 'An error occurred. Please try again.';
                console.error(err);
            });
        });
    }
});
