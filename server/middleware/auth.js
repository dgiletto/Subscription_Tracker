import admin from 'firebase-admin';
import serviceAccount from '../trakr-efefe-firebase-adminsdk-fbsvc-2a5c75687e.json' with { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).send("Unauthorized");
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.uid = decoded.uid;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}