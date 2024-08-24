const BASE_URL = "http://localhost:3000/api";

export async function getTeam(slug: string) {
  const response = await fetch(`${BASE_URL}/team/${slug}`);
  return await response.json();
}

export async function updateTeam(slug: string, data: any) {
  const response = await fetch(`${BASE_URL}/team/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}
