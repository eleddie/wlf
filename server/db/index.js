const fs = require("fs");

const dbPath = "./db/db.json";
const imagesPath = "./db/images";

function setTeamData(teamSlug, teamData) {
  // existing db
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
  // read existing data
  const dbStr = fs.readFileSync(dbPath);
  const db = JSON.parse(dbStr);

  //   image will be received as base64 string but must be stored in a file as {teamSlug}.png and the path to the image should be stored in the teamData object
  if (teamData.image && teamData.image.startsWith("data:image/svg+xml")) {
    const base64Data = teamData.image.replace(
      /^data:image\/svg\+xml;base64,/,
      ""
    );
    fs.writeFileSync(`${imagesPath}/${teamSlug}.svg`, base64Data, "base64");
    teamData.image = `${imagesPath}/${teamSlug}.svg`;
  }

  // update data
  db[teamSlug] = {
    ...db[teamSlug],
    ...teamData,
  };

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function getTeamData(teamSlug) {
  // existing db
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
  // read existing data
  const dbStr = fs.readFileSync(dbPath);
  const db = JSON.parse(dbStr);

  return db[teamSlug];
}

function getTeamsData() {
  // existing db
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
  // read existing data
  const dbStr = fs.readFileSync(dbPath);
  const db = JSON.parse(dbStr);

  return db;
}

module.exports = {
  setTeamData,
  getTeamData,
  getTeamsData,
};
