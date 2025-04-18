import React, { useState, useRef, useEffect } from 'react';
import { products } from '../constants';

const ProductItem = ({ onRemove, onDataChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputContainerRef = useRef(null);
  const prevDataRef = useRef(null);

  // Autocomplete logic
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Camera setup - now triggered by user clicking the camera icon
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Theo dõi thay đổi và cập nhật dữ liệu lên component cha
  useEffect(() => {
    let newData = null;
    if (selectedProduct && photoData) {
      newData = { product: selectedProduct, photo: photoData };
    }
    
    // Kiểm tra xem dữ liệu mới có khác với dữ liệu cũ không
    const prevData = prevDataRef.current;
    const isEqual = 
      (prevData === null && newData === null) ||
      (prevData !== null && newData !== null && 
       prevData.product.id === newData.product.id && 
       prevData.photo === newData.photo);
    
    // Chỉ gọi onDataChange khi dữ liệu thực sự thay đổi
    if (!isEqual) {
      onDataChange(newData);
      prevDataRef.current = newData;
    }
  }, [selectedProduct, photoData, onDataChange]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Lỗi truy cập camera:', err);
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    const photoDataUrl = canvas.toDataURL('image/jpeg');
    setPhotoData(photoDataUrl);
    stopCamera();
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    if (selectedProduct) {
      setSelectedProduct(null);
      setPhotoData(null); // Xóa hình khi thay đổi sản phẩm
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setShowSuggestions(false);
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="product-item bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4">
        <div className="mb-3" ref={inputContainerRef}>
          <label className="form-label flex items-center">
            <span className="text-red-500 mr-1">*</span> Chọn sản phẩm:
          </label>
          <div className="relative">
            <input
              type="text"
              className="form-control py-2.5 px-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên sản phẩm..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              disabled={!!selectedProduct}
              autoComplete="off"
            />
            
            {showSuggestions && searchTerm && !selectedProduct && (
              <div className="absolute z-20 inset-x-0 mt-0 border border-gray-300 border-t-0 bg-white rounded-b-md shadow-md max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
                      onMouseDown={() => handleSelectProduct(product)}
                    >
                      {product.name}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500">
                    Không tìm thấy sản phẩm
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedProduct && (
          <div className="product-photo-container mt-4 pt-4 border-t border-gray-200">
            <label className="form-label flex items-center">
              <span className="text-red-500 mr-1">*</span> Chụp hình sản phẩm (bắt buộc):
            </label>
            {!photoData ? (
              videoRef.current?.srcObject ? (
                <div className="camera-container bg-gray-50 p-3 rounded-md">
                  <video ref={videoRef} autoPlay playsInline className="camera-preview w-full max-h-[300px] object-cover rounded-md" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="text-center mt-3">
                    <button className="btn btn-primary px-4 py-2 w-full sm:w-auto" onClick={capturePhoto}>
                      <i className="bi bi-camera-fill mr-2"></i> Chụp hình
                    </button>
                  </div>
                </div>
              ) : (
                <div className="camera-icon-container flex justify-center my-4">
                  <button 
                    className="camera-icon-btn flex items-center justify-center px-5 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors w-full sm:w-auto"
                    onClick={startCamera}
                  >
                    <i className="bi bi-camera mr-2"></i> Mở camera
                  </button>
                </div>
              )
            ) : (
              <div className="photo-preview bg-gray-50 p-3 rounded-md">
                <div className="flex justify-center">
                  <img src={photoData} alt="Product preview" className="preview-image max-h-[300px] object-contain rounded-md" />
                </div>
                <div className="text-center mt-3">
                  <button 
                    className="btn btn-secondary px-4 py-2 w-full sm:w-auto"
                    onClick={() => {
                      setPhotoData(null);
                    }}
                  >
                    <i className="bi bi-arrow-repeat mr-2"></i> Chụp lại
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-2">
          <button className="btn btn-danger w-full sm:w-auto flex items-center justify-center" onClick={onRemove}>
            <i className="bi bi-trash mr-2"></i> Xóa sản phẩm
          </button>
          
          {selectedProduct && photoData && (
            <div className="text-green-600 flex items-center mt-2 sm:mt-0">
              <i className="bi bi-check-circle-fill mr-1"></i> Đã chụp hình
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
