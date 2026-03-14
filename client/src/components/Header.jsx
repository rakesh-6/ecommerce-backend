import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🛒 Ecommerce
          </Link>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/cart" className="cart-link">
              Cart ({cartItems.length})
            </Link>

            {user ? (
              <>
                <span className="user-name">Hi, {user.name}</span>
                <Link to="/orders">Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin">Admin</Link>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="register-btn">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
