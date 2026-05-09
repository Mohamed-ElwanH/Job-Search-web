function applyForJob(btn) {
    const isLoggedIn = localStorage.getItem('is_admin') !== null;
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    if (!isLoggedIn) {
        window.location.href = 'SignUp.html';
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

    let jobId = btn.getAttribute('data-id') || card.querySelectorAll('.card-details p')[0].innerText.trim();

    let allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");

    let alreadyApplied = appliedJobs.find(j => j.jobId === jobId);
    if (alreadyApplied) {
        alert("You have already applied for this job!");
        return;
    }

    let jobToApply = allJobs.find(j => j.jobId === jobId);
    if (jobToApply) {
        appliedJobs.push(jobToApply);
        localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
    }

    alert("Successfully applied for job ID: " + jobId + "\nGood luck!");
}
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

function deleteJob(btn) {
    let row = btn.closest('tr');
    let jobId = row.getAttribute('data-id');
    if (!confirm("Delete this job?")) return;

    fetch('/api/delete-job/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')   // Django requires this for POST
        },
        body: JSON.stringify({ jobId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) row.remove();   // remove the row from the table visually
    });
}
function filterCards(searchValue) {
    let val = searchValue.toLowerCase();
    const jobContainer = document.getElementById('jobContainer');
    if (jobContainer) {
        jobContainer.style.display = val ? 'block' : 'none';
    }
    document.querySelectorAll('#jobContainer .card').forEach(function (card) {
        let title = card.querySelector('.card-title').innerText.toLowerCase();
        card.style.display = title.includes(val) ? 'block' : 'none';
    });
}
document.addEventListener("DOMContentLoaded", function () {
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
    let confirmWithdraw = confirm("Are you sure you want to withdraw this application?");
    if (confirmWithdraw) {
        let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
        appliedJobs = appliedJobs.filter(j => j.jobId !== jobId);
        localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
        btn.closest('.card').remove();
    }
}
function viewDetails(jobId) {
    const isLoggedIn = localStorage.getItem('is_admin') !== null;
    if (!isLoggedIn) {
        window.location.href = 'SignUp.html';
        return;
    }
    window.location.href = 'JobDetails.html?id=' + jobId;
}