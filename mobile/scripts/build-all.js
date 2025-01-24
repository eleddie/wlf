const { execSync } = require("child_process");

async function buildAll(platform, profile) {
  const outputExtension = platform === "ios" ? "ipa" : "aab";

  const response = await fetch("http://localhost:3000/api/teams");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const teamsData = await response.json();

  for (const teamSlug in ["wlf", ...teamsData]) {
    console.log(`Building for ${teamSlug}`);
    const outputPath = `output/${teamSlug}.${outputExtension}`;
    const releaseChannel = `${profile}-${teamSlug}`;
    execSync(`yarn initialize ${teamSlug}`);
    execSync(
      `eas build -p ${platform} -e ${releaseChannel} --output ${outputPath} --local`
    );
  }
}

buildAll("ios", "production");
buildAll("android", "production");
