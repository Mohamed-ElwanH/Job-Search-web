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

function applyForJob(btn) {
    const isLoggedIn = localStorage.getItem('is_admin') !== null;
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const userEmail = localStorage.getItem('user_email');

    if (!isLoggedIn) {
        window.location.href = '/signup/';
        return;
    }
    if (isAdmin) {
        alert("Admins cannot apply for jobs.");
        return;
    }

    let card = btn.closest('.card');
    let badge = card.querySelector('.badge');

    if (badge.classList.contains('closed')) {
        alert("Sorry, this job is already closed.");
        return;
    }

    let jobId = btn.getAttribute('data-id');

    fetch('/api/apply/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        body: JSON.stringify({ jobId, user_email: userEmail })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Successfully applied! Good luck!");
        }
    });
}

function deleteJob(btn) {
    let row = btn.closest('tr');
    let jobId = row.getAttribute('data-id');
    if (!confirm("Delete this job?")) return;

    fetch('/api/delete-job/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ jobId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) row.remove();
    });
}

function filterCards(searchValue) {
    let val = searchValue.toLowerCase();
    const jobContainer = document.getElementById('jobContainer');
    if (!jobContainer) return;
    jobContainer.style.display = 'block';
    document.querySelectorAll('#jobContainer .card').forEach(function (card) {
        let title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
        let company = card.querySelector('.card-text')?.innerText.toLowerCase() || '';
        card.style.display = (title.includes(val) || company.includes(val)) ? 'block' : 'none';
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const jobContainer = document.getElementById('jobContainer');
    if (jobContainer) {
        jobContainer.style.display = 'block';
    }

    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            let searchValue = document.getElementById('search').value.trim();
            filterCards(searchValue);
        });
    }

    const params = new URLSearchParams(window.location.search);
    const query = params.get('search');
    if (query && document.getElementById('search')) {
        document.getElementById('search').value = query;
        setTimeout(() => filterCards(query), 50);
    }
});

function withdrawJob(btn) {
    let jobId = btn.getAttribute("data-id");
    const userEmail = localStorage.getItem('user_email');
    if (!confirm("Are you sure you want to withdraw this application?")) return;

    fetch('/api/withdraw/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        body: JSON.stringify({ jobId, user_email: userEmail })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) btn.closest('.card').remove();
    });
}

function viewDetails(jobId) {
    const isLoggedIn = localStorage.getItem('is_admin') !== null;
    if (!isLoggedIn) {
        window.location.href = '/signup/';
        return;
    }
    window.location.href = '/job-details/?id=' + jobId;
}
