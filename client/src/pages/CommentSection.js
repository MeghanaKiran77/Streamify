import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get(`/api/videos/${videoId}/comments`)
      .then(response => setComments(response.data))
      .catch(error => console.error(error));
  }, [videoId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/videos/${videoId}/comments`, { comment: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment._id}>{comment.comment}</li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input 
          type="text" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Add a comment" 
          required 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CommentSection;
