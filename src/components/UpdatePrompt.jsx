import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

const UpdatePrompt = () => {
  const registerSW = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!registerSW) return null;

  // Defensive destructuring to handle cases where properties might be missing
  const {
    offlineReady = [false, () => {}],
    needUpdate = [false, () => {}],
    updateServiceWorker = () => {},
  } = registerSW;

  const [isOfflineReady, setIsOfflineReady] = Array.isArray(offlineReady) ? offlineReady : [false, () => {}];
  const [isNeedUpdate, setIsNeedUpdate] = Array.isArray(needUpdate) ? needUpdate : [false, () => {}];

  const close = () => {
    setIsOfflineReady(false);
    setIsNeedUpdate(false);
  };

  if (!isNeedUpdate && !isOfflineReady) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-bounce-in">
      <style>{`
        .animate-bounce-in {
          animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(6,43,103,0.15)] border border-blue-50 p-5 max-w-sm flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#062B67]">
          <RefreshCw className={isNeedUpdate ? 'animate-spin' : ''} size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#062B67] text-lg mb-1">
            {isNeedUpdate ? 'Update Available!' : 'App Ready Offline'}
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            {isNeedUpdate 
              ? 'A new version of Vasista is available. Update now to get the latest features.' 
              : 'The app is now ready to work offline. Access it anytime, anywhere!'}
          </p>
          <div className="flex gap-3">
            {isNeedUpdate && (
              <button 
                onClick={() => updateServiceWorker(true)}
                className="bg-[#062B67] text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#083a8a] transition-all"
              >
                Update Now
              </button>
            )}
            <button 
              onClick={close}
              className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
        <button onClick={close} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
