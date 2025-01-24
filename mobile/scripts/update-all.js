const { execSync } = require("child_process");

async function updateAll(profile) {
  const response = await fetch("http://localhost:3000/api/teams");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const teamsData = await response.json();

  for (const teamSlug in ["wlf", ...teamsData]) {
    console.log(`Building for ${teamSlug}`);
    const releaseChannel = `${profile}-${teamSlug}`;
    execSync(`yarn initialize ${teamSlug}`);
    execSync(`eas update --branch ${releaseChannel} --auto`);
  }
}

updateAll("production");
