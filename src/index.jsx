import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience.jsx';
import { useState, useEffect } from 'react';

function ResponsiveCanvas() {
    const [camera, setCamera] = useState([0, 3, 7]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCamera([-5, 7, 16]); //mobile
            } else {
                setCamera([-5, 5, 16]);
            }
        };

        handleResize(); // Inisialisasi posisi kamera berdasarkan ukuran layar
        window.addEventListener('resize', handleResize); // Tambahkan listener untuk resize
        return () => window.removeEventListener('resize', handleResize); // Bersihkan listener
    }, []);

    return (
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: camera, 
            }}
        >
            <Experience />
        </Canvas>
    );
}

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
    <ResponsiveCanvas />
);
