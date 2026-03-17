import React, { useState } from 'react'


interface ReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void
    title: string;
    options: string[];
}

const ReasonModal: React.FC<ReasonModalProps> = ({ isOpen, onClose, onConfirm, title, options }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [customReason, setCustomReason] = useState('');

    if (!isOpen) return null;
    const handleConfirm = () => {
        const finalReason = selectedOption === 'Others' || !selectedOption ? customReason : selectedOption;
        if (!finalReason.trim()) return;
        onConfirm(finalReason);
        setSelectedOption('');
        setCustomReason('');
    }
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-[#1c2128] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>

                        {/* Quick Options */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setSelectedOption(opt)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedOption === opt
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
                                        } border`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {/* Custom Text Area */}
                        <textarea
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="Type detailed reason here..."
                            className="w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition h-24 resize-none"
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition">
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedOption && !customReason.trim()}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    
}

export default ReasonModal