# Mahalakshmi Spice Heritage Family Restaurant — 3D Next.js Website

A luxury, interactive **3D Web Experience** tailored for **Mahalakshmi Spice Heritage Family Restaurant (MSH)**, powered by **Next.js 14**, **Three.js (WebGL)**, **React**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🔮 3D Experience & Architectural Highlights

1. **Interactive 3D WebGL Gold Medallion (`ThreeDHeroMedallion.jsx`)**:
   - Built with **Three.js**: A metallic royal gold coin carrying the official **SH** (Spice Heritage) crest on both faces with an embossed gold torus ring.
   - **Full 360° Drag & Spin**: Click and drag with mouse/touch to spin the 3D coin in real time with physics inertia.
   - **Dynamic Lighting**: Ambient, directional, and cursor-following point lights that cast real specular gold gleams across the coin ridges.
   - **Floating 3D Gold Dust**: Ambient orbiting 3D gold particles in 3D coordinate space.
   - Quick toggle button in the Hero card to switch between interactive 3D Medallion and standard 2D view.

2. **3D Floating Ambient Particle & Ember Universe (`ThreeDBackgroundParticles.jsx`)**:
   - Global Three.js particle canvas with 220+ glowing gold ember particles.
   - Real-time 3D camera parallax following cursor coordinates to create depth of field throughout the entire page.

3. **3D Perspective Tilt Cards (`ThreeDTiltCard.jsx`)**:
   - Hardware-accelerated 3D perspective tilt (`rotateX`, `rotateY`, `scale3d`) with dynamic specular glare sheens that follow cursor position.
   - Integrated into the **Hero Showcase Card** and all **8 Signature Dishes**.

4. **Interactive 3D Tasting Showcase (`ThreeDDishExperience.jsx`)**:
   - Dedicated 3D interactive stage to inspect signature dishes in 3D perspective (*Royal Tandoori Murgh*, *Hyderabadi Dum Biryani*, *Paneer Tikka Angara*, *Malabar Spiced Prawns*).
   - Features nutrition specs, allergen callouts, and instant recipe inspection.

---

## 🚀 How to Run the Website

```bash
# Start development server
npm run dev

# Or compile and launch production build
npm run build
npm run start
```

Visit [http://localhost:3001](http://localhost:3001) in your browser.
