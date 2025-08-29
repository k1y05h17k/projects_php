import { http } from './http'

export type UserDTO = {
  id: number
  name: string
  email: string
  role_level: 1 | 2 | 3
}

type ApiList<T> = { data: T[] }

/**
 * Lista de usuários SEMPRE como array.
 * Se o backend vier com { data: [...] }, normalizamos aqui.
 */
export async function listUsers(): Promise<UserDTO[]> {
  const { data } = await http.get('/users')
  return Array.isArray(data) ? (data as UserDTO[]) : ((data as ApiList<UserDTO>)?.data ?? [])
}

export async function createUser(payload: {
  name: string
  email: string
  password: string
  role_level: 1 | 2 | 3
}): Promise<UserDTO> {
  const { data } = await http.post('/users', payload)
  return data as UserDTO
}

export async function updateUser(
  id: number,
  payload: Partial<Pick<UserDTO, 'name' | 'email' | 'role_level'>> & { password?: string }
): Promise<UserDTO> {
  const { data } = await http.put(`/users/${id}`, payload)
  return data as UserDTO
}

export async function deleteUser(id: number): Promise<void> {
  await http.delete(`/users/${id}`)
}
