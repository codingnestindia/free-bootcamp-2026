const API_URL = "https://fakejobs-api.vercel.app/jobs";

let jobs = [];
let filteredJobs = [];
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

const jobList = document.getElementById("job-list");
const searchInput = document.querySelector(".search-box input");
const locationInput = document.querySelector(".filter-box input");
const filterButtons = document.querySelectorAll(".tag-btn");
const bookmarkBtn = document.querySelector(".bookmark-btn");

async function fetchJobs() {
  jobList.innerHTML = "Loading...";

  const res = await fetch(API_URL);
  const data = await res.json();
  jobs = data;
  filteredJobs = jobs;
  showJobs(filteredJobs);
}

fetchJobs();
function showJobs(DisplayJobs) {
  jobList.innerHTML = "";
  DisplayJobs.forEach((job) => {
    const div = document.createElement("div");
    div.className = "col-md-4";
    const card = document.createElement("div");
    card.className = "card p-3 shadow-sm mb-4";

    card.innerHTML = `
      <span class="badge bg-light text-dark">${job.type}</span>
      <h5>${job.title}</h5>
      <p>${job.company.name}</p>
      <p>${job.location}</p>
      <p>${job.salary}</p>

      <div class="d-flex gap-2 mt-2">
        <button class="btn btn-dark w-100 view-btn">View</button>
        <button class="btn btn-outline-primary w-100 bookmark-btn-card">Bookmark</button>
      </div>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => {
      Swal.fire({
        width: "700px",
        showCloseButton: true,
        showConfirmButton: false,
        html: `
          <h3>${job.title}</h3>
          <p>${job.company.name}</p>
          <p>${job.location}</p>
          <p>${job.salary}</p>
          <h5>Description</h5>
          <p>Build the Popup using SweetAlert2.</p>

          <button style="width:100%; padding:10px;
           background:linear-gradient(135deg,#5f6fff,#a855f7);
           color:white; border:none; border-radius:10px;">
           Apply Now
          </button>
        `,
      });
    });
    const bookmark = card.querySelector(".bookmark-btn-card");
    bookmark.addEventListener("click", () => {
      const index = bookmarks.findIndex((j) => j.id === job.id);
      if (index === -1) {
        bookmarks.push(job);
      } else {
        bookmarks.splice(index, 1);
      }
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      updateBookmarkCount();
    });

    div.appendChild(card);
    jobList.appendChild(div);
  });
}
function updateBookmarkCount() {
  bookmarkBtn.innerHTML = `<i class="ri-bookmark-line"></i> Bookmarks (${bookmarks.length})`;
}
updateBookmarkCount();

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const location = locationInput.value.toLowerCase();
  const active = document
    .querySelector(".tag-btn.active")
    .innerText.toLowerCase();

  filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(search) &&
      job.location.toLowerCase().includes(location) &&
      (active === "all" || job.type.toLowerCase().includes(active))
    );
  });
  showJobs(filteredJobs);
}
searchInput.addEventListener("input", applyFilters);
locationInput.addEventListener("input", applyFilters);
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});
