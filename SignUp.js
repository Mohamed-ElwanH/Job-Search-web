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
            updateAdminFlag();
            const okRequired = validateRequiredFields();
            const okPasswords = validatePasswords();
            if (!okRequired || !okPasswords) {
                e.preventDefault();
                if (!okRequired) {
                    if (username && !username.value.trim()) username.focus();
                    else if (email && !email.value.trim()) email.focus();
                    else if (password && !password.value) password.focus();
                } else {
                    confirm.focus();
                }
            }
        });
    }
});
