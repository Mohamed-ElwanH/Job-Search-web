document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const formError = document.getElementById('formError');

    const adminEmails = new Set([
        '20242265@stud.fci-cu.edu.eg',
        '20240549@stud.fci-cu.edu.eg',
        '20242399@stud.fci-cu.edu.eg',
        '20242080@stud.fci-cu.edu.eg',
        '20240710@stud.fci-cu.edu.eg',
        '20240326@stud.fci-cu.edu.eg'
    ]);

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

            const val = (username.value || '').trim().toLowerCase();
            if (adminEmails.has(val)) {
                window.location.href = 'AdminMain.html';
            } else {
                window.location.href = 'UserMain.html';
            }
        });
    }
});
