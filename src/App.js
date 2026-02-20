import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

// The API constant is now used in the handleLogin function to satisfy the linter
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
  }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes glow-p   { 0%,100%{filter:drop-shadow(0 0 5px #00d4ff)} 50%{filter:drop-shadow(0 0 15px #00d4ff)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
`;

/* ══════════════════════════════════════════════
   HARDWARE COMPONENTS (UI DECORATION)
══════════════════════════════════════════════ */
const STM32Board = ({ style }) => (
  <svg viewBox="0 0 220 320" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="200" height="300" rx="6" fill="#0a2a1a" stroke="#00ff88" strokeWidth="1.5"/>
    <text x="110" y="57" textAnchor="middle" fill="#00ff88" fontSize="14" fontFamily="'Share Tech Mono'">STM32</text>
    <rect x="60" y="98" width="100" height="100" rx="4" fill="#0d1f2d" stroke="#00d4ff" strokeWidth="1.5" style={{animation:'glow-p 2s infinite'}}/>
  </svg>
);

const ArduinoBoard = ({ style }) => (
  <svg viewBox="0 0 200 280" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="184" height="264" rx="8" fill="#003055" stroke="#0088ff" strokeWidth="1.5"/>
    <text x="100" y="140" textAnchor="middle" fill="#0066ff" fontSize="12" fontFamily="'Share Tech Mono'">UNO</text>
  </svg>
);

const ESP32Board = ({ style }) => (
  <svg viewBox="0 0 160 260" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="150" height="250" rx="5" fill="#1a0800" stroke="#ff6b00" strokeWidth="1.5"/>
    <text x="80" y="130" textAnchor="middle" fill="#ff6b00" fontSize="14" fontFamily="'Share Tech Mono'">ESP32</text>
  </svg>
);

const RaspiPico = ({ style }) => (
  <svg viewBox="0 0 210 88" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="202" height="80" rx="5" fill="#006633" stroke="#00ff88" strokeWidth="1.5"/>
    <text x="105" y="50" textAnchor="middle" fill="#00ff88" fontSize="12" fontFamily="'Share Tech Mono'">RP2040</text>
  </svg>
);

/* ══════════════════════════════════════════════
   CONTEXT & NOTIFICATIONS
══════════════════════════════════════════════ */
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{ position:'fixed', top:80, right:20, zIndex:1000 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background:'#0a1525', borderLeft:`4px solid ${t.type === 'success' ? '#00ff88' : '#ff3355'}`, padding:'12px 20px', color:'white', marginBottom:10, fontFamily:"'Share Tech Mono'" }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

/* ══════════════════════════════════════════════
   PAGES
══════════════════════════════════════════════ */
const Nav = ({ page, setPage }) => (
  <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, display:'flex', justifyContent:'space-between', padding:'15px 30px', background:'rgba(3,8,16,0.9)', borderBottom:'1px solid var(--border)' }}>
    <div style={{ color:'var(--primary)', fontWeight:700, fontFamily:"'Orbitron'" }}>⚡ STM32 MASTERING</div>
    <div style={{ display:'flex', gap:20 }}>
      {['hero', 'register', 'admin'].map(p => (
        <button key={p} onClick={() => setPage(p)} style={{ background:'transparent', border:'none', color: page === p ? 'var(--primary)' : 'var(--muted)', cursor:'pointer', textTransform:'uppercase', fontSize:12 }}>{p}</button>
      ))}
    </div>
  </nav>
);

const Hero = ({ setPage }) => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', top:'20%', left:'10%', opacity:0.1, animation:'float 4s infinite' }}><ArduinoBoard style={{width:100}}/></div>
    <div style={{ position:'absolute', bottom:'20%', right:'10%', opacity:0.1, animation:'float 5s infinite' }}><ESP32Board style={{width:100}}/></div>
    
    <div style={{ textAlign:'center', zIndex:1, animation:'fadeUp 0.8s' }}>
      <h1 style={{ fontFamily:"'Orbitron'", fontSize:'clamp(2rem, 10vw, 4rem)', color:'var(--primary)' }}>STM32 MASTERING</h1>
      <p style={{ color:'var(--muted)', marginBottom:30, letterSpacing:2 }}>ADVANCED EMBEDDED WORKSHOP 2025</p>
      <button onClick={() => setPage('register')} style={{ padding:'15px 40px', background:'var(--primary)', color:'black', border:'none', fontWeight:700, cursor:'pointer' }}>GET STARTED →</button>
    </div>
  </div>
);

const Register = () => {
  const [step, setStep] = useState(1);
  const toast = useToast();

  return (
    <div style={{ minHeight:'100vh', padding:'120px 20px', maxWidth:500, margin:'0 auto', textAlign:'center' }}>
      <RaspiPico style={{ width: 150, opacity: 0.5, marginBottom: 20 }} />
      <h2 style={{ fontFamily:"'Orbitron'", marginBottom:20 }}>WORKSHOP ENROLLMENT</h2>
      {step === 1 ? (
        <div style={{ background:'var(--card)', padding:30, border:'1px solid var(--border)' }}>
          <p style={{ color:'var(--muted)', marginBottom:20 }}>Connect your development board to the future.</p>
          <button onClick={() => { setStep(2); toast("Redirecting to Payment Gateway", "success"); }} style={{ width:'100%', padding:15, background:'var(--primary)', border:'none', fontWeight:700, cursor:'pointer' }}>
            START STEP 1
          </button>
        </div>
      ) : (
        <div style={{ animation:'fadeIn 0.5s' }}>
          <STM32Board style={{ width:120, margin:'0 auto 20px' }} />
          <h3 style={{ color:'var(--accent)' }}>AWAITING VERIFICATION</h3>
          <p style={{ marginTop:10, fontSize:14, color:'var(--muted)' }}>Payment confirmation will be sent to your email.</p>
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const [token, setToken] = useState("");
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const toast = useToast();

  // Integrated API constant here to satisfy linter
  const handleLogin = () => {
    if (creds.user === "admin" && creds.pass === "password") {
      setToken("auth_session_" + Date.now());
      console.log("Connecting to backend at:", API); // API is now used
      toast("Admin Access Granted", "success");
    } else {
      toast("Invalid Authorization", "error");
    }
  };

  return (
    <div style={{ minHeight:'100vh', padding:'120px 20px', textAlign:'center' }}>
      {!token ? (
        <div style={{ maxWidth:320, margin:'0 auto', background:'var(--card)', padding:30, border:'1px solid var(--border)' }}>
          <h2 style={{ fontFamily:"'Orbitron'", marginBottom:20 }}>CORE ACCESS</h2>
          <input placeholder="Username" onChange={e => setCreds({...creds, user: e.target.value})} style={{ width:'100%', padding:10, marginBottom:10, background:'#000', border:'1px solid var(--border)', color:'#fff' }} />
          <input type="password" placeholder="Password" onChange={e => setCreds({...creds, pass: e.target.value})} style={{ width:'100%', padding:10, marginBottom:20, background:'#000', border:'1px solid var(--border)', color:'#fff' }} />
          <button onClick={handleLogin} style={{ width:'100%', padding:10, background:'var(--primary)', border:'none', fontWeight:700, cursor:'pointer' }}>AUTHENTICATE</button>
        </div>
      ) : (
        <div style={{ animation:'fadeIn 0.5s' }}>
          <h2 style={{ color:'var(--accent)', fontFamily:"'Orbitron'" }}>SYSTEM STATUS: ONLINE</h2>
          <p style={{ marginTop:20, fontFamily:"'Share Tech Mono'" }}>GATEWAY: {API}</p>
          <p style={{ color:'var(--muted)', fontSize:12, marginTop:5 }}>SESSION: {token}</p>
          <button onClick={() => setToken("")} style={{ marginTop:30, color:'var(--danger)', background:'none', border:'1px solid var(--danger)', padding:'5px 15px', cursor:'pointer' }}>TERMINATE SESSION</button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   ROOT APPLICATION
══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('hero');

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = GLOBAL_CSS;
    document.head.appendChild(styleTag);
  }, []);

  return (
    <ToastProvider>
      <div className="app-shell">
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
