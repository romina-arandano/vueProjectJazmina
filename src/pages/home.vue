<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../config/axios'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawer = ref(true)
const router = useRouter()
const dialog = ref(false)
const membresias = ref([])
const clientes = ref([])


const form = reactive({
  id: 0,
  id_usuario: null,
  clases_adquiridas: 0
})

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nombre del cliente', value: 'cliente' },
  { title: 'Clases adquiridas', value: 'clases_adquiridas' },
  { title: 'Disponibles', value: 'clases_disponibles' },
  { title: 'Ocupadas', value: 'clases_ocupadas' },
  { title: 'Acciones', value: 'actions', sortable: false },
]

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const openDialog = async (id = null) => {
  if (id) {
    const res = await axios.get(`membresias/${id}`)
    const m = res.data
    Object.assign(form, {
      id: m.id,
      id_usuario: m.id_usuario,
      clases_adquiridas: m.clases_adquiridas
    })
  } else {
    Object.assign(form, {
      id: 0,
      id_usuario: null,
      clases_adquiridas: 0
    })
  }
  dialog.value = true
}

const loadClientes = () => {
  axios.get('clientes')
    .then(res => {
      console.log('Clientes desde API:', res.data)
      clientes.value = res.data.data
    })
    .catch(err => console.error('Error al cargar clientes:', err))
}

const save = async () => {
  try {
    if (form.id) {
      await axios.put(`membresias/${form.id}`, form)
    } else {
      await axios.post('membresias', form)
    }
    dialog.value = false
    loadMembresias()
  } catch (err) {
    console.error('Error al guardar:', err)
  }
}

const deleteMembresia = async (id: any) => {
  if (!confirm('¿Eliminar esta membresía?')) return
  try {
    await axios.delete(`membresias/${id}`)
    loadMembresias()
  } catch (err) {
    console.error('Error al eliminar:', err)
  }
}

const loadMembresias = () => {
  axios.get('membresias')
    .then(res => membresias.value = res.data.data)
    .catch(err => console.error(err))
}


onMounted(() => {
  loadMembresias()
  loadClientes()
})
</script>

<template>
  <v-app>
    <NavigationDrawer v-model:drawer="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Membresías</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog()">Agregar membresía</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-data-table :items="membresias" :headers="headers">
          <template #item.actions="{ item }">
            <v-btn icon @click="openDialog(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteMembresia(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              {{ form.id ? 'Editar membresía' : 'Nueva membresía' }}
            </v-card-title>
            <v-card-text>
              <v-form>
                 <v-select
                    v-model="form.id_usuario"
                    :items="clientes"
                    item-title="name"
                    item-value="id"
                    label="Cliente"
                />
                <v-text-field
                  v-model="form.clases_adquiridas"
                  label="Clases adquiridas"
                  type="number"
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
