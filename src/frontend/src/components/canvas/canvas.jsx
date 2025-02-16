import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Grid, Box, Slider, Typography} from '@mui/material';
import theme from '../../themes/themes';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Undo from '@mui/icons-material/Undo';
import Redo from '@mui/icons-material/Redo';
import ComparisonView from '../CompareView';
import Timeout from '../Timeout';

const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F33FFF', '#FFD700', '#800080', '#00FF00', '#00FFFF', '#FF1493',
        '#4682B4', '#DC143C', '#00BFFF', '#FF4500', '#8A2BE2',
         '#B0E0E6','#FF8C00', 
        '#FF0000', '#6495ED', '#00008B', '#F0E68C', '#D8BFD8', '#556B2F', '#000000', '#ffffff'
];
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null; // Return null if the cookie is not found
  }

const Canvas = ({ themes, themeToggle }) => {
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
    const [timeoutDialog, setTimeoutDialog] = useState(false);


    const timeOutFetch = () => {
        // Coming soon
        setTimeoutDialog(true)
    }

    const [currentTheme, setCurrentTheme] = useState(themes ? theme[0] : theme[1]);

    useEffect(() => {
        // Update the current theme dynamically when theme or themeToggle changes
        setCurrentTheme(themes ? theme[0] : theme[1]);
    }, [themes, themeToggle]);

    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth / 2,
        height: window.innerHeight / 1.5
    });
    useEffect(() => {
        const updateCanvasSize = () => {
            setCanvasSize({
                width: window.innerWidth / 2,
                height: window.innerHeight / 1.5
            });
        };
    
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // const [currentTool, setCurrentTool] = useState('brush'); 
    const [CompareDialog, SetCompareDialog] = useState(false);
    const [canvasData , setCanvasData] = useState(null)
    const handledDialogOpen = () => SetCompareDialog(true);
    const handleDialogClose = () => SetCompareDialog(false);
    
    // fixes redo adding two drawings each time
    useEffect(() => {
        historyRef.current = history;
        redoHistoryRef.current = redoHistory;
    }, [history, redoHistory]);

    useEffect(() => {
        const uid = getCookie("uid")
        fetch(`http://127.0.0.1:8000/users/users/${uid}/get_puzzle/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${getCookie("auth")}`,
            }
        }).then((response) => response.json()).then((data) =>{
            console.log(data)
            setCanvasData(data)
        }).catch((error) => {
            console.log(error, "errror getting puzzle, trying to create")
            const date = new Date();
            const formattedDate = date.toLocaleDateString('en-CA');
            fetch(`http://localhost:8000/canvas/daily-puzzles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${getCookie("auth")}`,
                },
                body: JSON.stringify({
                    user_id: uid,
                    date: formattedDate,
                })

            }).then((response) => response.json()).then((data) => {
                console.log(data);
                fetch(`http://127.0.0.1:8000/users/users/${uid}/get_puzzle/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${getCookie("auth")}`,
                    }
                }).then((response) => response.json()).then((data) => {
                    setCanvasData(data)
                })
            }).catch((error) => {
                console.log(error, "errror creating puzzle")
            })
        })


        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const updateCanvas = () => {
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;

            // Set background color based on theme
            ctx.fillStyle = themes ? theme[0].palette.background.default : theme[1].palette.background.default;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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

        // setCurrentDrawing((prevDrawing) => [...prevDrawing, { x, y, color: currentColor, size: brushSize }]);
        setCurrentDrawing((prevDrawing) => {
            const newDrawing = [...prevDrawing, { x, y, color: currentColor, size: brushSize }];
            
            if (newDrawing.length > 1) {
                const ctx = canvas.getContext('2d');
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = brushSize;
                ctx.lineJoin = 'round';  // This makes line joints smoother
                ctx.lineCap = 'round';   // This makes the line ends smooth
                
                ctx.beginPath();
                ctx.moveTo(newDrawing[newDrawing.length - 2].x, newDrawing[newDrawing.length - 2].y); // Move to the last point
                ctx.lineTo(x, y); // Draw to the new point
                ctx.stroke();
            }
            return newDrawing;
        });        
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
        handledDialogOpen()

    };
    // const saveDrawing = () => {
    //     const canvas = canvasRef.toDataURL('image/png');
    //     const name = `drawing_${Date.now()}.png`;
    // }
    const [error, setError] = useState('');

    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
    };

    const getSessionId = () => {
        const sessionId = getCookie('sessionid');
        return sessionId;
    };


    const getPrompt = async () => {
        const sessionId = getSessionId();
        try {
            const response = await fetch('http://localhost:8000/canvas/daily-puzzles/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
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
        setImage(canvasRef.current.toDataURL('image/png'));
        e.preventDefault();
        setError("");
        console.clear();
        try {
            const response = await fetch('http://localhost:8000/canvas/daily-puzzles/', {
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
            {canvasData && <Typography variant='h4' align='center'>"{canvasData[0]?.prompt}"</Typography>}

            <div className='grid grid-cols-2 gap-4 justify-center items-center'>

            <p>{error}</p>
            </div>
            {/* Color selection buttons */}
            <div className='flex flex-col items-center justify-center'>
            <div className='grid grid-cols-12 pb-2 pl-2' style={{ position: '', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', overflowX: 'hidden', marginLeft: 'auto', marginRight: 'auto', width: '100%', left: '', top: '0' }}>
                {colors.map((color) => (
                    <div key={color} className="pt-2">
                        <Button
                            style={{
                                backgroundColor: color,
                                width: '30px', // Adjusted width for better visibility
                                height: '30px',
                                margin: '0 5px', // Adds horizontal space between buttons
                            }}
                            onClick={() => handleColorChange(color)}
                        />
                    </div>
                ))}
            </div>
            
            <div className="flex space-x-2">
                <p>Size:</p>
                <Slider
                    value={brushSize}
                    onChange={handleBrushChange}
                    min={1}
                    max={50}
                    step={1}
                    aria-labelledby="brush-size-slider"
                    style={{ width: '200px' }}
                    sx={{
                        width: '200px',
                        color: currentTheme.palette.button.default,
                    }}
                />
                </div>
                </div>
            <div className="grid grid-cols-2" style={{ display: 'flex', alignItems: '', justifyContent: '' }}>

                <div className='' style={{position: '', width: '100%', left: '', top: '0' }}>
                <canvas         
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onMouseDown={() => setDrawing(true)}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    style={{ border: '1px solid black', marginLeft: 'auto', marginRight: 'auto', maxHeight: '', maxWidth: '' }}
                    
                />
                </div>
                <div className="flex flex-col" style={{ position: 'absolute', paddingLeft: '', padding: '10px' }}>
                    <IconButton onClick={clearCanvas} aria-label="clear"
                    sx={{ color: currentTheme.palette.button.default }}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton sx={{ color: currentTheme.palette.button.default }} onClick={undoDrawing} aria-label="undo">
                        <Undo />
                    </IconButton>
                    <IconButton sx={{ color: currentTheme.palette.button.default }} onClick={redoDrawing} aria-label="redo">
                        <Redo />
                    </IconButton>
                </div>
            </div>

        {/* Side action buttons */}
        <div className='flex flex-col mx-auto grid grid-cols-2 gap-4'>
            {/* Download button */}
            <Button variant="contained" sx={{ backgroundColor: currentTheme.palette.button.default }} onClick={handleDownload} style={{ marginTop: '10px' }}>
                Download Image
            </Button>
            <Button variant="contained" sx={{ backgroundColor: currentTheme.palette.button.default}} onClick={saveDrawing} style={{ marginTop: '10px' }}>
                Submit Image
            </Button>
            <ComparisonView open = {CompareDialog} handleClose={handleDialogClose}/>
            <Timeout open={timeoutDialog} />
            </div>
        </div>
    );

};

export default Canvas;
