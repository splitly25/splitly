import { useState, useEffect } from 'react';
import TingTingGif from '~/assets/tingting.gif';

const Chatbot = ({ isOpen, setIsOpen, numberOfNotifications, newMessage, setNewMessage }) => {
    const [showMessage, setShowMessage] = useState(false);
    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen) {
            if (newMessage !== "") {
                setShowMessage(true);
            } else {
                setShowMessage(false);
            }
        }
    }, [newMessage, isOpen]);

    return (
        <>
            {/* Notification Message Bubble */}
            {showMessage && !isOpen && (
                <div className="fixed bottom-24 right-20 bg-white rounded-2xl shadow-xl p-4 z-[999] max-w-xs animate-slideIn">
                    {/* Speech bubble tail */}
                    <div className="absolute bottom-[-8px] right-8 w-4 h-4 bg-white transform rotate-45"></div>
                    <p className="text-gray-800 text-sm font-medium relative z-10">{newMessage}</p>
                </div>
            )}

            {/* Chatbot Button - Fixed at bottom right */}
            {!isOpen && (
                <div
                    className="fixed bottom-6 right-6 w-[72px] h-[72px] rounded-full border-3 border-[#D591A6] cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 z-[1000] p-1"
                    onClick={toggleChatbot}
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-300 to-pink-400 shadow-lg shadow-pink-300/40 flex items-center justify-center hover:shadow-xl hover:shadow-pink-300/60">
                        <img
                            src={TingTingGif}
                            alt="TingTing Bot"
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '🤖';
                                e.target.parentElement.classList.add('text-3xl');
                            }}
                        />
                    </div>
                    {numberOfNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                            {numberOfNotifications}
                        </span>
                    )}
                </div>
            )}

            {/* Animation styles */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default Chatbot;
