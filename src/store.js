import { createStore } from "vuex";
import axios from "axios";

const loginUrl = "http://192.168.15.67:8000/api/login";
const logoutUrl = "http://192.168.15.67:8000/api/logout"; // Add logout URL

export default createStore({
  state: {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || { role: null },
    students: [],
    acceptedStudents: [],
    rejectedStudents: [],
    managers: [],
    assignedQuizzes: [], // Added state for assigned quizzes
    quizzesList: [], // Changed state name
  },

  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    isAdmin(state) {
      return state.user.role === "admin";
    },
    isManager(state) {
      return state.user.role === "manager";
    },
    isStudent(state) {
      return state.user.role === "student";
    },
    allStudents(state) {
      return state.students;
    },
    acceptedStudents(state) {
      return state.acceptedStudents;
    },
    rejectedStudents(state) {
      return state.rejectedStudents;
    },
    managers(state) {
      return state.managers;
    },
    assignedQuizzes(state) {
      return state.assignedQuizzes; // Getter for assigned quizzes
    },
    quizzesList(state) {
      return state.quizzesList;
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    SET_STUDENTS(state, students) {
      state.students = students;
    },
    SET_ACCEPTED_STUDENTS(state, students) {
      state.acceptedStudents = students;
    },
    SET_REJECTED_STUDENTS(state, students) {
      state.rejectedStudents = students;
    },
    SET_MANAGERS(state, managers) {
      state.managers = managers;
    },
    ADD_MANAGER(state, manager) {
      state.managers.push(manager);
    },
    SET_ASSIGNED_QUIZZES(state, quizzes) {
      state.assignedQuizzes = quizzes; // Mutation to set assigned quizzes
    },
    UPDATE_ASSIGNED_QUIZZES(state, quizzes) {
      state.quizzesList = quizzes; // Updated to new state name
    },
    LOGOUT(state) {
      state.token = null;
      state.user = { role: null };
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(loginUrl, credentials);
        const token = response.data.data.token;
        const user = response.data.data;

        commit("SET_TOKEN", token);
        commit("SET_USER", user);

        return user.role;
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw new Error("Login failed. Please check your credentials.");
      }
    },

    async fetchStudents({ commit, state }) {
      try {
        const response = await axios.get(
          "http://192.168.15.67:8000/api/students",
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const students = response.data.data || response.data;
        commit("SET_STUDENTS", students);
      } catch (error) {
        console.error(
          "Error fetching students:",
          error.response?.data || error.message
        );
        throw new Error("Failed to fetch students.");
      }
    },

    async fetchAcceptedStudents({ commit, state }) {
      try {
        const response = await axios.get(
          "http://192.168.15.67:8000/api/students?status=accepted",
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const acceptedStudents = response.data.data || response.data;
        commit("SET_ACCEPTED_STUDENTS", acceptedStudents);
      } catch (error) {
        console.error(
          "Error fetching accepted students:",
          error.response?.data || error.message
        );
        throw new Error("Failed to fetch accepted students.");
      }
    },

    async fetchRejectedStudents({ commit, state }) {
      try {
        const response = await axios.get(
          "http://192.168.15.67:8000/api/students?status=rejected",
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const rejectedStudents = response.data.data || response.data;
        commit("SET_REJECTED_STUDENTS", rejectedStudents);
      } catch (error) {
        console.error(
          "Error fetching rejected students:",
          error.response?.data || error.message
        );
        throw new Error("Failed to fetch rejected students.");
      }
    },

    async fetchManagers({ commit, state }) {
      try {
        const response = await axios.get(
          "http://192.168.15.67:8000/api/managers",
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const managers = response.data.data || response.data;
        commit("SET_MANAGERS", managers);
      } catch (error) {
        console.error(
          "Error fetching managers:",
          error.response?.data || error.message
        );
        throw new Error("Failed to fetch managers.");
      }
    },

    async addManager({ commit, state }, manager) {
      try {
        const response = await axios.post(
          "http://192.168.15.67:8000/api/add-manager",
          manager,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        commit("ADD_MANAGER", response.data);
      } catch (error) {
        console.error(
          "Error adding manager:",
          error.response?.data || error.message
        );
        throw new Error("Failed to add manager.");
      }
    },

    async acceptStudent({ commit, state }, email) {
      try {
        await axios.post(
          "http://192.168.15.67:8000/api/add-student",
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        // Update the student's status to accepted
        commit("UPDATE_STUDENT_STATUS", { email, status: "accepted" });
      } catch (error) {
        console.error(
          "Error accepting student:",
          error.response?.data || error.message
        );
        throw new Error("Failed to accept student.");
      }
    },

    async rejectStudent({ commit, state }, email) {
      try {
        await axios.post(
          "http://192.168.15.67:8000/api/reject-student",
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        // Update the student's status to rejected
        commit("UPDATE_STUDENT_STATUS", { email, status: "rejected" });
      } catch (error) {
        console.error(
          "Error rejecting student:",
          error.response?.data || error.message
        );
        throw new Error("Failed to reject student.");
      }
    },

    async logout({ commit }) {
      try {
        const response = await axios.post(
          logoutUrl,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        commit("LOGOUT");
        return response;
      } catch (error) {
        console.error("Logout Error:", error);
        throw new Error("Logout failed. Please try again.");
      }
    },
  },
  async fetchAssignedQuizzes({ commit, state }) {
    try {
      const response = await axios.get(
        "http://192.168.15.67:8000/api/assigned-quizzes",
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      commit("SET_ASSIGNED_QUIZZES", response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching assigned quizzes:", error.message);
      throw new Error("Failed to fetch assigned quizzes.");
    }
  },
  async deleteManager({ dispatch }, payload) {
    await axios.delete("http://192.168.15.67:8000/api/delete-manager", {
      data: payload, // The payload should be sent as data in the request
    });
    await dispatch("fetchManagers"); // Refresh the list after deletion
  },
  async loadAssignedQuizzes({ commit }) {
    try {
      const response = await axios.get(
        "http://192.168.15.67:8000/api/my-assigned-quizzes"
      );
      commit("UPDATE_ASSIGNED_QUIZZES", response.data);
    } catch (error) {
      console.error("Error fetching assigned quizzes:", error);
    }
  },
});
