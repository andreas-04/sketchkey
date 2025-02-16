import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Grid, Box, Slider} from '@mui/material';
import theme from '../../themes/themes';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Undo from '@mui/icons-material/Undo';
import Redo from '@mui/icons-material/Redo';

const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F33FFF', '#FFD700', '#800080', '#00FF00', '#00FFFF', '#FF1493',
        '#4682B4', '#DC143C', '#00BFFF',  '#8A2BE2',
         '#B0E0E6','#FF8C00', 
        '#FF0000', '#6495ED', '#00008B', '#F0E68C', '#D8BFD8', '#556B2F', '#000000'
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
    const [currentColor, setCurrentColor] = useState(colors[0]); 
    const [brushSize, setBrushSize] = useState(10); 
    var widthCanvas = window.innerWidth / 1.7;
    var heightCanvas = window.innerHeight / 1.5;

    // fixes redo adding two drawings each time
    useEffect(() => {
        historyRef.current = history;
        redoHistoryRef.current = redoHistory;
    }, [history, redoHistory]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const updateCanvas = () => {
            widthCanvas = window.innerWidth / 1.7;
            heightCanvas = window.innerHeight / 1.5;
            canvas.width = widthCanvas;
            canvas.height = heightCanvas;
            const currentTheme = themes ? theme[0] : theme[1];

            // Set background color based on theme
            ctx.fillStyle = currentTheme.palette.background.default;
            ctx.fillRect(0, 0, widthCanvas, heightCanvas);

            // Draw history, change fillstyle because previous filled background, this is lines
            history.forEach((path) => {
                path.forEach(({ x, y, color, size }) => {
                    ctx.fillStyle = color; // Use the color of the point
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            // Draw the current stroke
            currentDrawing.forEach(({ x, y, color, size }) => {
                ctx.fillStyle = color; // Use the color of the point
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            });
            setImage(canvas.toDataURL('image/png'));
        };

        updateCanvas();
        window.addEventListener('resize', updateCanvas);
        // window.addEventListener('click', updateCanvas);
        // window.addEventListener('mouseup', stopDrawing);
        return () => {
            window.removeEventListener('resize', updateCanvas);
            // window.removeEventListener('mouseup', stopDrawing);
        };
    }, [themes, history, currentDrawing]);

    const draw = (e) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentDrawing((prevDrawing) => [...prevDrawing, { x, y, color: currentColor, size: brushSize }]);
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
    const handleBrushChange = (event, newSize) => {
        setBrushSize(newSize);
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
    // const saveDrawing = () => {
    //     const canvas = canvasRef.toDataURL('image/png');
    //     const name = `drawing_${Date.now()}.png`;
    // }
    const [id, setId] = useState('');
    const [error, setError] = useState('');

    const getPrompt = async () => {
        setId(5);
        try {
            const response = await fetch('http://localhost:8000/canvas/daily-puzzles/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                }),
            });
     
            if (response.ok) {
                const responseData = await response.json();
                setError(responseData.prompt);
                
            } else {
                throw new Error('Prompt failed to load.');
            }
        } catch (err) {
            setError('Prompt failed to load.');
            console.error(err);
        }
    };


    const saveDrawing = async (e) => {
        e.preventDefault();
        setError("");
        console.clear();
        try {
            const response = await fetch('http://localhost:8000/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image,
                }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                responseData.message ? setError(responseData.message): setError(responseData.error);
                responseData.message ? console.log(responseData.message) : console.log(responseData.error);
            
            } else {
                throw new Error('Submission failed.');
            }
        } catch (err) {
            setError('Submission failed.');
            console.error(err);
        }
    };
    
    return (
        <div className='flex flex-col items-center min-h-screen pt-6'>
            <div className='grid grid-cols-2 gap-4 justify-center items-center'>

            <Button variant="contained" color="primary" onClick={getPrompt} style={{ marginTop: '' }}>
                Get Prompt
            </Button>
            <p>{error}</p>
            </div>
            {/* Color selection buttons */}
            <div className='grid grid-cols-12 pb-2 pl-2' style={{ alignItems: 'center', justifyContent: 'space-between', position: '', overflowX: 'hidden', marginLeft: 'auto', marginRight: 'auto', width: '80%', left: '', top: '0' }}>
            {colors.map((color) => (
                <div key={color} className="pt-2">
                    <Button variant=''
                        style={{
                            backgroundColor: color,
                            width: '30px', // Adjusted width for better visibility
                            height: '30px',
                            margin: '0 10px', // Adds horizontal space between buttons
                        }}
                        onClick={() => handleColorChange(color)}
                    />
                </div>
            ))}
            </div>
  
            <div className='' style={{ position: '', width: '30%', left: '', top: '' }}>
                <Slider
                    value={brushSize}
                    onChange={handleBrushChange}
                    aria-labelledby="brush-size-slider"
                    valueLabelDisplay="auto"
                    min={1}
                    max={10}
                />
            </div>
            <div className="grid grid-cols-2" style={{ display: 'flex', alignItems: '', justifyContent: '' }}>

                <div className='' style={{position: '', width: '100%', left: '', top: '0' }}>
                <canvas         
                    ref={canvasRef}
                    width={widthCanvas}
                    height={heightCanvas}
                    onMouseDown={() => setDrawing(true)}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    style={{ border: '1px solid blue', marginLeft: 'auto', marginRight: 'auto', maxHeight: '', maxWidth: '' }}
                />
                </div>
                <div className="flex flex-col" style={{ position: 'absolute', paddingLeft: '', padding: '10px' }}>
                    <IconButton color="primary" onClick={clearCanvas} aria-label="clear">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={undoDrawing} aria-label="undo">
                        <Undo />
                    </IconButton>
                    <IconButton color="primary" onClick={redoDrawing} aria-label="redo">
                        <Redo />
                    </IconButton>
                </div>
                
            {/* Brush size slider */}
            </div>


        {/* Side action buttons */}
        <div className='flex flex-col mx-auto grid grid-cols-2 gap-4'>
            {/* Download button */}
            <Button variant="contained" color="primary" onClick={handleDownload} style={{ marginTop: '10px' }}>
                Download Image
            </Button>
            <Button variant="contained" color="primary" onClick={saveDrawing} style={{ marginTop: '10px' }}>
                Submit Image
            </Button>
            </div>
        </div>
    );
    // return (
    //     <div>
    //         <Grid container spacing={1} style={{ marginTop: '10px',  position: '', width: '70%', left: '', top: '0' }}>
    //             {colors.map((color) => (
    //                 <Grid item key={color}>
    //                     <Button
    //                         style={{ backgroundColor: color, width: '30px', height: '30px' }}
    //                         onClick={() => handleColorChange(color)}
    //                     />
    //                 </Grid>
    //             ))}
    //         </Grid>
    //         <canvas
    //             ref={canvasRef}
    //             width={window.innerWidth / 2}
    //             height={window.innerHeight / 1.5}
    //             onMouseDown={() => setDrawing(true)}
    //             onMouseUp={stopDrawing}
    //             onMouseMove={draw}
    //             style={{ border: '1px solid red' }}
    //         />
            
    //         <IconButton onClick={undoDrawing} aria-label="undo">
    //             <Undo />
    //         </IconButton>
    //         <IconButton onClick={clearCanvas} aria-label="delete">
    //             <DeleteIcon />
    //         </IconButton>
    //         <IconButton onClick={redoDrawing} aria-label="delete">
    //             <Redo />
    //         </IconButton>
            
    //     </div>
    // );
};

export default Canvas;
