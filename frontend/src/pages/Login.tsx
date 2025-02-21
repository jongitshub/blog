// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<null | string>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.email || "User");
        navigate("/home"); // Redirect if the user is already logged in
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAuth = async () => {
    try {
      setError(null);
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered successfully!");
        setIsRegistering(false);
        navigate("/login");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully!");
        navigate("/home"); // Redirect to Home after successful login
      }
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out.");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? "Register" : "Login"}
        </h1>

        {user ? (
          <div className="text-center">
            <p className="mb-4">Welcome, {user}!</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-xl"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-xl"
            />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              onClick={handleAuth}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl"
            >
              {isRegistering ? "Register" : "Login"}
            </button>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegistering ? "Already have an account? Login" : "New user? Register here"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
