Copy
<template>
  <div class="manager-page">
    <!-- Button to Open Add Manager Form -->
    <div class="d-flex align-items-center justify-content-center">
      <button @click="toggleForm" class="open-form-button">Add Manager</button>
    </div>

    <!-- Add Manager Card -->
    <div v-if="isFormVisible" class="card">
      <form @submit.prevent="submitForm" class="add-manager-form">
        <h2 class="text-center">Add Manager</h2>
        <div class="form-group">
          <label for="name">Name:</label>
          <input
            type="text"
            id="name"
            v-model="manager.name"
            required
            class="form-input"
            placeholder="Enter manager's name"
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="manager.email"
            required
            class="form-input"
            placeholder="Enter manager's email"
          />
        </div>
        <div class="form-group">
          <label for="role">Role:</label>
          <select id="role" v-model="manager.role" required class="form-select">
            <option value="" disabled>Select Role</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>
        <div class="d-flex align-items-center justify-content-center">
          <button
            style="background-color: #7b4bff"
            type="submit"
            class="submit-button"
          >
            Add Manager
          </button>
        </div>
      </form>
    </div>

    <!-- Message Display -->
    <div
      v-if="message"
      class="message"
      :class="{ success: isSuccess, error: !isSuccess }"
    >
      {{ message }}
    </div>

    <h2 class="text-center">Managers List</h2>

    <!-- Responsive Manager Table -->
    <div class="table-responsive">
      <table v-if="paginatedManagers.length > 0" class="managers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <!-- <th>Role</th> -->
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manager in paginatedManagers" :key="manager.id">
            <td>{{ manager.name }}</td>
            <td>{{ manager.email }}</td>
            <!-- <td>{{ manager.role }}</td> -->
            <td>
              <button @click="deleteManager(manager.id)" class="btn delete-button text-white bg-danger">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Managers Message -->
    <!-- <div v-else>
      <p>No managers found.</p>
    </div> -->

    <!-- Pagination Controls -->
    <div class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const manager = ref({ name: "", email: "", role: "" });
    const managers = ref([]);
    const message = ref("");
    const isSuccess = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const isFormVisible = ref(false); // Control form visibility

    const fetchManagers = async () => {
      try {
        await store.dispatch("fetchManagers");
        managers.value = store.getters.managers;
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    onMounted(fetchManagers);

    const submitForm = async () => {
      message.value = "";
      isSuccess.value = false;

      try {
        await store.dispatch("addManager", manager.value);
        message.value = "Manager added successfully!";
        isSuccess.value = true;

        manager.value.name = "";
        manager.value.email = "";
        manager.value.role = "";
        isFormVisible.value = false; // Hide form after submission

        await fetchManagers();
      } catch (error) {
        message.value =
          error.response?.data?.message ||
          "Failed to add manager. Please try again.";
        isSuccess.value = false;
      }
    };

    const deleteManager = async (id) => {
      if (confirm("Are you sure you want to delete this manager?")) {
        try {
          await store.dispatch("deleteManager", { id });
          message.value = "Manager deleted successfully!";
          isSuccess.value = true;
          await fetchManagers();
        } catch (error) {
          message.value =
            error.response?.data?.message ||
            "Failed to delete manager. Please try again.";
          isSuccess.value = false;
        }
      }
    };

    const totalPages = computed(() =>
      Math.ceil(managers.value.length / itemsPerPage)
    );
    const paginatedManagers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return managers.value.slice(start, start + itemsPerPage);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const toggleForm = () => {
      isFormVisible.value = !isFormVisible.value; // Toggle form visibility
    };

    return {
      manager,
      managers,
      message,
      isSuccess,
      submitForm,
      deleteManager,
      paginatedManagers,
      currentPage,
      totalPages,
      nextPage,
      previousPage,
      isFormVisible,
      toggleForm,
    };
  },
};
</script>

<style scoped>
.manager-page {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}

.open-form-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  margin: 0 auto;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 3px;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 2rem;
}

.managers-table {
  width: 100%;
  border-collapse: collapse;
}

.managers-table th,
.managers-table td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}

.managers-table th {
  background-color: #f4f4f4;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
