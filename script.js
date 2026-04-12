function applyForJob(btn) {
     const isLoggedIn = localStorage.getItem('is_admin') !== null;
    if (!isLoggedIn) {
        window.location.href = 'LogIn.html';
        return;
    }
    let card = btn.closest('.card');
    let badge = card.querySelector('.badge');

    if (badge.classList.contains('closed')) {
        alert("Sorry, this job is already closed.");
        return;
    }

    let jobId = card.querySelectorAll('.card-details p')[0].innerText.trim();

    
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

function deleteJob(btn) {
    let row = btn.closest('tr');
    let jobTitle = row.cells[0].innerText;

    let confirmDelete = confirm("Are you sure you want to delete: " + jobTitle + "?");
    if (confirmDelete) {
        let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
        let jobId = row.getAttribute('data-id');
        jobs = jobs.filter(job => job.jobId !== jobId);
        localStorage.setItem("jobs", JSON.stringify(jobs));
        row.remove();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector('.search-form');

    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let searchValue = document.getElementById('search').value.toLowerCase().trim();
            let cards = document.querySelectorAll('.card');

            cards.forEach(function (card) {
                let cardText = card.innerText.toLowerCase();

                if (cardText.includes(searchValue)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
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