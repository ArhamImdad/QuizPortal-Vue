<template>
  <div class="dashboard-wrapper">
    <Sidebar
      :active="isActive"
      @close="isActive = false"
      @logout="handleLogout"
    />

    <div class="dashboard-content" :class="{ shifted: isActive }">
      <button class="toggle-button" @click="toggleSidebar">
        <span class="bar" :class="{ active: isActive }"></span>
        <span class="bar" :class="{ active: isActive }"></span>
        <span class="bar" :class="{ active: isActive }"></span>
      </button>
      <b-container>
        <div
          class="d-flex justify-content-center align-items-center flex-column top-div"
        >
          <h2 v-if="$route.name === 'StudentDashboard'">
            Welcome to Your Dashboard
          </h2>
        </div>

        <router-view></router-view>
      </b-container>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import Sidebar from "../Sidebar.vue";

export default {
  components: { Sidebar },
  setup() {
    const store = useStore();
    const isActive = ref(false);

    const toggleSidebar = () => {
      isActive.value = !isActive.value;
    };

    const handleLogout = async () => {
      try {
        console.log("Attempting to log out...");
        await store.dispatch("logout"); // Call the Vuex logout action
        console.log("Logout successful, redirecting...");
        await router.push("/login"); // Adjust based on your routing
      } catch (error) {
        console.error("Logout process failed:", error); // Log the error
        alert("Logout failed. Please try again.");
      }
    };

    return {
      isActive,
      toggleSidebar,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
}

.dashboard-content {
  flex-grow: 1;
  padding: 20px;
  transition: margin-left 0.3s;
}

.dashboard-content.shifted {
  margin-left: 250px; /* Same as sidebar width */
}

.toggle-button {
  position: absolute;
  top: 20px; /* Adjust as needed */
  left: 20px; /* Adjust as needed */
  background: transparent;
  border: none;
  z-index: 1000;
  cursor: pointer;
  display: flex;
  flex-direction: column; /* Stack bars vertically */
}

.bar {
  width: 30px;
  height: 4px;
  background-color: #333;
  margin: 5px 0;
  transition: background-color 0.3s;
}

.bar.active {
  background-color: red; /* Change color when active */
}

@media only screen and (max-width: 600px) {
  .top-div {
    margin-left: 50px;
  }
}
</style>
