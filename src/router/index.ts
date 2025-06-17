/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ Función para verificar si hay token
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

// ✅ Middleware global: proteger rutas
router.beforeEach((to, from, next) => {
  // Permitimos el acceso libre solo al login ("/")
  const publicPages = ['/', '/login']
if (!publicPages.includes(to.path) && !isAuthenticated()) {
    console.warn('Acceso denegado. Redirigiendo a login.')
    next('/')
  } else {
    next()
  }
})

// Workaround para error de importación dinámica
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
