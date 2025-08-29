export function roleName(level?: number | null): 'Admin' | 'Moderador' | 'Leitor' {
  switch (Number(level)) {
    case 1: return 'Admin'
    case 2: return 'Moderador'
    default: return 'Leitor'
  }
}

export function roleDisplay(level?: number | null): string {
  const n = Number(level) || 3
  return `${n} · ${roleName(n)}`
}

export function roleBadgeClass(level?: number | null): string {
  const n = Number(level) || 3
  return 'badge ' + (n === 1 ? 'admin' : n === 2 ? 'moderator' : 'reader')
}
