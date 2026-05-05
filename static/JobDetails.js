const submitBtn = document.getElementById("submitBtn");
const jobContainer = document.getElementById("jobContainer");
const userJobContainer = document.getElementById("userJobContainer");
const adminJobContainer = document.getElementById("adminJobContainer");
const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");

function getJobs() {
    return JSON.parse(localStorage.getItem("jobs") || "[]");
}

if (submitBtn) {
    submitBtn.onclick = function (e) {
        e.preventDefault();
        const jobTitle = document.getElementById("jobTitle").value.trim();
        const jobId = document.getElementById("id").value.trim();
        const companyName = document.getElementById("companyName").value.trim();
        const salary = document.getElementById("salary").value.trim();
        const status = document.querySelector("input[name='status']:checked")?.value;
        const experience = document.getElementById("experience").value.trim();
        const description = document.getElementById("description").value.trim();
        const location = document.getElementById("location").value.trim();
        let jobDisplay = getJobs();
        if (!jobTitle || !jobId || !companyName || !salary || !experience || !description || !location) {
            alert("Please fill in all fields.");
            return;
        }
        if (!status) {
            alert("Please select a job status.");
            return;
        }
        if (jobDisplay.find(j => j.jobId === jobId)) {
            alert("A job with this ID already exists. Please use a unique ID.");
            return;
        }
        const job = { jobTitle, jobId, companyName, salary, status, experience, description, location };
        jobDisplay.push(job);
        localStorage.setItem("jobs", JSON.stringify(jobDisplay));
        alert("Job added successfully!");
    }
}

if (jobContainer) {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("id");

    if (jobId) {
        // show single job detail
        const job = jobs.find(j => j.jobId === jobId);

        if (!job) {
            jobContainer.innerHTML = "<p>Job not found.</p>";
        } else {
            jobContainer.innerHTML = `
            <div class="card">
                <div class="card-top">
                    <div>
                        <h5 class="card-title">${job.jobTitle}</h5>
                        <p class="card-text">Company: ${job.companyName}</p>
                        <p class="card-text">Location: ${job.location}</p>
                    </div>
                    <span class="badge ${job.status === 'Open' ? 'open' : 'closed'}">${job.status}</span>
                </div>
                <hr>
                <div class="card-details">
                    <div><small>ID</small><p>${job.jobId}</p></div>
                    <div><small>Salary</small><p>${job.salary}</p></div>
                    <div><small>Experience</small><p>${job.experience}</p></div>
                </div>
                <hr>
                <div><small>Description</small><p>${job.description}</p></div>
                <hr>
                <div class="card-actions">
    ${localStorage.getItem('is_admin') === 'true'
        ? `<button type="button" class="delete-btn" onclick="(function(){
            if(confirm('Are you sure you want to delete this job?')){
                let jobs = JSON.parse(localStorage.getItem('jobs')||'[]');
                jobs = jobs.filter(j => j.jobId !== '${job.jobId}');
                localStorage.setItem('jobs', JSON.stringify(jobs));
                window.location.href = 'AdminMain.html';
            }
        })()">Delete</button>`
        : `<button type="button" onclick="applyForJob(this)" data-id="${job.jobId}">Apply</button>`}
    <a href="UserMain.html">Back to Jobs</a>
</div>
            </div>`;
        }
    } else {
        // show all jobs
        jobs.forEach(function (job) {
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
                </div>
                <hr>
                <div class="card-actions">
                    <button type="button" onclick="viewDetails('${job.jobId}')">View Details</button>
                    <button type="button" onclick="applyForJob(this)" data-id="${job.jobId}">Apply</button>
                </div>
            </div>`;
        });
    }
}

if (userJobContainer) {
    jobs.forEach(function (job) {
        userJobContainer.innerHTML += `
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
}

if (adminJobContainer) {
    jobs.forEach(function (job) {
        adminJobContainer.innerHTML += `
        <tr data-id="${job.jobId}">
    <td>${job.jobId}</td>
    <td>${job.jobTitle}</td>
    <td>${job.companyName}</td>
    <td>${job.status}</td>
    <td>
        <a href="EditJob.html?id=${job.jobId}">Edit</a>
        <button class="delete-btn" onclick="deleteJob(this)">Delete</button>
    </td>
</tr>`;
    });
}

const container = document.getElementById("appliedJobsContainer");
if (container) {
    let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");

    if (appliedJobs.length === 0) {
        container.innerHTML = "<p>You have not applied for any jobs yet.</p>";
    } else {
        appliedJobs.forEach(function (job) {
            container.innerHTML += `
            <div class="card">
                <div class="card-top">
                    <div>
                        <h5 class="card-title">${job.jobTitle}</h5>
                        <p class="card-text">${job.companyName}</p>
                        <p class="card-text">${job.location}</p>
                    </div>
                    <span class="badge ${job.status === 'Open' ? 'open' : 'closed'}">${job.status}</span>
                </div>
                <hr>
                <div class="card-details">
                    <div><small>Job ID</small><p>${job.jobId}</p></div>
                    <div><small>Salary</small><p>${job.salary}</p></div>
                    <div><small>Experience</small><p>${job.experience} years</p></div>
                </div>
                <hr>
                <div class="card-actions">
                    <button type="button" onclick="withdrawJob(this)" data-id="${job.jobId}">Withdraw</button>
                </div>
            </div>`;
        });
    }
}