import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [IsAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let formErrors = {};
        let valid = true;

        if (!email) {
            valid = false;
            formErrors['email'] = 'Email is required';
        }

        if (!password) {
            valid = false;
            formErrors['password'] = 'Password is required';
        }

        setErrors(formErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:5002/api/auth/login', {
                    email,
                    password
                });

                // Store the token in local storage and set authentication state
                localStorage.setItem('token', response.data.token);
                setIsAuthenticated(true);
                // Redirect to the profile page
                navigate('/profile');
            } catch (err) {
                console.error(err);
                // Handle error, e.g., display error message to user
            }
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
