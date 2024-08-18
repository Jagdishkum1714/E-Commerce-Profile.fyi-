import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('/Product.json')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingProductIndex > -1) {
        // Increase quantity of existing product
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    toast.success(`${product.name} added to cart!`);
  };

  const changeQuantity = (id, amount) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(item => item !== null);
      return updatedCart;
    });
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProductList products={products} addToCart={addToCart} />
            }
          />
          <Route
            path="/cart"
            element={<CartPage cart={cart} changeQuantity={changeQuantity} />}
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-left">Shopping Website</div>
    <div className="navbar-right">
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>
    </div>
  </nav>
);

const ProductList = ({ products, addToCart }) => (
  <div>
    <h1>Products List</h1>
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.img} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
            <button 
              className="add-to-cart-button" 
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  </div>
);

const CartPage = ({ cart, changeQuantity }) => {
  const calculateSubtotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    toast.success('Order successful!');
  };

  return (
    <div>
      <h1>Cart Page</h1>
      <div className="cart-items">
        {cart.length > 0 ? (
          <div>
            <ul>
              {cart.map((product) => (
                <li key={product.id}>
                  <img src={product.img} alt={product.name} className="cart-item-image" />
                  <div>
                    <h2>{product.name}</h2>
                    <p>${product.price.toFixed(2)} x {product.quantity}</p>
                    <button onClick={() => changeQuantity(product.id, 1)}>+</button>
                    <button onClick={() => changeQuantity(product.id, -1)}>-</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <p>Subtotal: ${calculateSubtotal()}</p>
              <button className="checkout-button" onClick={handleCheckout}>
                Order
              </button>
            </div>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default App;
