import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY))
});

async function verifyToken(req, res, next) {
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