import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../views/pages/LoginForm.vue";
import Register from "../views/pages/RegisterForm.vue";
import AdminDashboard from "../components/dashboard/adminDashboard/AdminDashboard.vue";
import StudentDashboard from "../components/dashboard/studentDashboard/StudentDashboard.vue";
import ManagerDashboard from "../components/dashboard/managerDashboard/ManagerDashboard.vue";
import Students from "../components/dashboard/adminDashboard/Students.vue";
import AddManager from "../components/dashboard/adminDashboard/AddManager.vue";
import SetPassword from "../components/setPassword/SetPassword.vue";
import AssignQuiz from "../components/dashboard/adminDashboard/AssignQuiz.vue";
import RefWork from "../components/dashboard/RefWork.vue";
import AssignQuizz from "../components/dashboard/studentDashboard/AssignQuizz.vue";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginForm,
  },
  {
    path: "/set-password",
    name: "SetPassword",
    component: SetPassword,
    props: (route) => ({ token: route.query.token }), // Pass token as prop
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/refWork",
    name: "RefWork",
    component: RefWork,
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    children: [
      { path: "students", component: Students },
      { path: "addManager", component: AddManager },
      { path: "assignQuiz", component: AssignQuiz }, // AdminDashboard path
    ],
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/student-dashboard",
    name: "StudentDashboard",
    component: StudentDashboard,
    meta: { requiresAuth: true, role: "student" },
    children: [{ path: "/assignQuizz", component: AssignQuizz }],
  },
  {
    path: "/manager-dashboard",
    name: "ManagerDashboard",
    component: ManagerDashboard,
    meta: { requiresAuth: true, role: "manager" },
    children: [
      { path: "students", component: Students },
      { path: "assignQuiz", component: AssignQuiz }, // AdminDashboard path
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard
// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token"); // Check for token
  const isAuthenticated = !!token; // Check if user is authenticated
  const user = localStorage.getItem("user"); // Get user data from local storage
  let userRole = null;

  // Safely parse user data
  if (user) {
    try {
      userRole = JSON.parse(user)?.role; // Get user role
    } catch (e) {
      console.error("Error parsing user data:", e);
      localStorage.removeItem("user"); // Remove invalid user data
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: "/login" }); // Redirect to login if not authenticated
  } else if (to.meta.role && to.meta.role !== userRole) {
    next({ path: "/" }); // Redirect if user does not have the required role
  } else {
    next(); // Proceed to the route
  }
});
export default router;
