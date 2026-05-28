'use client'

import { useEffect, useState } from 'react'

export type Role = 'posto' | 'distribuidora'

const STORAGE_KEY = 'tanqe:role'
const NAME_KEY = 'tanqe:nome'

const PERFIS: Record<Role, { email: string; nome: string }> = {
  posto: { email: 'posto@tanqe.com.br', nome: 'Posto Sol Nascente' },
  distribuidora: { email: 'distribuidora@tanqe.com.br', nome: 'BR Petro SP' },
}

export function loginAs(role: Role) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, role)
  localStorage.setItem(NAME_KEY, PERFIS[role].nome)
}

export function getRole(): Role | null {
  if (typeof window === 'undefined') return null
  const v = localStorage.getItem(STORAGE_KEY)
  return v === 'posto' || v === 'distribuidora' ? v : null
}

export function getNome(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(NAME_KEY) || ''
}

export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(NAME_KEY)
}

export function useRole(): Role | null {
  const [role, setRole] = useState<Role | null>(null)
  useEffect(() => {
    setRole(getRole())
  }, [])
  return role
}

export const PERFIS_DEMO = PERFIS
