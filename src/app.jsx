import React, { useState } from 'react';
import Step1ManagerStore from './components/Step1ManagerStore.jsx';
import Step2ProductPhoto from './components/Step2ProductPhoto.jsx';
import SurveySuccess from './components/SurveySuccess.jsx';
import { db, storage } from './firebase/config';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    manager: null,
    store: null,
    products: []
  });

  const handleStep1Complete = ({ manager, store }) => {
    setSurveyData(prev => ({ ...prev, manager, store }));
    setCurrentStep(2);
  };

  const handleSubmit = async (products) => {
    try {
      // Kiểm tra lại một lần nữa trước khi gửi
      if (!products.every(p => p.product && p.photo)) {
        alert('Vui lòng chụp hình cho tất cả sản phẩm!');
        return;
      }

      // Upload photos and get URLs
      const productsWithPhotos = await Promise.all(
        products.map(async (product) => {
          const photoRef = ref(storage, `surveys/${Date.now()}_${product.product.id}.jpg`);
          await uploadString(photoRef, product.photo, 'data_url');
          return {
            ...product.product,
            photoUrl: await getDownloadURL(photoRef)
          };
        })
      );

      // Save to Firestore
      await addDoc(collection(db, 'surveys'), {
        ...surveyData,
        products: productsWithPhotos,
        createdAt: new Date()
      });

      setCurrentStep(3);
    } catch (error) {
      console.error('Lỗi khi gửi khảo sát:', error);
      alert('Đã xảy ra lỗi khi gửi khảo sát!');
    }
  };

  return (
    <div className="container px-4 md:px-6">
      <h1 className="text-center text-2xl md:text-3xl font-bold my-4 md:my-6">Khảo sát sản phẩm</h1>
      
      {currentStep === 1 && (
        <Step1ManagerStore onNext={handleStep1Complete} />
      )}
      
      {currentStep === 2 && (
        <Step2ProductPhoto
          onSubmit={handleSubmit}
          onBack={() => setCurrentStep(1)}
        />
      )}
      
      {currentStep === 3 && (
        <SurveySuccess onRestart={() => {
          setCurrentStep(1);
          setSurveyData({
            manager: null,
            store: null,
            products: []
          });
        }} />
      )}
      
      <div className="text-center text-xs text-gray-500 mt-8 mb-2">
        © {new Date().getFullYear()} Khảo sát sản phẩm
      </div>
    </div>
  );
}

export default App;
