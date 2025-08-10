import Navbar from "../Components/Navbar";
import './Home.css'
import Carousel from "../Components/Carousel";
import dashboard from "../Images/dashboard.png"
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import LoginModal from "../Components/LoginModal.jsx";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(() => {});
    return () => unsub();
  }, []);
  
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
        <button className="get-started" onClick={() => { setIsSignup(true); setShowForm(true); }}>
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
            <h2 style={{ marginBottom: "30px", fontSize: "2.3rem" }}>Why Use <b>Trackr?</b></h2>
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
        <LoginModal
          showForm={showForm}
          setShowForm={setShowForm}
          isSignup={isSignup}
          setIsSignup={setIsSignup}
        />
      )}
    </>
  );
}
