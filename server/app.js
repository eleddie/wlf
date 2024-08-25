const express = require("express");
const cors = require("cors");
const { getTeamData, setTeamData, getTeamsData } = require("./db/index.js");
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.listen(port, () => {
  console.log(`WLF app listening on port ${port}`);
});

app.get("/api/team/:teamSlug", (req, res) => {
  const teamSlug = req.params.teamSlug;
  const teamData = getTeamData(teamSlug);
  if (teamData) teamData.image = `http://localhost:3000/images/${teamSlug}`;
  res.status(200).json(teamData ?? {});
});

app.get("/images/:teamSlug", (req, res) => {
  const teamSlug = req.params.teamSlug;
  const teamData = getTeamData(teamSlug);
  const img = fs.readFileSync(teamData.image);
  res.writeHead(200, { "Content-Type": "image/svg+xml" });
  res.end(img, "binary");
});

app.get("/api/teams", (req, res) => {
  const teamsData = getTeamsData();
  for (const teamSlug in teamsData) {
    if (teamsData[teamSlug].image)
      teamsData[teamSlug].image = `http://localhost:3000/images/${teamSlug}`;
  }
  res.status(200).json(teamsData);
});

app.put("/api/team/:teamSlug", (req, res) => {
  const teamSlug = req.params.teamSlug;
  const teamData = req.body;
  console.log(teamData);
  setTeamData(teamSlug, teamData);
  res.status(200).json({ status: "ok" });
});
