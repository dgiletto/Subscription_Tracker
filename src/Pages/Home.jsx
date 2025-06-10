import Navbar from "../Components/Navbar";
import './Home.css'
import Carousel from "../Components/Carousel";
import dashboard from "../Images/dashboard.png"
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();

export default function Home() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);
  
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      setShowForm(false);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowForm(false);
      setEmail("");
      setPassword("");
      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="home-container">
        <Carousel />
        <h2>Track Your Subscriptions</h2>
        <p>
          Stay on top of your recurring payments with our simple and effective subscription manager.
          <br></br>
          Track and manage all of your subscriptions in one place
        </p>
        <button className="get-started" onClick={() => { setIsSignup(false); setShowForm(true); }}>
          Get Started Here
        </button>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "60px",
          gap: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          margin: "40px auto",
          maxWidth: "1200px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <div style={{ flex: "1 1 400px" }}>
            <h2 style={{ marginBottom: "30px", fontSize: "2.3rem" }}>Why Use <b>Trakr?</b></h2>
            <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2", fontSize: "1.5rem" }}>
              <li>Track Spending 💰</li>
              <li>Get Subscription Insights 🧠</li>
              <li>Visualize Trends 📊</li>
            </ul>
          </div>
          <div style={{ flex: "1 1 400px", textAlign: "center" }}>
            <img 
            src={dashboard} 
            alt="Dashboard Example" 
            style={{ width: "100%", maxWidth: "700px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Sign Up</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br />
            {error && <p className="error">{error}</p>}
            <button onClick={handleAuth}>
              {isSignup ? "Create Account" : "Login"}
            </button>
            <button onClick={loginWithGoogle}>Login with Google</button><br />
            <button className="close-btn" onClick={() => setShowForm(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
