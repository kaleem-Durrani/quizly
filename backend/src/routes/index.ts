import express from "express";
import quizRoutes from "./quizRoutes";
import questionRoutes from "./questionRoutes";
import submissionRoutes from "./submissionRoutes";
import adminRoutes from "./adminRoutes";
import studentRoutes from "./studentRoutes";
import teacherRoutes from "./teacherRoutes";
import classRoutes from "./classRoutes";

// Auth routes
import adminAuthRoutes from "./adminAuthRoutes";
import studentAuthRoutes from "./studentAuthRoutes";
import teacherAuthRoutes from "./teacherAuthRoutes";

const router = express.Router();

// Normal routes
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/classes", classRoutes);
router.use("/quizzes", quizRoutes);
router.use("/questions", questionRoutes);
router.use("/submissions", submissionRoutes);
router.use("/admin", adminRoutes);

// Auth routes
router.use("/admin/auth", adminAuthRoutes);
router.use("/students/auth", studentAuthRoutes);
router.use("/teachers/auth", teacherAuthRoutes);

export default router;
