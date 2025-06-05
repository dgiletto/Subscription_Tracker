import { auth } from "../firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/"); // If not logged in, redirect home
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div>
        <Navbar />
        <div className="dashboard-container">
            <h1>Welcome to your Dashboard!</h1>
            <p>Track your subscriptions here.</p>
        </div>
    </div>
  );
}