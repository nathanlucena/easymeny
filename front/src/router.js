import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Users from './components/Users.vue';
import HelloWorld from './components/HelloWorld.vue';

const routes = [
  {
    path: '/', // Caminho principal
    name: 'Home',
    component: Home, // Componente a ser renderizado
  },
  {
    path: '/users', // Caminho para /users
    name: 'Users',
    component: Users, // Componente a ser renderizado
  },
  {
    path: '/hello', // Caminho para /users
    name: 'HelloWorld',
    component: HelloWorld, // Componente a ser renderizado
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
