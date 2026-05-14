let data;
async function getJSON() {
  try {
    // 1. Fetch the data from a URL
    const response = await fetch("prevProjects.json");

    // 2. Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 3. Parse the response body as JSON
    data = await response.json();
    // console.log(data);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}
async function init() {
  await getJSON();
  console.log(data);
  data.forEach((e) => {
    console.log(e.desc);
  });
}
init();
