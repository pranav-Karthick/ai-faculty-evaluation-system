const API_BASE = "http://127.0.0.1:8000";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });
}
