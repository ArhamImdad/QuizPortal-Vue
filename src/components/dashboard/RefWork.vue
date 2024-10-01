<template>
  <div class="container mt-4">
    <h1 class="text-center">Student Dashboard</h1>

    <!-- Assign Quizzes Section -->
    <div class="card mt-4">
      <div class="card-header">
        <h5>Assign Quizzes</h5>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Quiz Name</th>
              <th scope="col">Assign Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quiz, index) in assignedQuizzes" :key="index">
              <td>{{ quiz.name }}</td>
              <td>{{ quiz.assignedDate }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  @click="attemptQuiz(quiz)"
                  data-bs-toggle="modal"
                  data-bs-target="#quizModal"
                >
                  Attempt
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pending Quizzes Section -->
    <div class="card mt-4" v-if="pendingQuizzes.length">
      <div class="card-header">
        <h5>Pending Quizzes</h5>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Quiz Name</th>
              <th scope="col">Assigned Date</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quiz, index) in pendingQuizzes" :key="index">
              <td>{{ quiz.name }}</td>
              <td>{{ quiz.assignedDate }}</td>
              <td>{{ quiz.status }}</td>
              <td>
                <button class="btn btn-success" @click="completeQuiz(quiz)">
                  Finish Quiz
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Attempted Quizzes Section -->
    <div class="card mt-4" v-if="attemptedQuizzes.length">
      <div class="card-header">
        <h5>Attempted Quizzes</h5>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Quiz Name</th>
              <th scope="col">Completion Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quiz, index) in attemptedQuizzes" :key="index">
              <td>{{ quiz.name }}</td>
              <td>{{ quiz.completionDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for MCQs-based Quiz -->
    <div
      class="modal fade"
      id="quizModal"
      tabindex="-1"
      aria-labelledby="quizModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="quizModalLabel">
              {{ currentQuiz.name }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h6>MCQs Quiz</h6>
            <form>
              <div class="mb-3">
                <label>1. What is 2 + 2?</label>
                <div>
                  <label
                    ><input
                      type="radio"
                      value="3"
                      v-model="demoQuizAnswers.q1"
                    />
                    3</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="4"
                      v-model="demoQuizAnswers.q1"
                    />
                    4</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="5"
                      v-model="demoQuizAnswers.q1"
                    />
                    5</label
                  >
                </div>
              </div>
              <div class="mb-3">
                <label>2. What is the capital of France?</label>
                <div>
                  <label
                    ><input
                      type="radio"
                      value="Berlin"
                      v-model="demoQuizAnswers.q2"
                    />
                    Berlin</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="Madrid"
                      v-model="demoQuizAnswers.q2"
                    />
                    Madrid</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="Paris"
                      v-model="demoQuizAnswers.q2"
                    />
                    Paris</label
                  >
                </div>
              </div>
              <div class="mb-3">
                <label>3. What is 5 * 6?</label>
                <div>
                  <label
                    ><input
                      type="radio"
                      value="30"
                      v-model="demoQuizAnswers.q3"
                    />
                    30</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="20"
                      v-model="demoQuizAnswers.q3"
                    />
                    20</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="25"
                      v-model="demoQuizAnswers.q3"
                    />
                    25</label
                  >
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="finishDemoQuiz"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Element for Recording -->
    <video id="cameraFeed" width="320" height="240" autoplay muted></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assignedQuizzes: [
        { name: "Math Quiz", assignedDate: "2024-09-26" },
        { name: "History Quiz", assignedDate: "2024-09-26" },
      ],
      pendingQuizzes: [],
      attemptedQuizzes: [],
      currentQuiz: {},
      demoQuizAnswers: {
        q1: "",
        q2: "",
        q3: "",
      },
      cameraStream: null,
      mediaRecorder: null,
      recordedChunks: [],
    };
  },
  methods: {
    attemptQuiz(quiz) {
      this.currentQuiz = quiz;
      this.pendingQuizzes.push({ ...quiz, status: "In Progress" });
      this.assignedQuizzes = this.assignedQuizzes.filter(
        (q) => q.name !== quiz.name
      );
      this.startCameraRecording();
    },
    completeQuiz(quiz) {
      const completionDate = new Date().toISOString().split("T")[0];
      this.attemptedQuizzes.push({ name: quiz.name, completionDate });
      this.pendingQuizzes = this.pendingQuizzes.filter(
        (q) => q.name !== quiz.name
      );
      this.stopCameraRecording();
    },
    finishDemoQuiz() {
      // Add the current quiz to attempted list when finishing the quiz
      this.completeQuiz(this.currentQuiz);
    },
    async startCameraRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoElement = document.getElementById("cameraFeed");
        videoElement.srcObject = stream;
        this.cameraStream = stream;

        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.start();
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    },
    stopCameraRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.mediaRecorder.onstop = () => {
          const videoBlob = new Blob(this.recordedChunks, {
            type: "video/webm",
          });
          const url = window.URL.createObjectURL(videoBlob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "quiz-recording.webm";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          this.recordedChunks = [];
          this.stopCameraStream();
        };
      }
    },
    stopCameraStream() {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((track) => track.stop());
      }
    },
  },
};
</script>

<style scoped>
#cameraFeed {
  display: block;
  margin-top: 20px;
}
</style>
