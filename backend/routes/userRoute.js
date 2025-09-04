import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { getSession } from "../controllers/paymentController.js";
import { faqHandler } from "../controllers/aiController.js";
import { chatHandler } from "../controllers/chatController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.post("/create-checkout-session", authUser, createCheckoutSession);
userRouter.get("/session", authUser, getSession);
userRouter.post("/ai/faq", faqHandler);
userRouter.post("/ai/chat", chatHandler);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

export default userRouter;
