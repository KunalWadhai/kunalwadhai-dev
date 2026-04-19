import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import profileImg from '../assets/KunalProfilePhoto.jpeg'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function Background() {
  const planetRef = useRef<THREE.Mesh | null>(null)

  useFrame((_, delta) => {
    if (!planetRef.current) return
    planetRef.current.rotation.y += delta * 0.15
    planetRef.current.rotation.x += delta * 0.04
  })

  const orbitDots = useMemo(
    () =>
      Array.from({ length: 200 }, () => {
        const r = 3 + Math.random() * 6
        const a = Math.random() * Math.PI * 2
        const b = Math.random() * Math.PI * 2
        return new THREE.Vector3(
          r * Math.sin(a) * Math.cos(b),
          r * Math.sin(a) * Math.sin(b),
          r * Math.cos(a)
        )
      }),
    []
  )

  return (
    <>
      <Stars radius={100} depth={60} count={4000} factor={4} fade speed={1.2} />
      <mesh ref={planetRef} position={[5, 2, -5]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#4c1d95"
          emissiveIntensity={0.4}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>
      {orbitDots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#a78bfa' : '#86efac'}
            transparent
            opacity={0.4 + Math.random() * 0.4}
          />
        </mesh>
      ))}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[-5, 3, 5]} intensity={0.5} color="#06b6d4" />
    </>
  )
}

const TITLES = [
  'Backend Engineer & System Architect',
  'IoT Integration Specialist',
  'Building production systems at scale',
]

export function Hero3D() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const target = TITLES[titleIndex]
    if (typing) {
      if (displayText.length < target.length) {
        const timer = setTimeout(() => setDisplayText(target.slice(0, displayText.length + 1)), 42)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setTyping(false), 2200)
        return () => clearTimeout(timer)
      }
    } else {
      if (displayText.length > 0) {
        const timer = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 25)
        return () => clearTimeout(timer)
      } else {
        setTitleIndex((prev) => (prev + 1) % TITLES.length)
        setTyping(true)
      }
    }
  }, [displayText, typing, titleIndex])

  return (
    <motion.div
      className="hero3d"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <Background />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>

      <div className="hero3d__content">
        <div className="hero3d__badge">AVAILABLE FOR OPPORTUNITIES</div>
        <h1 className="hero3d__title">
          Hi, I'm <span className="gradient-text">Kunal Wadhai</span>
        </h1>
        <p className="hero3d__subtitle">
          {displayText}
          <span className="typewriter-cursor" />
        </p>
      </div>

      <div className="hero3d__portrait">
        <img src={profileImg} alt="Kunal Wadhai" />
      </div>
    </motion.div>
  )
}
