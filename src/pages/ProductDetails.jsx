import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductDetail from '../components/product/ProductDetail';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }
    
    setLoading(false);
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); 
  };

  if (loading) {
    return <Loading text="Loading product details..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          message={error} 
          showRetry={false}
        />
        <div className="text-center mt-4">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </button>
      </div>
      
      <ProductDetail productId={parseInt(id)} />
    </div>
  );
};

export default ProductDetailsPage;
