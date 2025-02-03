import { OrbitControls, Sparkles } from '@react-three/drei'
import BoxBaru from './BoxBaru'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useHelper } from '@react-three/drei'
import { DirectionalLightHelper, AxesHelper } from 'three'
import {useFrame, useThree} from '@react-three/fiber'
import * as THREE from 'three'

const SparkConnections = ({ sparkCount = 300, maxDistance = 2.47104 }) => {
    const lineRef = useRef()
    const sparklesRef = useRef([])
    const connectionsRef = useRef([])
    const [initialized, setInitialized] = useState(false)
    const updateTimeRef = useRef(0)
    const touchPointRef = useRef(null)
    const touchRadiusRef = useRef(10)
    const clickPointRef = useRef(null)
    const attractionStrengthRef = useRef(0)

    useEffect(() => {
        const radius = 25
        sparklesRef.current = Array(sparkCount).fill().map(() => {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = radius * Math.cbrt(Math.random())

            const position = new THREE.Vector3(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta) + 1,
                r * Math.cos(phi)
            )

            const originalPosition = position.clone()
            const distFromCenter = position.distanceTo(new THREE.Vector3(0, 1, 0))
            const centerWeight = 1 - (distFromCenter / (radius * 1.5))

            return {
                position,
                originalPosition,
                startTime: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.5 + 0.5,
                connectionCount: 0,
                centerWeight: Math.max(0.1, centerWeight)
            }
        })

        const handlePointerMove = (event) => {
            if (event.buttons > 0 || event.touches) {
                const canvas = event.target
                const rect = canvas.getBoundingClientRect()
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

                const vector = new THREE.Vector3(x, y, 0.5)
                vector.unproject(window.camera)
                touchPointRef.current = vector
                touchRadiusRef.current = 10
            } else {
                touchPointRef.current = null
            }
        }

        const handlePointerUp = () => {
            touchPointRef.current = null
        }

        const handleClick = (event) => {
            const canvas = event.target
            const rect = canvas.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

            const vector = new THREE.Vector3(x, y, 0.5)
            vector.unproject(window.camera)
            clickPointRef.current = vector
            attractionStrengthRef.current = 1
        }

        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)
        window.addEventListener('click', handleClick)

        setInitialized(true)

        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
            window.removeEventListener('click', handleClick)
        }
    }, [])

    const updateConnections = (time) => {
        const connections = []
        const baseConnectionProb = 0.15

        sparklesRef.current.forEach((sparkle, i) => {
            if (sparkle.connectionCount >= 3) return

            sparklesRef.current.forEach((otherSparkle, j) => {
                if (i < j && otherSparkle.connectionCount < 3) {
                    const distance = sparkle.position.distanceTo(otherSparkle.position)
                    if (distance < maxDistance) {
                        let connectionProb = baseConnectionProb *
                            (sparkle.centerWeight + otherSparkle.centerWeight) / 2

                        if (touchPointRef.current) {
                            const touchDist = sparkle.position.distanceTo(touchPointRef.current)
                            if (touchDist < touchRadiusRef.current) {
                                connectionProb *= (1 + (1 - touchDist / touchRadiusRef.current))
                            }
                        }

                        if (Math.random() < connectionProb) {
                            connections.push({
                                from: i,
                                to: j,
                                phase: Math.random() * Math.PI * 2,
                                amplitude: Math.random() * 0.3 + 0.2,
                                speed: Math.random() * 0.5 + 0.5,
                                startTime: time,
                                life: Math.random() * 2000 + 1000
                            })
                            sparkle.connectionCount++
                            otherSparkle.connectionCount++
                        }
                    }
                }
            })
        })

        if (touchPointRef.current && touchRadiusRef.current > 5) {
            touchRadiusRef.current *= 0.95
        }

        sparklesRef.current.forEach(sparkle => {
            sparkle.connectionCount = 0
        })

        return connections
    }

    useFrame(({ clock }) => {
        if (!lineRef.current || !initialized) return

        const time = clock.getElapsedTime() * 1000
        const now = time

        // Update sparkle positions
        if (clickPointRef.current && attractionStrengthRef.current > 0) {
            sparklesRef.current.forEach(sparkle => {
                // Calculate direction to click point
                const toClick = clickPointRef.current.clone().sub(sparkle.position)
                const dist = toClick.length()

                // Normalize and scale by strength (slower movement)
                toClick.normalize().multiplyScalar(0.005 * attractionStrengthRef.current)

                // Limit movement based on distance to original position
                const toOriginal = sparkle.originalPosition.clone().sub(sparkle.position)
                const origDist = toOriginal.length()
                if (origDist > 5) {
                    toOriginal.normalize().multiplyScalar(0.01)
                    sparkle.position.add(toOriginal)
                } else {
                    sparkle.position.add(toClick)
                }
            })

            // Very slowly decrease attraction
            attractionStrengthRef.current *= 0.998
        }

        if (now - updateTimeRef.current > 500) {
            const newConnections = updateConnections(now)
            connectionsRef.current = connectionsRef.current
                .filter(conn => now - conn.startTime < conn.life)
                .concat(newConnections)
            updateTimeRef.current = now
        }

        const positions = []
        connectionsRef.current.forEach(connection => {
            const start = sparklesRef.current[connection.from]
            const end = sparklesRef.current[connection.to]

            const lifeProgress = Math.min((now - connection.startTime) / connection.life, 1)
            const fadeInOut = Math.sin(lifeProgress * Math.PI)

            const startPos = start.position.clone()
            const endPos = end.position.clone()

            const waveTime = time * 0.001
            startPos.y += Math.sin(waveTime * start.speed + start.startTime) * 0.2 * fadeInOut
            endPos.y += Math.sin(waveTime * end.speed + start.startTime) * 0.2 * fadeInOut

            const midpoint = new THREE.Vector3().lerpVectors(startPos, endPos, 0.5)
            const waveOffset = Math.sin(waveTime * connection.speed + connection.phase) *
                             connection.amplitude * fadeInOut
            midpoint.y += waveOffset

            positions.push(
                startPos.x, startPos.y, startPos.z,
                midpoint.x, midpoint.y, midpoint.z,
                midpoint.x, midpoint.y, midpoint.z,
                endPos.x, endPos.y, endPos.z
            )
        })

        lineRef.current.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        )
    })

    return initialized ? (
        <line ref={lineRef}>
            <bufferGeometry />
            <shaderMaterial
                transparent
                uniforms={{
                    color: { value: new THREE.Color("#c6baaa") },
                    opacity: { value: 0.2 },
                    cameraPosition: { value: window.camera ? window.camera.position : new THREE.Vector3() }
                }}
                vertexShader={`
                    varying vec3 vPosition;
                    varying float vDistance;
                    uniform vec3 cameraPosition;
                    
                    void main() {
                        vPosition = position;
                        vDistance = distance(position, cameraPosition);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    varying vec3 vPosition;
                    varying float vDistance;
                    uniform vec3 color;
                    uniform float opacity;
                    
                    void main() {
                        // Calculate line thickness based on camera distance (40%-80%)
                        float thickness = mix(0.4, 0.8, 1.0 - clamp(vDistance / 50.0, 0.0, 1.0));
                        
                        // Glossy effect
                        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                        float specular = pow(max(dot(normalize(vPosition), lightDir), 0.0), 32.0);
                        vec3 finalColor = mix(color, vec3(1.0), specular * 0.5);
                        
                        gl_FragColor = vec4(finalColor, opacity * thickness);
                    }
                `}
            />
        </line>
    ) : null
}

export default function Experience() {
    const light1Ref = useRef()
    const light2Ref = useRef()
    const [showOrbCont, setShowOrbCont] = useState(true)
    const {camera} = useThree()
    const [targetPosition, setTargetPosition] = useState([-5, 20, 10])
    const cameraRef = useRef()
    const [aturPosisi, setAturPosisi] = useState(false)
    const [enableRandomMovement, setEnableRandomMovement] = useState(false)
    const [fadeOpacity, setFadeOpacity] = useState(1)
    const lastScrollY = useRef(0)
    const randomMovementRef = useRef({
        target: new THREE.Vector3(-5, 20, 10),
        startTime: 0,
        duration: 4000,
        isReturning: false
    })

    useEffect(() => {
        window.camera = camera
    }, [camera])

    const easeWave = (t) => {
        return 0.5 - 0.5 * Math.cos(t * Math.PI)
    }

    const generateRandomPosition = () => {
        const currentPos = camera.position
        const moveType = Math.floor(Math.random() * 2)

        switch(moveType) {
            case 0:
                return [
                    currentPos.x + (Math.random() > 0.5 ? 12 : -12),
                    currentPos.y + THREE.MathUtils.randFloat(-2, 2),
                    currentPos.z + 4
                ]
            case 1:
                return [
                    currentPos.x + THREE.MathUtils.randFloat(-3, 3),
                    currentPos.y + THREE.MathUtils.randFloat(-2, 2),
                    currentPos.z + (Math.random() > 0.5 ? -8 : 8)
                ]
        }
    }

    const handleScroll = () => {
        if (!enableRandomMovement) return

        const currentScrollY = window.scrollY
        const scrollDelta = currentScrollY - lastScrollY.current

        if (Math.abs(scrollDelta) > 15) {
            const newPosition = generateRandomPosition()
            randomMovementRef.current.target = new THREE.Vector3(...newPosition)
            randomMovementRef.current.startTime = performance.now()
            randomMovementRef.current.isReturning = false
            setFadeOpacity(1)

            if (randomMovementRef.current.timeoutId) {
                clearTimeout(randomMovementRef.current.timeoutId)
            }

            randomMovementRef.current.timeoutId = setTimeout(() => {
                randomMovementRef.current.isReturning = true
                randomMovementRef.current.startTime = performance.now()
                randomMovementRef.current.target = new THREE.Vector3(-5, 20, 10)
            }, 3000)
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
            }, 2000)
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
            camera.position.lerp(new THREE.Vector3(...targetPosition), 0.03)
        } else if (enableRandomMovement) {
            const elapsed = performance.now() - randomMovementRef.current.startTime
            const progress = Math.min(elapsed / randomMovementRef.current.duration, 1)
            const easedProgress = easeWave(progress)

            if (randomMovementRef.current.isReturning) {
                const fadeProgress = elapsed / randomMovementRef.current.duration
                setFadeOpacity(Math.max(0.2, 1 - fadeProgress))
            }

            camera.position.lerp(randomMovementRef.current.target, 0.02 * (1 + easedProgress))

            const lookAtY = Math.sin(elapsed * 0.001) * 2
            camera.lookAt(0, lookAtY, 0)
        }
    })
            />
            <directionalLight
                ref={light1Ref}
                castShadow
                position={[3, 4, -3]}
                intensity={0.7 * fadeOpacity}
