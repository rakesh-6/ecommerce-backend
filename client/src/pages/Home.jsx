import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productAPI } from '../api';
import { ProductCard } from '../components/ProductCard';
import '../styles/Home.css';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';

  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          keyword,
          category: category || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined
        };
        const response = await productAPI.getAll(params);
        // The backend now returns { products, page, pages }
        setProducts(response.data.products || response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, minPrice, maxPrice]);

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
          <div className="filters-bar">
            <div className="filter-group">
              <label>Category:</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price:</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Max Price:</label>
              <input
                type="number"
                placeholder="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            {(keyword || category || minPrice || maxPrice) && (
              <button
                className="clear-filters"
                onClick={() => {
                  setCategory('');
                  setMinPrice('');
                  setMaxPrice('');
                  // Note: keyword is from URL, clearing it requires navigating
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          <h2>{keyword ? `Search Results for "${keyword}"` : 'Featured Products'}</h2>

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
