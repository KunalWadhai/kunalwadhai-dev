/// <reference types="vite/client" />

import axios, { AxiosError } from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

interface ApiError {
  ok: false
  error: string
  code?: string
  timestamp?: string
}

function shouldSuppressApiError(url: string | undefined, status: number | undefined) {
  if (!url) return false
  return url.includes('/api/github/summary') && status === 502
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const data = error.response?.data as ApiError | undefined
    const status = error.response?.status
    const url = error.config?.url
    if (!shouldSuppressApiError(url, status)) {
      console.error('API Error:', {
        status,
        message: data?.error || error.message,
        code: data?.code,
        url,
      })
    }
    throw error
  }
)

export async function apiGet(path: string) {
  try {
    const res = await axiosInstance.get(path)
    return res.data
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<ApiError>
    const errorMsg = axiosErr.response?.data?.error || axiosErr.message || 'Unknown error'
    const errorCode = axiosErr.response?.data?.code || 'NETWORK_ERROR'
    const status = axiosErr.response?.status

    if (!shouldSuppressApiError(path, status)) {
      console.error(`GET ${path} failed`, {
        status,
        message: errorMsg,
        code: errorCode,
      })
    }

    throw new Error(`GET ${path} failed: ${status ?? 'unknown'} - ${errorMsg}`)
  }
}

export async function apiPost(path: string, body: unknown) {
  try {
    const res = await axiosInstance.post(path, body)
    return res.data
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<ApiError>
    const errorMsg = axiosErr.response?.data?.error || axiosErr.message || 'Unknown error'
    const errorCode = axiosErr.response?.data?.code || 'NETWORK_ERROR'

    console.error(`POST ${path} failed`, {
      status: axiosErr.response?.status,
      message: errorMsg,
      code: errorCode,
    })

    // Create error object for higher-level handling
    const err = new Error(errorMsg) as AxiosError<ApiError>
    err.response = axiosErr.response
    throw err
  }
}
