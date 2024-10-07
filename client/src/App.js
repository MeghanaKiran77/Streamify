import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import VideoUpload from './pages/VideoUpload';
import VideoPlayback from './pages/VideoPlayback';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './pages/SearchBar';
import PasswordReset from './pages/PasswordReset';
import Contact from './pages/Contact';

function App() {
    return (
        <Router>
            <Header />
            <SearchBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<VideoUpload />} />
                <Route path="/videos/:id" element={<VideoPlayback />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/reset-password" element={<PasswordReset />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
