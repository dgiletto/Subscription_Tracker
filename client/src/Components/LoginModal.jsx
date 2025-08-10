import { useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './LoginModal.css'

const provider = new GoogleAuthProvider();

export default function LoginModal({ showForm, setShowForm, isSignup, setIsSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, provider);
      handleClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAuth = async () => {
    try {
      setIsLoading(true);
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError("");
  }

  if (!showForm) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-login">
          <h2 className="modal-title-login">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="modal-subtitle-login">
            {isSignup 
              ? "Join thousands of users managing their subscriptions" 
              : "Sign in to your account to continue"
            }
          </p>
          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <button className="google-btn" onClick={loginWithGoogle} disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isLoading ? "Loading..." : `Continue with Google`}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                isSignup ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          <div className="switch-mode">
            <p>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button className="switch-btn" onClick={switchMode} disabled={isLoading}>
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}