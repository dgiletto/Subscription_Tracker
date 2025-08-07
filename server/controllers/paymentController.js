import { calculateNextPayment } from "../lib/paymentCalculator";
import User from '../models/User.js';

// Update a single user's subscriptions if there are any payments past due
export const updateSubscriptionsForUser = async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.uid });
        if (!user) return res.status(404).send("User not found");

        if (user.subscriptions.length === 0) {
            return res.status(404).send("No subscriptions found");
        }

        for (const sub of user.subscriptions) {
            const today = new Date();
            const nextPayment = new Date(sub.nextPayment);

            if (nextPayment <= today) {
                sub.nextPayment = calculateNextPayment(nextPayment, sub.billingPeriod);
                await user.save();
            }
        }
        res.json(user.subscriptions);
    } catch (error) {
        console.error("Error updating payment dates:", error);
    }
}

