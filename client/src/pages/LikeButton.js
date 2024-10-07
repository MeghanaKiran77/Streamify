import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LikeButton({ videoId }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    axios.get(`/api/videos/${videoId}/likes`)
      .then(response => {
        setLikes(response.data.likes);
        setLiked(response.data.liked);
      })
      .catch(error => console.error(error));
  }, [videoId]);

  const handleLike = async () => {
    try {
      await axios.post(`/api/videos/${videoId}/likes`);
      setLikes(likes + 1);
      setLiked(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleLike} disabled={liked}>
      {liked ? 'Liked' : 'Like'} ({likes})
    </button>
  );
}

export default LikeButton;
