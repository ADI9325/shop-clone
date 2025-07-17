import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowRight, Truck, Shield, RotateCcw, Star, TrendingUp } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate(); 
  
  const [homeData, setHomeData] = useState({
    featuredProducts: [],
    categories: [],
    allProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.combined.getHomepageData();
      setHomeData(data);
    } catch (err) {
      setError(api.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading homepage..." />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchHomeData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Find Amazing Products 
                <span className="text-yellow-300"> at Great Prices</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Shop thousands of quality products with fast shipping and easy returns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={() => navigate('/products')}
                  className="border font-semibold"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={() => navigate('/products')} 
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Browse Products
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Featured Products</h3>
                <div className="grid grid-cols-2 gap-4">
                  {homeData.featuredProducts.slice(0, 4).map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => navigate(`/products/${product.id}`)} 
                      className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow h-32 flex flex-col"
                    >
                      <img
                        src={api.helpers.getImageUrl(product.images?.[0])}
                        alt={product.title}
                        className="w-full h-16 object-cover rounded mb-2 flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between min-h-0">
                        <p className="text-gray-800 text-xs font-medium truncate">{product.title}</p>
                        <p className="text-blue-600 text-sm font-bold">{api.helpers.formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Shop With Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make shopping easy with great service and customer care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm h-64 flex flex-col">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Free Shipping</h3>
                <p className="text-gray-600">Free delivery on orders over $50. Fast and reliable shipping.</p>
              </div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm h-64 flex flex-col">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                <RotateCcw className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Easy Returns</h3>
                <p className="text-gray-600">30-day return policy. Not happy? Send it back for a full refund.</p>
              </div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm h-64 flex flex-col">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Payment</h3>
                <p className="text-gray-600">Your payment is safe and secure. Shop with confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div className="text-center sm:text-left mb-6 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
              <p className="text-lg text-gray-600">Find what you're looking for</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/products')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {homeData.categories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate(`/products?category=${category.id}`)}
                className="text-center cursor-pointer group"
              >
                <div className="bg-gray-50 rounded-xl p-4 mb-3 group-hover:bg-gray-100 transition-colors h-24 flex items-center justify-center">
                  <img
                    src={api.helpers.getImageUrl(category.image)}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div className="text-center sm:text-left mb-6 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Products</h2>
              <p className="text-lg text-gray-600">Best-selling items this month</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/products')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View All Products
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeData.featuredProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the latest deals and new products delivered to your inbox.
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  variant="primary" 
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">4.8/5 Rating</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">50,000+ Happy Customers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;