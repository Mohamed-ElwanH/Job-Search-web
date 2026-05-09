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

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const match = users.find(u => u.email === username.value.trim() && u.password === password.value);

            if (!match) {
                formError.textContent = 'Invalid email or password.';
                return;
            }

            localStorage.setItem('is_admin', match.isAdmin ? 'true' : 'false');
            localStorage.setItem('user_email', match.email);
            window.location.href = match.isAdmin ? '/admin-main/' : '/user-main/';
        });
    }
});
