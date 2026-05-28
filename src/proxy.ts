import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// MOCK MODE: proxy desativado. Auth check passou a ser client-side via localStorage
// (ver src/lib/auth.ts + useEffect em src/app/{posto,distribuidora}/layout.tsx).
// Esta função é no-op e não importa supabase.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
