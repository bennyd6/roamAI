import './header.css';
import logo from '../assets/logo.png';
// import user from '../assets/woman.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

export default function Header() {
    const [userName, setUserName] = useState('');
    const [isDropdownVisible, setDropdownVisible] = useState(false); // State to toggle dropdown
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate(); // Use useNavigate hook for navigation

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/getuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('authToken'),
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.name);
                } else {
                    console.error('Failed to fetch user');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear auth token
        // navigate('/login'); // Use navigate instead of history.push
        window.location.href='/login'
    };

    return (
        <div className="header-main">
            <div className="header-1">
            <h1>Globemate</h1>
                {/* <img src={logo} alt="" /> */}
                {/* <h1>motherly .</h1> */}
            </div>
            <div className="header-2" onClick={() => setDropdownVisible(!isDropdownVisible)}>
                {/* <img src={user} alt="" /> */}
                <a href="#">{userName ? userName : 'Loading...'}</a>

                {/* Dropdown Menu */}
                {isDropdownVisible && (
                    <div className="dropdown-menu">
                        <a href="#!" onClick={handleLogout}>Logout</a>
                    </div>
                )}
            </div>
        </div>
    );
}
