import { OrbitControls, Sparkles } from '@react-three/drei'
import BoxBaru from './BoxBaru'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useHelper } from '@react-three/drei'
import { DirectionalLightHelper, AxesHelper } from 'three'
import {useFrame, useThree} from '@react-three/fiber'
import * as THREE from 'three'

export default function Experience() {
    const light1Ref = useRef()
    const light2Ref = useRef()
    const [showOrbCont, setShowOrbCont] = useState(true)
    const {camera} = useThree()
    const [targetPosition, setTargetPosition] = useState([-5, 20, 10])
    const cameraRef = useRef()
    const [aturPosisi, setAturPosisi] = useState(false)
    const [enableRandomMovement, setEnableRandomMovement] = useState(false)
    const lastScrollY = useRef(0)
    const randomMovementRef = useRef({
        target: new THREE.Vector3(-5, 20, 10),
        timeoutId: null,
        startTime: 0,
        duration: 4000 // 4 seconds for each movement
    })

    // Create easing function
    const easeInOutCubic = (t) => {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const generateRandomPosition = () => {
        const currentPos = camera.position
        return [
            currentPos.x + THREE.MathUtils.randFloat(-5, 5),  // Smaller range for smoother movement
            currentPos.y + THREE.MathUtils.randFloat(-3, 3),  // Subtle vertical movement
            currentPos.z + THREE.MathUtils.randFloat(-4, 4)   // Moderate depth movement
        ]
    }

    const handleScroll = () => {
        if (!enableRandomMovement) return

        const currentScrollY = window.scrollY
        const scrollDelta = currentScrollY - lastScrollY.current
        
        if (Math.abs(scrollDelta) > 15) { // Lower threshold for more frequent movements
            const newPosition = generateRandomPosition()
            randomMovementRef.current.target = new THREE.Vector3(...newPosition)
            randomMovementRef.current.startTime = performance.now()
            
            // Clear existing timeout
            if (randomMovementRef.current.timeoutId) {
                clearTimeout(randomMovementRef.current.timeoutId)
            }
            
            // Set new timeout to return to original position
            randomMovementRef.current.timeoutId = setTimeout(() => {
                randomMovementRef.current.target = new THREE.Vector3(-5, 20, 10)
                randomMovementRef.current.startTime = performance.now()
            }, 5000) // Longer delay before returning
        }
        
        lastScrollY.current = currentScrollY
    }

    useEffect(() => {
        const handleEvent = (event) => {
            setShowOrbCont(false)
            setTargetPosition([5, 12, 20])
            setAturPosisi(true)
            setTimeout(() => {
                setAturPosisi(false)
                setEnableRandomMovement(true)
            }, 2000) // Longer initial animation
        }

        window.addEventListener('tombolDitekan', handleEvent)
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('tombolDitekan', handleEvent)
            window.removeEventListener('scroll', handleScroll)
            if (randomMovementRef.current.timeoutId) {
                clearTimeout(randomMovementRef.current.timeoutId)
            }
        }
    }, [enableRandomMovement])

    useFrame(() => {
        if (!camera) return

        if (aturPosisi) {
            // Initial animation with slower lerp
            camera.position.lerp(new THREE.Vector3(...targetPosition), 0.05)
        } else if (enableRandomMovement) {
            // Smooth random movement with easing
            const elapsed = performance.now() - randomMovementRef.current.startTime
            const progress = Math.min(elapsed / randomMovementRef.current.duration, 1)
            const easedProgress = easeInOutCubic(progress)
            
            camera.position.lerp(randomMovementRef.current.target, 0.02 * easedProgress)
        }
    })

    // Menggunakan helper untuk directionalLight
    // useHelper(light1Ref, DirectionalLightHelper, 1)
    // useHelper(light2Ref, DirectionalLightHelper, 1)

    return (
        <>
            {showOrbCont && <OrbitControls 
                // makeDefaultDistance={30} // Changed from 10 to 40
                enableZoom={true} 
                enableDamping={true}
                minDistance={40}
                maxDistance={60} 
                maxPolarAngle={Math.PI/2}
                maxAzimuthAngle={Math.PI/1}
                minAzimuthAngle={-Math.PI/1}
                makeDefault
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
