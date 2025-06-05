import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import trackr_logo from '../Images/trakr_logo.png';

const provider = new GoogleAuthProvider();

export default function Navbar() {
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

  const logout = () => signOut(auth);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={trackr_logo} className="navbar-logo" alt=""/>
          <div className="navbar-title">Trackr</div>
        </div>
        <div className="navbar-auth">
          {user ? (
            <>
              <span className="user-name">{user.displayName || user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="login" onClick={() => { setIsSignup(false); setShowForm(true); }}>
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
        <div className="modal">
          <div className="modal-content">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
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