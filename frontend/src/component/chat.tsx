import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3002'; 

const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null); 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]); 
  const [status, setStatus] = useState('');

  useEffect(() => {
    const socketIo = io(SOCKET_SERVER_URL);
    setSocket(socketIo);

    socketIo.on('message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketIo.on('New-joining', (notification: { message: string }) => {
      setStatus(notification.message);
    });

    socketIo.on('User-left', (notification: { message: string }) => {
      setStatus(notification.message);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('newMessage', message);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        <strong>Status:</strong> {status}
      </div>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
