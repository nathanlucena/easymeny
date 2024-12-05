<script>
import api from '../api';

export default {
  name: 'UserListPage',
  data() {
    return {
      users: [ {name: 'nathan'}, {name: 'bianca'}],
    };
  },
  async mounted() {
    try {
      const response = await api.get('/users');
      this.users = response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<template>
  <div>
    <h1>Lista de Usuários 11</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}:      {{ user.phone }}</li>
    </ul>
  </div>
</template>
