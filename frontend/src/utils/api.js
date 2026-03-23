const API_BASE = "https://ai-faculty-evaluation-system.onrender.com";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE}${endpoint}`, {
        cache: 'no-store',
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });
}
