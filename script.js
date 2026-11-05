// Demo internship data
const defaultJobs = [
  {
    id: 1,
    title: "Electronics Intern",
    company: "Tech Electronics",
    location: "Hyderabad",
    skills: "electronics, circuits, communication",
    eligibility: "ECE students"
  },
  {
    id: 2,
    title: "Web Development Intern",
    company: "Web Solutions",
    location: "Remote",
    skills: "html, css, javascript",
    eligibility: "All branches"
  },
  {
    id: 3,
    title: "Python Developer Intern",
    company: "Code Masters",
    location: "Remote",
    skills: "python, programming, sql",
    eligibility: "CSE, ECE students"
  },
  {
    id: 4,
    title: "AI and ML Intern",
    company: "Future AI",
    location: "Bangalore",
    skills: "python, ai, machine learning",
    eligibility: "CSE, ECE students"
  },
  {
    id: 5,
    title: "Embedded Systems Intern",
    company: "Embedded Tech",
    location: "Hyderabad",
    skills: "electronics, microcontrollers, c programming",
    eligibility: "ECE, EEE students"
  }
];

// Load demo data from browser storage
let jobs = JSON.parse(localStorage.getItem("internmatchJobs") || "null") || defaultJobs;
let applications = JSON.parse(localStorage.getItem("internmatchApplications") || "[]");
let student = JSON.parse(localStorage.getItem("internmatchStudent") || "null");

// Save data
function saveData() {
  localStorage.setItem("internmatchJobs", JSON.stringify(jobs));
  localStorage.setItem("internmatchApplications", JSON.stringify(applications));
  localStorage.setItem("internmatchStudent", JSON.stringify(student));
}

// Convert text into searchable words
function cleanText(text) {
  return text.toLowerCase().split(/[,;\s]+/).filter(Boolean);
}

// Student registration
document.getElementById("studentForm").addEventListener("submit", function(event) {
  event.preventDefault();

  student = {
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("studentEmail").value.trim(),
    college: document.getElementById("college").value.trim(),
    branch: document.getElementById("branch").value,
    skills: document.getElementById("skills").value.trim(),
    interest: document.getElementById("interest").value.trim()
  };

  saveData();
  showStudent();
  renderJobs();
  renderApplications();

  document.getElementById("studentDashboard").classList.remove("hidden");
  document.getElementById("studentMessage").textContent =
    "Your profile is ready! Explore your internship matches below.";

  document.getElementById("studentDashboard").scrollIntoView({
    behavior: "smooth"
  });
});

// Display student profile
function showStudent() {
  if (!student) return;

  document.getElementById("displayName").textContent = student.name;
  document.getElementById("displayEmail").textContent = student.email;
  document.getElementById("displayCollege").textContent = student.college;
  document.getElementById("displayBranch").textContent = student.branch;
  document.getElementById("displaySkills").textContent = student.skills;
  document.getElementById("displayInterest").textContent = student.interest;

  document.getElementById("studentDashboard").classList.remove("hidden");

  document.getElementById("studentName").value = student.name;
  document.getElementById("studentEmail").value = student.email;
  document.getElementById("college").value = student.college;
  document.getElementById("branch").value = student.branch;
  document.getElementById("skills").value = student.skills;
  document.getElementById("interest").value = student.interest;
}

// Calculate match score
function getMatch(job) {
  if (!student) return 0;

  const studentWords = new Set(cleanText(
    student.skills + " " + student.interest + " " + student.branch
  ));

  const required = cleanText(job.skills);
  const matched = required.filter(skill => studentWords.has(skill));

  return required.length
    ? Math.round((matched.length / required.length) * 100)
    : 0;
}

// Display internship cards
function renderJobs() {
  const container = document.getElementById("recommendations");
  const search = document.getElementById("jobSearch").value.toLowerCase();

  const filtered = jobs
    .map(job => ({ ...job, score: getMatch(job) }))
    .filter(job =>
      (job.title + " " + job.company + " " + job.skills + " " + job.location)
        .toLowerCase().includes(search)
    )
    .sort((a, b) => b.score - a.score);

  container.innerHTML = "";

  if (!filtered.length) {
    container.textContent = "No internships found.";
    return;
  }

  filtered.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";

    const title = document.createElement("h3");
    title.textContent = job.title;

    const company = document.createElement("p");
    company.textContent = "Company: " + job.company;

    const location = document.createElement("p");
    location.textContent = "Location: " + job.location;

    const skills = document.createElement("p");
    skills.textContent = "Required skills: " + job.skills;

    const eligibility = document.createElement("p");
    eligibility.textContent = "Eligibility: " + job.eligibility;

    const score = document.createElement("div");
    score.className = "match";
    score.textContent = student ? "Match: " + job.score + "%" : "Register to see match";

    const applyButton = document.createElement("button");
    applyButton.className = "primary-btn";
    applyButton.textContent = "Apply Now";
    applyButton.addEventListener("click", () => applyForJob(job.id));

    card.append(title, company, location, skills, eligibility, score, applyButton);
    container.appendChild(card);
  });
}

// Search internships
document.getElementById("jobSearch").addEventListener("input", renderJobs);

// Recruiter posts an internship
document.getElementById("internshipForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const newJob = {
    id: Date.now(),
    company: document.getElementById("companyName").value.trim(),
    title: document.getElementById("internshipTitle").value.trim(),
    location: document.getElementById("internshipLocation").value.trim(),
    skills: document.getElementById("requiredSkills").value.trim(),
    eligibility: document.getElementById("eligibility").value.trim()
  };

  jobs.push(newJob);
  saveData();

  this.reset();
  renderJobs();
  renderPostedJobs();

  alert("Internship posted successfully!");
});

// Display recruiter posts
function renderPostedJobs() {
  const container = document.getElementById("postedInternships");
  container.innerHTML = "";

  if (!jobs.length) {
    container.textContent = "No internships posted yet.";
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";

    const title = document.createElement("h3");
    title.textContent = job.title;

    const company = document.createElement("p");
    company.textContent = "Company: " + job.company;

    const location = document.createElement("p");
    location.textContent = "Location: " + job.location;

    const skills = document.createElement("p");
    skills.textContent = "Skills: " + job.skills;

    const eligibility = document.createElement("p");
    eligibility.textContent = "Eligibility: " + job.eligibility;

    card.append(title, company, location, skills, eligibility);
    container.appendChild(card);
  });
}

// Apply for an internship
function applyForJob(jobId) {
  if (!student) {
    alert("Please register as a student before applying.");
    document.getElementById("student").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const alreadyApplied = applications.some(application =>
    application.jobId === jobId && application.email === student.email
  );

  if (alreadyApplied) {
    alert("You have already applied for this internship.");
    return;
  }

  const job = jobs.find(item => item.id === jobId);
  if (!job) return;

  applications.push({
    jobId: job.id,
    title: job.title,
    company: job.company,
    email: student.email,
    status: "Submitted"
  });

  saveData();
  renderApplications();

  alert("Your application has been submitted!");
}

// Display applications
function renderApplications() {
  const container = document.getElementById("myApplications");
  container.innerHTML = "";

  const myApps = student
    ? applications.filter(app => app.email === student.email)
    : [];

  if (!myApps.length) {
    container.textContent = "You have not applied for any internships yet.";
    return;
  }

  myApps.forEach(app => {
    const card = document.createElement("div");
    card.className = "job-card";

    const title = document.createElement("h3");
    title.textContent = app.title;

    const company = document.createElement("p");
    company.textContent = "Company: " + app.company;

    const status = document.createElement("p");
    status.textContent = "Application status: " + app.status;

    card.append(title, company, status);
    container.appendChild(card);
  });
}

// Demo contact form
document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();
  alert("Thank you for contacting InternMatch!");
  this.reset();
});

// Load saved information when page opens
showStudent();
renderJobs();
renderPostedJobs();
renderApplications();