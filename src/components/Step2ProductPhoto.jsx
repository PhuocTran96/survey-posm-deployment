import React, { useState, useCallback } from 'react';
import ProductItem from './ProductItem.jsx';

const Step2ProductPhoto = ({ onSubmit, onBack }) => {
  const [products, setProducts] = useState([{ id: Date.now() }]);
  const [productData, setProductData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduct = () => {
    setProducts([...products, { id: Date.now() }]);
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    const newData = { ...productData };
    delete newData[id];
    setProductData(newData);
  };

  const handleDataChange = useCallback((id, data) => {
    if (data === null) {
      setProductData(prevData => {
        const newData = { ...prevData };
        delete newData[id];
        return newData;
      });
    } else {
      setProductData(prevData => ({ ...prevData, [id]: data }));
    }
  }, []);

  // Kiểm tra xem tất cả sản phẩm đã có đủ thông tin và hình ảnh chưa
  const completedItems = Object.values(productData).filter(data => data && data.product && data.photo).length;
  const allValid = products.length > 0 && products.length === completedItems;

  const handleSubmitSurvey = async () => {
    if (!allValid) {
      alert('Vui lòng chụp hình cho tất cả sản phẩm!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(Object.values(productData));
    } catch (error) {
      console.error('Lỗi khi gửi khảo sát:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="survey-step bg-white p-5 rounded-lg shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Bước 2: Thông tin sản phẩm</h2>
      
      {/* Thêm thanh tiến độ */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Tiến độ chụp hình:</span>
          <span>{completedItems}/{products.length} sản phẩm</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{width: `${products.length > 0 ? (completedItems/products.length)*100 : 0}%`}}
          ></div>
        </div>
      </div>
      
      <div id="products-container" className="space-y-4">
        {products.map(product => (
          <ProductItem
            key={product.id}
            onRemove={() => removeProduct(product.id)}
            onDataChange={(data) => handleDataChange(product.id, data)}
          />
        ))}
      </div>

      {!allValid && products.length > 0 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-700">
          <div className="flex">
            <i className="bi bi-exclamation-triangle mr-2"></i>
            <p>Vui lòng chọn sản phẩm và chụp hình cho tất cả mục trước khi gửi khảo sát.</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button 
          className="btn btn-success order-1 flex items-center justify-center"
          onClick={addProduct}
        >
          <i className="bi bi-plus-circle mr-1"></i> Thêm sản phẩm
        </button>
        <button 
          className="btn btn-primary order-3 sm:order-2 flex items-center justify-center"
          onClick={handleSubmitSurvey}
          disabled={!allValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang gửi...
            </>
          ) : (
            <>
              <i className="bi bi-send mr-1"></i> Gửi khảo sát
            </>
          )}
        </button>
        <button 
          className="btn btn-secondary order-2 sm:order-3 flex items-center justify-center"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <i className="bi bi-arrow-left mr-1"></i> Quay lại
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><span className="text-red-500">*</span> Các trường đánh dấu là bắt buộc</p>
      </div>
    </div>
  );
};

export default Step2ProductPhoto;
