import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../pages/SearchBar';

function Header({ isAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to="/" style={styles.link}>Streamify</Link>
            </div>
            <SearchBar />
            <nav style={styles.nav}>
                <Link to="/" style={styles.link}>Home</Link>
                <Link to="/contact" style={styles.link}>Contact Us</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/upload" style={styles.link}>Upload Video</Link>
                        <Link to="/profile" style={styles.link}>Profile</Link>
                        <button onClick={handleLogout} style={styles.link}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff'
    },
    logo: {
        fontSize: '1.5rem'
    },
    nav: {
        display: 'flex',
        gap: '15px'
    },
    link: {
        color: '#fff',
        textDecoration: 'none'
    }
};

export default Header;
