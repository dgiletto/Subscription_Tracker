import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import './Navbar.css'

const provider = new GoogleAuthProvider();

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsub();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => signOut(auth);

  return (
    <nav className="navbar">
      <div className="navbar-title">Trackr</div>
      <div className="navbar-auth">
        {user ? (
          <>
            <span className="username">{user.displayName}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    </nav>
  );
}
