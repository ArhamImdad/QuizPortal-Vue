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
          <!-- Show the heading only on the /manager-dashboard route -->
          <h2 v-if="$route.name === 'ManagerDashboard'">Manager Dashboard</h2>
        </div>
        <br/>
        <div class="">
          <!-- Cards Section -->
          <div
            v-if="$route.name === 'ManagerDashboard'"
            class="cards-container"
          >
            <!-- Accepted Students Card -->

            <a href="/manager-dashboard/students" class="text-decoration-none">
              <div class="dashboard-card">
                <img
                  src="../../../assets/images/accepted.png"
                  alt="Accepted Students"
                />
                <h3>Accepted Students</h3>
              </div>
            </a>

            <a href="/manager-dashboard/assignQuiz" class="text-decoration-none">
              <div class="dashboard-card">
                <img
                  src="../../../assets/images/assignQuiz.png"
                  alt="Assign Quizzes"
                />
                <h3>Assign Quizzes</h3>
              </div>
            </a>

            <!-- Assign Quizzes Card -->
          </div>
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

    return {
      isActive,
      toggleSidebar,
    };
  },
};
</script>

<style scoped>
/* General layout styles */
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
  top: 20px;
  left: 20px;
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

/* Responsive Cards Layout */
.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns layout */
  gap: 2rem;
  margin-top: 3rem;
  max-width: 1111px;
  margin: 0 auto;
}

@media only screen and (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr); /* Two columns on smaller screens */
  }
}

@media only screen and (max-width: 500px) {
  .cards-container {
    grid-template-columns: 1fr; /* One column on the smallest screens */
  }
}

.dashboard-card {
  background-color: #f5f5f5;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.dashboard-card img {
  width: 250px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
}

.dashboard-card h3 {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #333;
}

/* Hover effect: bubbling and scaling */
.dashboard-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.dashboard-card::before {
  content: "";
  position: absolute;
  top: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.6s ease-in-out;
}

.dashboard-card:hover::before {
  top: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.3);
}

/* Mobile responsiveness */
@media only screen and (max-width: 768px) {
  .dashboard-card {
    padding: 15px;
  }

  .dashboard-card img {
    height: 120px;
  }

  .dashboard-card h3 {
    font-size: 1rem;
  }
}

@media only screen and (max-width: 500px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>
