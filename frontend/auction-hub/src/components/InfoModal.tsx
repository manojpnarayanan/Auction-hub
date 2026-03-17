


export default function InfoModal({ isOpen, onClose, title, message }: { isOpen: boolean, onClose: () => void, title: string, message: string }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <p className="text-gray-600 mb-6 italic">"{message}"</p>
                <button onClick={onClose} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Got it</button>
            </div>
        </div>
    );
}
