import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import TingTingGif from '~/assets/tingting.gif';
import TingTingPng from '~/assets/tingting.png';

const ChatbotWindow = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là TingTing, trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      time: '18:25 25/10/2025'
    },
    {
      id: 2,
      text: 'Giúp tôi thêm hatra.dev@gmail.com vào hóa đơn...',
      sender: 'user',
      time: '18:24 25/10/2025'
    },
    {
      id: 3,
      text: 'TingTing đã giúp bạn thêm hatra.dev@gmail.com vào hóa đơn...',
      sender: 'bot',
      time: '18:25 25/10/2025'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN')
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'Cảm ơn bạn đã nhắn tin! Tôi đang xử lý yêu cầu của bạn...',
        sender: 'bot',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN')
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col p-2">
      {/* Header */}
      <div className="bg-[#EF9A9A] p-4 rounded-t-xl flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white m-0">TingTing</h3>
        <button
          className="bg-transparent border-none text-white text-2xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#FEEBEE] border-x-4 border-[#EF9A9A] flex flex-col gap-3">
        {/* Bot Info Section */}
        <div className="bg-[#FEEBEE] flex flex-col items-center py-8 px-4">
          <div className="w-24 h-24 rounded-full bg-[#E89AC7] flex items-center justify-center mb-4">
            <img
              src={TingTingGif}
              alt="TingTing"
              className="w-22 h-22 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 m-0 mb-1">TingTing</h2>
          <p className="text-sm text-gray-600 m-0">Trợ lý tài chính của bạn</p>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className="flex gap-3 items-start animate-fadeIn"
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <img
                  src={TingTingPng}
                  alt="TingTing"
                  className="w-7 h-7 object-contain"
                />
              </div>
            )}
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-gray-600">PH</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-800">
                  {message.sender === 'bot' ? 'TingTing' : 'Phi Hùng'}
                </span>
                <span className="text-xs text-gray-500">
                  {message.time}
                </span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed break-words">
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form className="flex p-2 gap-2 bg-[#FEEBEE] border-x-4 border-b-4 border-[#EF9A9A] rounded-b-xl" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Nhắn gì đó cho TingTing..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-4 py-3 bg-white/50 border border-[#D591A6]/30 rounded-3xl text-sm outline-none focus:border-[#D591A6] focus:bg-white transition-colors placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-[#FF6B9D] border-none text-white text-xl font-bold cursor-pointer flex items-center justify-center hover:bg-[#FF5A8C] active:scale-95 transition-all shadow-md"
        >
          <SendIcon />
        </button>
      </form>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }

        .duration-400 {
          transition-duration: 400ms;
        }
      `}</style>
    </div>
  );
};

export default ChatbotWindow;
