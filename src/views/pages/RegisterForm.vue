<template>
  <div
    class="container-fluid mt-5 d-flex justify-content-center align-items-center login-container"
  >
    <div class="row" style="height: 100px; width: 800px">
      <div
        class="col-md-6 d-flex flex-column justify-content-center align-items-center bg-dark text-white p-4"
      >
        <form @submit.prevent="handleSubmit">
          <h2 class="fw-bold mb-2 text-center">Register</h2>
          <p class="mb-2 text-center">Create your account</p>

          <div class="mb-2">
            <label for="name" class="form-label">Name</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              class="form-control bg-dark text-white border-secondary"
              placeholder="Name"
              required
            />
            <span class="text-danger">{{ errors.name }}</span>
          </div>

          <div class="mb-2">
            <label for="email" class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="form-control bg-dark text-white border-secondary"
              placeholder="Email"
              required
            />
            <span class="text-danger">{{ errors.email }}</span>
          </div>

          <div class="mb-2">
            <label for="phone_number" class="form-label">Phone Number</label>
            <input
              v-model="form.phone_number"
              type="text"
              id="phone_number"
              class="form-control bg-dark text-white border-secondary"
              placeholder="Enter Phone Number"
              required
            />
            <span class="text-danger">{{ errors.phone_number }}</span>
          </div>

          <div class="mb-2">
            <label for="cv" class="form-label">Upload CV (PDF/Word only)</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="form-control bg-dark text-white border-secondary"
              id="cv"
              accept=".pdf,.doc,.docx"
              required
            />
            <span class="text-danger">{{ errors.cv }}</span>
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3">
            Register
          </button>
          <p class="text-center">
            Already have an account?
            <router-link to="/login" class="text-white">Login</router-link>
          </p>
        </form>
      </div>
      <div
        class="col-md-6 d-flex flex-column justify-content-center align-items-center bg-light p-5 text-center"
      >
        <h1 class="fw-bold mb-3 text-purple">
          Welcome to <span class="text-purple">student portal</span>
        </h1>
        <p class="text-secondary mb-5">Register to access your account</p>
        <img
          src="../../assets/images/register.png"
          alt="Illustration"
          class="img-fluid"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "FormPage",
  setup() {
    const router = useRouter();
    const form = ref({
      name: "",
      email: "",
      phone_number: "",
      cv: null,
    });

    const errors = ref({});

    const validate = () => {
      errors.value = {};
      let valid = true;

      if (!form.value.name) {
        errors.value.name = "Please provide your name.";
        valid = false;
      }

      if (!form.value.email.match(/\w+@\w+\.\w+/)) {
        errors.value.email = "Please provide a valid email address.";
        valid = false;
      }

      if (!form.value.phone_number) {
        errors.value.phone_number = "Please provide your phone number.";
        valid = false;
      }

      // Optional: Add phone number validation
      if (form.value.phone_number.length < 10) {
        errors.value.phone_number =
          "Phone number must be at least 10 digits long.";
        valid = false;
      }

      if (!form.value.cv) {
        errors.value.cv = "Please upload a CV in PDF or Word format.";
        valid = false;
      }

      return valid;
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (
        file &&
        (file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        form.value.cv = file;
        errors.value.cv = ""; // Clear error if file type is valid
      } else {
        errors.value.cv = "Only PDF or Word files are allowed.";
      }
    };

    const saveUser = async () => {
      const formData = new FormData();
      formData.append("name", form.value.name.trim());
      formData.append("email", form.value.email.trim());
      formData.append("phone_number", form.value.phone_number.trim());
      if (form.value.cv) {
        formData.append("cv", form.value.cv);
      }

      try {
        const response = await axios.post(
          "http://192.168.15.67:8000/api/register/student",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("User saved:", response.data);
        alert(
          "Registration successful! Your form has been submitted for review."
        );
        router.push("/LoginPage");
      } catch (error) {
        console.error(
          "Error saving user:",
          error.response ? error.response.data : error.message
        );
        alert("Registration failed. Please try again.");
      }
    };

    const handleSubmit = async () => {
      if (validate()) {
        await saveUser();
      }
    };

    return {
      form,
      errors,
      handleSubmit,
      handleFileUpload,
    };
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

.bg-dark {
  background-color: #1a1a1a !important;
}

/* .login-container {
  height: auto;
  width: 800px;
} */

.text-purple {
  color: #7b4bff;
}

.bi-eye {
  cursor: pointer;
  color: white;
}

.login-container {
  max-width: 1200px;
  max-height: auto;
}
</style>
