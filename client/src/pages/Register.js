import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let formErrors = {};
        let valid = true;

        if (!username) {
            valid = false;
            formErrors['username'] = 'Username is required';
        }

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
                const response = await axios.post('http://localhost:5002/api/auth/register', { username, email, password, bio });
                localStorage.setItem('token', response.data.token);
                navigate('/login');
            } catch (err) {
                console.error(err);
                alert('Registration failed');
            }
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                </div>
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
                <div>
                    <label>Bio</label>
                    <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        required 
                    />
                    {errors.bio && <span className="error">{errors.bio}</span>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
