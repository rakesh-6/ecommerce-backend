import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

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
