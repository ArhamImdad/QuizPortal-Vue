<template>
  <div :class="['sidebar', { active }]">
    <!-- Admin Sidebar -->
    <ul v-if="role === 'admin'" class="nav flex-column mt-5">
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/admin" class="nav-link">Dashboard</router-link>
      </li>
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/admin/addManager" class="nav-link"
          >Add Users</router-link
        >
      </li>
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/admin/students" class="nav-link"
          >Students</router-link
        >
      </li>
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/admin/assignQuiz" class="nav-link"
          >Assign Quiz</router-link
        >
      </li>
    </ul>

    <!-- Manager Sidebar -->
    <ul v-if="role === 'manager'" class="nav flex-column mt-5">
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/manager-dashboard" class="nav-link"
          >Dashboard</router-link
        >
      </li>
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/manager-dashboard/students" class="nav-link"
          >Students</router-link
        >
      </li>
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/manager-dashboard/assignQuiz" class="nav-link"
          >Assign Quiz</router-link
        >
      </li>
    </ul>

    <!-- Student Sidebar -->
    <ul v-if="role === 'student'" class="nav flex-column mt-5">
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/student-dashboard" class="nav-link"
          >Dashboard
        </router-link>
      </li>
      <li class="nav-item hover" @click="closeSidebar">
        <router-link to="/assignQuizz" class="nav-link"
          >Assigned Quiz</router-link
        >
      </li>
    </ul>

    <button class="btn btn-dark" @click="logout">Logout</button>
  </div>
</template>

<script>
import { mapActions } from "vuex"; // Map Vuex actions

export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      role: null, // Store user role
    };
  },
  mounted() {
    // Get role from localStorage when component is mounted
    this.role = localStorage.getItem("userRole");
  },
  methods: {
    closeSidebar() {
      this.$emit("close");
    },
    ...mapActions(["logout"]), // Map the Vuex logout action
    async logout() {
      try {
        await this.logout(); // Call the Vuex action
        this.$router.push("/login"); // Redirect to the login page
      } catch (error) {
        console.error("Error during logout:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.hover :hover {
  background-color: whitesmoke;
}

.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: lightgray;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%); /* Hide by default */
  transition: transform 0.3s ease;
}

.sidebar.active {
  transform: translateX(0); /* Show when active */
}

.nav-link {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  display: block;
}
</style>
