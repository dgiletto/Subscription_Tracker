import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: String,
    category: String,
    billingPeriod: String,
    cost: Number,
    nextPayment: Date,
    createdAt: {type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    uid: {type: String, required: true, unique: true},
    subscriptions: [subscriptionSchema]
});

const User = mongoose.model("User", userSchema);

export default User;