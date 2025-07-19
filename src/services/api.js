const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.escuelajs.co/api/v1';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const productAPI = {
  getAll: async (limit = 20, offset = 0) => {
    return await apiRequest(`/products?limit=${limit}&offset=${offset}`);
  },

  getById: async (id) => {
    return await apiRequest(`/products/${id}`);
  },

  getByCategory: async (categoryId, limit = 20) => {
    return await apiRequest(`/categories/${categoryId}/products?limit=${limit}`);
  },

  search: async (title) => {
    return await apiRequest(`/products/?title=${encodeURIComponent(title)}`);
  },

  getByPriceRange: async (minPrice, maxPrice, limit = 20) => {
    return await apiRequest(`/products/?price_min=${minPrice}&price_max=${maxPrice}&limit=${limit}`);
  },

  getWithFilters: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.title) params.append('title', filters.title);
    if (filters.price_min) params.append('price_min', filters.price_min);
    if (filters.price_max) params.append('price_max', filters.price_max);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const queryString = params.toString();
    return await apiRequest(`/products${queryString ? '?' + queryString : ''}`);
  },

  create: async (productData) => {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id, productData) => {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

export const categoryAPI = {
  getAll: async () => {
    return await apiRequest('/categories');
  },

  getById: async (id) => {
    return await apiRequest(`/categories/${id}`);
  },

  create: async (categoryData) => {
    return await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  update: async (id, categoryData) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

export const userAPI = {
  getAll: async () => {
    return await apiRequest('/users');
  },

  getById: async (id) => {
    return await apiRequest(`/users/${id}`);
  },

  create: async (userData) => {
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || "https://picsum.photos/800",
    };
    return await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id, userData) => {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  checkEmailExists: async (email) => {
    try {
      const users = await apiRequest('/users');
      return users.some(user => user.email === email);
    } catch (error) {
      return false;
    }
  },
};

export const authAPI = {
  login: async (credentials) => {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  refreshToken: async (refreshToken) => {
    return await apiRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const fileAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getFileUrl: (filename) => {
    return `${API_BASE_URL}/files/${filename}`;
  },
};

export const helpers = {
  formatPrice: (price) => {
    if (typeof price !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  formatDate: (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  isValidImageUrl: (url) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('https');
  },

  getImageUrl: (imageUrl, fallback = 'https://via.placeholder.com/400x400?text=No+Image') => {
    if (helpers.isValidImageUrl(imageUrl)) {
      return imageUrl;
    }
    return fallback;
  },

  truncateText: (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  calculateCartTotal: (cartItems) => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  calculateCartItemsCount: (cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },
};

export const combinedAPI = {
  getHomepageData: async () => {
    try {
      const [products, categories] = await Promise.all([
        productAPI.getAll(16, 0),
        categoryAPI.getAll(),
      ]);

      return {
        featuredProducts: products.slice(0, 8),
        allProducts: products,
        categories: categories.slice(0, 6),
      };
    } catch (error) {
      throw new Error('Failed to load homepage data');
    }
  },

  getProductWithRelated: async (productId) => {
    try {
      const product = await productAPI.getById(productId);
      const relatedProducts = await productAPI.getByCategory(product.category.id, 8);
      
      return {
        product,
        relatedProducts: relatedProducts
          .filter(p => p.id !== product.id)
          .slice(0, 4),
      };
    } catch (error) {
      throw new Error('Failed to load product details');
    }
  },

  searchWithFilters: async (filters = {}) => {
    try {
      const { searchTerm, categoryId, priceRange, sortBy } = filters;
      let products = [];

      if (categoryId && categoryId !== 'all') {
        products = await productAPI.getByCategory(categoryId, 50);
      } else {
        if (searchTerm && searchTerm.trim()) {
          products = await productAPI.search(searchTerm.trim());
        } else {
          products = await productAPI.getAll(50, 0);
        }
      }

      if (searchTerm && searchTerm.trim() && categoryId && categoryId !== 'all') {
        const term = searchTerm.toLowerCase().trim();
        products = products.filter(product =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
        );
      }

      if (priceRange && (priceRange.min !== undefined || priceRange.max !== undefined)) {
        products = products.filter(product => {
          const price = product.price;
          const minPrice = priceRange.min ?? 0;
          const maxPrice = priceRange.max ?? Infinity;
          return price >= minPrice && price <= maxPrice;
        });
      }

      if (sortBy) {
        products = [...products].sort((a, b) => {
          switch (sortBy) {
            case 'price-low-high':
              return a.price - b.price;
            case 'price-high-low':
              return b.price - a.price;
            case 'name-a-z':
              return a.title.localeCompare(b.title);
            case 'name-z-a':
              return b.title.localeCompare(a.title);
            case 'newest':
              return new Date(b.creationAt) - new Date(a.creationAt);
            default:
              return 0;
          }
        });
      }

      return products;
    } catch (error) {
      throw new Error('Search failed. Please try again.');
    }
  },

  getProductsPage: async (page = 1, limit = 20, categoryId = null) => {
    try {
      const offset = (page - 1) * limit;
      
      let products;
      if (categoryId && categoryId !== 'all') {
        products = await productAPI.getByCategory(categoryId, limit);
      } else {
        products = await productAPI.getAll(limit, offset);
      }

      return {
        products,
        currentPage: page,
        hasNextPage: products.length === limit,
        hasPrevPage: page > 1,
      };
    } catch (error) {
      throw new Error('Failed to load products');
    }
  },

  registerUser: async (userData) => {
    try {
      if (!helpers.isValidEmail(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const emailExists = await userAPI.checkEmailExists(userData.email);
      if (emailExists) {
        throw new Error('Email already exists. Please use a different email.');
      }

      const newUser = await userAPI.create(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Please enter both email and password');
      }

      if (!helpers.isValidEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      const authResponse = await authAPI.login(credentials);
      
      localStorage.setItem('token', authResponse.access_token);
      if (authResponse.refresh_token) {
        localStorage.setItem('refreshToken', authResponse.refresh_token);
      }

      const userProfile = await authAPI.getProfile();
      localStorage.setItem('user', JSON.stringify(userProfile));

      return { success: true, user: userProfile };
    } catch (error) {
      throw error;
    }
  },
};

export const handleApiError = (error) => {
  if (error.message.includes('401')) {
    authAPI.logout();
    return 'Your session has expired. Please login again.';
  } else if (error.message.includes('404')) {
    return 'The requested item was not found.';
  } else if (error.message.includes('403')) {
    return 'You do not have permission to perform this action.';
  } else if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  } else if (error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your internet connection.';
  } else {
    return error.message || 'Something went wrong. Please try again.';
  }
};

const api = {
  products: productAPI,
  categories: categoryAPI,
  users: userAPI,
  auth: authAPI,
  files: fileAPI,
  helpers,
  combined: combinedAPI,
  handleError: handleApiError,
  BASE_URL: API_BASE_URL,
};

export default api;