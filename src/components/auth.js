import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // Importing the CSS file

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/main");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/main");
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/main");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <h1 className="auth-title">Sign in to Disciple </h1>
        <button className="google-button" onClick={signInWithGoogle}>
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google logo"
          />
          Continue with Google
        </button>
        <div className="divider">
          <span>or</span>
        </div>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <button className="auth-button" onClick={handleSignIn}>
            Log in
          </button>
          <button className="auth-button" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
        <div className="auth-links">
          <a href="#">Use single sign-on</a>
          <a href="#">Reset password</a>
          <a href="#">No account? Create one</a>
        </div>
      </div>
    </div>
  );
};
