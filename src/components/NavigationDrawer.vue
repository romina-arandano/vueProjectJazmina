<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'

const props = defineProps({
  drawer: Boolean
})

const emit = defineEmits(['update:drawer'])
const router = useRouter()
const { lgAndUp } = useDisplay()

const toggleDrawer = () => {
  emit('update:drawer', !props.drawer)
}

const navigate = (route: string) => {
  router.push(route)
  emit('update:drawer', false) // cerrar el drawer después de navegar
}
</script>

<template>
  <v-navigation-drawer :model-value="props.drawer" @update:model-value="emit('update:drawer', $event)" :clipped="lgAndUp" app>
    <v-list dense>
      <v-list-item @click="navigate('/home')" link>
        <v-list-item-title>🏠 Inicio</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigate('/perfil')" link>
        <v-list-item-title>👤 Perfil</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
