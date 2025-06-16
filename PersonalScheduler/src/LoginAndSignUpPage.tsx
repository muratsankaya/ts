import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './LoginAndSignUpPage.css';
import { auth } from './config/firebase';

interface LoginAndSignUpPageProps {}

function hasNonAlphanumericChar(s: string): boolean {
  for (const c of `^$*.[]{}()?"!@#%&/\\,><':;|_~`) {
    if (s.includes(c)) return true;
  }
  return false;
}

const LoginAndSignUpPage: React.FC<LoginAndSignUpPageProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [highlightPassword, setHighlightPassword] = useState<boolean>(false);

  // This handler is for the primary form action: logging in
  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === '') {
      setHighlightPassword(true);
      return;
    }

    if (error) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600); // Duration should match CSS animation
      return;
    }
  };

  // This handler is for the secondary action: signing up
  const handleSignUpClick = () => {
    if (password === '') {
      setHighlightPassword(true);
      return;
    }

    if (error) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600); // Duration should match CSS animation
      return;
    }

    // --- Your sign-up navigation or modal logic goes here ---
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (password === '') {
      setError('');
      return;
    }
    setHighlightPassword(false);
    if (password.length < 8)
      setError('Pasword must be at least 8 characters long');
    else if (password.length > 4096)
      setError('Password length should not be longer that 4096 characters');
    else if (password === password.toUpperCase())
      setError('Password must contain a lowercase character');
    else if (password === password.toLowerCase())
      setError('Password must contain an uppercase character');
    // /\d/ is a regular expression that looks for a numeric character
    else if (!/\d/.test(password))
      setError('Password must contain a numeric letter');
    else if (!hasNonAlphanumericChar(password))
      setError('Password must contain at least 1 alphanumeric character.');
    else setError('');
  }, [password]);

  return (
    <div className="login-container">
      <form onSubmit={handleLoginSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field ${highlightPassword ? 'input-error-highlight' : ''}`}
              required
            />
            <span
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="password-toggle-icon"
            >
              {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>
        </div>

        {error && (
          <p className={`error ${isShaking ? 'shake' : ''}`}>{error}</p>
        )}

        <div className="button-group">
          <button type="submit" className="button primary">
            Login
          </button>
          <button
            type="button"
            onClick={handleSignUpClick}
            className="button secondary"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginAndSignUpPage;
