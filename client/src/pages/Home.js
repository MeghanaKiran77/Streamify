import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/videos');
                setVideos(response.data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };
        fetchVideos();
    }, []);

    return (
        <div>
            <h1>Welcome to Streamify</h1>
            <p>Streamify is your ultimate destination for streaming and sharing videos. Whether you're here to watch the latest content or to upload your own creations, Streamify provides an engaging platform for all your video needs. Join us and dive into a world of endless entertainment!</p>
            <div>
                {videos.map(video => (
                    <div key={video._id}>
                        <h2>{video.title}</h2>
                        <Link to={`/videos/${video._id}`}>Watch Video</Link> {/* Use video._id here */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;