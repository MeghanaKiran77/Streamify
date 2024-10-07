import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState({});
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:5002/api/users/me', {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                });

                setUser(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5002/api/videos/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setVideos(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserVideos();
    }, []);

    return (
        <div>
            <h1>Profile</h1>
            <div>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <p>{user.bio}</p>
            </div>
            <div>
                <h2>Your Videos</h2>
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <div key={video._id}>
                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                        </div>
                    ))
                ) : (
                    <p>You have no uploaded videos.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
