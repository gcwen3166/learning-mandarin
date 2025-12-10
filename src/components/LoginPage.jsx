import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Signup
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let result;

    if (isSignUp) {
      // Create a new user
      result = await supabase.auth.signUp({ email, password });
    } else {
      // Log in existing user
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    const { data, error } = result;

    if (error) {
      setMessage(error.message);
    } else {
      if (isSignUp) {
        setMessage("Success! Please check your email to confirm your account.");
      } else {
        // If login successful, go to the Lessons page
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
        
        <form onSubmit={handleAuth} className="auth-form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" disabled={loading} className="start-btn">
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Log In")}
          </button>
        </form>

        {message && <p className="error-msg">{message}</p>}

        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "Need an account?"} 
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? " Log In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}