import React, { useState } from 'react';
import axios from 'axios';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/reset-password', { email });
      setMessage('Password reset link sent to your email');
    } catch (error) {
      console.error(error);
      setMessage('Error sending password reset link');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          required 
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PasswordReset;
