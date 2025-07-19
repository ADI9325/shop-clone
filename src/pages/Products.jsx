// src/pages/Products.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
      setCurrentFilters(prev => ({ ...prev, categoryId: category }));
    }
    if (search) {
      setSearchTerm(search);
    }
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentFilters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        api.products.getAll(20, 0),
        api.categories.getAll()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(api.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        searchTerm: searchTerm.trim(),
        categoryId: currentFilters.categoryId,
        priceRange: currentFilters.priceRange,
        sortBy: currentFilters.sortBy,
        minRating: currentFilters.minRating
      };
      
      const results = await api.combined.searchWithFilters(filters);
      setProducts(results);

      updateURL(filters);
    } catch (err) {
      setError(api.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (filters) => {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) params.set('search', filters.searchTerm);
    if (filters.categoryId && filters.categoryId !== 'all') params.set('category', filters.categoryId);
    if (filters.sortBy) params.set('sort', filters.sortBy);
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  };

  const handleFilterChange = useCallback((newFilters) => {
    setCurrentFilters(newFilters);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const loadMoreProducts = async () => {
    try {
      const nextPage = pagination.currentPage + 1;
      const moreProducts = await api.products.getAll(20, (nextPage - 1) * 20);
      
      setProducts(prev => [...prev, ...moreProducts]);
      setPagination(prev => ({
        ...prev,
        currentPage: nextPage,
        hasNextPage: moreProducts.length === 20
      }));
    } catch (err) {
      setError(api.handleError(err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
          
          <div className="flex items-center space-x-4">
              
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {!loading && (
          <p className="text-gray-600 mt-4">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <ProductFilter
            categories={categories}
            onFilterChange={handleFilterChange}
            currentFilters={currentFilters}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <Loading text="Loading products..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchInitialData} />
          ) : (
            <>
              <ProductList
                products={products}
                emptyMessage={searchTerm ? `No products found for "${searchTerm}"` : "No products found"}
              />

              {products.length > 0 && products.length % 20 === 0 && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    size="large"
                    onClick={loadMoreProducts}
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;