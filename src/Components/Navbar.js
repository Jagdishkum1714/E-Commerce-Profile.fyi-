// Navbar.js
import React from 'react';
import '../Components/Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Side - Shopping Website */}
      <div className="navbar-brand">
        Shopping Website
      </div>

      {/* Right Side - Cart Button */}
      <div>
        <button className="cart-button">
          Cart
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
