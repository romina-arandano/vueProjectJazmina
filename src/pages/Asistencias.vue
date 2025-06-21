<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from '../config/axios'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(true)
const dialog = ref(false)
const asistencias = ref([])
const clases = ref([])
const usuarios = ref([])
const profesores = ref([])
const membresias = ref([])
const router = useRouter()

const form = reactive({
  id: 0,
  id_clase: null,
  id_usuario: null,
  id_profesor: null,
  id_membresia: null
})

const headers = [
  { title: 'Clase', value: 'clase' },
  { title: 'Fecha', value: 'fecha_clase' },
  { title: 'Usuario', value: 'usuario' },
  { title: 'Profesor', value: 'profesor' },
  { title: 'Membresía', value: 'id_membresia' },
  { title: 'Acciones', value: 'actions', sortable: false }
]

const openDialog = async (id = null) => {
  if (id) {
    const res = await axios.get(`asistencias/${id}`)
    Object.assign(form, res.data)
  } else {
    Object.assign(form, {
      id: 0,
      id_clase: null,
      id_usuario: null,
      id_profesor: null,
      id_membresia: null
    })
  }
  dialog.value = true
}

const save = async () => {
  try {
    if (form.id) {
      await axios.put(`asistencias/${form.id}`, form)
    } else {
      await axios.post('asistencias', form)
    }

    dialog.value = false
    loadAsistencias()
  } catch (err) {
    console.error('Error al guardar:', err)

    if (err.response && err.response.status === 422) {
      console.warn('Errores de validación:', err.response.data.errors)
      alert('Errores de validación. Checa la consola')
    }
  }
}

const deleteAsistencia = async (id) => {
  if (!confirm('¿Eliminar esta asistencia?')) return
  try {
    await axios.delete(`asistencias/${id}`)
    loadAsistencias()
  } catch (err) {
    console.error('Error al eliminar:', err)
  }
}

const loadAsistencias = () => {
  axios.get('asistencias')
    .then(res => asistencias.value = res.data.data)
    .catch(err => console.error(err))
}

const loadUsuarios = () => {
  axios.get('usuarios')
    .then(res => usuarios.value = res.data.data)
    .catch(err => console.error(err))
}

const loadProfesores = () => {
  axios.get('profesores')
    .then(res => profesores.value = res.data.data)
    .catch(err => console.error(err))
}

const loadClases = () => {
  axios.get('clases')
    .then(res => clases.value = res.data.data)
    .catch(err => console.error(err))
}

const loadMembresias = () => {
  axios.get('membresias')
    .then(res => membresias.value = res.data.data)
    .catch(err => console.error(err))
}

onMounted(() => {
  loadAsistencias()
  loadUsuarios()
  loadProfesores()
  loadClases()
  loadMembresias()
})
</script>

<template>
  <v-app>
    <NavigationDrawer v-model:drawer="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Asistencias</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog()">Agregar asistencia</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-data-table :headers="headers" :items="asistencias">
          <template #item.actions="{ item }">
            <v-btn icon @click="openDialog(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteAsistencia(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              {{ form.id ? 'Editar asistencia' : 'Nueva asistencia' }}
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-select
                  v-model="form.id_clase"
                  :items="clases"
                  item-title="tipo"
                  item-value="id"
                  label="Clase"
                />
                <v-select
                  v-model="form.id_usuario"
                  :items="usuarios"
                  item-title="name"
                  item-value="id"
                  label="Usuario"
                />
                <v-select
                  v-model="form.id_profesor"
                  :items="profesores"
                  item-title="name"
                  item-value="id"
                  label="Profesor"
                />
                <v-select
                  v-model="form.id_membresia"
                  :items="membresias"
                  item-title="id"
                  item-value="id"
                  label="Membresía (opcional)"
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
