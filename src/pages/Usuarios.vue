<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from '../config/axios'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(true)
const dialog = ref(false)
const usuarios = ref([])
const router = useRouter()

const form = reactive({
  id: 0,
  name: '',
  email: '',
  password: '',
  rol: '',
})

const headers = [
  { title: 'Nombre', value: 'name' },
  { title: 'Correo', value: 'email' },
  { title: 'Rol', value: 'rol' },
  { title: 'Acciones', value: 'actions', sortable: false }
]

const openDialog = async (id = null) => {
  if (id) {
    const res = await axios.get(`usuarios/${id}`)
    Object.assign(form, res.data.data)
    form.password = ''
  } else {
    Object.assign(form, {
        id: 0,
        name: '',
        email: '',
        password: '',
        rol:'cliente'
    })

  }
  dialog.value = true
}

const save = async () => {
  try {
    console.log('Formulario antes de guardar:', JSON.stringify(form))

    if (form.id) {
      await axios.put(`usuarios/${form.id}`, form)
    } else {
      await axios.post('usuarios', form)
    }

    dialog.value = false
    loadUsuarios()
  } catch (err) {
    console.error('Error al guardar:', err)

    if (err.response && err.response.status === 422) {
      console.warn('Errores de validación:', err.response.data.errors)
      alert('Errores de validación. Checa la consola 🙈')
    }
  }
}

const deleteUsuario = async (id) => {
  if (!confirm('¿Eliminar este usuario?')) return
  try {
    await axios.delete(`usuarios/${id}`)
    loadUsuarios()
  } catch (err) {
    console.error('Error al eliminar:', err)
  }
}

const loadUsuarios = () => {
  axios.get('usuarios')
    .then(res => usuarios.value = res.data.data)
    .catch(err => console.error(err))
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  loadUsuarios()
})
</script>

<template>
  <v-app>
    <NavigationDrawer v-model:drawer="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Usuarios</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog()">Agregar usuario</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-data-table :headers="headers" :items="usuarios">
          <template #item.actions="{ item }">
            <v-btn icon @click="openDialog(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteUsuario(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              {{ form.id ? 'Editar usuario' : 'Nuevo usuario' }}
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field v-model="form.name" label="Nombre" />
                <v-text-field v-model="form.email" label="Correo" type="email" />
                <v-text-field v-model="form.password" label="Contraseña" type="password" />
                <v-select
                    v-model="form.rol"
                    :items="['profesor', 'cliente', 'administrador']"
                    label="Rol"
                    :rules="[v => !!v || 'Selecciona un rol']"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="primary" @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>
