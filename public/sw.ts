/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope

const CACHE_NAME = 'trainlog-v1'

const STATIC_ASSETS = [
  '/',
  '/login',
  '/signup',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  sw.skipWaiting()
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  sw.clients.claim()
})

sw.addEventListener('fetch', (event) => {
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension')
  ) return

  if (event.request.url.includes('supabase.co')) return

  const offlineResponse = new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
  })

  event.respondWith(
    fetch(event.request)
      .then((response): Response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })
        }
        return response
      })
      .catch(async (): Promise<Response> => {
        const cached = await caches.match(event.request)
        if (cached) return cached

        if (event.request.mode === 'navigate') {
          const fallback = await caches.match('/login')
          if (fallback) return fallback
        }

        return offlineResponse
      })
  )
})