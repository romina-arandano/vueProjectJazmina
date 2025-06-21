<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from '../config/axios'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(true)
const dialog = ref(false)
const pagos = ref([])
const usuarios = ref([])
const clases = ref([])
const membresias = ref([])
const router = useRouter()

const form = reactive({
  id: 0,
  id_usuario: null,
  id_membresia: null,
  id_clase: null,
  monto: 0,
  fecha: ''
})

const headers = [
  { title: 'Usuario', value: 'usuario' },
  { title: 'Clase', value: 'clase' },
  { title: 'Membresía', value: 'membresia' },
  { title: 'Monto', value: 'monto' },
  { title: 'Fecha', value: 'fecha' },
  { title: 'Acciones', value: 'actions', sortable: false }
]

const openDialog = async (id = null) => {
  if (id) {
    const res = await axios.get(`pagos/${id}`)
    Object.assign(form, res.data)
  } else {
    Object.assign(form, {
      id: 0,
      id_usuario: null,
      id_membresia: null,
      id_clase: null,
      monto: 0,
      fecha: ''
    })
  }
  dialog.value = true
}

const save = async () => {
  try {
    if (form.id) {
      await axios.put(`pagos/${form.id}`, form)
    } else {
      await axios.post('pagos', form)
    }

    dialog.value = false
    loadPagos()
  } catch (err) {
    console.error('Error al guardar:', err)
    if (err.response?.status === 422) {
      console.warn('Errores de validación:', err.response.data.errors)
      alert('Errores de validación. Revisa la consola 🙈')
    }
  }
}

const deletePago = async (id) => {
  if (!confirm('¿Eliminar este pago?')) return
  try {
    await axios.delete(`pagos/${id}`)
    loadPagos()
  } catch (err) {
    console.error('Error al eliminar:', err)
  }
}

const loadPagos = () => {
  axios.get('pagos')
    .then(res => pagos.value = res.data.data)
    .catch(err => console.error(err))
}

const loadUsuarios = () => {
  axios.get('usuarios')
    .then(res => usuarios.value = res.data.data)
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
  loadPagos()
  loadUsuarios()
  loadClases()
  loadMembresias()
})
</script>

<template>
  <v-app>
    <NavigationDrawer v-model:drawer="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Pagos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog()">Agregar pago</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-data-table :headers="headers" :items="pagos">
          <template #item.actions="{ item }">
            <v-btn icon @click="openDialog(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deletePago(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              {{ form.id ? 'Editar pago' : 'Nuevo pago' }}
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-select
                  v-model="form.id_usuario"
                  :items="usuarios"
                  item-title="name"
                  item-value="id"
                  label="Usuario"
                />
                <v-select
                  v-model="form.id_clase"
                  :items="clases"
                  item-title="tipo"
                  item-value="id"
                  label="Clase (opcional)"
                />
                <v-select
                  v-model="form.id_membresia"
                  :items="membresias"
                  item-title="id"
                  item-value="id"
                  label="Membresía (opcional)"
                />
                <v-text-field
                  v-model="form.monto"
                  label="Monto"
                  type="number"
                />
                <v-text-field
                  v-model="form.fecha"
                  label="Fecha"
                  type="date"
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
