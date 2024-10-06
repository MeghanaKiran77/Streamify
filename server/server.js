const express = require('express');
const cors = require('cors');
const app = require('./app');

const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: 'http://localhost:4000'
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
