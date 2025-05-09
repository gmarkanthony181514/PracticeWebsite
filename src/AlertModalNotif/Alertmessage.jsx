import { useEffect } from "react";

const Alertmessage = ({ title, message, onConfirm, onCancel, }) => {

  useEffect(() => {
    const handleShortCutKey = (event) => {
      if (["Escape", "Enter"].includes(event.key)) {
        event.key === "Escape" ? onCancel() : onConfirm();
      }
    };

    window.addEventListener("keydown", handleShortCutKey);
    
    return () => window.removeEventListener("keydown", handleShortCutKey);
  }, [onCancel, onConfirm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 transform transition-transform duration-300 scale-95">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-red-600 hover:text-white">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800">
            Confirm
          </button>
        </div>
        </div>
      </div>
  );
};

export default Alertmessage;