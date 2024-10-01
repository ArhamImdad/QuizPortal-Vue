<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4" style="color: #7b4bff">Manage Quizzes</h1>
    <div class="row justify-content-center">
      <!-- Assign Quiz Card -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-dark text-white text-center">
            <h5 class="mb-0">Assign Quiz</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleAssignQuiz">
              <div class="mb-3">
                <label for="studentEmail" class="form-label"
                  >Select Student Email</label
                >
                <select
                  id="studentEmail"
                  class="form-select"
                  v-model="selectedEmail"
                  required
                >
                  <option value="" disabled>Select an email</option>
                  <option
                    v-for="student in acceptedStudents"
                    :key="student.id"
                    :value="student.email"
                  >
                    {{ student.email }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label for="quizSelect" class="form-label">Select Quiz</label>
                <select
                  id="quizSelect"
                  class="form-select"
                  v-model="selectedQuiz"
                  required
                >
                  <option value="" disabled>Select a quiz</option>
                  <option
                    v-for="quiz in quizzes"
                    :key="quiz.id"
                    :value="quiz.id"
                  >
                    {{ quiz.title }}
                  </option>
                </select>
              </div>
              <div    class="d-flex justify-content-center align-items-center">
                <p v-if="errorMessage" class="text-danger">
                  {{ errorMessage }}
                </p>

                <button
                  type="submit"
                  class="btn text-center d-flex justify-content-center align-items-center text-white"
                  style="background: #7b4bff; width: 150px"
                >
                  Assign Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Assigned Quizzes Card -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-dark text-white text-center">
            <h5 class="mb-0">Assigned Quizzes</h5>
          </div>
          <div class="card-body">
            <table class="table mt-4">
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Assigned At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="assignedQuiz in assignedQuizzes"
                  :key="assignedQuiz.id"
                >
                  <td>{{ assignedQuiz.quiz.title }}</td>
                  <td>
                    {{ new Date(assignedQuiz.assigned_at).toLocaleString() }}
                  </td>
                  <td>{{ assignedQuiz.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    const selectedEmail = ref("");
    const selectedQuiz = ref("");
    const errorMessage = ref("");

    const acceptedStudents = computed(() => store.getters.acceptedStudents);
    const quizzes = ref([]);
    const assignedQuizzes = ref([]);

    onMounted(async () => {
      await store.dispatch("fetchAcceptedStudents");
      await fetchQuizzes();
      await fetchAssignedQuizzes();
    });

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://192.168.15.67:8000/api/quizzes",
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        );
        quizzes.value = response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching quizzes:", error.message);
        errorMessage.value = "Failed to load quizzes.";
      }
    };

    const fetchAssignedQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://192.168.15.67:8000/api/assigned-quizzes",
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        );
        assignedQuizzes.value = response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching assigned quizzes:", error.message);
        errorMessage.value = "Failed to load assigned quizzes.";
      }
    };

    const handleAssignQuiz = async () => {
      if (!selectedEmail.value || !selectedQuiz.value) {
        errorMessage.value = "Please select both a student and a quiz.";
        return;
      }

      const student = acceptedStudents.value.find(
        (s) => s.email === selectedEmail.value
      );

      if (!student) {
        errorMessage.value = "Selected student not found.";
        return;
      }

      try {
        await axios.post(
          "http://192.168.15.67:8000/api/assign-quiz",
          {
            student_id: student.id,
            quiz_id: selectedQuiz.value,
          },
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        );

        alert("Quiz assigned successfully!");
        selectedEmail.value = "";
        selectedQuiz.value = "";
        errorMessage.value = "";

        await fetchAssignedQuizzes();
      } catch (error) {
        console.error("Error assigning quiz:", error.message);
        errorMessage.value = "Failed to assign quiz.";
      }
    };

    return {
      selectedEmail,
      selectedQuiz,
      acceptedStudents,
      quizzes,
      assignedQuizzes,
      errorMessage,
      handleAssignQuiz,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}
.card {
  border-radius: 10px;
}
.card-body {
  overflow: auto;
  width: auto;
  max-height: 243px;
}
</style>
