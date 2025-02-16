import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Grid } from '@mui/material';
import theme from '../../themes/themes';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Undo from '@mui/icons-material/Undo';
import Redo from '@mui/icons-material/Redo';

const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F33FFF', '#FFD700', '#800080', '#00FF00', '#00FFFF', '#FF1493',
        '#FF6347', '#4682B4', '#D2691E', '#32CD32', '#DC143C', '#00BFFF', '#7FFF00', '#FF4500', '#8A2BE2',
        '#B22222', '#FFD700', '#32CD32', '#FF69B4', '#B0E0E6', '#8B0000', '#A52A2A', '#FF8C00', '#98FB98',
        '#FF0000', '#6495ED', '#00008B', '#BDB76B', '#00CED1', '#F0E68C', '#D8BFD8', '#556B2F'
];

const Canvas = ({ themes }) => {
    const [image, setImage] = useState(null);
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [history, setHistory] = useState([]); 
    const [redoHistory, setRedoHistory] = useState([]); 
    const [currentDrawing, setCurrentDrawing] = useState([]); 
    const historyRef = useRef(history);  
    const redoHistoryRef = useRef(redoHistory);  
    const [currentColor, setCurrentColor] = useState(colors[0]); // Default color


    // fixes redo adding two drawings each time
    useEffect(() => {
        historyRef.current = history;
        redoHistoryRef.current = redoHistory;
    }, [history, redoHistory]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const updateCanvas = () => {
            canvas.width = window.innerWidth / 2;
            canvas.height = window.innerHeight / 1.5;

            // Set background color based on theme
            ctx.fillStyle = themes ? theme[0].palette.background.default : theme[1].palette.background.default;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw history, change fillstyle because previous filled background, this is lines
            history.forEach((path) => {
                path.forEach(({ x, y, color }) => {
                    ctx.fillStyle = color; // Use the color of the point
                    ctx.fillRect(x, y, 2, 2);
                });
            });

            // Draw the current stroke
            currentDrawing.forEach(({ x, y, color }) => {
                ctx.fillStyle = color; // Use the color of the point
                ctx.fillRect(x, y, 2, 2);
            });
            setImage(canvas.toDataURL('image/png'));
        };

        updateCanvas();
        window.addEventListener('resize', updateCanvas);
        return () => {
            window.removeEventListener('resize', updateCanvas);
        };
    }, [themes, history, currentDrawing]);

    const draw = (e) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentDrawing((prevDrawing) => [...prevDrawing, { x, y, color: currentColor }]);
    };

    const redoDrawing = useCallback(() => {
        if (redoHistoryRef.current.length === 0) return; 
        
        const lastRedo = redoHistoryRef.current[redoHistoryRef.current.length - 1];
        setHistory((prevHistory) => [...prevHistory, lastRedo]); 
        setRedoHistory((prevRedoHistory) => prevRedoHistory.slice(0, -1));
    }, []);

    const stopDrawing = () => {
        if (currentDrawing.length > 0) {
            setHistory((prevHistory) => [...prevHistory, currentDrawing]); 
            setRedoHistory([]); 
        }
        setCurrentDrawing([]); 
        setDrawing(false);
    };

    const undoDrawing = useCallback(() => {
        if (historyRef.current.length === 0) return; // Prevent undo when history is empty

        const lastDrawing = historyRef.current[historyRef.current.length - 1];
        setRedoHistory((prevRedoHistory) => [...prevRedoHistory, lastDrawing]);
        setHistory((prevHistory) => prevHistory.slice(0, -1)); 
    }, []);

    const clearCanvas = useCallback(() => {
        setHistory([]); 
        setRedoHistory([]);
        setCurrentDrawing([]);
    }, []);

    const handleColorChange = (color) => {
        setCurrentColor(color); 
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === 'z') {
                undoDrawing();
            } else if (e.key.toLowerCase() === 'c') {
                clearCanvas();
            } else if (e.ctrlKey && e.key === 'e') {
                redoDrawing();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [undoDrawing, clearCanvas, redoDrawing]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png'); // Capture the canvas as a PNG image
        const link = document.createElement('a'); 
        link.href = dataURL; 
        link.download = 'drawing.png'; 
        link.click(); // Trigger the download
    };

    return (
        <div className='min-h-screen items-center'>
            {/* Color selection buttons */}
            <div className='items-center flex flex-col'>
            <Grid container spacing={1} style={{ marginTop: '10px', paddingBottom: '10px', maxWidth: '90vh'}}>
                {colors.map((color) => (
                    <Grid item key={color}>
                        <Button
                            style={{ backgroundColor: color, width: '10px', height: '30px' }}
                            onClick={() => handleColorChange(color)}
                        />
                    </Grid>
                ))}
            </Grid>
            </div>
            <div className='items-center flex flex-col'>
            <canvas
                ref={canvasRef}
                width={window.innerWidth / 2}
                height={window.innerHeight / 1.5}
                onMouseDown={() => setDrawing(true)}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                style={{ border: '1px solid red' }}
                />
               </div>
               <div className='items-center justify-center flex flex-row '>
            <IconButton onClick={clearCanvas} aria-label="delete">
                <DeleteIcon />
            </IconButton>
            <IconButton onClick={undoDrawing} aria-label="undo">
                <Undo />
            </IconButton>
            <IconButton onClick={redoDrawing} aria-label="redo">
                <Redo />
            </IconButton>
            <div className=''>
            <Button onClick={handleDownload}>Download Image</Button>

                </div>
            </div>
        </div>
    );
};

export default Canvas;
