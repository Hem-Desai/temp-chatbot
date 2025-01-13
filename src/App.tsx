import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
};

function getBotResponse(message: string): string {
  // Convert to lowercase for easier matching
  const input = message.toLowerCase();
  
  // Common greetings
  if (input.match(/^(hi|hello|hey|howdy)/)) {
    return "Hello! How can I help you today?";
  }
  
  // Questions about the bot
  if (input.includes("what can you do") || input.includes("help me")) {
    return "I can help you with basic questions and conversation. Feel free to ask me anything!";
  }
  
  // Questions about weather
  if (input.includes("weather")) {
    return "I'm sorry, I don't have access to real-time weather data, but I can help you with other questions!";
  }
  
  // Questions about time
  if (input.includes("time")) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }
  
  // Questions about the bot's name
  if (input.includes("your name") || input.includes("who are you")) {
    return "I'm a friendly chatbot here to help you!";
  }
  
  // Goodbye messages
  if (input.match(/^(bye|goodbye|see you|farewell)/)) {
    return "Goodbye! Have a great day!";
  }
  
  // How are you
  if (input.includes("how are you")) {
    return "I'm doing well, thank you for asking! How are you?";
  }
  
  // Thank you messages
  if (input.match(/(thank you|thanks)/)) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  
  // Default responses for unknown inputs
  const defaultResponses = [
    "That's interesting! Tell me more.",
    "I understand. How can I help you with that?",
    "I'm not sure I fully understand. Could you rephrase that?",
    "Let me know if you need any specific information.",
    "I'm here to help! What would you like to know?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    
    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      content: newMessage,
      is_bot: false,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Get bot response
    setTimeout(() => {
      const botMessage = {
        id: crypto.randomUUID(),
        content: getBotResponse(newMessage),
        is_bot: true,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-4">
          <div className="flex items-center space-x-2">
            <Bot className="text-white" size={24} />
            <h1 className="text-xl font-bold text-white">Chatbot</h1>
          </div>
        </div>
        
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              <p>👋 Say hello to start chatting!</p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.is_bot ? '' : 'flex-row-reverse space-x-reverse'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                message.is_bot 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-indigo-600 text-white'
              } max-w-[80%]`}>
                <div className="flex items-center space-x-2 mb-1">
                  {message.is_bot ? (
                    <Bot size={16} />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="text-xs opacity-75">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;