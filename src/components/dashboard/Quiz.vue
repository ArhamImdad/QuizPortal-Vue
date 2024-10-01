<template>
  <div class="quiz-container" v-if="!isQuizClosed">
    <div class="quiz-header">
      <h2>Quiz{{ quizId }}</h2>
      <p>Total Questions: {{ questions.length }}</p>
    </div>

    <div class="video-container">
      <!-- Placeholder for video -->
      <p>Video will show here</p>
    </div>

    <div v-if="currentQuestion" class="question-section">
      <p class="question-text">
        {{ currentIndex + 1 }}. {{ currentQuestion.question_text }}
      </p>

      <div class="options-container">
        <div
          class="option-card"
          v-for="(option, key) in parsedOptions(currentQuestion.options)"
          :key="key"
        >
          <label>
            <input
              type="radio"
              :value="key"
              v-model="userAnswers[currentIndex]"
            />
            <span>{{ option }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="navigation">
      <button
        @click="prevQuestion"
        :disabled="currentIndex === 0"
        class="btn btn-prev"
      >
        Previous
      </button>
      <button
        @click="nextQuestion"
        :disabled="currentIndex === questions.length - 1"
        class="btn btn-next"
      >
        Next
      </button>
    </div>

    <p class="question-info">
      Question {{ currentIndex + 1 }} of {{ questions.length }}
    </p>

    <!-- Submit Button -->
    <button v-if="isQuizCompleted" @click="submitQuiz" class="btn btn-submit">
      Submit
    </button>
  </div>

  <!-- Message when quiz is submitted -->
  <div v-if="isQuizClosed" class="quiz-closed">
    <h2>Thank you! The quiz has been submitted.</h2>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export default {
  props: {
    questions: Array,
    quizId: Number,
  },
  setup(props) {
    const currentIndex = ref(0);
    const userAnswers = ref(Array(props.questions.length).fill(null)); // Store answers
    const studentId = JSON.parse(localStorage.getItem("user")).id; // Get student ID from local storage
    const mediaRecorder = ref(null);
    const recordedChunks = ref([]);
    const isQuizClosed = ref(false); // To track if the quiz is closed

    const currentQuestion = computed(() => props.questions[currentIndex.value]);
    const isQuizCompleted = computed(() =>
      userAnswers.value.every((answer) => answer !== null)
    );

    const parsedOptions = (options) => {
      return JSON.parse(options);
    };

    const nextQuestion = () => {
      if (currentIndex.value < props.questions.length - 1) {
        currentIndex.value++;
      }
    };

    const prevQuestion = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    };

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaRecorder.value = new MediaRecorder(stream);
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.value.push(event.data);
        }
      };
      mediaRecorder.value.start();
    };

    const stopRecording = () => {
      return new Promise((resolve) => {
        mediaRecorder.value.onstop = () => {
          const blob = new Blob(recordedChunks.value, { type: "video/webm" });
          const videoFile = new File([blob], "video.mp4", {
            type: "video/mp4",
          });
          resolve(videoFile);
        };
        mediaRecorder.value.stop();
      });
    };

    const stopVideoStream = () => {
      // Stop all active streams from the media recorder
      let tracks = mediaRecorder.value.stream.getTracks();
      tracks.forEach((track) => track.stop());
    };

    const submitQuiz = async () => {
      const videoFile = await stopRecording(); // Stop recording and get video file

      const answersPayload = {
        student_id: studentId,
        id: props.quizId,
        video: videoFile, // Video file to be uploaded
        answers: JSON.stringify({
          answers: props.questions.map((question, index) => ({
            question_id: question.question_id,
            answer: userAnswers.value[index],
          })),
        }),
      };

      console.log("Payload to submit:", JSON.stringify(answersPayload));

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("student_id", studentId);
      formData.append("id", props.quizId);
      formData.append("video", videoFile);
      formData.append("answers", answersPayload.answers);

      try {
        const response = await fetch(
          "http://192.168.15.67:8000/api/submit-quiz-attempt",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          console.log("Quiz submitted successfully:", result);

          // Stop the video stream and close the quiz
          stopVideoStream();
          isQuizClosed.value = true; // Close the quiz
        } else {
          console.error("Error submitting quiz:", result.errors);
        }
      } catch (error) {
        console.error("Submission error:", error);
      }
    };

    onMounted(() => {
      startRecording(); // Start recording when the component mounts
    });

    onBeforeUnmount(() => {
      if (mediaRecorder.value) {
        mediaRecorder.value.stop(); // Stop recording when the component unmounts
      }
    });

    return {
      currentQuestion,
      nextQuestion,
      prevQuestion,
      parsedOptions,
      userAnswers,
      currentIndex,
      isQuizCompleted,
      submitQuiz,
      isQuizClosed,
    };
  },
};
</script>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.video-container {
  margin: 20px 0;
  text-align: center;
}

.question-section {
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.options-container {
  display: flex;
  flex-direction: column;
}

.option-card {
  background-color: #e7f3ff;
  border: 1px solid #007bff;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.option-card input {
  margin-right: 10px;
}

.navigation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-prev {
  background-color: #d1f0d1;
}

.btn-next {
  background-color: #28a745;
  color: white;
}

.btn-submit {
  background-color: #007bff;
  color: white;
  width: 100%;
  margin-top: 20px;
}

.question-info {
  text-align: center;
  font-size: 1rem;
}

.quiz-closed {
  text-align: center;
  padding: 20px;
}

@media (max-width: 600px) {
  .quiz-container {
    padding: 10px;
  }

  .btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>
