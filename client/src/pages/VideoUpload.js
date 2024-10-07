import React, { useState } from 'react';
import axios from 'axios';

function VideoUpload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formErrors = {};
        let valid = true;

        if (!title) {
            valid = false;
            formErrors['title'] = 'Title is required';
        }

        if (!description) {
            valid = false;
            formErrors['description'] = 'Description is required';
        }

        if (!video) {
            valid = false;
            formErrors['video'] = 'Video file is required';
        }

        setErrors(formErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('video', video);

            try {
                await axios.post('http://localhost:5002/api/videos/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Video uploaded successfully');
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h1>Upload Video</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                    {errors.title && <span className="error">{errors.title}</span>}
                </div>
                <div>
                    <label>Description</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                </div>
                <div>
                    <label>Video</label>
                    <input 
                        type="file" 
                        onChange={(e) => setVideo(e.target.files[0])} 
                        required 
                    />
                    {errors.video && <span className="error">{errors.video}</span>}
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default VideoUpload;
