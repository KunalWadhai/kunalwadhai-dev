/// <reference types="vite/client" />

import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const axiosInstanstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json' 
  },
});

export async function apiGet(path: string) {
  // const res = await fetch(`${API_BASE_URL}${path}`, {
  //   method: 'GET',
  //   headers: { 'Content-Type': 'application/json' },
  // })
  try{
    const res = await axiosInstanstance.get(path);
    return res.data;
  }catch(error: any){
    throw new Error(
      `GET ${path} failed: ${error.response.status} ${error.response.data}`
    );
  }
}

export async function apiPost(path: string, body: unknown) {
  // const res = await fetch(`${API_BASE_URL}${path}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(body),
  // })
  try{
    const payload = JSON.stringify(body);
    const res = await axiosInstanstance.post(path, payload);
    return res.data;
  }catch(error: any){
    throw new Error(
      `POST ${path} failed: ${error.response.status} ${error.response.data}`
    );
  }
}

