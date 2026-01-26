// A simple API client that handles token-based authentication with automatic token refresh.
import { API_URL } from "@/constants/api";
import { getAccessToken, refreshAccessToken, logoutUser } from "@/services/authService";

let isRefreshing = false; 

interface QueueItem {
  resolve: (value: string | null) => void; // New access token or null if refresh failed
  reject: (reason?: any) => void; // Error reason
}

let failedQueue: QueueItem[] = []; // Queue of requests that failed due to access token expiration

// Process the queue of failed requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// A wrapper around fetch that adds authentication headers and handles token refresh
export async function apiFetch(
    endpoint: string,
    options: RequestInit = {},
    retry = true
): Promise<Response> {
    let token = await getAccessToken();
    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // first request
    const controller1 = new AbortController();
    const timeoutId1 = setTimeout(() => controller1.abort(), 10000);

    let response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller1.signal,
    });

    clearTimeout(timeoutId1);

    // If token expired — try to refresh and retry the request
    if (response.status === 401 && retry) {
            
            if (isRefreshing) {
                // Refresh already in progress — queue this request
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then((newToken) => {
                    // Retry original request with new token
                    return apiFetch(endpoint, options, false);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
            }

            // No refresh in progress — start one
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();

                if (!newToken) {
                    // Refresh failed - logout user and reject all queued requests
                    const err = new Error("Session expired");
                    processQueue(err, null);
                    await logoutUser();
                    throw err;
                }

                processQueue(null, newToken);

                // Retry the original request with the new token
                return apiFetch(endpoint, options, false);

            } catch (e) {
                processQueue(e, null);
                await logoutUser();
                throw e;
            } finally {
                isRefreshing = false;
            }
        }

        return response;
}