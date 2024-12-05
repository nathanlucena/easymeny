<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/users">Users</router-link></li>
        <li><router-link to="/hello">Hello World</router-link></li>
      </ul>
    </nav>
    <router-view></router-view> <!-- Aqui será renderizado o componente da rota -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
nav ul {
  list-style-type: none;
  display: flex;
  gap: 10px;
  padding: 0;
}

nav ul li {
  display: inline;
}

nav ul li a {
  text-decoration: none;
  color: blue;
}

nav ul li a.router-link-exact-active {
  font-weight: bold;
  color: black;
}
</style>
