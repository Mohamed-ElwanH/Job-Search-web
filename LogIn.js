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
            if (!validateRequiredFields()) {
                if (username && !username.value.trim()) username.focus();
                else if (password && !password.value) password.focus();
                return;
            }

           const isAdmin = localStorage.getItem('is_admin') === 'true';
            window.location.href = isAdmin ? 'AdminMain.html' : 'UserMain.html';
        });
    }
});
