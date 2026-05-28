import { createBrowserClient } from '@supabase/ssr'

// Stub defensivo: se env vars do Supabase estiverem ausentes (ou com BOM/lixo),
// retorna um cliente fake que devolve respostas vazias em vez de explodir.
// O app roda em modo mock (auth via localStorage), então as páginas internas
// que ainda importam supabase apenas não recebem dados — mas não crasham.
type AnyResult = { data: unknown; error: unknown }
const EMPTY: AnyResult = { data: null, error: null }
const EMPTY_LIST: AnyResult = { data: [], error: null }

function makeQueryBuilder(): unknown {
  const handler: ProxyHandler<() => unknown> = {
    get(_, prop) {
      if (prop === 'then') {
        return (resolve: (v: AnyResult) => unknown, reject?: (e: unknown) => unknown) =>
          Promise.resolve(EMPTY_LIST).then(resolve, reject)
      }
      if (prop === 'single' || prop === 'maybeSingle') {
        return () => Promise.resolve(EMPTY)
      }
      return () => makeQueryBuilder()
    },
    apply() {
      return makeQueryBuilder()
    },
  }
  return new Proxy(() => undefined, handler)
}

function makeStubClient() {
  const channel = {
    on() {
      return channel
    },
    subscribe() {
      return channel
    },
    unsubscribe() {
      return Promise.resolve('ok')
    },
  }
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: 'Auth desabilitado em modo demo' },
      }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => makeQueryBuilder(),
    channel: () => channel,
    removeChannel: () => Promise.resolve('ok'),
  }
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return makeStubClient() as unknown as ReturnType<typeof createBrowserClient>
  }
  try {
    return createBrowserClient(url, key)
  } catch {
    return makeStubClient() as unknown as ReturnType<typeof createBrowserClient>
  }
}
