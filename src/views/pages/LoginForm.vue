<template>
  <div
    class="container-fluid mt-5 d-flex justify-content-center align-items-center login-container"
  >
    <form @submit.prevent="handleLogin">
      <div class="row w-100">
        <div
          class="col-md-6 d-flex flex-column justify-content-center align-items-center bg-dark text-white p-5"
        >
          <div class="w-75">
            <h2 class="fw-bold mb-3">Login</h2>
            <p class="mb-4">Enter your account details</p>

            <!-- Email Field -->
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                v-model="email"
                type="email"
                id="email"
                class="form-control bg-dark text-white border-secondary"
                placeholder="Email"
                required
              />
            </div>

            <!-- Password Field -->
            <div class="mb-3 position-relative">
              <label for="password" class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                id="password"
                class="form-control bg-dark text-white border-secondary"
                placeholder="Password"
                required
              />
              <i
                class="bi bi-eye position-absolute top-50 end-0 translate-middle-y me-3 mt-3"
              ></i>
            </div>

            <div class="mb-4">
              <a href="#" class="text-white">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary w-100 mb-3">
              Login
            </button>

            <p class="text-center">
              Don’t have an account?
              <router-link to="/register" class="text-primary"
                >Register</router-link
              >
            </p>
          </div>
        </div>

        <div
          class="col-md-6 d-flex flex-column justify-content-center align-items-center bg-light p-5 text-center"
        >
          <h1 class="fw-bold mb-3 text-purple">
            Welcome to <span class="text-purple">student portal</span>
          </h1>
          <p class="text-secondary mb-5">Login to access your account</p>
          <img
            src="../../assets/images/login.jpg"
            alt="Illustration"
            class="img-fluid"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");

    const handleLogin = async () => {
      try {
        const response = await axios.post(
          "http://192.168.15.67:8000/api/login",
          // "http://192.168.15.159:8080/api/login",
          {
            email: email.value,
            password: password.value,
          }
        );

        if (response.data.status === 200) {
          const token = response.data.data.token;
          const role = response.data.data.role;

          if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(response.data.data)); // Store user data
            localStorage.setItem("userRole", role); // Store role

            // Redirect based on user role
            console.log("User role:", role);
            switch (role) {
              case "admin":
                console.log("Redirecting to admin dashboard");
                await router.push("/admin");
                break;
              case "manager":
                console.log("Redirecting to manager dashboard");
                await router.push("/manager-dashboard");
                break;
              case "student":
                console.log("Redirecting to student dashboard");
                await router.push("/student-dashboard");
                break;
              default:
                console.log("Redirecting to default route");
                await router.push("/");
                break;
            }
          } else {
            throw new Error("Token not received");
          }
        } else {
          throw new Error(
            response.data.message || "Login failed. Please try again."
          );
        }
      } catch (error) {
        console.error(
          "Login Error:",
          error.response ? error.response.data : error
        );
        alert(
          error.response?.data?.message ||
            error.message ||
            "Login failed. Please try again."
        );
      }
    };

    // Return email, password, and handleLogin for template access
    return { email, password, handleLogin };
  },
};
</script>

<style scoped>
/* Custom Styles */
body {
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
}

.login-container {
  height: auto;
  max-width: 800px;
}

.bg-dark {
  background-color: #1a1a1a !important;
}

.text-purple {
  color: #7b4bff;
}

.bi-eye {
  cursor: pointer;
  color: whitesmoke;
}
</style>
