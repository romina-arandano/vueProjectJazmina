<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from '../config/axios'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(true)
const dialog = ref(false)
const clases = ref([])
const profesores = ref([])
const router = useRouter()

const form = reactive({
  id: 0,
  fecha: '',
  tipo: '',
  lugares: 0,
  lugares_ocupados: 0,
  lugares_disponibles: 0,
  id_profesor: null,
})

const headers = [
  { title: 'Fecha', value: 'fecha' },
  { title: 'Tipo', value: 'tipo' },
  { title: 'Lugares', value: 'lugares' },
  { title: 'Ocupados', value: 'lugares_ocupados' },
  { title: 'Disponibles', value: 'lugares_disponibles' },
  { title: 'Profesor', value: 'profesor' },
  { title: 'Acciones', value: 'actions', sortable: false }
]

const openDialog = async (id = null) => {
  if (id) {
    const res = await axios.get(`clases/${id}`)
    Object.assign(form, res.data)
  } else {
    Object.assign(form, {
      id: 0,
      fecha: '',
      tipo: '',
      lugares: 0,
      lugares_ocupados: 0,
      lugares_disponibles: 0,
      id_profesor: null,
    })
  }
  dialog.value = true
}

const save = async () => {
  try {
    if (form.id) {
      await axios.put(`clases/${form.id}`, form)
    } else {
      await axios.post('clases', form)
    }

    dialog.value = false
    loadClases()
  } catch (err) {
    console.error('Error al guardar:', err)

    if (err.response && err.response.status === 422) {
      console.warn('Errores de validación:', err.response.data.errors)
      alert('Errores de validación. Checa la consola 🙈')
    }
  }
}

const deleteClase = async (id) => {
  if (!confirm('¿Eliminar esta clase?')) return
  try {
    await axios.delete(`clases/${id}`)
    loadClases()
  } catch (err) {
    console.error('Error al eliminar:', err)
  }
}

const loadClases = () => {
  axios.get('clases')
    .then(res => clases.value = res.data.data)
    .catch(err => console.error(err))
}


const loadProfesores = () => {
  axios.get('profesores')
    .then(res => {
      console.log('Profesores desde API:', res.data)
      profesores.value = res.data.data
    })
    .catch(err => console.error('Error al cargar profesores:', err))
}



onMounted(() => {
  loadClases()
  loadProfesores()
})
</script>

<template>
  <v-app>
    <NavigationDrawer v-model:drawer="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Clases</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog()">Agregar clase</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-data-table :headers="headers" :items="clases">
          <template #item.actions="{ item }">
            <v-btn icon @click="openDialog(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteClase(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              {{ form.id ? 'Editar clase' : 'Nueva clase' }}
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field v-model="form.fecha" label="Fecha" type="date" />
                <v-text-field v-model="form.tipo" label="Tipo de clase" />
                <v-text-field v-model="form.lugares" label="Lugares" type="number" />
                <v-text-field v-model="form.lugares_ocupados" label="Ocupados" type="number" />
                <v-text-field v-model="form.lugares_disponibles" label="Disponibles" type="number" />
                <v-select
                    v-model="form.id_profesor"
                    :items="profesores"
                    item-title="name"
                    item-value="id"
                    label="Profesor"
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
