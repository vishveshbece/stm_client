import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/**
 * VERCEL DEPLOYMENT NOTE:
 * 1. Set VITE_API_URL in your Vercel Dashboard -> Settings -> Environment Variables.
 * 2. Ensure your backend allows CORS from your Vercel domain.
 */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ══════════════════════════════════════════════
   GLOBAL STYLES & ANIMATIONS
══════════════════════════════════════════════ */
const GLOBAL_CSS = `
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
  input, select, textarea { color-scheme: dark; }
  input[type=file] { display: none; }
  
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes scanH    { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes spark    { 0%{opacity:1;transform:scale(0)} 100%{opacity:0;transform:scale(2) translate(var(--dx),var(--dy))} }
  @keyframes float1   { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-12px) rotate(1deg)} }
  @keyframes float2   { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-9px) rotate(-1deg)} }
  @keyframes float3   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(.5deg)} }
  @keyframes zoomIn   { from{opacity:0;transform:scale(.35) translateY(60px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes neon     { 0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 8px #00d4ff,0 0 20px #00d4ff} 20%,24%,55%{text-shadow:none} }
  @keyframes orbit    { from{transform:rotate(0deg) translateX(100px) rotate(0deg)} to{transform:rotate(360deg) translateX(100px) rotate(-360deg)} }
  @keyframes orbit2   { from{transform:rotate(180deg) translateX(100px) rotate(-180deg)} to{transform:rotate(540deg) translateX(100px) rotate(-540deg)} }
  @keyframes glow-p   { 0%,100%{filter:drop-shadow(0 0 5px #00d4ff)} 50%{filter:drop-shadow(0 0 15px #00d4ff)} }
  @keyframes led      { 0%,100%{fill:#00ff88;filter:drop-shadow(0 0 6px #00ff88)} 50%{fill:#004422;filter:none} }
  @keyframes pin-p    { 0%{opacity:.3} 50%{opacity:1} 100%{opacity:.3} }
  @keyframes slideIn  { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes progressBar { from{width:0} to{width:100%} }
  @keyframes stepPulse { 0%,100%{box-shadow:0 0 0 rgba(0,212,255,0)} 50%{box-shadow:0 0 16px rgba(0,212,255,.5)} }
`;

/* ══════════════════════════════════════════════
   SVG COMPONENTS (Internal Hardware Graphics)
══════════════════════════════════════════════ */
const STM32Board = ({ style }) => (
  <svg viewBox="0 0 220 320" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="200" height="300" rx="6" fill="#0a2a1a" stroke="#00ff88" strokeWidth="1.5"/>
    <text x="110" y="57" textAnchor="middle" fill="#00ff88" fontSize="11" fontFamily="'Share Tech Mono',monospace">STM32</text>
    <rect x="60" y="98" width="100" height="100" rx="4" fill="#0d1f2d" stroke="#00d4ff" strokeWidth="1.5" style={{animation:'glow-p 2s ease-in-out infinite'}}/>
    <text x="110" y="143" textAnchor="middle" fill="#00d4ff" fontSize="8.5" fontFamily="'Share Tech Mono',monospace">F411RET6</text>
    <circle cx="38" cy="68" r="5" fill="#00ff00" style={{animation:'led 1.2s ease-in-out infinite'}}/>
    <circle cx="34" cy="238" r="8" fill="#1a1a1a" stroke="#00d4ff" strokeWidth="1.2"/>
  </svg>
);

const ArduinoBoard = ({ style }) => (
  <svg viewBox="0 0 200 280" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="184" height="264" rx="8" fill="#003055" stroke="#0088ff" strokeWidth="1.5"/>
    <rect x="55" y="88" width="90" height="90" rx="3" fill="#111" stroke="#0066ff" strokeWidth="1.2"/>
    <text x="100" y="128" textAnchor="middle" fill="#0066ff" fontSize="8" fontFamily="'Share Tech Mono',monospace">ATmega328P</text>
    <circle cx="34" cy="50" r="5" fill="#00ff00" style={{animation:'led 2s ease-in-out infinite'}}/>
  </svg>
);

const ESP32Board = ({ style }) => (
  <svg viewBox="0 0 160 260" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="150" height="250" rx="5" fill="#1a0800" stroke="#ff6b00" strokeWidth="1.5"/>
    <rect x="25" y="68" width="110" height="82" rx="3" fill="#0d0d0d" stroke="#ff6b00" strokeWidth="1.2"/>
    <text x="80" y="107" textAnchor="middle" fill="#ff6b00" fontSize="10" fontFamily="'Share Tech Mono',monospace">ESP32</text>
  </svg>
);

const RaspiPico = ({ style }) => (
  <svg viewBox="0 0 210 88" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="202" height="80" rx="5" fill="#006633" stroke="#00ff88" strokeWidth="1.5"/>
    <rect x="75" y="18" width="60" height="52" rx="3" fill="#111" stroke="#00ff88" strokeWidth="1.2"/>
    <text x="105" y="41" textAnchor="middle" fill="#00ff88" fontSize="7.5" fontFamily="'Share Tech Mono',monospace">RP2040</text>
  </svg>
);

/* ══════════════════════════════════════════════
   BACKGROUND SYSTEM
══════════════════════════════════════════════ */
const CircuitBg = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!ctx) return;

    let nodes = [];
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      nodes = Array.from({ length: 50 }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > c.width) n.vx *= -1;
        if (n.y < 0 || n.y > c.height) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.2)';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, opacity:0.4, pointerEvents:'none' }} />;
};

/* ══════════════════════════════════════════════
   TOAST SYSTEM
══════════════════════════════════════════════ */
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{ position:'fixed', top:80, right:20, zIndex:1000, display:'flex', flexDirection:'column', gap:10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ 
            background:'#0a1525', 
            borderLeft:`4px solid ${t.type === 'success' ? 'var(--accent)' : t.type === 'error' ? 'var(--danger)' : 'var(--primary)'}`,
            padding:'12px 20px', color:'white', animation:'slideIn 0.3s ease-out', boxShadow:'0 10px 30px rgba(0,0,0,0.5)',
            fontFamily:"'Share Tech Mono', monospace", fontSize:'13px'
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

/* ══════════════════════════════════════════════
   SUB-COMPONENTS (Layout, Nav, etc.)
══════════════════════════════════════════════ */
const Nav = ({ page, setPage }) => (
  <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 30px', background:'rgba(3,8,16,0.9)', backdropFilter:'blur(10px)', borderBottom:'1px solid var(--border)' }}>
    <div onClick={() => setPage('hero')} style={{ cursor:'pointer', color:'var(--primary)', fontWeight:700, letterSpacing:2, fontFamily:"'Orbitron', sans-serif" }}>⚡ STM32 WORKSHOP</div>
    <div style={{ display:'flex', gap:15 }}>
      {['hero', 'register', 'admin'].map(p => (
        <button key={p} onClick={() => setPage(p)} style={{ 
          background: page === p ? 'rgba(0,212,255,0.1)' : 'transparent',
          border: `1px solid ${page === p ? 'var(--primary)' : 'transparent'}`,
          color: page === p ? 'var(--primary)' : 'var(--muted)',
          padding:'5px 15px', cursor:'pointer', textTransform:'uppercase', fontSize:12, fontWeight:600
        }}>
          {p}
        </button>
      ))}
    </div>
  </nav>
);

const Label = ({ children, required }) => (
  <label style={{ display:'block', marginBottom:8, fontSize:11, color:'var(--primary)', fontFamily:"'Share Tech Mono', monospace", letterSpacing:1 }}>
    {children.toUpperCase()} {required && <span style={{color:'var(--danger)'}}>*</span>}
  </label>
);

/* ══════════════════════════════════════════════
   PAGES (Hero, Register, Admin)
══════════════════════════════════════════════ */

const Hero = ({ setPage }) => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 20px', zIndex:1, position:'relative' }}>
    <div style={{ animation:'fadeUp 0.8s ease' }}>
      <h3 style={{ fontFamily:"'Share Tech Mono', monospace", color:'var(--accent)', letterSpacing:5, marginBottom:10 }}>CHENNAI INSTITUTE OF TECHNOLOGY</h3>
      <h1 style={{ fontFamily:"'Orbitron', sans-serif", fontSize:'clamp(2.5rem, 8vw, 5rem)', fontWeight:900, color:'var(--primary)', textShadow:'var(--glow)', lineHeight:1.1 }}>STM32 MASTERING</h1>
      <h2 style={{ fontFamily:"'Orbitron', sans-serif", color:'var(--secondary)', letterSpacing:8, marginBottom:30 }}>WORKSHOP 2025</h2>
      <p style={{ maxWidth:600, margin:'0 auto 40px', color:'var(--muted)', fontSize:18, lineHeight:1.6 }}>
        Build a high-performance career in Embedded Systems. Hands-on training on ARM Cortex-M4 architecture.
      </p>
      <button onClick={() => setPage('register')} style={{ 
        background:'linear-gradient(135deg, var(--primary), var(--accent))', border:'none', padding:'18px 45px', 
        fontFamily:"'Orbitron', sans-serif", fontWeight:700, fontSize:16, cursor:'pointer', clipPath:'polygon(10% 0, 100% 0, 90% 100%, 0 100%)'
      }}>
        SECURE YOUR SEAT →
      </button>
    </div>
  </div>
);

const Step1 = ({ onSuccess }) => {
  const toast = useToast();
  const [form, setForm] = useState({ firstName:'', email:'', mobile:'', college:'', kit:'no-kit' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.mobile) return toast("Missing required fields", "error");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/register/step1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      onSuccess(data);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, animation:'fadeIn 0.5s' }}>
      <div>
        <Label required>Full Name</Label>
        <input style={{ width:'100%', padding:12, background:'var(--bg2)', border:'1px solid var(--border)', color:'white' }} 
               value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
      </div>
      <div>
        <Label required>Email</Label>
        <input style={{ width:'100%', padding:12, background:'var(--bg2)', border:'1px solid var(--border)', color:'white' }} 
               type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      </div>
      <div>
        <Label required>Mobile</Label>
        <input style={{ width:'100%', padding:12, background:'var(--bg2)', border:'1px solid var(--border)', color:'white' }} 
               value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
      </div>
      <button onClick={handleSubmit} disabled={loading} style={{ padding:15, background:'var(--primary)', color:'black', fontWeight:700, cursor:'pointer', border:'none' }}>
        {loading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
      </button>
    </div>
  );
};

const Register = () => {
  const [step, setStep] = useState(1);
  const [regData, setRegData] = useState(null);

  return (
    <div style={{ minHeight:'100vh', padding:'120px 20px 40px', maxWidth:600, margin:'0 auto', position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <h2 style={{ fontFamily:"'Orbitron', sans-serif", color:'var(--primary)' }}>REGISTRATION</h2>
        <div style={{ height:2, width:60, background:'var(--primary)', margin:'10px auto' }} />
      </div>
      {step === 1 && <Step1 onSuccess={(data) => { setRegData(data); setStep(2); }} />}
      {step === 2 && (
        <div style={{ textAlign:'center', animation:'fadeUp 0.5s' }}>
          <h3 style={{ color:'var(--accent)' }}>STEP 1 COMPLETE</h3>
          <p style={{ margin:'20px 0', color:'var(--muted)' }}>Check your email for instructions or proceed with UTR verification.</p>
          <div style={{ background:'white', padding:10, display:'inline-block' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STMWORKSHOP_${regData?.regId}`} alt="QR" />
          </div>
          <p style={{ marginTop:10, fontFamily:"'Share Tech Mono', monospace" }}>ID: {regData?.regId}</p>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   ADMIN VIEW (Simplified)
══════════════════════════════════════════════ */
const Admin = () => {
  const [token, setToken] = useState("");
  return (
    <div style={{ minHeight:'100vh', padding:'120px 20px', textAlign:'center', zIndex:1, position:'relative' }}>
      <h2 style={{ fontFamily:"'Orbitron', sans-serif" }}>ADMIN DASHBOARD</h2>
      <div style={{ marginTop:40, padding:40, border:'1px dashed var(--border)', color:'var(--muted)' }}>
        Authorized Personnel Only. Please Login to view statistics.
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ROOT APPLICATION
══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('hero');

  // Inject global CSS once
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = GLOBAL_CSS;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <ToastProvider>
      <div className="app-container">
        <CircuitBg />
        <Nav page={page} setPage={setPage} />
        <main>
          {page === 'hero' && <Hero setPage={setPage} />}
          {page === 'register' && <Register />}
          {page === 'admin' && <Admin />}
        </main>
      </div>
    </ToastProvider>
  );
}
