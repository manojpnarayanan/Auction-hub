import React from 'react';

interface ConfirmModalProps {
    isOpen:boolean;
    onClose: ()=>void;
    onConfirm:()=>void;
    title:string;
    message:string;
    confirmText?:string;
    cancelText?:string;
    isDanger?:boolean
}

const ConfirmModal:React.FC<ConfirmModalProps>=({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText='Confirm',
    cancelText='Cancel',
    isDanger=false
})=>{
    if(!isOpen) return null;
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
        <div className="p-6">
          <h3 className={`text-lg font-bold mb-2 ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
                isDanger 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal