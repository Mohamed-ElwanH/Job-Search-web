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
        const job = { jobTitle, jobId, companyName, salary, status, experience, description, location};
        let jobDisplay = getJobs();
        jobDisplay.push(job);
        localStorage.setItem("jobs", JSON.stringify(jobDisplay));
        alert("Job added successfully!");
    }
}

if (jobContainer) {
    jobs.forEach(function (job) {
        jobContainer.innerHTML += `
        <div class="card">

    <div class="card-top">
        <div>
            <h5 class="card-title">${job.jobTitle}</h5>
            <p class="card-text">Company Name: ${job.companyName}</p>

        </div>
        <span class="badge open">${job.status}</span>
    </div>

    <hr>

    <div class="card-details">
        <div>
            <small>ID</small>
            <p> ${job.jobId}</p>
        </div>
        <div>
            <small>Salary</small>
            <p>${job.salary}</p>
        </div>
        <div>
            
        </div>
    </div>
     <div class="card-details">
        <div>
            
        </div>
    </div>

    <hr>

    <div class="card-actions">
        <a href="JobDetails.html">View Details</a>
        <button type="button" onclick="applyForJob(1)">Apply</button>
    </div>

</div>
        `
    })
}
if (userJobContainer) {
    jobs.forEach(function (job) {
        userJobContainer.innerHTML += `
        <div class="card">

    <div class="card-top">
        <div>
            <h5 class="card-title">${job.jobTitle}</h5>
        </div>
        <span class="badge open">${job.status}</span>
    </div>

    <hr>

    <div class="card-details">
        <div>
            <small>ID</small>
            <p> ${job.jobId}</p>
        </div>

    <hr>

    <div class="card-actions">
        <a href="JobDetails.html">View Details</a>
        <button type="button" onclick="applyForJob(1)">Apply</button>
    </div>

</div>
        `
    })
}
if (adminJobContainer) {
    jobs.forEach(function (job) {
        adminJobContainer.innerHTML += `
        <tr>
            <td>${job.jobTitle}</td>
            <td>${job.companyName}</td>
            <td>${job.status}</td>
            <td>
                <a href="EditJob.html">Edit</a> |
                <button class="delete-btn" onclick="deleteJob(1)">Delete</button>
            </td>
        </tr>`
    })
}