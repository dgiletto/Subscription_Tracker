import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  signOut,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import trackr_logo from '../Images/trakr_logo.svg';
import LoginModal from "./LoginModal.jsx";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={trackr_logo} className="navbar-logo" alt=""/>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="navbar-title">Trackr</div>
          </Link>
        </div>
        <div className="navbar-auth">
          {user ? (
            <>
              <span className="user-name">{user.displayName || user.email}</span>
              <button className="offset-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="offset-btn" onClick={() => { setIsSignup(false); setShowForm(true); }}>
                Login
              </button>
              <button onClick={() => { setIsSignup(true); setShowForm(true); }}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

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