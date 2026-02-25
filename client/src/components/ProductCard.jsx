import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert('Added to cart!');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/product/${product._id}`}>
            {product.name}
          </Link>
        </h3>
        <p className="product-description">
          {product.description.substring(0, 60)}...
        </p>
        <div className="product-footer">
          <span className="price">₹{product.price}</span>
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            disabled={product.countInStock === 0}
          >
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        <small className="stock-info">
          Stock: {product.countInStock}
        </small>
      </div>
    </div>
  );
};
