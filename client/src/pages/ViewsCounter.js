import React, { useEffect } from 'react';
import axios from 'axios';

function ViewsCounter({ videoId }) {
  useEffect(() => {
    axios.post(`/api/videos/${videoId}/views`)
      .catch(error => console.error(error));
  }, [videoId]);

  return null;
}

export default ViewsCounter;
