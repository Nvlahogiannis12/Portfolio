let data;
let gradeSort = [];

async function getJSON() {
  try {
    const response = await fetch("prevProjects.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    data = await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

async function init() {
  await getJSON();
}

function sortYears(year) {
  const row = document.getElementById("cardcontainment");

  // clear old cards
  row.innerHTML = "";

  // clear old sorted list
  gradeSort = [];

  // loop through JSON
  Object.entries(data).forEach(([name, project]) => {
    // check if project belongs to selected year
    if (name.includes(year)) {
      // store matching names
      gradeSort.push(name);

      // clean display name
      let cleanName = name.replace(year, "").replaceAll("_", " ");

      // create card
      const col = document.createElement("div");
      col.className = "col-6 col-lg-3";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body text-center">

            <h5 class="card-title mb-2">
              ${cleanName}
            </h5>

            <p class="small text-muted">
              ${project.desc}
            </p>

            <a href="${project.link}" 
               target="_blank" 
               class="btn btn-primary">
              Visit
            </a>

          </div>
        </div>
      `;

      row.appendChild(col);
    }
  });

  console.log(gradeSort);
}

init();
