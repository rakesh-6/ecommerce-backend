import { useState, useEffect } from 'react';
import { productAPI } from '../api';
import { ProductCard } from '../components/ProductCard';
import '../styles/Home.css';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="container"><p className="loading">Loading products...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
        </div>

        <div className="products-section">
          <h2>Featured Products</h2>
          
          {products.length === 0 ? (
            <p className="no-products">No products available</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
