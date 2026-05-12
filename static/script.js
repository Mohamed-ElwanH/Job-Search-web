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
    fetch('/api/session/')
        .then(res => res.json())
        .then(session => {
            if (!session.is_logged_in) {
                window.location.href = '/signup/';
                return;
            }
            if (session.is_admin) {
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
                body: JSON.stringify({ jobId, user_email: session.user_email })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert("Successfully applied! Good luck!");
                    }
                });
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
    if (jobContainer && jobContainer.dataset.home !== 'true') {
        jobContainer.style.display = 'block';
        fetch('/api/jobs/')
            .then(res => res.json())
            .then(data => {
                data.jobs.forEach(job => {
                    jobContainer.innerHTML += `
            <div class="card">
                <div class="card-top">
                    <div>
                        <h5 class="card-title">${job.jobTitle}</h5>
                        <p class="card-text">Company Name: ${job.companyName}</p>
                    </div>
                    <span class="badge ${job.status === 'Open' ? 'open' : 'closed'}">${job.status}</span>
                </div>
                <hr>
                <div class="card-details">
                    <div><small>ID</small><p>${job.jobId}</p></div>
                    <div><small>Salary</small><p>${job.salary}</p></div>
                    <div><small>Location</small><p>${job.location}</p></div>
                </div>
                <hr>
                <div class="card-actions">
                    <button type="button" onclick="viewDetails('${job.jobId}')">View Details</button>
                    <button type="button" onclick="applyForJob(this)" data-id="${job.jobId}">Apply</button>
                </div>
            </div>`;
                });
            });
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
    fetch('/api/session/')
        .then(res => res.json())
        .then(session => {
            let jobId = btn.getAttribute("data-id");
            if (!confirm("Are you sure you want to withdraw this application?")) return;
            fetch('/api/withdraw/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ jobId, user_email: session.user_email })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) btn.closest('.card').remove();
                });
        });
}


function viewDetails(jobId) {
    fetch('/api/session/')
        .then(res => res.json())
        .then(session => {
            if (!session.is_logged_in) {
                window.location.href = '/signup/';
                return;
            }
            window.location.href = '/job-details/?id=' + jobId;
        });
}
