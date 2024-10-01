<template>
  <div class="container">
    <h1 class="text-center mb-4">Assigned Quizzes</h1>

    <!-- Assigned Quizzes Section -->
    <div class="card mb-4">
      <div class="card-header"></div>
      <div class="card-body">
        <table class="table table-striped table-responsive">
          <thead>
            <tr>
              <th scope="col">Quiz Title</th>
              <th scope="col">Description</th>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Due Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quiz, index) in quizzesList" :key="index">
              <td>{{ quiz.quiz.title }}</td>
              <td>{{ quiz.quiz.description }}</td>
              <td>{{ formatDate(quiz.quiz.start_time) }}</td>
              <td>{{ formatDate(quiz.quiz.end_time) }}</td>
              <td>{{ formatDate(quiz.due_date) }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  style="background-color: #7b4bff"
                  @click="attemptQuiz(quiz.id)"
                >
                  Attempt
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quiz Modal -->
    <div v-if="isQuizModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <Quiz :questions="quizQuestions" :quizId="currentQuizId" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Quiz from "../Quiz.vue"; // Import the Quiz component
import { formatDate } from "../utils"; // Import the formatDate utility function

export default {
  components: {
    Quiz,
  },
  setup() {
    const quizzesList = ref([]);
    const isQuizModalOpen = ref(false);
    const quizQuestions = ref([]);
    const currentQuizId = ref(null);

    const fetchAssignedQuizzes = async () => {
      try {
        const response = await fetch(
          "http://192.168.15.67:8000/api/my-assigned-quizzes",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          quizzesList.value = result.data;
        } else {
          console.error("Error fetching quizzes:", result.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const attemptQuiz = async (quizId) => {
      try {
        const response = await fetch(
          `http://192.168.15.67:8000/api/take-quiz?id=${quizId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          quizQuestions.value = result.data.questions;
          currentQuizId.value = quizId;
          isQuizModalOpen.value = true;
        } else {
          console.error("Error attempting quiz:", result.message);
        }
      } catch (error) {
        console.error("Attempt quiz error:", error);
      }
    };

    const closeModal = () => {
      isQuizModalOpen.value = false;
    };

    onMounted(() => {
      fetchAssignedQuizzes();
    });

    return {
      quizzesList,
      formatDate,
      attemptQuiz,
      isQuizModalOpen,
      closeModal,
      quizQuestions,
      currentQuizId,
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

.card {
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  border-collapse: collapse;
  width: 100%;
}

.table-responsive {
  overflow-x: auto;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  transition: transform 0.3s ease;
}

.close {
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  float: right;
}

@media (max-width: 768px) {
  .card-header h5 {
    font-size: 1.25rem;
  }

  .btn {
    font-size: 0.9rem;
  }
}
</style>
