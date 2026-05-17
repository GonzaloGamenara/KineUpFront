const URL_BACK = import.meta.env.VITE_URL_BACK;
const PUERTO_BACK = import.meta.env.VITE_PUERTO_BACK;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    method: options.method ?? "GET",
    ...options,
    headers,
  };

  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${URL_BACK}:${PUERTO_BACK}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  return await response.json().catch(() => null);
}

export const httpClient = {
  get: (endpoint, options) =>
    request(endpoint, { ...options, method: "GET" }),

  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "POST", body }),

  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PUT", body }),

  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PATCH", body }),

  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: "DELETE" }),
};