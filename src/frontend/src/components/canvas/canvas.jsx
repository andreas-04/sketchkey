import React, { useRef, useState, useEffect } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const handleResize = () => {
            canvas.width = window.innerWidth / 2;
            canvas.height = window.innerHeight / 1.5;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    const draw = (e) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, 2, 2);
    };

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth / 2}
            height={window.innerHeight / 1.5}
            onMouseDown={() => setDrawing(true)}
            onMouseUp={() => setDrawing(false)}
            onMouseMove={draw}
            style={{ border: '1px solid black' }}
        />
    );
};

export default Canvas;
