const BASE_URL = "http://localhost:3000/api";

export async function getTeam(slug: string) {
  const response = await fetch(`${BASE_URL}/team/${slug}`);
  return await response.json();
}

export async function getTeams() {
  const response = await fetch(`${BASE_URL}/teams`);
  return await response.json();
}
