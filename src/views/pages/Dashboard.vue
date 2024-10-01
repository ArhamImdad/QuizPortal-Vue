<template>
  <div class="dashboard-container">
    <h1>Welcome, {{ user.username }}!</h1>
    <p>You are logged in to the Student Portal.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script></script>

<style scoped>
.dashboard-container {
  text-align: center;
  padding: 50px;
}
</style>
