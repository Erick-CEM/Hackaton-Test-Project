import { io } from 'socket.io-client';

const socket = io('http://localhost:53777');

export default socket;