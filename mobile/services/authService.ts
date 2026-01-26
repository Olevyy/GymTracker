import * as SecureStore from 'expo-secure-store';
import { API_URL, ENDPOINTS } from '@/constants/api';
import { router } from 'expo-router';


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
    try {
        // Get tokens
        const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
        const access = await SecureStore.getItemAsync(ACCESS_KEY);

        // If we still have tokens, inform backend
        if (refresh && access) {
             fetch(`${API_URL}${ENDPOINTS.LOGOUT}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}` 
                },
                body: JSON.stringify({ refresh }),
            });
        }
    } catch (e) {
        console.log("Logout error:", e);
    } finally {
        // Always clear tokens and redirect to login
        await clearTokens();
        router.replace("/(auth)/login");
    }
}

// Refresh access token using the stored refresh token
export async function refreshAccessToken() {
    const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!refresh) return null;
    const controller1 = new AbortController();
    const timeoutId1 = setTimeout(() => controller1.abort(), 10000);
    try {
        const res = await fetch(`${API_URL}${ENDPOINTS.REFRESH}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
            signal: controller1.signal,
        });
        clearTimeout(timeoutId1);
        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        await handleAuthTokens(data);
        return data.access;
    } catch (e) {
        throw e;
    }
}