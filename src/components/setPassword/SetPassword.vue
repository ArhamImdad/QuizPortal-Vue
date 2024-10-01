<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="row w-75">
      <!-- Left Section -->
      <div class="col-md-6 bg-dark text-white p-5">
        <h1 class="mb-4">Set New Password</h1>
        <p>Enter your new password below</p>

        <!-- Set Password Form -->
        <form @submit.prevent="handleSetPassword">
          <div class="mb-3">
            <label for="newPassword" class="form-label">New Password</label>
            <input
              type="password"
              v-model="newPassword"
              class="form-control"
              id="newPassword"
              placeholder="Enter new password"
              required
            />
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label"
              >Confirm Password</label
            >
            <input
              type="password"
              v-model="confirmPassword"
              class="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              required
            />
          </div>

          <!-- Error Message -->
          <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100">
            Set Password
          </button>
        </form>
      </div>

      <!-- Right Section -->
      <div
        class="col-md-6 bg-light text-center d-flex flex-column justify-content-center p-5"
      >
        <h2 class="text-primary">Your information is safe with us.</h2>
        <p>Set your password to access your account</p>
        <img
          src="../../assets/images/resetPassword.png"
          alt="Set Password Illustration"
          class="img-fluid"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router"; // Import for routing

export default {
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      errorMessage: "",
      email: "", // Email to be passed to the backend
      token: "", // Token from the URL
    };
  },
  created() {
    const route = useRoute();
    this.token = route.query.token; // Get token from the URL
    this.email = route.query.email; // Get email from the URL
  },
  methods: {
    async handleSetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }

      const payload = {
        password: this.newPassword,
        password_confirmation: this.confirmPassword,
        token: this.token,
        email: this.email, // Extract email from URL
      };

      try {
        // Send the payload to the backend API
        const response = await axios.post(
          "http://192.168.15.67:8000/api/set-password",
          payload
        );

        if (response.data.success) {
          alert("Password successfully set!");
          // Redirect to login page after successful password reset
          this.$router.push("/login");
        } else {
          this.errorMessage = response.data.message || "Password reset failed!";
        }
      } catch (error) {
        this.errorMessage = "An error occurred. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}

.bg-dark {
  background-color: #212529;
}

.text-primary {
  color: #6f42c1;
}

button {
  background-color: #0069d9;
}
</style>
