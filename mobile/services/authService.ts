import * as SecureStore from 'expo-secure-store';
import { API_URL, ENDPOINTS } from '@/constants/api';


const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

// Get stored access token
export async function getAccessToken() {
  return await SecureStore.getItemAsync(ACCESS_KEY);
}

// Get stored refresh token
async function handleAuthTokens(data: any) {
  const access = data.access ?? data.key ?? data.token;
  const refresh = data.refresh ?? data.refresh_token;

  if (access) await SecureStore.setItemAsync(ACCESS_KEY, access);
  if (refresh) await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}


export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_URL}${ENDPOINTS.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  
  await handleAuthTokens(data);
}

export async function registerUser(userData: any) {
    console.log("Registering user with data:", userData, API_URL + ENDPOINTS.REGISTER);
    const res = await fetch(`${API_URL}${ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error('Registration failed');
    await handleAuthTokens(data);
}

export async function logoutUser() {
    const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
    await clearTokens(); // Clear tokens locally first

    if (refresh) {
        try {
            await fetch(`${API_URL}${ENDPOINTS.LOGOUT}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });
        } catch (e) {
            console.log("Logout backend warning:", e);
        }
    }
}

// Refresh access token using the stored refresh token
export async function refreshAccessToken() {
    const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!refresh) return null;

    try {
        const res = await fetch(`${API_URL}${ENDPOINTS.REFRESH}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });

        if (!res.ok) {
            await clearTokens();
            return null;
        }

        const data = await res.json();
        await handleAuthTokens(data);
        return data.access;
    } catch (e) {
        return null;
    }
}