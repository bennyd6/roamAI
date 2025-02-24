import { Link } from 'react-router-dom'; // Import the Link component from react-router-dom
import './navbar.css';

export default function Navbar() {
  return (
    <div className="nav-main">
      <Link to="/">Home</Link> {/* Use Link instead of a */}
      <Link to="/plan">Plan with AI</Link>
      <Link to="/car">Rent a Car</Link>
      <Link to="/hotel">Book Hotel</Link>
    </div>
  );
}
