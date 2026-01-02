

import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { v4 as uuidv4 } from 'uuid';

const Board = () => {
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // --- NEW: Color State ---
    const [color, setColor] = useState('black');

    const isDrawing = useRef(false);
    const stompClient = useRef(null);
    const userId = useRef(uuidv4());

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);
        client.debug = null;
        stompClient.current = client;

        client.connect({}, () => {
            if (stompClient.current !== client) return;
            console.log("Connected to WebSocket!");
            setIsConnected(true);

            client.subscribe('/topic/board', (message) => {
                const action = JSON.parse(message.body);
                if (action.senderId === userId.current) return;
                handleRemoteDraw(action);
            });
        }, (error) => {
            console.error("Connection Error:", error);
        });

        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, []);

    const handleRemoteDraw = (action) => {
        setLines((prevLines) => {
            if (action.type === 'start') {
                // Use the color sent by the other user
                return [...prevLines, { id: action.lineId, points: [action.x, action.y], color: action.color }];
            } else if (action.type === 'draw') {
                return prevLines.map(line => {
                    if (line.id === action.lineId) {
                        return { ...line, points: [...line.points, action.x, action.y] };
                    }
                    return line;
                });
            }
            return prevLines;
        });
    };

    const handleMouseDown = (e) => {
        if (!isConnected) return;

        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLineId = uuidv4();

        // Start local line with CURRENT color
        setCurrentLine({ id: newLineId, points: [pos.x, pos.y], color: color });

        // Send 'start' action with CURRENT color
        sendDrawAction('start', pos.x, pos.y, newLineId, color);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current || !currentLine || !isConnected) return;

        const pos = e.target.getStage().getPointerPosition();

        setCurrentLine(prev => ({
            ...prev,
            points: [...prev.points, pos.x, pos.y]
        }));

        // For 'draw' events, color is less critical (backend uses 'start' color),
        // but we send it for consistency.
        sendDrawAction('draw', pos.x, pos.y, currentLine.id, color);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        if (currentLine) {
            setLines(prev => [...prev, currentLine]);
            setCurrentLine(null);
        }
    };

    const sendDrawAction = (type, x, y, lineId, strokeColor) => {
        if (stompClient.current && stompClient.current.connected) {
            const payload = {
                type: type,
                x: x,
                y: y,
                color: strokeColor, // Send dynamic color
                lineId: lineId,
                senderId: userId.current
            };
            stompClient.current.send("/app/draw", {}, JSON.stringify(payload));
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* --- NEW: Color Picker UI --- */}
            <div className="flex gap-4 p-4 bg-gray-800 rounded-lg shadow-lg">
                <span className="text-white font-bold self-center mr-2">Pick Color:</span>

                {['black', 'red', 'blue', 'green', 'orange'].map((c) => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                            color === c ? 'border-white ring-2 ring-blue-400 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                    />
                ))}
            </div>

            {/* Board Container */}
            <div className="relative border-4 border-blue-500 rounded-lg overflow-hidden bg-white shadow-2xl">
                {!isConnected && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="text-white font-bold text-xl animate-pulse">
                            Connecting to Server...
                        </div>
                    </div>
                )}

                <Stage
                    width={800}
                    height={600}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    onMouseleave={handleMouseUp}
                >
                    <Layer>
                        <Text text="SyncBoard - Realtime Canvas" x={20} y={20} fontSize={20} fill="gray" />

                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line.points}
                                stroke={line.color}
                                strokeWidth={5}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        ))}

                        {currentLine && (
                            <Line
                                points={currentLine.points}
                                stroke={currentLine.color} // Use the line's specific color
                                strokeWidth={5}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Board;