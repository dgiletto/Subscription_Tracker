import User from "../models/User.js"


// Get all subscriptions for logged in user
export const getUserSubscriptions = async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.uid });
        if (!user) {
            user = await User.create({ uid: req.uid, subscriptions: [] });
        }
        res.json(user.subscriptions);
    } catch (error) {
        console.log(error.message);
        res.json({message: error.message});
    }
}

// Add a subscription
export const addSubscription = async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.uid });
        if (!user) {
            user = await User.create({ uid: req.uid, subscriptions: [] });
        }
        user.subscriptions.push(req.body);
        await user.save();
        res.json(user.subscriptions);
    } catch (error) {
        console.log(error.message);
        res.json({message: error.message});
    }
}

// Update a subscription
export const updateSubscription = async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.uid });
        if (!user) return res.status(404).send("User not found");
        
        const sub = user.subscriptions.id(req.params.subId);
        if (!sub) return res.status(404).send("Subscription not found");

        Object.assign(sub, req.body);
        await user.save();
        res.json(sub);
    } catch (error) {
        console.log(error.message);
        res.json({message: error.message});
    }
}

// Delete a subscription
export const deleteSubscription = async (req, res) => {
    try {
        const { subId } = req.params;
        const user = await User.findOne({ uid: req.uid });
        if (!user) return res.status(404).send("User not found");

        const subIndex = user.subscriptions.findIndex(
            s => s._id.toString() === subId
        );
        if (subIndex === -1) return res.status(404).send("Subscription not found");

        user.subscriptions.splice(subIndex, 1);
        await user.save();

        res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
        res.json({message: error.message});
    }
}