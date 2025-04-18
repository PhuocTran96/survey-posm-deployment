import React, { useEffect, useState } from 'react'
import { managers, storesByManager } from '../constants'

const Step1ManagerStore = ({ onNext }) => {
  const [selectedManager, setSelectedManager] = useState('')
  const [selectedStore, setSelectedStore] = useState('')
  const [stores, setStores] = useState([])

  useEffect(() => {
    if (selectedManager) {
      setStores(storesByManager[selectedManager])
    }
  }, [selectedManager])

  return (
    <div className="survey-step">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Bước 1: Thông tin cửa hàng</h2>
      <div className="mb-4">
        <label className="form-label">
          <span className="text-red-500">*</span> Chọn quản lý:
        </label>
        <select 
          className="form-control" 
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          <option value="">-- Chọn quản lý --</option>
          {managers.map(manager => (
            <option key={manager.id} value={manager.id}>
              {manager.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="form-label">
          <span className="text-red-500">*</span> Chọn cửa hàng:
        </label>
        <select
          className="form-control"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          disabled={!selectedManager}
        >
          <option value="">-- Chọn cửa hàng --</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <button 
        className="btn btn-primary flex items-center"
        onClick={() => onNext({ manager: selectedManager, store: selectedStore })}
        disabled={!selectedStore}
      >
        <i className="bi bi-arrow-right mr-1"></i> Tiếp tục
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><span className="text-red-500">*</span> Các trường đánh dấu là bắt buộc</p>
      </div>
    </div>
  )
}

export default Step1ManagerStore
