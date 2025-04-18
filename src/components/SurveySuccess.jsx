import React from 'react'

const SurveySuccess = ({ onRestart }) => {
  return (
    <div className="survey-step text-center">
      <div className="py-8">
        <i className="bi bi-check-circle-fill text-green-500 text-6xl mb-4 block"></i>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Cảm ơn bạn!</h2>
        <p className="text-lg text-gray-700 mb-6">Khảo sát của bạn đã được gửi thành công.</p>
        <button 
          className="btn btn-primary flex items-center mx-auto"
          onClick={onRestart}
        >
          <i className="bi bi-plus-circle mr-2"></i> Tạo khảo sát mới
        </button>
      </div>
    </div>
  )
}

export default SurveySuccess
