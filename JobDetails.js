const submitBtn = document.getElementById("submitBtn");
const jobContainer = document.getElementById("jobContainer");
const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
if (submitBtn) {
    submitBtn.onclick = function () {
        const jobTitle = document.getElementById("jobTitle").value.trim();
        const jobId = document.getElementById("id").value.trim();
        const companyName = document.getElementById("companyName").value.trim();
        const salary = document.getElementById("salary").value.trim();
        const status = document.querySelector("input[name='status']:checked")?.value;
        const experience = document.getElementById("experience").value.trim();
        const description = document.getElementById("description").value.trim();
        const job = { jobTitle, jobId, companyName, salary, status, experience, description };
        let jobDisplay = JSON.parse(localStorage.getItem("jobs") || "[]");
        jobDisplay.push(job);
        localStorage.setItem("jobs", JSON.stringify(jobDisplay));
    }
}
if (jobContainer) {
    jobs.forEach(function (job) {
        jobContainer.innerHTML += `
        <hr>
    <div class="card-details">
        <div>
            <small>Job ID</small>
            <p>1</p>
        </div>
        <div>
            <small>Salary</small>
            <p>10,000 EGP</p>
        </div>
    </div>

    <hr>
        `
    })
}