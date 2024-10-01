<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center">Student Management</h1>

    <!-- Pending students table -->
    <div v-if="pendingStudents.length && role === 'admin'" class="mt-5">
      <h2 class="mb-3">Pending Students</h2>
      <table class="table table-bordered table-hover">
        <thead class="table-secondary">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in paginatedPendingStudents" :key="student.email">
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>
              <span class="badge bg-secondary">
                {{ capitalizeFirstLetter(student.status) }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-success btn-sm me-2"
                @click="handleAccept(student.email)"
              >
                Accept
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="handleReject(student.email)"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button
          class="btn btn-secondary btn-sm me-2"
          @click="previousPage('pending')"
          :disabled="currentPage.pending === 1"
        >
          Previous
        </button>
        <span>Page {{ currentPage.pending }} of {{ totalPages.pending }}</span>
        <button
          class="btn btn-secondary btn-sm ms-2"
          @click="nextPage('pending')"
          :disabled="currentPage.pending === totalPages.pending"
        >
          Next
        </button>
      </div>
    </div>

    <br />

    <div v-if="isAuthenticated">
      <!-- Admin view -->
      <div v-if="role === 'admin'">
        <h2 class="mb-3">All Students</h2>
        <table class="table table-bordered table-hover">
          <thead class="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in paginatedAllStudents" :key="student.email">
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-success': student.status === 'accepted',
                    'badge bg-danger': student.status === 'rejected',
                    'badge bg-secondary': student.status === 'pending',
                  }"
                >
                  {{ capitalizeFirstLetter(student.status) }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-success btn-sm me-2"
                  v-if="student.status !== 'accepted'"
                  @click="handleAccept(student.email)"
                >
                  Accept
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  v-if="student.status !== 'rejected'"
                  @click="handleReject(student.email)"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button
            class="btn btn-secondary btn-sm me-2"
            @click="previousPage('all')"
            :disabled="currentPage.all === 1"
          >
            Previous
          </button>
          <span>Page {{ currentPage.all }} of {{ totalPages.all }}</span>
          <button
            class="btn btn-secondary btn-sm ms-2"
            @click="nextPage('all')"
            :disabled="currentPage.all === totalPages.all"
          >
            Next
          </button>
        </div>
      </div>
      <br />

      <!-- Manager view -->
      <div v-if="role === 'admin' || role === 'manager'">
        <h2 class="text-success mb-3">Accepted Students</h2>
        <table class="table table-bordered table-hover">
          <thead class="table-success">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in paginatedAcceptedStudents"
              :key="student.email"
            >
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <span class="badge bg-success">
                  {{ capitalizeFirstLetter(student.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button
            class="btn btn-secondary btn-sm me-2"
            @click="previousPage('accepted')"
            :disabled="currentPage.accepted === 1"
          >
            Previous
          </button>
          <span
            >Page {{ currentPage.accepted }} of {{ totalPages.accepted }}</span
          >
          <button
            class="btn btn-secondary btn-sm ms-2"
            @click="nextPage('accepted')"
            :disabled="currentPage.accepted === totalPages.accepted"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Rejected Students Table (Visible to Admin) -->
      <div v-if="role === 'admin' && rejectedStudents.length" class="mt-5">
        <h2 class="text-danger mb-3">Rejected Students</h2>
        <table class="table table-bordered table-hover">
          <thead class="table-danger">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in paginatedRejectedStudents"
              :key="student.email"
            >
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <span class="badge bg-danger">
                  {{ capitalizeFirstLetter(student.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button
            class="btn btn-secondary btn-sm me-2"
            @click="previousPage('rejected')"
            :disabled="currentPage.rejected === 1"
          >
            Previous
          </button>
          <span
            >Page {{ currentPage.rejected }} of {{ totalPages.rejected }}</span
          >
          <button
            class="btn btn-secondary btn-sm ms-2"
            @click="nextPage('rejected')"
            :disabled="currentPage.rejected === totalPages.rejected"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Message for No Students -->
      <div v-if="isAuthenticated && !allStudents.length">
        <p>No students found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const role = ref(localStorage.getItem("userRole"));

    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const allStudents = computed(() => store.getters.allStudents);
    const acceptedStudents = computed(() => store.getters.acceptedStudents);
    const rejectedStudents = computed(() => store.getters.rejectedStudents);

    const pendingStudents = computed(() => {
      return allStudents.value.filter(
        (student) => student.status === "pending"
      );
    });

    const currentPage = ref({
      all: 1,
      accepted: 1,
      rejected: 1,
      pending: 1, // New entry for pending students
    });

    const itemsPerPage = 10;

    const totalPages = computed(() => ({
      all: Math.ceil(allStudents.value.length / itemsPerPage),
      accepted: Math.ceil(acceptedStudents.value.length / itemsPerPage),
      rejected: Math.ceil(rejectedStudents.value.length / itemsPerPage),
      pending: Math.ceil(pendingStudents.value.length / itemsPerPage), // Total pages for pending students
    }));

    const paginatedAllStudents = computed(() => {
      const start = (currentPage.value.all - 1) * itemsPerPage;
      return allStudents.value.slice(start, start + itemsPerPage);
    });

    const paginatedAcceptedStudents = computed(() => {
      const start = (currentPage.value.accepted - 1) * itemsPerPage;
      return acceptedStudents.value.slice(start, start + itemsPerPage);
    });

    const paginatedRejectedStudents = computed(() => {
      const start = (currentPage.value.rejected - 1) * itemsPerPage;
      return rejectedStudents.value.slice(start, start + itemsPerPage);
    });

    const paginatedPendingStudents = computed(() => {
      const start = (currentPage.value.pending - 1) * itemsPerPage;
      return pendingStudents.value.slice(start, start + itemsPerPage);
    });

    const nextPage = (table) => {
      if (currentPage.value[table] < totalPages.value[table]) {
        currentPage.value[table]++;
      }
    };

    const previousPage = (table) => {
      if (currentPage.value[table] > 1) {
        currentPage.value[table]--;
      }
    };

    const handleAccept = async (email) => {
      try {
        await store.dispatch("acceptStudent", email);
        alert("Student accepted successfully.");
      } catch (error) {
        alert("Error accepting student: " + error.message);
      }
    };

    const handleReject = async (email) => {
      try {
        await store.dispatch("rejectStudent", email);
        alert("Student rejected successfully.");
      } catch (error) {
        alert("Error rejecting student: " + error.message);
      }
    };

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    onMounted(() => {
      if (isAuthenticated.value) {
        store.dispatch("fetchStudents");
        store.dispatch("fetchAcceptedStudents");
        store.dispatch("fetchRejectedStudents");
      }
    });

    return {
      isAuthenticated,
      allStudents,
      acceptedStudents,
      rejectedStudents,
      pendingStudents,
      role,
      paginatedAllStudents,
      paginatedAcceptedStudents,
      paginatedRejectedStudents,
      paginatedPendingStudents,
      currentPage,
      totalPages,
      nextPage,
      previousPage,
      handleAccept,
      handleReject,
      capitalizeFirstLetter,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
}

.table {
  border-radius: 0.5rem;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.badge {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn {
  font-size: 0.875rem;
}

h2 {
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .table {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 0.8rem;
  }

  h1,
  h2 {
    font-size: 1.5rem;
  }
}
</style>
