function applyForJob(btn) {
    let card = btn.closest('.card');
    let badge = card.querySelector('.badge');

    if (badge.classList.contains('closed')) {
        alert("Sorry, this job is already closed.");
        return;
    }

    let jobId = card.querySelectorAll('.card-details p')[0].innerText;

    badge.innerText = "Closed";
    badge.classList.remove('open');
    badge.classList.add('closed');

    alert("Successfully applied for job ID: " + jobId + "\nGood luck!");
}

function deleteJob(btn) {
    let row = btn.closest('tr');
    let jobTitle = row.cells[0].innerText;

    let confirmDelete = confirm("Are you sure you want to delete: " + jobTitle + "?");
    if (confirmDelete) {
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