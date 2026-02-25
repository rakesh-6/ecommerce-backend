import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    alert(`Added ${qty} item(s) to cart!`);
    navigate('/cart');
  };

  if (loading) return <div className="container"><p className="loading">Loading product...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!product) return <div className="container"><p className="error">Product not found</p></div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Products
        </button>

        <div className="product-detail">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details-section">
            <h1>{product.name}</h1>
            
            <div className="product-meta">
              <p><strong>Stock:</strong> {product.countInStock} items</p>
              <p><strong>Seller:</strong> {product.user?.name || 'Store'}</p>
            </div>

            <p className="description">{product.description}</p>

            <div className="price-section">
              <h2 className="price">₹{product.price}</h2>
            </div>

            {product.countInStock > 0 ? (
              <div className="purchase-section">
                <div className="qty-selector">
                  <label>Quantity:</label>
                  <select value={qty} onChange={(e) => setQty(parseInt(e.target.value))}>
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button onClick={handleAddToCart} className="add-to-cart-btn">
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="out-of-stock">
                <p>Out of Stock</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
