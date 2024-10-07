import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function VideoPlayback() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
                const response = await axios.get(`http://localhost:5002/api/videos`);
                console.log(response.data);
                setVideo(response.data);
        };
        fetchVideo();
    }, [id]);

    if (!video) return <div>Loading...</div>;

    console.log(video[0]._id);

    if (!video) return <div>Loading...</div>;

    return (
        <div>
            <h1>{video[0].title}</h1>
            <iframe
                width="600"
                height="400"
                src={`http://localhost:5002/api/videos/${video[0]._id}`}  // Use video._id here
                title={video[0].title}
            ></iframe>
            <p>{video[0].description}</p>
        </div>
    );
}

export default VideoPlayback;