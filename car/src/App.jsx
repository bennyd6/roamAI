import './App.css';
import Header from './components/header';
import Navbar from './components/navbar';
import Home from './pages/home';
import Plan from './pages/plan';
import Car from './pages/car';
import Hotel from './pages/hotel';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch

function App() {
  return (
    <Router> {/* Wrap everything inside Router */}
      <Header />
      <Navbar />
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} /> {/* Use element prop instead of component */}
        <Route path="/plan" element={<Plan />} />
        <Route path="/car" element={<Car />} />
        <Route path="/hotel" element={<Hotel />} />
      </Routes>
    </Router>
  );
}

export default App;
