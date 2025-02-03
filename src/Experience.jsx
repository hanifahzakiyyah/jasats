import { OrbitControls, Sparkles } from '@react-three/drei'
import BoxBaru from './BoxBaru'
import { useEffect, useRef, useState } from 'react'
import { useHelper } from '@react-three/drei'
import { DirectionalLightHelper, AxesHelper } from 'three'
import {useFrame, useThree} from '@react-three/fiber'
import * as THREE from 'three'

export default function Experience() {
    const light1Ref = useRef()
    const light2Ref = useRef()
    const [showOrbCont, setShowOrbCont] = useState(true)
    const {camera} = useThree()
    const [targetPosition, setTargetPosition] = useState([-5, 20, 10]);
    const cameraRef = useRef();
    const [aturPosisi, setAturPosisi] = useState(false)

    //tombol login untuk orbit
    useEffect(() => {
        const handleEvent = (event) => {
            setShowOrbCont(false);
            setTargetPosition([5, 7, 20]); // Set target position
            setAturPosisi(true)
            setTimeout(()=>{
                setAturPosisi(false)
            }, 1000)
        };

        // Tambahkan event listener
        window.addEventListener('tombolDitekan', handleEvent);

        return () => {
            // Bersihkan event listener saat komponen unmount
            window.removeEventListener('tombolDitekan', handleEvent);
        };
    }, []);

    useFrame(() => {
        if (camera && aturPosisi) {
            // Lerp camera position
            camera.position.lerp(new THREE.Vector3(...targetPosition), 0.1);
        }
    });

    // Menggunakan helper untuk directionalLight
    // useHelper(light1Ref, DirectionalLightHelper, 1)
    // useHelper(light2Ref, DirectionalLightHelper, 1)

    return (
        <>
            {showOrbCont && <OrbitControls 
                makeDefault 
                enableZoom={true} 
                enableDamping={true}
                maxPolarAngle={Math.PI/2}
                maxAzimuthAngle={Math.PI/1}
                minAzimuthAngle={-Math.PI/1}
                minDistance={10} // Adjust this value as needed
                maxDistance={50} 
            />}
            

            {/* Pencahayaan */}
            <directionalLight
                
                castShadow
                position={[3, 4, 2]}
                intensity={0.5}
                shadow-camera-near={0.5}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <directionalLight
                ref={light2Ref}
                castShadow
                position={[-4, 5, 2]}
                intensity={0.5}
                shadow-camera-near={0.5}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            {/* <directionalLight
                castShadow
                position={[-4, 0, -1]}
                intensity={0.2}s
            /> */}
            <directionalLight
                ref={light1Ref}
                castShadow
                position={[3, 4, -3]}
                intensity={0.7}
                shadow-camera-near={0.5}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <directionalLight
                castShadow
                position={[0, 0, -3]}
                intensity={0.2}
                shadow-camera-near={0.5}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <ambientLight intensity={0.4} /> 

            {/* Helper untuk memvisualisasikan posisi */}
            {/* <primitive object={new AxesHelper(5)} /> */}

            {/* Objek lain */}
            {/* <Box /> */}
            <BoxBaru/>

            <Sparkles
                size={20}
                scale={[50,50,50]}
                count={500}
                position={[0,1,0]}
                color={"#c6baaa"}
            />
        </>
    )
}
