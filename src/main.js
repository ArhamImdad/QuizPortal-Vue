import { createApp } from "vue";

import App from "./App.vue";

import store from "./store"; // Make sure this path is correct

import router from "./router"; // If you're using Vue Router

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure this is included for modal functionality

import "bootstrap";

const app = createApp(App);

app.use(store); // Correctly use the Vuex store

app.use(router); // If you're using router

app.mount("#app");
