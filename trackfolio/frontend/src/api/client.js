const BASE_URL = "/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
};

export const applicationsApi = {
  list: (token, query = "") => request(`/applications${query}`, { token }),
  stats: (token) => request("/applications/stats", { token }),
  create: (token, payload) => request("/applications", { method: "POST", body: payload, token }),
  update: (token, id, payload) => request(`/applications/${id}`, { method: "PUT", body: payload, token }),
  remove: (token, id) => request(`/applications/${id}`, { method: "DELETE", token }),
};
