import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import profileImg from '../assets/KunalProfilePhoto.jpeg'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Background() {
  const planetRef = useRef<THREE.Mesh | null>(null)

  // Small, subtle animation so the planet feels alive.
  useFrame((_, delta) => {
    if (!planetRef.current) return
    planetRef.current.rotation.y += delta * 0.15
    planetRef.current.rotation.x += delta * 0.04
  })

  const orbitDots = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return { x: Math.cos(a) * 2.25, z: Math.sin(a) * 2.25, y: -1.15 }
      }),
    [],
  )

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <Stars radius={80} depth={40} count={5000} factor={4} saturation={0} fade />

      {/* Cute planet: smaller + deeper + atmosphere */}
      <group position={[0, -0.6, -4.5]}>
        <mesh ref={planetRef} scale={0.42}>
          <sphereGeometry args={[2.3, 48, 48]} />
          <meshStandardMaterial
            color="#4f46e5"
            emissive="#22c55e"
            emissiveIntensity={0.14}
            metalness={0.18}
            roughness={0.85}
          />
        </mesh>

        {/* Atmosphere glow (additive + transparent) */}
        <mesh scale={0.46}>
          <sphereGeometry args={[2.3, 48, 48]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Tiny orbit dots */}
        {orbitDots.map((p, i) => (
          <mesh key={i} position={[p.x * 0.55, p.y * 0.55, p.z * 0.55]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.65} />
          </mesh>
        ))}

        {/* Soft ring to make it feel planet-like */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 1, 1]}>
          <torusGeometry args={[2.2, 0.06, 16, 80]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate />
    </>
  )
}

export function Hero3D() {
  return (
    <div className="hero3d">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 50 }}>
        <Background />
      </Canvas>

      <motion.div
        className="hero3d__content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero3d__badge">Backend Engineer • AI + Systems</div>
        <h1 className="hero3d__title">
          I build scalable backend systems with delightful UX.
        </h1>
        <p className="hero3d__subtitle">
          Explore experiences, projects, real-time coding stats (connect later), and a profile-tuned AI assistant.
        </p>
      </motion.div>

      <motion.div
        className="hero3d__portrait"
        initial={{ opacity: 0, x: 20, rotateY: -18 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <img src={profileImg} alt="Kunal Wadhai profile" />
      </motion.div>
    </div>
  )
}

