<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import axios from '../config/axios'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(true)
const dialog = ref(false)
const asistencias = ref([])
const clases = ref([])
const clientes = ref([])
const profesores = ref([])
const membresiasUsuario = ref([]) // ← solo las del usuario seleccionado
const router = useRouter()

const form = reactive({
  id: 0,
  id_clase: null,
  id_usuario: null,
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
    await loadMembresiasByUsuario(form.id_usuario) // Cargar membresías del usuario si ya existe
  } else {
    Object.assign(form, {
      id: 0,
      id_clase: null,
      id_usuario: null,
      id_profesor: null,
      id_membresia: null
    })
    membresiasUsuario.value = [] // limpiar
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
    if (err.response?.status === 422) {
      alert('Errores de validación. Revisa la consola.')
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

const loadClientes = () => {
  axios.get('clientes')
    .then(res => {
      console.log('Clientes desde API:', res.data)
      clientes.value = res.data.data
    })
    .catch(err => console.error('Error al cargar clientes:', err))
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

const loadMembresiasByUsuario = async (id_usuario) => {
  if (!id_usuario) return membresiasUsuario.value = []
  try {
    const res = await axios.get(`membresias/por-usuario/${id_usuario}`)
    membresiasUsuario.value = res.data.data
  } catch (err) {
    console.error('Error al cargar membresías por usuario:', err)
  }
}

// Ver cambios de usuario en tiempo real:
watch(() => form.id_usuario, (nuevoUsuario) => {
  loadMembresiasByUsuario(nuevoUsuario)
})

onMounted(() => {
  loadAsistencias()
  loadClientes()
  loadProfesores()
  loadClases()
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
                  :items="clientes"
                  item-title="name"
                  item-value="id"
                  label="Cliente"
                />
                <v-select
                  v-model="form.id_membresia"
                  :items="membresiasUsuario"
                  item-title="id"
                  item-value="id"
                  label="Membresía del usuario"
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
