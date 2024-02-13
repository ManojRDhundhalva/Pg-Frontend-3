import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io.connect('http://localhost:8000/chat');

function ChatApp() {
    // const [message, setMessage] = useState('');
    // const [receivedMessages, setReceivedMessages] = useState([]);
    // const [room, setRoom] = useState('default');

    // useEffect(() => {
    //     const handleMessage = (data) => {
    //         console.log('data', data);
    //         setReceivedMessages(prevMessages => [...prevMessages, data]);
    //     };

    //     // Listen for messages from the server
    //     socket.on('message', handleMessage);

    //     // Listen for reconnection events
    //     socket.on('reconnect', (attemptNumber) => {
    //         console.log(`User reconnected after attempt ${attemptNumber}`);
    //         // Rejoin the room after reconnection
    //         socket.emit('joinRoom', room);
    //     });

    //     // Join the default room when the component mounts
    //     socket.emit('joinRoom', room);

    //     // Cleanup function to remove the event listener when the component is unmounted
    //     return () => {
    //         socket.off('message', handleMessage);
    //     };

    // }, [room]);

    // const sendMessage = () => {
    //     // Send message to the server along with the current room
    //     socket.emit('send-message', { message, room });
    //     setMessage('');
    // };

    // const handleDisconnect = () => {
    //     socket.emit('disconnectMe');
    // };

    // const handleLeaveRoom = () => {
    //     socket.emit('leaveRoom', room);
    // }

    // const changeRoom = (newRoom) => {
    //     // Change the current room
    //     setRoom(newRoom);
    //     // Join the new room
    //     socket.emit('joinRoom', newRoom);
    // };

    return (
        <div>
            {/* <h1>React Socket.io Example</h1>
            <div>
                <label htmlFor="room">Room:</label>
                <input
                    type="text"
                    id="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <button onClick={() => changeRoom(room)}>Join Room</button>
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
                <button onClick={handleLeaveRoom}>Leave Room</button>
                <button onClick={handleDisconnect}>Disconnect</button>
            </div>
            <div>
                <h2>Received Messages:</h2>
                {receivedMessages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div> */}
        </div>
    );
}

export default ChatApp;
