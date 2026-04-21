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

    function updateAdminFlag() {
    const isAdmin = document.getElementById('admin_checkbox').checked;
    localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');
}

    if (username)
        username.addEventListener('input', validateRequiredFields);
    if (email)
        email.addEventListener('input', function () { validateRequiredFields(); updateAdminFlag(); });
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
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(u => u.email === email.value.trim())) {
        formError.textContent = 'An account with this email already exists.';
        return;
    }

    users.push({
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value,
        isAdmin: isAdmin
    });
    localStorage.setItem('users', JSON.stringify(users));
    window.location.href = 'LogIn.html';
});
    }
});
