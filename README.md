# Arc de Triomphe

A cinematic WebGL experience of the iconic French monument, built with React Three Fiber, custom GLSL shaders, and scroll-driven animation.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r184-black?style=flat-square&logo=threedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)


---

## Overview

This project is an interactive, cinematic 3D presentation of the Arc de Triomphe — the historic monument at the heart of Paris. Visitors are taken through a visually rich, scroll-driven journey around the monument, with cinematic postprocessing effects, smooth camera choreography, and custom GLSL materials bringing the scene to life in the browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| 3D Rendering | [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) |
| Postprocessing | [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) (Unreal Bloom, depth effects) |
| Helpers / Abstractions | [@react-three/drei](https://github.com/pmndrs/drei) |
| Shaders | Custom GLSL via [vite-plugin-glsl](https://github.com/UstymUkhman/vite-plugin-glsl) |
| Scroll Animation | [Lenis](https://lenis.darkroom.engineering/) (smooth scroll) + [GSAP](https://gsap.com/) |
| UI Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Debug | [Leva](https://github.com/pmndrs/leva) + [r3f-perf](https://github.com/utsuboco/r3f-perf) |
| Build | Vite 8 |



## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Ony3dika/Arc-de-Triomphe.git
cd Arc-de-Triomphe
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## License

MIT


