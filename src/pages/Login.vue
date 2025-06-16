<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../config/axios';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();

const login = async () => {
  try {
    if (!email.value || !password.value) {
      errorMessage.value = 'Por favor, completa todos los campos';
      return;
    }

    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    });

    if (response.data.acceso === 'Ok') {
      localStorage.setItem('token', response.data.token);
      router.push('/home');
    } else {
      errorMessage.value = response.data.error;
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Error inesperado';
  }
};
</script>

<template>
  <div style="max-width: 400px; margin: auto; padding: 2rem">
    <h1>Iniciar Sesión</h1>
    <input v-model="email" placeholder="Correo" type="email" />
    <input v-model="password" placeholder="Contraseña" type="password" />
    <button @click="login">Entrar</button>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>
