<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(true)
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login') 
}

</script>

<template>
  <v-app>
    <NavigationDrawer v-model:drawer="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Mi aplicación</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <h1>PERFIL DEL USUARIO</h1>
      </v-container>
    </v-main>
  </v-app>
</template>
