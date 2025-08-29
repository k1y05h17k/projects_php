import { http } from './http'

type LoginPayload = { email: string; password: string }
type LoginResponse = { access_token: string; token_type: string; expires_in: number }

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function me() {
  const { data } = await http.get('/auth/me')
  return data
}

export async function register(payload: {
  name: string
  email: string
  password: string
  password_confirmation: string
  role_level?: 1 | 2 | 3
}) {
  const { data } = await http.post('/auth/register', payload)
  return data
}