/// <reference types="vite/client" />

import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

export async function apiGet(path: string) {
  try {
    const res = await axiosInstance.get(path);
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: string } };
    throw new Error(
      `GET ${path} failed: ${err.response?.status ?? 'unknown'} ${err.response?.data ?? ''}`
    );
  }
}

export async function apiPost(path: string, body: unknown) {
  try {
    const res = await axiosInstance.post(path, body);
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: string } };
    throw new Error(
      `POST ${path} failed: ${err.response?.status ?? 'unknown'} ${err.response?.data ?? ''}`
    );
  }
}
