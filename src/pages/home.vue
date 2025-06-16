<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<template>
  <div style="max-width: 600px; margin: auto; padding: 2rem">
    <h1>Bienvenido a Home 🏠</h1>
    <p>¡Ya estás autenticado!</p>
    <button @click="logout">Cerrar sesión</button>
  </div>
</template>
