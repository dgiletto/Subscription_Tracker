import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { addSubscription, deleteSubscription, getUserSubscriptions, updateSubscription } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.get("/subscriptions", verifyToken, getUserSubscriptions);
userRouter.post("/subscriptions", verifyToken, addSubscription);
userRouter.put("/subscriptions/:subId", verifyToken, updateSubscription);
userRouter.delete("/subscriptions/:subId", verifyToken, deleteSubscription);

export default userRouter;