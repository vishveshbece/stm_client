/**
 * ═══════════════════════════════════════════════════════════════
 *  STM32 MASTERING WORKSHOP — React Frontend
 *  App.jsx  (single-file, no extra UI libs needed)
 *
 *  Pages: Hero → Register (Step1 → QR+Payment → Step2 → Done) → Admin
 *  Backend: Express on http://localhost:5000 (set VITE_API in .env)
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior: smooth; }
  body { background:#030810; color:#e0f4ff; font-family:'Rajdhani',sans-serif; overflow-x:hidden; }
  :root {
    --bg:#030810; --bg2:#060d1a;
    --primary:#00d4ff; --secondary:#ff6b00; --accent:#00ff88;
    --card:rgba(0,212,255,.04); --border:rgba(0,212,255,.15);
    --text:#e0f4ff; --muted:#6a8fa8; --danger:#ff3355;
    --glow:0 0 24px rgba(0,212,255,.45); --glow-o:0 0 24px rgba(255,107,0,.5);
  }
  ::selection { background:rgba(0,212,255,.2); }
  input,select,textarea { color-scheme:dark; }
  input[type=file] { display:none; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:#030810; }
  ::-webkit-scrollbar-thumb { background:rgba(0,212,255,.3); border-radius:3px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes scanH    { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes scanLine { 0%{top:0;opacity:1} 90%{opacity:.8} 100%{top:100%;opacity:0} }
  @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes slideIn  { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes float1   { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-12px) rotate(1deg)} }
  @keyframes float2   { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-9px) rotate(-1deg)} }
  @keyframes float3   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(.5deg)} }
  @keyframes zoomIn   { from{opacity:0;transform:scale(.35) translateY(60px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes neon     { 0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 8px #00d4ff,0 0 20px #00d4ff,0 0 40px #00d4ff} 20%,24%,55%{text-shadow:none} }
  @keyframes orbit    { from{transform:rotate(0deg) translateX(100px) rotate(0deg)} to{transform:rotate(360deg) translateX(100px) rotate(-360deg)} }
  @keyframes orbit2   { from{transform:rotate(180deg) translateX(100px) rotate(-180deg)} to{transform:rotate(540deg) translateX(100px) rotate(-540deg)} }
  @keyframes glow-p   { 0%,100%{filter:drop-shadow(0 0 5px #00d4ff)} 50%{filter:drop-shadow(0 0 18px #00d4ff)} }
  @keyframes led      { 0%,100%{fill:#00ff88;filter:drop-shadow(0 0 6px #00ff88)} 50%{fill:#004422;filter:none} }
  @keyframes pin-p    { 0%{opacity:.3} 50%{opacity:1} 100%{opacity:.3} }
  @keyframes spark    { 0%{opacity:1;transform:scale(0) translate(0,0)} 100%{opacity:0;transform:scale(2) translate(var(--dx),var(--dy))} }
  @keyframes typeIn   { from{width:0;opacity:0} to{width:100%;opacity:1} }
  @keyframes progressBar { from{width:0} to{width:100%} }
  @keyframes stepPulse { 0%,100%{box-shadow:0 0 0 rgba(0,212,255,0)} 50%{box-shadow:0 0 16px rgba(0,212,255,.5)} }
`;

/* ══════════════════════════════════════════════
   SVG BOARDS
══════════════════════════════════════════════ */
const STM32Board = ({ style }) => (
  <svg viewBox="0 0 220 320" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="200" height="300" rx="6" fill="#0a2a1a" stroke="#00ff88" strokeWidth="1.5"/>
    <rect x="10" y="10" width="200" height="300" rx="6" fill="none" stroke="#00d4ff" strokeWidth=".4" opacity=".4"/>
    <rect x="70" y="38" width="80" height="28" rx="3" fill="#1a3a2a" stroke="#00ff88" strokeWidth="1"/>
    <text x="110" y="57" textAnchor="middle" fill="#00ff88" fontSize="11" fontFamily="'Share Tech Mono',monospace" fontWeight="bold">STM32</text>
    <rect x="60" y="98" width="100" height="100" rx="4" fill="#0d1f2d" stroke="#00d4ff" strokeWidth="1.5" style={{animation:'glow-p 2s ease-in-out infinite'}}/>
    <rect x="64" y="102" width="92" height="92" rx="2" fill="#091520"/>
    <text x="110" y="143" textAnchor="middle" fill="#00d4ff" fontSize="8.5" fontFamily="'Share Tech Mono',monospace">STM32F411RET6</text>
    <text x="110" y="157" textAnchor="middle" fill="#0099bb" fontSize="7" fontFamily="'Share Tech Mono',monospace">ARM Cortex-M4 | 100MHz</text>
    <text x="110" y="170" textAnchor="middle" fill="#006688" fontSize="6.5" fontFamily="'Share Tech Mono',monospace">512KB Flash | 128KB RAM</text>
    {[108,118,128,138,148,158,168,178,188].map((y,i)=><rect key={i} x="54" y={y} width="10" height="5" rx="1" fill="#c8a000" opacity=".9" style={{animation:`pin-p ${1.5+i*.15}s ease-in-out infinite`}}/>)}
    {[108,118,128,138,148,158,168,178,188].map((y,i)=><rect key={i} x="156" y={y} width="10" height="5" rx="1" fill="#c8a000" opacity=".9" style={{animation:`pin-p ${1.5+i*.15}s .5s ease-in-out infinite`}}/>)}
    {[68,82,96,110,124,138,152].map((x,i)=><rect key={i} x={x} y="92" width="5" height="10" rx="1" fill="#c8a000" opacity=".9"/>)}
    {[68,82,96,110,124,138,152].map((x,i)=><rect key={i} x={x} y="196" width="5" height="10" rx="1" fill="#c8a000" opacity=".9"/>)}
    <circle cx="38" cy="68" r="5" fill="#00ff00" style={{animation:'led 1.2s ease-in-out infinite'}}/>
    <circle cx="52" cy="68" r="5" fill="#ff8800" style={{animation:'led 1.8s ease-in-out .4s infinite'}}/>
    <rect x="78" y="268" width="64" height="26" rx="3" fill="#1a1a2e" stroke="#4444aa" strokeWidth="1.2"/>
    <text x="110" y="284" textAnchor="middle" fill="#4444aa" fontSize="7" fontFamily="'Share Tech Mono',monospace">USB MICRO-B</text>
    <circle cx="34" cy="238" r="8" fill="#1a1a1a" stroke="#00d4ff" strokeWidth="1.2"/>
    <circle cx="34" cy="238" r="4" fill="#00d4ff" opacity=".7"/>
    <text x="34" y="254" textAnchor="middle" fill="#00d4ff" fontSize="5.5" fontFamily="'Share Tech Mono',monospace">RST</text>
    {[218,230,242,254,267].map((y,i)=><circle key={i} cx="24" cy={y} r="3.2" fill="#c8a000" stroke="#ffcc00" strokeWidth=".5" style={{animation:`pin-p ${1.5+i*.2}s ease-in-out infinite`}}/>)}
    {[218,230,242,254,267].map((y,i)=><circle key={i} cx="196" cy={y} r="3.2" fill="#c8a000" stroke="#ffcc00" strokeWidth=".5" style={{animation:`pin-p ${1.5+i*.2}s .5s ease-in-out infinite`}}/>)}
    <path d="M110 208 L110 226" stroke="#00d4ff" strokeWidth=".8" opacity=".4"/>
    <path d="M64 148 L40 148" stroke="#00ff88" strokeWidth=".6" opacity=".4"/>
    <path d="M166 128 L192 128" stroke="#00ff88" strokeWidth=".6" opacity=".4"/>
    {[[28,88],[176,88],[28,182],[176,182]].map(([x,y],i)=>(
      <g key={i}><rect x={x-4} y={y-6} width="8" height="12" rx="1" fill="#1a2a3a" stroke="#00d4ff" strokeWidth=".8"/><line x1={x-4} y1={y} x2={x+4} y2={y} stroke="#00d4ff" strokeWidth="1"/></g>
    ))}
    <ellipse cx="110" cy="82" rx="11" ry="6" fill="#1a2a1a" stroke="#00ff88" strokeWidth="1"/>
    <text x="110" y="85" textAnchor="middle" fill="#00ff88" fontSize="5" fontFamily="'Share Tech Mono',monospace">8MHz XTAL</text>
  </svg>
);

const ArduinoBoard = ({ style }) => (
  <svg viewBox="0 0 200 280" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="184" height="264" rx="8" fill="#003055" stroke="#0088ff" strokeWidth="1.5"/>
    <rect x="55" y="88" width="90" height="90" rx="3" fill="#111" stroke="#0066ff" strokeWidth="1.2"/>
    <text x="100" y="128" textAnchor="middle" fill="#0066ff" fontSize="8" fontFamily="'Share Tech Mono',monospace">ATmega328P</text>
    <text x="100" y="142" textAnchor="middle" fill="#004499" fontSize="6.5" fontFamily="'Share Tech Mono',monospace">ARDUINO UNO</text>
    <text x="100" y="155" textAnchor="middle" fill="#003377" fontSize="6" fontFamily="'Share Tech Mono',monospace">16MHz | 32KB</text>
    {[93,105,117,129,141,153,165].map((y,i)=><rect key={i} x="49" y={y} width="8" height="4" rx="1" fill="#888" opacity=".9"/>)}
    {[93,105,117,129,141,153,165].map((y,i)=><rect key={i} x="143" y={y} width="8" height="4" rx="1" fill="#888" opacity=".9"/>)}
    <circle cx="34" cy="50" r="5" fill="#00ff00" style={{animation:'led 2s ease-in-out infinite'}}/>
    <circle cx="52" cy="50" r="4" fill="#ff6600" style={{animation:'led .5s ease-in-out infinite'}}/>
    <circle cx="66" cy="50" r="4" fill="#ff6600" style={{animation:'led .7s .2s ease-in-out infinite'}}/>
    <rect x="70" y="238" width="60" height="22" rx="3" fill="#1a1a2e" stroke="#4444cc" strokeWidth="1"/>
    <text x="100" y="253" textAnchor="middle" fill="#4444cc" fontSize="6" fontFamily="'Share Tech Mono',monospace">USB TYPE-B</text>
    {[18,32,46,60,74,88,102,116,130,144,158,172,186].map((x,i)=><rect key={i} x={x} y="10" width="8" height="16" rx="1" fill="#c8a000" opacity=".8"/>)}
    {[18,36,54,72,90,108].map((x,i)=><rect key={i} x={x} y="246" width="8" height="16" rx="1" fill="#c8a000" opacity=".8"/>)}
    <circle cx="158" cy="50" r="7" fill="#cc0000" stroke="#ff4444" strokeWidth="1"/>
    <text x="158" y="54" textAnchor="middle" fill="white" fontSize="5" fontFamily="'Share Tech Mono',monospace">RST</text>
    <ellipse cx="100" cy="74" rx="12" ry="7" fill="#1a2a1a" stroke="#00ff00" strokeWidth="1"/>
    <text x="100" y="77" textAnchor="middle" fill="#00aa00" fontSize="5" fontFamily="'Share Tech Mono',monospace">16MHz</text>
  </svg>
);

const ESP32Board = ({ style }) => (
  <svg viewBox="0 0 160 260" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="150" height="250" rx="5" fill="#1a0800" stroke="#ff6b00" strokeWidth="1.5"/>
    <rect x="25" y="68" width="110" height="82" rx="3" fill="#0d0d0d" stroke="#ff6b00" strokeWidth="1.2"/>
    <rect x="30" y="73" width="100" height="72" rx="2" fill="#111" stroke="#333" strokeWidth=".5"/>
    <text x="80" y="107" textAnchor="middle" fill="#ff6b00" fontSize="10" fontFamily="'Share Tech Mono',monospace" fontWeight="bold">ESP32</text>
    <text x="80" y="121" textAnchor="middle" fill="#cc4400" fontSize="6.5" fontFamily="'Share Tech Mono',monospace">Xtensa LX6 | 240MHz</text>
    <text x="80" y="133" textAnchor="middle" fill="#aa3300" fontSize="6" fontFamily="'Share Tech Mono',monospace">WiFi 802.11b/g/n + BT 4.2</text>
    <path d="M 52 66 Q 80 46 108 66" stroke="#ff6b00" strokeWidth="1.5" fill="none" opacity=".7"/>
    <path d="M 57 66 Q 80 50 103 66" stroke="#ff9933" strokeWidth="1" fill="none" opacity=".5"/>
    <path d="M 63 66 Q 80 55 97 66" stroke="#ffbb66" strokeWidth=".8" fill="none" opacity=".3"/>
    {[163,175,187,199,211,223,235].map((y,i)=><rect key={i} x="0" y={y} width="10" height="6" rx="1" fill="#c8a000" opacity=".9" style={{animation:`pin-p ${1.5+i*.15}s ease-in-out infinite`}}/>)}
    {[163,175,187,199,211,223,235].map((y,i)=><rect key={i} x="150" y={y} width="10" height="6" rx="1" fill="#c8a000" opacity=".9" style={{animation:`pin-p ${1.5+i*.15}s .4s ease-in-out infinite`}}/>)}
    <circle cx="28" cy="40" r="4" fill="#0000ff" style={{animation:'led 1.5s ease-in-out infinite'}}/>
    <circle cx="42" cy="40" r="4" fill="#ff0000" style={{animation:'led 1s .3s ease-in-out infinite'}}/>
    <rect x="53" y="234" width="54" height="18" rx="2" fill="#1a1a1a" stroke="#ff6b00" strokeWidth="1"/>
    <text x="80" y="247" textAnchor="middle" fill="#ff6b00" fontSize="6" fontFamily="'Share Tech Mono',monospace">MICRO-USB</text>
    <circle cx="112" cy="40" r="5" fill="#222" stroke="#ff6b00" strokeWidth="1"/>
    <text x="112" y="55" textAnchor="middle" fill="#ff6b00" fontSize="5" fontFamily="'Share Tech Mono',monospace">BOOT</text>
    <circle cx="130" cy="40" r="5" fill="#222" stroke="#ff6b00" strokeWidth="1"/>
    <text x="130" y="55" textAnchor="middle" fill="#ff6b00" fontSize="5" fontFamily="'Share Tech Mono',monospace">EN</text>
  </svg>
);

const RaspiPico = ({ style }) => (
  <svg viewBox="0 0 210 88" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="202" height="80" rx="5" fill="#006633" stroke="#00ff88" strokeWidth="1.5"/>
    <rect x="75" y="18" width="60" height="52" rx="3" fill="#111" stroke="#00ff88" strokeWidth="1.2"/>
    <text x="105" y="41" textAnchor="middle" fill="#00ff88" fontSize="7.5" fontFamily="'Share Tech Mono',monospace" fontWeight="bold">RP2040</text>
    <text x="105" y="53" textAnchor="middle" fill="#009944" fontSize="6" fontFamily="'Share Tech Mono',monospace">133MHz Dual Core</text>
    <text x="105" y="63" textAnchor="middle" fill="#007733" fontSize="5.5" fontFamily="'Share Tech Mono',monospace">264KB SRAM</text>
    {[80,92,104,116,128,138,148].map((x,i)=><rect key={i} x={x} y="13" width="5" height="8" rx="1" fill="#c8a000" opacity=".9"/>)}
    {[80,92,104,116,128,138,148].map((x,i)=><rect key={i} x={x} y="67" width="5" height="8" rx="1" fill="#c8a000" opacity=".9"/>)}
    {[18,28,38,48,58,68].map((y,i)=><rect key={i} x="4" y={y} width="10" height="6" rx="1" fill="#c8a000" opacity=".8"/>)}
    {[18,28,38,48,58,68].map((y,i)=><rect key={i} x="196" y={y} width="10" height="6" rx="1" fill="#c8a000" opacity=".8"/>)}
    <rect x="20" y="24" width="30" height="20" rx="2" fill="#111" stroke="#00aaff" strokeWidth="1"/>
    <text x="35" y="37" textAnchor="middle" fill="#00aaff" fontSize="6.5" fontFamily="'Share Tech Mono',monospace">USB</text>
    <circle cx="57" cy="34" r="4" fill="#00ff00" style={{animation:'led 1s ease-in-out infinite'}}/>
    <rect x="152" y="24" width="30" height="16" rx="2" fill="#111" stroke="#00ff88" strokeWidth=".8"/>
    <text x="167" y="35" textAnchor="middle" fill="#009944" fontSize="5.5" fontFamily="'Share Tech Mono',monospace">2MB Flash</text>
  </svg>
);

/* ══════════════════════════════════════════════
   CIRCUIT CANVAS BACKGROUND
══════════════════════════════════════════════ */
const CircuitBg = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    }));
    const pulses = [];
    for (const n of nodes) {
      const near = nodes.filter(o => o !== n && Math.hypot(n.x-o.x, n.y-o.y) < 160).slice(0, 1);
      for (const m of near) pulses.push({ a: n, b: m, t: Math.random(), s: .003 + Math.random() * .004 });
    }
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > c.width) n.vx *= -1;
        if (n.y < 0 || n.y > c.height) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x-nodes[j].x, nodes[i].y-nodes[j].y);
          if (d < 160) { ctx.beginPath(); ctx.strokeStyle = `rgba(0,212,255,${.12*(1-d/160)})`; ctx.lineWidth=.7; ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke(); }
        }
        ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, 1.8, 0, Math.PI*2); ctx.fillStyle='rgba(0,212,255,.3)'; ctx.fill();
      }
      for (const p of pulses) {
        p.t += p.s; if (p.t > 1) p.t = 0;
        const x = p.a.x+(p.b.x-p.a.x)*p.t, y = p.a.y+(p.b.y-p.a.y)*p.t;
        ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI*2); ctx.fillStyle='rgba(0,212,255,.85)'; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:.35 }}/>;
};

/* ══════════════════════════════════════════════
   INTRO ANIMATION
══════════════════════════════════════════════ */
const Intro = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const [sparks, setSparks] = useState([]);
  const [codeLines, setCodeLines] = useState([]);
  const title = 'STM32 MASTERING';
  const lines = ['#include "stm32f4xx_hal.h"','HAL_Init();','SystemClock_Config();','MX_GPIO_Init();','MX_UART_Init();','MX_SPI_Init();','MX_I2C_Init();','while(1) { HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5); HAL_Delay(500); }'];
  const canvasRef = useRef(null);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3600),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 7200),
      setTimeout(() => onDone(), 7900),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  // code rain
  useEffect(() => {
    if (phase !== 2) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i < lines.length) { setCodeLines(p => [...p, lines[i]]); i++; }
      else clearInterval(iv);
    }, 210);
    return () => clearInterval(iv);
  }, [phase]);

  // typing
  useEffect(() => {
    if (phase !== 4) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i <= title.length) { setTyped(title.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 75);
    return () => clearInterval(iv);
  }, [phase]);

  // sparks
  useEffect(() => {
    if (phase !== 3) return;
    setSparks(Array.from({ length: 28 }, (_, i) => ({
      id: i, dx: (Math.random()-.5)*70+'px', dy: (Math.random()-.5)*70+'px',
      color: ['#00d4ff','#00ff88','#ffcc00','#ff6b00','#ffffff'][Math.floor(Math.random()*5)],
      delay: Math.random()*.6,
      x: 30+Math.random()*40, y: 30+Math.random()*40,
    })));
    setTimeout(() => setSparks([]), 1200);
  }, [phase]);

  // bg circuit
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random()*c.width, y: Math.random()*c.height,
      vx: (Math.random()-.5)*.2, vy: (Math.random()-.5)*.2,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      for (const n of nodes) { n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>c.width)n.vx*=-1; if(n.y<0||n.y>c.height)n.vy*=-1; }
      for (let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){const d=Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y);if(d<130){ctx.beginPath();ctx.strokeStyle=`rgba(0,212,255,${.13*(1-d/130)})`;ctx.lineWidth=.6;ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();}}
      for(const n of nodes){ctx.beginPath();ctx.arc(n.x,n.y,1.6,0,Math.PI*2);ctx.fillStyle='rgba(0,212,255,.28)';ctx.fill();}
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,background:'#030810',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden', opacity: phase===5?0:1, transition:'opacity .8s ease' }}>
      <canvas ref={canvasRef} style={{ position:'absolute',inset:0,pointerEvents:'none' }}/>

      {/* Phase 1-2: Boards float in */}
      {phase >= 1 && phase < 3 && (
        <div style={{ display:'flex',gap:'2.5rem',alignItems:'center',animation:'zoomIn .8s cubic-bezier(.16,1,.3,1) forwards' }}>
          {[
            [<ArduinoBoard style={{width:110,filter:'drop-shadow(0 0 16px rgba(0,102,255,.65))'}}/>,'float1 3s ease-in-out infinite','ARDUINO UNO','#0066ff'],
            [<STM32Board style={{width:130,filter:'drop-shadow(0 0 22px rgba(0,212,255,.75))',animation:'glow-p 2s ease-in-out infinite'}}/>,'float3 2.5s ease-in-out infinite','STM32 NUCLEO','#00d4ff'],
            [<ESP32Board style={{width:100,filter:'drop-shadow(0 0 16px rgba(255,107,0,.65))'}}/>,'float2 3.5s ease-in-out infinite','ESP32 DEVKIT','#ff6b00'],
          ].map(([board,anim,label,color],i)=>(
            <div key={i} style={{animation:anim,textAlign:'center'}}>
              {board}
              <div style={{marginTop:8,fontFamily:"'Share Tech Mono',monospace",fontSize:9,color,letterSpacing:2}}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Phase 2: Code rain */}
      {phase === 2 && (
        <div style={{ position:'absolute',bottom:'6%',left:'50%',transform:'translateX(-50%)',width:'min(520px,90vw)',fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:'rgba(0,212,255,.6)',lineHeight:2.1,letterSpacing:1 }}>
          {codeLines.map((line, i) => (
            <div key={i} style={{ opacity:1,transition:'all .3s',display:'flex',alignItems:'center',gap:8 }}>
              <span style={{color:'#00ff88',minWidth:14}}>&gt;</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      )}

      {/* Phase 3: Sparks */}
      {phase === 3 && (
        <>
          <div style={{ animation:'zoomIn .5s cubic-bezier(.16,1,.3,1) forwards' }}>
            <STM32Board style={{ width:180, filter:'drop-shadow(0 0 32px rgba(0,212,255,.95))', animation:'glow-p 1s ease-in-out infinite' }}/>
          </div>
          {sparks.map(s => (
            <div key={s.id} style={{ position:'absolute',left:`${s.x}%`,top:`${s.y}%`,width:6,height:6,borderRadius:'50%',background:s.color,boxShadow:`0 0 10px ${s.color}`, '--dx':s.dx,'--dy':s.dy, animation:`spark .9s ease ${s.delay}s forwards`, pointerEvents:'none' }}/>
          ))}
        </>
      )}

      {/* Phase 4+: Title */}
      {phase >= 4 && (
        <div style={{ textAlign:'center', animation:'fadeUp .6s ease forwards' }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(2rem,6vw,4.2rem)',fontWeight:900,color:'#00d4ff',letterSpacing:4,textShadow:'0 0 30px rgba(0,212,255,.8),0 0 60px rgba(0,212,255,.4)', animation:'neon 4s ease 1s infinite',lineHeight:1.2 }}>
            {typed}<span style={{ color:'#00ff88',animation:'blink 1s step-end infinite' }}>|</span>
          </div>
          <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(1rem,2.5vw,1.6rem)',color:'#ff6b00',letterSpacing:6,marginTop:10,textShadow:'0 0 18px rgba(255,107,0,.7)',opacity:typed.length>6?1:0,transition:'opacity .5s' }}>
            WORKSHOP 2025
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'rgba(0,212,255,.45)',letterSpacing:4,marginTop:20,animation:'fadeIn .5s ease .8s both' }}>SYSTEM BOOT COMPLETE</div>
          <div style={{ width:220,height:2,background:'rgba(0,212,255,.15)',margin:'16px auto 0',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:0,left:0,height:'100%',background:'linear-gradient(90deg,transparent,#00d4ff,#00ff88)',animation:'progressBar 1.5s ease forwards',width:'100%' }}/>
          </div>
          {/* Mini orbit */}
          <div style={{ position:'relative',width:200,height:200,margin:'16px auto 0' }}>
            <STM32Board style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:65,filter:'drop-shadow(0 0 18px rgba(0,212,255,.9))' }}/>
            <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'orbit 3s linear infinite' }}>
              <ArduinoBoard style={{ width:32,filter:'drop-shadow(0 0 8px rgba(0,102,255,.7))' }}/>
            </div>
            <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'orbit2 4s linear infinite' }}>
              <ESP32Board style={{ width:28,filter:'drop-shadow(0 0 8px rgba(255,107,0,.7))' }}/>
            </div>
          </div>
        </div>
      )}

      {/* Corners */}
      {[[{top:16,left:16},{borderTop:'2px solid rgba(0,212,255,.4)',borderLeft:'2px solid rgba(0,212,255,.4)'}],[{top:16,right:16},{borderTop:'2px solid rgba(0,212,255,.4)',borderRight:'2px solid rgba(0,212,255,.4)'}],[{bottom:16,left:16},{borderBottom:'2px solid rgba(0,212,255,.4)',borderLeft:'2px solid rgba(0,212,255,.4)'}],[{bottom:16,right:16},{borderBottom:'2px solid rgba(0,212,255,.4)',borderRight:'2px solid rgba(0,212,255,.4)'}]].map(([pos,border],i)=>(
        <div key={i} style={{ position:'absolute',...pos,width:28,height:28,...border }}/>
      ))}

      <button onClick={onDone} style={{ position:'absolute',bottom:20,right:20,background:'transparent',border:'1px solid rgba(0,212,255,.2)',color:'rgba(0,212,255,.35)',fontFamily:"'Share Tech Mono',monospace",fontSize:10,padding:'5px 12px',cursor:'pointer',letterSpacing:2 }}>SKIP ›</button>
    </div>
  );
};

/* ══════════════════════════════════════════════
   TOAST SYSTEM
══════════════════════════════════════════════ */
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type='info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{ position:'fixed',top:74,right:16,zIndex:600,display:'flex',flexDirection:'column',gap:8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background:'#0a1525',borderLeft:`3px solid ${t.type==='success'?'var(--accent)':t.type==='error'?'var(--danger)':'var(--primary)'}`,padding:'10px 16px',fontFamily:"'Share Tech Mono',monospace",fontSize:13,color:'var(--text)',maxWidth:320,animation:'slideIn .3s ease',boxShadow:'0 4px 24px rgba(0,0,0,.5)',display:'flex',alignItems:'center',gap:8 }}>
            {t.type==='success'?'✅':t.type==='error'?'❌':'ℹ️'} {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

/* ══════════════════════════════════════════════
   NAV
══════════════════════════════════════════════ */
const Nav = ({ page, setPage }) => (
  <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 24px',background:'rgba(3,8,16,.93)',backdropFilter:'blur(14px)',borderBottom:'1px solid var(--border)' }}>
    <div onClick={() => setPage('hero')} style={{ fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,color:'var(--primary)',letterSpacing:2,cursor:'pointer',textShadow:'0 0 12px rgba(0,212,255,.5)' }}>⚡ STM32 WORKSHOP</div>
    <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
      {[['hero','HOME'],['register','REGISTER'],['admin','ADMIN']].map(([id,label])=>(
        <button key={id} onClick={() => setPage(id)} style={{ background:page===id?'rgba(0,212,255,.1)':'transparent',border:`1px solid ${page===id?'var(--primary)':'var(--border)'}`,color:page===id?'var(--primary)':'var(--muted)',fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,letterSpacing:2,padding:'5px 14px',cursor:'pointer',transition:'all .3s' }}>{label}</button>
      ))}
    </div>
  </nav>
);

/* ══════════════════════════════════════════════
   SHARED STYLE HELPERS
══════════════════════════════════════════════ */
const inp = (props) => ({
  background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)',
  fontFamily:"'Rajdhani',sans-serif", fontSize:16, padding:'11px 14px',
  outline:'none', width:'100%', transition:'border-color .3s, box-shadow .3s', ...props
});
const focusStyle = { borderColor:'var(--primary)', boxShadow:'0 0 0 1px var(--primary)' };
const blurStyle  = { borderColor:'var(--border)', boxShadow:'none' };

const Label = ({ children, required }) => (
  <label style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--primary)',letterSpacing:2,textTransform:'uppercase',display:'block',marginBottom:6 }}>
    {children}{required && ' *'}
  </label>
);

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
const Hero = ({ setPage }) => {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const s = d => ({ opacity:vis?1:0, transform:vis?'translateY(0)':'translateY(24px)', transition:`all .7s ease ${d}s` });

  return (
    <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'6rem 2rem 4rem',textAlign:'center',position:'relative',zIndex:1 }}>
      {/* Floating board decorations */}
      <div style={{ position:'absolute',top:'8%',left:'1%',opacity:.12,pointerEvents:'none',animation:'float1 4s ease-in-out infinite' }}><ArduinoBoard style={{width:130}}/></div>
      <div style={{ position:'absolute',top:'18%',right:'1%',opacity:.12,pointerEvents:'none',animation:'float2 5s ease-in-out infinite' }}><ESP32Board style={{width:110}}/></div>
      <div style={{ position:'absolute',bottom:'5%',left:'2%',opacity:.08,pointerEvents:'none',animation:'float3 6s ease-in-out infinite' }}><RaspiPico style={{width:170}}/></div>
      <div style={{ position:'absolute',bottom:'12%',right:'2%',opacity:.1,pointerEvents:'none',animation:'float1 5.5s ease-in-out .5s infinite' }}><STM32Board style={{width:100}}/></div>

      <div style={s(.1)}>
        <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--accent)',letterSpacing:4,border:'1px solid var(--accent)',padding:'5px 16px',display:'inline-block',position:'relative',overflow:'hidden' }}>
          <span style={{ position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(0,255,136,.1),transparent)',animation:'scanH 2s linear infinite' }}/>
          ⚡ EXECUTIVE HANDS-ON PROGRAM
        </span>
      </div>

      <div style={{ ...s(.2),fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--muted)',letterSpacing:3,marginTop:14 }}>IOT CENTERS OF EXCELLENCE • CHENNAI INSTITUTE OF TECHNOLOGY</div>

      <div style={{ ...s(.3),marginTop:16 }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(2.6rem,7vw,5.2rem)',fontWeight:900,color:'var(--primary)',textShadow:'0 0 30px rgba(0,212,255,.6)',animation:'neon 6s ease 2s infinite',lineHeight:1.1 }}>STM32 MASTERING</div>
        <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(1rem,3vw,1.8rem)',color:'var(--secondary)',textShadow:'0 0 18px rgba(255,107,0,.6)',letterSpacing:6,marginTop:8 }}>WORKSHOP 2025</div>
      </div>

      <div style={{ ...s(.5),color:'var(--muted)',fontSize:15,maxWidth:580,lineHeight:1.9,margin:'20px 0',fontWeight:300,letterSpacing:.4 }}>
        Roadmap to Secure an Embedded Placement. A professionally designed hands-on training<br/>experience mastering STM32 development & building your Embedded Systems career.
      </div>

      <div style={{ ...s(.6),display:'flex',gap:'2rem',flexWrap:'wrap',justifyContent:'center',marginBottom:20 }}>
        {[['📅','March 5 & 6, 2025'],['⏰','9:00 AM – 3:00 PM'],['📍','Chennai Institute of Technology']].map(([ic,tx])=>(
          <div key={tx} style={{ display:'flex',alignItems:'center',gap:8,fontFamily:"'Share Tech Mono',monospace",fontSize:12 }}><span>{ic}</span><span>{tx}</span></div>
        ))}
      </div>

      <div style={{ ...s(.7),display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))',gap:10,maxWidth:720,width:'100%',marginBottom:24 }}>
        {['🔧 Hands-On STM32 Dev Board','⚙️ Bare Metal Programming','🏗️ STM32 HAL Architecture','📡 UART | SPI | I2C Protocols','🔌 Peripheral Interfacing','🎯 Embedded Career Roadmap'].map(h=>(
          <div key={h} style={{ background:'var(--card)',border:'1px solid var(--border)',borderLeft:'2px solid var(--primary)',padding:'10px 14px',fontSize:13,color:'var(--muted)',fontFamily:"'Share Tech Mono',monospace",transition:'all .3s',cursor:'default' }}
            onMouseEnter={e=>{e.currentTarget.style.color='var(--text)';e.currentTarget.style.background='rgba(0,212,255,.07)';}}
            onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)';e.currentTarget.style.background='var(--card)';}}
          >{h}</div>
        ))}
      </div>

      <div style={{ ...s(.85),display:'flex',gap:18,marginBottom:24,flexWrap:'wrap',justifyContent:'center' }}>
        {[['₹699','Without Kit','var(--primary)',false,''],['₹1200','With Complete Kit','var(--secondary)',true,'STM32 Board + Starter Peripherals']].map(([price,label,color,feat,sub])=>(
          <div key={price} style={{ background:feat?'rgba(255,107,0,.07)':'var(--card)',border:`1px solid ${feat?'var(--secondary)':'var(--border)'}`,padding:'20px 28px',textAlign:'center',minWidth:165,position:'relative',transition:'transform .3s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
          >
            {feat&&<div style={{ position:'absolute',top:7,right:7,background:'var(--secondary)',color:'#000',fontSize:8,fontWeight:700,padding:'2px 6px',letterSpacing:1 }}>BEST</div>}
            <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:26,fontWeight:700,color }}>{price}</div>
            <div style={{ fontSize:13,color:'var(--muted)',marginTop:5,fontFamily:"'Share Tech Mono',monospace" }}>{label}</div>
            {sub&&<div style={{ fontSize:10,color:'var(--muted)',marginTop:4,opacity:.7,fontFamily:"'Share Tech Mono',monospace" }}>{sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ ...s(.9),fontSize:12,color:'var(--accent)',fontFamily:"'Share Tech Mono',monospace",marginBottom:22 }}>🎁 Certificate • Refreshments • Performance-Based Awards</div>

      <button onClick={() => setPage('register')} style={{ ...s(1),fontFamily:"'Orbitron',sans-serif",fontSize:15,fontWeight:700,letterSpacing:3,color:'#000',background:'linear-gradient(135deg,var(--primary),var(--accent))',border:'none',padding:'16px 52px',cursor:'pointer',clipPath:'polygon(14px 0,100% 0,calc(100% - 14px) 100%,0 100%)',transition:'all .3s',position:'relative',overflow:'hidden' }}
        onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.04)';e.currentTarget.style.boxShadow='0 0 32px rgba(0,212,255,.5)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='none';}}
      >
        <span style={{ position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)',animation:'scanH 2s linear infinite' }}/>
        ⚡ REGISTER NOW →
      </button>

      <div style={{ ...s(1.1),marginTop:28,fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--muted)' }}>
        COORDINATOR: <span style={{color:'var(--primary)'}}>Edward Paul Raj</span> &nbsp;•&nbsp; 📞 <span style={{color:'var(--primary)'}}>9894923662</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   REGISTRATION — STEP 1
══════════════════════════════════════════════ */
const Step1 = ({ onSuccess }) => {
  const toast = useToast();
  const [form, setForm] = useState({ firstName:'',lastName:'',email:'',mobile:'',degree:'',specialisation:'',college:'',year:'',referral:'',kit:'no-kit' });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    const req = ['firstName','lastName','email','mobile','degree','specialisation','college'];
    for (const k of req) if (!form[k].trim()) { toast('Fill all required fields.', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast('Invalid email address.', 'error'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resumeFile) fd.append('resume', resumeFile);
      const res = await fetch(`${API}/api/register/step1`, { method:'POST', body:fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      toast('Step 1 complete! Now complete the payment.', 'success');
      onSuccess({ ...data, firstName:form.firstName, lastName:form.lastName, email:form.email, kit:form.kit, amount:data.amount });
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, id, type='text', placeholder='', required=true, colSpan=false, children }) => (
    <div style={{ ...(colSpan ? { gridColumn:'1 / -1' } : {}) }}>
      <Label required={required}>{label}</Label>
      {children || <input type={type} value={form[id]} onChange={e=>set(id,e.target.value)} placeholder={placeholder}
        style={inp()} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}/>}
    </div>
  );

  const Sel = ({ label, id, opts, required=true }) => (
    <div>
      <Label required={required}>{label}</Label>
      <select value={form[id]} onChange={e=>set(id,e.target.value)}
        style={{ ...inp(), cursor:'pointer', background:'#060d1a' }}
        onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}
      >
        {opts.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>
        <Field label="First Name" id="firstName" placeholder="Enter first name"/>
        <Field label="Last Name" id="lastName" placeholder="Enter last name"/>
        <Field label="Email Address" id="email" type="email" placeholder="your@email.com"/>
        <Field label="Mobile Number" id="mobile" type="tel" placeholder="+91 XXXXX XXXXX"/>
        <Sel label="Degree" id="degree" opts={[['','Select Degree'],'B.E.','B.Tech','M.E.','M.Tech','MBA','MCA','Other']}/>
        <Field label="Specialisation" id="specialisation" placeholder="ECE, EEE, CSE..."/>
        <Field label="College Name" id="college" placeholder="Your institution name" colSpan/>
        <Field label="Referral Code" id="referral" placeholder="Optional referral code" required={false}/>
        <Sel label="Year of Study" id="year" opts={[['','Select Year'],'1st Year','2nd Year','3rd Year','4th Year','Post Graduate']} required={false}/>

        {/* Resume upload */}
        <div style={{ gridColumn:'1 / -1' }}>
          <Label>Resume (Optional)</Label>
          <div onClick={()=>document.getElementById('resume-inp').click()} style={{ border:'2px dashed var(--border)',padding:'26px',textAlign:'center',cursor:'pointer',transition:'all .3s',background:'var(--card)' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--primary)';e.currentTarget.style.background='rgba(0,212,255,.04)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--card)';}}
          >
            <div style={{ fontSize:28,marginBottom:6 }}>📄</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:resumeFile?'var(--accent)':'var(--muted)' }}>{resumeFile?.name||'DROP RESUME OR CLICK TO BROWSE'}</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--muted)',marginTop:4,opacity:.5 }}>PDF, DOC, DOCX • Max 5MB</div>
            <input id="resume-inp" type="file" accept=".pdf,.doc,.docx" onChange={e=>setResumeFile(e.target.files[0]||null)}/>
          </div>
        </div>

        {/* Kit selector */}
        <div style={{ gridColumn:'1 / -1' }}>
          <Label required>Registration Type</Label>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            {[['no-kit','₹699','Without Kit','var(--primary)',false,''],['with-kit','₹1200','With Complete Kit','var(--secondary)',true,'STM32 Board + Starter Peripherals Included']].map(([val,price,label,color,feat,sub])=>(
              <div key={val} onClick={()=>set('kit',val)} style={{ background:form.kit===val?(feat?'rgba(255,107,0,.1)':'rgba(0,212,255,.08)'):'var(--card)',border:`2px solid ${form.kit===val?color:'var(--border)'}`,padding:'18px',textAlign:'center',cursor:'pointer',transition:'all .3s',position:'relative' }}>
                {feat&&<div style={{ position:'absolute',top:6,right:6,background:'var(--secondary)',color:'#000',fontSize:8,fontWeight:700,padding:'2px 5px',letterSpacing:1 }}>RECOMMENDED</div>}
                <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:form.kit===val?color:'var(--muted)' }}>{price}</div>
                <div style={{ fontSize:12,color:'var(--muted)',marginTop:4,fontFamily:"'Share Tech Mono',monospace" }}>{label}</div>
                {sub&&<div style={{ fontSize:9,color:'var(--muted)',marginTop:3,fontFamily:"'Share Tech Mono',monospace",opacity:.6 }}>{sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ margin:'20px 0',padding:'12px 16px',border:'1px solid rgba(0,212,255,.1)',background:'var(--card)',fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--muted)',lineHeight:2 }}>
        <span style={{color:'var(--accent)'}}>✓ INCLUDED:</span> Certificate of Participation • Refreshments • Performance-Based Awards
      </div>

      <button onClick={submit} disabled={loading} style={{ width:'100%',fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,letterSpacing:3,color:'#000',background:loading?'rgba(0,212,255,.4)':'linear-gradient(135deg,var(--primary),var(--accent))',border:'none',padding:'15px',cursor:loading?'not-allowed':'pointer',clipPath:'polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%)',transition:'all .3s',marginTop:8,position:'relative',overflow:'hidden' }}
        onMouseEnter={e=>{if(!loading)e.currentTarget.style.boxShadow='0 0 24px rgba(0,212,255,.5)';}}
        onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
      >
        {loading ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}><span style={{width:16,height:16,border:'2px solid rgba(0,0,0,.3)',borderTopColor:'#000',borderRadius:'50%',display:'inline-block',animation:'spin .8s linear infinite'}}/>SAVING...</span> : 'CONTINUE TO PAYMENT →'}
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════
   QR + PAYMENT STEP
══════════════════════════════════════════════ */
const PaymentStep = ({ regData, onSuccess }) => {
  const toast = useToast();
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [loading, setLoading] = useState(false);
  const qrRef = useRef(null);

  // Generate QR as image via free API (no lib needed)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(regData.qrPayload)}&format=png&ecc=M`;

  // UPI deep link for GPay / PhonePe / Paytm
  const upiLink = `upi://pay?pa=${encodeURIComponent(regData.upiId)}&pn=${encodeURIComponent(regData.upiName)}&am=${regData.amount}&cu=INR&tn=${encodeURIComponent('STM32 Workshop ' + regData.regId)}`;
  const upiQr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&format=png&ecc=M`;

  const submit = async () => {
    if (!txnId.trim()) { toast('Enter your Transaction / UTR ID.', 'error'); return; }
    if (!screenshot)   { toast('Upload payment screenshot.', 'error'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('regId', regData.regId);
      fd.append('transactionId', txnId.trim());
      fd.append('paymentScreenshot', screenshot);
      const res  = await fetch(`${API}/api/register/step2`, { method:'POST', body:fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      toast('Payment submitted! Check your email.', 'success');
      onSuccess(data);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation:'fadeUp .5s ease' }}>
      {/* Reg ID banner */}
      <div style={{ background:'rgba(0,212,255,.05)',border:'1px solid rgba(0,212,255,.2)',padding:'14px 20px',textAlign:'center',marginBottom:24,position:'relative',overflow:'hidden' }}>
        <span style={{ position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(0,212,255,.06),transparent)',animation:'scanH 3s linear infinite' }}/>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--muted)',letterSpacing:3,marginBottom:4 }}>YOUR REGISTRATION ID</div>
        <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:20,color:'var(--primary)',fontWeight:700,textShadow:'var(--glow)' }}>{regData.regId}</div>
        <div style={{ fontSize:12,color:'var(--muted)',marginTop:4,fontFamily:"'Share Tech Mono',monospace" }}>
          {regData.firstName} {regData.lastName} &nbsp;|&nbsp; {regData.kit === 'with-kit' ? '₹1200 – With Kit' : '₹699 – Without Kit'}
        </div>
      </div>

      {/* QR + UPI payment side by side */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:28 }}>
        {/* Registration QR */}
        <div style={{ background:'var(--card)',border:'1px solid var(--border)',padding:'20px',textAlign:'center' }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--accent)',letterSpacing:3,marginBottom:12 }}>YOUR ENTRY QR CODE</div>
          <div style={{ background:'white',padding:8,display:'inline-block',marginBottom:10 }}>
            <img ref={qrRef} src={qrSrc} alt="Registration QR" style={{ width:170,height:170,display:'block' }}/>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--muted)',lineHeight:1.7 }}>
            📌 Save this QR — it's<br/>your workshop entry pass
          </div>
        </div>

        {/* UPI QR + info */}
        <div style={{ background:'rgba(255,107,0,.04)',border:'1px solid rgba(255,107,0,.2)',padding:'20px',textAlign:'center' }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--secondary)',letterSpacing:3,marginBottom:12 }}>SCAN TO PAY — UPI</div>
          <div style={{ background:'white',padding:8,display:'inline-block',marginBottom:10 }}>
            <img src={upiQr} alt="UPI QR" style={{ width:170,height:170,display:'block' }}/>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--secondary)',fontWeight:700,marginBottom:4 }}>
            ₹{regData.amount.toLocaleString('en-IN')}
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--muted)',lineHeight:1.8 }}>
            UPI ID: <span style={{color:'var(--text)'}}>{regData.upiId}</span><br/>
            {regData.upiName}<br/>
            <span style={{opacity:.6}}>GPay • PhonePe • Paytm • BHIM</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ background:'rgba(0,212,255,.03)',border:'1px solid rgba(0,212,255,.1)',padding:'16px 20px',marginBottom:24 }}>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--muted)',letterSpacing:3,marginBottom:12 }}>PAYMENT STEPS</div>
        {['Scan the UPI QR or pay to the UPI ID shown above','Complete the payment of ₹'+regData.amount+' from any UPI app','Copy the Transaction / UTR ID from your payment app','Upload a screenshot of the payment confirmation','Submit below — we\'ll send a confirmation email within 24hrs'].map((step,i)=>(
          <div key={i} style={{ display:'flex',gap:12,alignItems:'flex-start',marginBottom:10 }}>
            <div style={{ width:22,height:22,borderRadius:'50%',background:'rgba(0,212,255,.15)',border:'1px solid var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',monospace",fontSize:10,color:'var(--primary)',flexShrink:0 }}>{i+1}</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--muted)',lineHeight:1.6,paddingTop:2 }}>{step}</div>
          </div>
        ))}
      </div>

      {/* Transaction ID */}
      <div style={{ marginBottom:18 }}>
        <Label required>Transaction / UTR ID</Label>
        <input type="text" value={txnId} onChange={e=>setTxnId(e.target.value)} placeholder="Enter 12-digit UTR or Transaction ID"
          style={inp()} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}/>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--muted)',marginTop:5 }}>Find this in your UPI app under payment history / transaction details</div>
      </div>

      {/* Screenshot upload */}
      <div style={{ marginBottom:22 }}>
        <Label required>Payment Screenshot</Label>
        <div onClick={()=>document.getElementById('pay-ss').click()} style={{ border:'2px dashed var(--border)',padding:'24px',textAlign:'center',cursor:'pointer',transition:'all .3s',background:'var(--card)' }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--secondary)';e.currentTarget.style.background='rgba(255,107,0,.04)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--card)';}}
        >
          {screenshot ? (
            <div>
              <div style={{ fontSize:28,marginBottom:6 }}>🖼️</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--accent)' }}>{screenshotName}</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--muted)',marginTop:4 }}>Click to change</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:28,marginBottom:6 }}>📸</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--muted)' }}>UPLOAD PAYMENT SCREENSHOT</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--muted)',marginTop:4,opacity:.5 }}>JPG, PNG, PDF • Max 8MB</div>
            </div>
          )}
          <input id="pay-ss" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={e=>{const f=e.target.files[0];if(f){setScreenshot(f);setScreenshotName(f.name);}}}/>
        </div>
      </div>

      <button onClick={submit} disabled={loading} style={{ width:'100%',fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,letterSpacing:3,color:'#000',background:loading?'rgba(255,107,0,.4)':'linear-gradient(135deg,var(--secondary),#ff9900)',border:'none',padding:'15px',cursor:loading?'not-allowed':'pointer',clipPath:'polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%)',transition:'all .3s',position:'relative',overflow:'hidden' }}
        onMouseEnter={e=>{if(!loading)e.currentTarget.style.boxShadow='0 0 24px rgba(255,107,0,.5)';}}
        onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
      >
        {loading ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}><span style={{width:16,height:16,border:'2px solid rgba(0,0,0,.3)',borderTopColor:'#000',borderRadius:'50%',display:'inline-block',animation:'spin .8s linear infinite'}}/>SUBMITTING...</span> : '✅ SUBMIT PAYMENT DETAILS'}
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════
   SUCCESS SCREEN
══════════════════════════════════════════════ */
const SuccessScreen = ({ regData, setPage }) => (
  <div style={{ textAlign:'center',padding:'2rem 0',animation:'fadeUp .6s ease' }}>
    <div style={{ fontSize:60,animation:'pulse 1.5s ease infinite',marginBottom:16 }}>🎉</div>
    <h2 style={{ fontFamily:"'Orbitron',sans-serif",color:'var(--accent)',fontSize:24,textShadow:'0 0 20px rgba(0,255,136,.5)',marginBottom:10 }}>PAYMENT SUBMITTED!</h2>
    <p style={{ color:'var(--muted)',fontSize:15,lineHeight:1.8,maxWidth:440,margin:'0 auto 20px' }}>
      Your payment details have been received.<br/>Our team will verify within <strong style={{color:'var(--primary)'}}>24 hours</strong>.<br/>A confirmation email has been sent to your inbox.
    </p>
    <div style={{ background:'rgba(0,255,136,.06)',border:'1px solid rgba(0,255,136,.2)',padding:'18px',fontFamily:"'Share Tech Mono',monospace",fontSize:13,color:'var(--accent)',marginBottom:24,display:'inline-block' }}>
      <div style={{ fontSize:10,color:'var(--muted)',letterSpacing:3,marginBottom:6 }}>YOUR REGISTRATION ID</div>
      <div style={{ fontSize:20,fontFamily:"'Orbitron',sans-serif",color:'var(--primary)' }}>{regData.regId}</div>
    </div>
    <div style={{ marginBottom:10 }}>
      {[['📅','Date','March 5 & 6, 2025'],['⏰','Time','9:00 AM – 3:00 PM'],['📍','Venue','Chennai Institute of Technology'],['📧','Confirmation','Check your email inbox']].map(([ic,label,val])=>(
        <div key={label} style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(0,212,255,.06)',fontFamily:"'Share Tech Mono',monospace",fontSize:12,maxWidth:380,margin:'0 auto' }}>
          <span style={{color:'var(--muted)'}}>{ic} {label}</span>
          <span style={{color:'var(--text)'}}>{val}</span>
        </div>
      ))}
    </div>
    <div style={{ margin:'24px 0 0',display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
      <button onClick={() => setPage('hero')} style={{ fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,color:'var(--primary)',background:'transparent',border:'1px solid var(--primary)',padding:'10px 22px',cursor:'pointer',transition:'all .3s' }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(0,212,255,.1)'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
      >← HOME</button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   REGISTER PAGE (Orchestrator)
══════════════════════════════════════════════ */
const Register = ({ setPage }) => {
  const [step, setStep]       = useState(1); // 1 | 2 | 3
  const [step1Data, setStep1] = useState(null);
  const [finalData, setFinal] = useState(null);

  const stepLabels = ['PERSONAL DETAILS', 'PAYMENT', 'CONFIRMED'];

  return (
    <div style={{ minHeight:'100vh',padding:'7rem 2rem 4rem',position:'relative',zIndex:1 }}>
      <div style={{ maxWidth:700,margin:'0 auto' }}>
        {/* Page header */}
        <div style={{ textAlign:'center',marginBottom:36 }}>
          <h2 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:26,color:'var(--primary)',textShadow:'var(--glow)',marginBottom:8 }}>REGISTRATION</h2>
          <p style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--muted)',letterSpacing:2 }}>
            &gt; STM32 MASTERING WORKSHOP // MARCH 5 & 6, 2025<span style={{animation:'blink 1s step-end infinite',color:'var(--primary)'}}>_</span>
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display:'flex',alignItems:'center',marginBottom:36 }}>
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const active = step === n, done = step > n;
            return (
              <div key={n} style={{ display:'flex',alignItems:'center',flex:1 }}>
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flex:'none' }}>
                  <div style={{ width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,border:`2px solid ${done?'var(--accent)':active?'var(--primary)':'var(--border)'}`,background:done?'rgba(0,255,136,.15)':active?'rgba(0,212,255,.12)':'transparent',color:done?'var(--accent)':active?'var(--primary)':'var(--muted)',transition:'all .4s',animation:active?'stepPulse 2s ease infinite':'' }}>
                    {done ? '✓' : n}
                  </div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:done?'var(--accent)':active?'var(--primary)':'var(--muted)',letterSpacing:1,marginTop:5,whiteSpace:'nowrap' }}>{label}</div>
                </div>
                {i < stepLabels.length - 1 && (
                  <div style={{ flex:1,height:2,margin:'0 8px 16px',background:done?'var(--accent)':'var(--border)',transition:'background .4s' }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        {step === 1 && <Step1 onSuccess={data => { setStep1(data); setStep(2); }}/>}
        {step === 2 && <PaymentStep regData={step1Data} onSuccess={data => { setFinal({ ...step1Data, ...data }); setStep(3); }}/>}
        {step === 3 && <SuccessScreen regData={finalData} setPage={setPage}/>}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════════ */
const Admin = () => {
  const toast = useToast();
  const [token, setToken]     = useState('');
  const [user, setUser]       = useState('');
  const [pass, setPass]       = useState('');
  const [err, setErr]         = useState('');
  const [loginLoad, setLL]    = useState(false);
  const [data, setData]       = useState({ docs:[], total:0, totalPages:1, page:1 });
  const [stats, setStats]     = useState({});
  const [search, setSearch]   = useState('');
  const [fStatus, setFS]      = useState('');
  const [fKit, setFK]         = useState('');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLL(true); setErr('');
    try {
      const res  = await fetch(`${API}/api/admin/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username:user, password:pass }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setToken(json.token);
      toast('Welcome, Admin!', 'success');
    } catch (e) {
      setErr(e.message);
    } finally {
      setLL(false);
    }
  };

  const fetchData = useCallback(async (pg=1) => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page:pg, limit:15, search, status:fStatus, kit:fKit });
      const [regRes, statRes] = await Promise.all([
        fetch(`${API}/api/admin/registrations?${params}`, { headers:{ Authorization:`Bearer ${token}` } }),
        fetch(`${API}/api/admin/stats`, { headers:{ Authorization:`Bearer ${token}` } }),
      ]);
      const [regJson, statJson] = await Promise.all([regRes.json(), statRes.json()]);
      if (!regRes.ok) throw new Error(regJson.error);
      setData(regJson);
      setStats(statJson);
    } catch (e) {
      if (e.message.includes('token')) { setToken(''); toast('Session expired. Please login again.', 'error'); }
      else toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [token, search, fStatus, fKit]);

  useEffect(() => { if (token) { setPage(1); fetchData(1); } }, [token, search, fStatus, fKit]);

  const exportCSV = () => {
    const url = `${API}/api/admin/export?status=${fStatus}&kit=${fKit}`;
    window.open(`${url}&token=${token}`, '_blank');
    // Alternatively: fetch with auth header and trigger download
    fetch(url, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.blob())
      .then(b => { const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='stm32_registrations.csv'; a.click(); });
    toast('Exporting CSV...', 'info');
  };

  const verify = async (regId) => {
    try {
      const res = await fetch(`${API}/api/admin/verify/${regId}`, { method:'PATCH', headers:{ Authorization:`Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast('Registration verified!', 'success');
      fetchData(page);
    } catch (e) { toast(e.message, 'error'); }
  };

  const resendMail = async (regId) => {
    try {
      const res = await fetch(`${API}/api/admin/resend-mail/${regId}`, { method:'POST', headers:{ Authorization:`Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast('Mail resent!', 'success');
    } catch (e) { toast(e.message, 'error'); }
  };

  // Login screen
  if (!token) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'6rem 2rem',position:'relative',zIndex:1 }}>
      <div style={{ width:'100%',maxWidth:400,background:'var(--card)',border:'1px solid var(--border)',padding:'2.5rem',textAlign:'center',animation:'fadeUp .5s ease' }}>
        <div style={{ fontSize:40,marginBottom:14 }}>🔐</div>
        <h2 style={{ fontFamily:"'Orbitron',sans-serif",color:'var(--primary)',fontSize:18,textShadow:'var(--glow)',marginBottom:6 }}>ADMIN ACCESS</h2>
        <p style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--muted)',marginBottom:22,letterSpacing:2 }}>AUTHORIZED PERSONNEL ONLY</p>
        {[['Username',user,setUser,'text'],['Password',pass,setPass,'password']].map(([ph,val,set,type])=>(
          <input key={ph} type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} onKeyDown={e=>e.key==='Enter'&&login()}
            style={{ ...inp(),marginBottom:12,display:'block' }} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}/>
        ))}
        <button onClick={login} disabled={loginLoad} style={{ width:'100%',fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,letterSpacing:2,color:'#000',background:'linear-gradient(135deg,var(--primary),var(--accent))',border:'none',padding:'11px',cursor:'pointer',transition:'opacity .3s' }}>
          {loginLoad?'AUTHENTICATING...':'AUTHENTICATE →'}
        </button>
        <div style={{ color:'var(--danger)',fontFamily:"'Share Tech Mono',monospace",fontSize:11,marginTop:10,minHeight:18 }}>{err}</div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const map = { step1_done:['var(--muted)','var(--border)','PENDING PAYMENT'], step2_done:['var(--secondary)','rgba(255,107,0,.3)','PAYMENT SUBMITTED'], verified:['var(--accent)','rgba(0,255,136,.25)','✓ VERIFIED'] };
    const [color,bg,label] = map[status] || ['var(--muted)','var(--border)',status];
    return <span style={{ display:'inline-flex',alignItems:'center',gap:4,fontFamily:"'Share Tech Mono',monospace",fontSize:9,padding:'3px 8px',border:`1px solid ${bg}`,color,background:bg.includes('rgba')?bg:'transparent',letterSpacing:1,whiteSpace:'nowrap' }}><span style={{width:5,height:5,borderRadius:'50%',background:color}}/>  {label}</span>;
  };

  return (
    <div style={{ minHeight:'100vh',padding:'7rem 2rem 4rem',position:'relative',zIndex:1 }}>
      <div style={{ maxWidth:1200,margin:'0 auto' }}>
        {/* Header */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:26,flexWrap:'wrap',gap:12 }}>
          <div>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif",color:'var(--primary)',fontSize:20,textShadow:'var(--glow)' }}>ADMIN DASHBOARD</h2>
            <p style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--muted)',marginTop:4,letterSpacing:2 }}>STM32 MASTERING WORKSHOP • MARCH 5 & 6, 2025</p>
          </div>
          <div style={{ display:'flex',gap:8 }}>
            <button onClick={() => fetchData(page)} style={{ background:'transparent',border:'1px solid var(--border)',color:'var(--muted)',fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,padding:'6px 14px',cursor:'pointer',letterSpacing:1 }}>↻ REFRESH</button>
            <button onClick={() => setToken('')} style={{ background:'transparent',border:'1px solid var(--danger)',color:'var(--danger)',fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,padding:'6px 14px',cursor:'pointer',letterSpacing:1 }}>LOGOUT</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,marginBottom:24 }}>
          {[['Total Registrations',stats.total||0,'var(--primary)'],['Payment Submitted',stats.paymentSubmitted||0,'var(--secondary)'],['Verified',stats.verified||0,'var(--accent)'],['With Kit',stats.withKit||0,'#ffcc00'],['Without Kit',stats.noKit||0,'var(--muted)'],['Est. Revenue','₹'+(stats.revenue||0).toLocaleString('en-IN'),'var(--primary)']].map(([label,val,color])=>(
            <div key={label} style={{ background:'var(--card)',border:'1px solid var(--border)',padding:'18px',position:'relative',overflow:'hidden',transition:'border-color .3s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={{ position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)` }}/>
              <div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:26,fontWeight:900,color,lineHeight:1 }}>{val}</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--muted)',marginTop:6,letterSpacing:2,textTransform:'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center' }}>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, email, reg ID, txn ID..."
            style={{ ...inp(),flex:1,minWidth:200 }} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}/>
          {[[fStatus,setFS,[['','All Status'],['step1_done','Pending Payment'],['step2_done','Payment Submitted'],['verified','Verified']]],[fKit,setFK,[['','All Types'],['with-kit','With Kit'],['no-kit','Without Kit']]]].map(([val,set,opts],i)=>(
            <select key={i} value={val} onChange={e=>{set(e.target.value);setPage(1);}} style={{ background:'#060d1a',border:'1px solid var(--border)',color:'var(--text)',fontFamily:"'Rajdhani',sans-serif",fontSize:14,padding:'10px 12px',outline:'none',cursor:'pointer' }}>
              {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          <button onClick={exportCSV} style={{ fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,letterSpacing:2,color:'#000',background:'linear-gradient(135deg,var(--secondary),#ff9500)',border:'none',padding:'10px 18px',cursor:'pointer',transition:'opacity .3s',whiteSpace:'nowrap' }}
            onMouseEnter={e=>e.currentTarget.style.opacity='.85'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}
          >⬇ EXPORT CSV</button>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12 }}>
            <thead>
              <tr>
                {['REG ID','NAME','EMAIL','MOBILE','COLLEGE','KIT','TXN ID','STATUS','DATE','ACTIONS'].map(h=>(
                  <th key={h} style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'var(--primary)',letterSpacing:2,padding:'10px 10px',textAlign:'left',borderBottom:'1px solid var(--border)',background:'rgba(0,212,255,.04)',whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ textAlign:'center',padding:'3rem',fontFamily:"'Share Tech Mono',monospace",color:'var(--muted)',fontSize:12 }}>
                  <span style={{ display:'inline-flex',alignItems:'center',gap:10 }}><span style={{width:16,height:16,border:'2px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',display:'inline-block',animation:'spin .8s linear infinite'}}/>LOADING...</span>
                </td></tr>
              ) : !data.docs.length ? (
                <tr><td colSpan={10} style={{ textAlign:'center',padding:'3rem',fontFamily:"'Share Tech Mono',monospace",color:'var(--muted)',fontSize:12 }}>No registrations found.</td></tr>
              ) : data.docs.map(r => (
                <tr key={r.regId}
                  onMouseEnter={e=>{for(const td of e.currentTarget.querySelectorAll('td'))td.style.background='rgba(0,212,255,.025)';}}
                  onMouseLeave={e=>{for(const td of e.currentTarget.querySelectorAll('td'))td.style.background='';}}
                >
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',fontFamily:"'Share Tech Mono',monospace",color:'var(--primary)',fontSize:10,whiteSpace:'nowrap' }}>{r.regId}</td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',color:'var(--text)',fontWeight:600,whiteSpace:'nowrap' }}>{r.firstName} {r.lastName}</td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',color:'var(--muted)',whiteSpace:'nowrap' }}>{r.email}</td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',color:'var(--muted)',whiteSpace:'nowrap' }}>{r.mobile}</td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',color:'var(--muted)',whiteSpace:'nowrap',maxWidth:130,overflow:'hidden',textOverflow:'ellipsis' }}>{r.college}</td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',whiteSpace:'nowrap' }}>
                    <span style={{ border:`1px solid ${r.kit==='with-kit'?'var(--secondary)':'var(--muted)'}`,color:r.kit==='with-kit'?'var(--secondary)':'var(--muted)',fontFamily:"'Share Tech Mono',monospace",fontSize:9,padding:'2px 6px',letterSpacing:1 }}>
                      {r.kit==='with-kit'?'✓ KIT':'NO KIT'}
                    </span>
                  </td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',color:'var(--muted)',fontFamily:"'Share Tech Mono',monospace",fontSize:10,whiteSpace:'nowrap' }}>{r.transactionId||'—'}</td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',whiteSpace:'nowrap' }}><StatusBadge status={r.status}/></td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',color:'var(--muted)',fontFamily:"'Share Tech Mono',monospace",fontSize:10,whiteSpace:'nowrap' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'})}
                  </td>
                  <td style={{ padding:'9px 10px',borderBottom:'1px solid rgba(0,212,255,.05)',whiteSpace:'nowrap' }}>
                    <div style={{ display:'flex',gap:5 }}>
                      {r.status === 'step2_done' && (
                        <button onClick={() => verify(r.regId)} style={{ background:'rgba(0,255,136,.1)',border:'1px solid var(--accent)',color:'var(--accent)',fontFamily:"'Share Tech Mono',monospace",fontSize:9,padding:'3px 8px',cursor:'pointer',letterSpacing:1,transition:'all .3s' }}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(0,255,136,.2)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,255,136,.1)'}
                        >VERIFY</button>
                      )}
                      {(r.status === 'step2_done' || r.status === 'verified') && (
                        <button onClick={() => resendMail(r.regId)} style={{ background:'rgba(0,212,255,.08)',border:'1px solid var(--border)',color:'var(--muted)',fontFamily:"'Share Tech Mono',monospace",fontSize:9,padding:'3px 8px',cursor:'pointer',letterSpacing:1 }}
                          onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
                        >RESEND</button>
                      )}
                      {r.paymentScreenshot && (
                        <a href={`${API}/uploads/${r.paymentScreenshot}`} target="_blank" rel="noreferrer" style={{ background:'rgba(255,107,0,.08)',border:'1px solid rgba(255,107,0,.3)',color:'var(--secondary)',fontFamily:"'Share Tech Mono',monospace",fontSize:9,padding:'3px 8px',textDecoration:'none',letterSpacing:1,display:'inline-block' }}>VIEW</a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div style={{ display:'flex',gap:6,marginTop:20,justifyContent:'center',alignItems:'center',flexWrap:'wrap' }}>
            <button disabled={page===1} onClick={()=>{const p=page-1;setPage(p);fetchData(p);}} style={{ background:'var(--card)',border:'1px solid var(--border)',color:'var(--muted)',fontFamily:"'Share Tech Mono',monospace",fontSize:12,padding:'6px 12px',cursor:page===1?'not-allowed':'pointer',opacity:page===1?.4:1 }}>←</button>
            {Array.from({length:data.totalPages},(_,i)=>(
              <button key={i} onClick={()=>{const p=i+1;setPage(p);fetchData(p);}} style={{ background:i+1===page?'rgba(0,212,255,.12)':'var(--card)',border:`1px solid ${i+1===page?'var(--primary)':'var(--border)'}`,color:i+1===page?'var(--primary)':'var(--muted)',fontFamily:"'Share Tech Mono',monospace",fontSize:12,padding:'6px 12px',cursor:'pointer' }}>{i+1}</button>
            ))}
            <button disabled={page===data.totalPages} onClick={()=>{const p=page+1;setPage(p);fetchData(p);}} style={{ background:'var(--card)',border:'1px solid var(--border)',color:'var(--muted)',fontFamily:"'Share Tech Mono',monospace",fontSize:12,padding:'6px 12px',cursor:page===data.totalPages?'not-allowed':'pointer',opacity:page===data.totalPages?.4:1 }}>→</button>
            <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'var(--muted)',marginLeft:6 }}>{data.total} total</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════ */
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [page, setPage]           = useState('hero');
  const handlePage = p => { setPage(p); window.scrollTo(0, 0); };

  return (
    <>
      <style>{G}</style>
      <ToastProvider>
        {showIntro && <Intro onDone={() => setShowIntro(false)}/>}
        {!showIntro && (
          <>
            <CircuitBg/>
            <Nav page={page} setPage={handlePage}/>
            {page === 'hero'     && <Hero setPage={handlePage}/>}
            {page === 'register' && <Register setPage={handlePage}/>}
            {page === 'admin'    && <Admin/>}
          </>
        )}
      </ToastProvider>
    </>
  );
}