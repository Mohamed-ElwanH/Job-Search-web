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
            if (!session.is_logged_in) { window.location.href = '/signup/'; return; }
            if (session.is_admin) { alert("Admins cannot apply for jobs."); return; }
            let card = btn.closest('.card');
            let badge = card.querySelector('.badge');
            if (badge.classList.contains('closed')) { alert("Sorry, this job is already closed."); return; }
            let jobId = btn.getAttribute('data-id');
            fetch('/api/apply/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ jobId, user_email: session.user_email })
            }).then(res => res.json()).then(data => {
                if (data.error) alert(data.error);
                else alert("Successfully applied! Good luck!");
            });
        });
}

function deleteJob(btn) {
    let row = btn.closest('tr');
    let jobId = row.getAttribute('data-id');
    if (!confirm("Delete this job?")) return;
    fetch('/api/delete-job/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        body: JSON.stringify({ jobId })
    }).then(res => res.json()).then(data => { if (data.success) row.remove(); });
}

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
            }).then(res => res.json()).then(data => { if (data.success) btn.closest('.card').remove(); });
        });
}

function viewDetails(jobId) {
    fetch('/api/session/')
        .then(res => res.json())
        .then(session => {
            if (!session.is_logged_in) { window.location.href = '/signup/'; return; }
            window.location.href = '/job-details/?id=' + jobId;
        });
}

function buildJobCard(job) {
    return `
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
}

document.addEventListener("DOMContentLoaded", function () {
    const homeContainer = document.getElementById('jobContainer');
    const userContainer = document.getElementById('userJobContainer');
    const searchForm = document.querySelector('.search-form');

    
    if (homeContainer && homeContainer.dataset.home === 'true') {
        fetch('/api/jobs/')
            .then(res => res.json())
            .then(data => {
                data.jobs.forEach(job => homeContainer.innerHTML += buildJobCard(job));
            });

        if (searchForm) {
            searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const val = document.getElementById('search').value.trim().toLowerCase();
                if (!val) { homeContainer.style.display = 'none'; return; }
                homeContainer.style.display = 'block';
                homeContainer.querySelectorAll('.card').forEach(card => {
                    const title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
                    const company = card.querySelector('.card-text')?.innerText.toLowerCase() || '';
                    card.style.display = (title.includes(val) || company.includes(val)) ? 'block' : 'none';
                });
            });
        }
    }

    
    if (userContainer) {
        if (searchForm) {
            searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const val = document.getElementById('search').value.trim().toLowerCase();
                userContainer.querySelectorAll('.card').forEach(card => {
                    const title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
                    const company = card.querySelector('.card-text')?.innerText.toLowerCase() || '';
                    card.style.display = (!val || title.includes(val) || company.includes(val)) ? 'block' : 'none';
                });
            });
        }
    }
});