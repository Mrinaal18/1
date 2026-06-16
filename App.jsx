import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
  bg: "#080C14",
  surface: "#111827",
  surfaceHigh: "#1A2235",
  border: "#1E2D45",
  violet: "#7C3AED",
  violetLight: "#9F67FF",
  pink: "#EC4899",
  cyan: "#06B6D4",
  amber: "#F59E0B",
  emerald: "#10B981",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  textFaint: "#475569",
};

// ─── GOOGLE FONTS ───────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,600&family=Inter:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'Inter', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.violet}; border-radius: 3px; }
  
  .serif { font-family: 'Fraunces', Georgia, serif; }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-12px) rotate(1deg); }
    66% { transform: translateY(-6px) rotate(-0.5deg); }
  }
  @keyframes drift {
    0% { transform: translate(0, 0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 0.3; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0.5); opacity: 0; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); }
    50% { box-shadow: 0 0 40px rgba(124, 58, 237, 0.6), 0 0 80px rgba(236, 72, 153, 0.2); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp { from { opacity: 0; } to { opacity: 1; } }
  @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes reading-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  .particle {
    position: absolute;
    pointer-events: none;
    font-family: 'Fraunces', serif;
    animation: drift var(--dur) ease-out forwards;
  }
  .btn-primary {
    background: linear-gradient(135deg, ${T.violet}, ${T.pink});
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124,58,237,0.4); }
  .btn-secondary {
    background: transparent;
    color: ${T.text};
    border: 1.5px solid ${T.border};
    padding: 14px 28px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .btn-secondary:hover { border-color: ${T.violet}; background: rgba(124,58,237,0.08); transform: translateY(-2px); }
  .btn-ghost {
    background: transparent;
    color: ${T.textMuted};
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .btn-ghost:hover { color: ${T.text}; background: rgba(255,255,255,0.06); }

  .card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 16px;
    transition: all 0.25s;
  }
  .card:hover { border-color: rgba(124,58,237,0.4); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
  }

  .gradient-text {
    background: linear-gradient(135deg, ${T.violetLight}, ${T.pink});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .shimmer-text {
    background: linear-gradient(90deg, ${T.violetLight}, ${T.pink}, ${T.cyan}, ${T.violetLight});
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .section-fade { animation: fadeUp 0.7s ease forwards; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, ${T.border}, transparent); margin: 0; }

  input, textarea, select {
    background: ${T.surfaceHigh};
    border: 1px solid ${T.border};
    color: ${T.text};
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  input:focus, textarea:focus, select:focus { border-color: ${T.violet}; }
  input::placeholder, textarea::placeholder { color: ${T.textFaint}; }

  .progress-bar {
    height: 3px;
    background: linear-gradient(90deg, ${T.violet}, ${T.pink});
    border-radius: 2px;
    transition: width 0.3s;
  }

  .genre-fantasy { border-left: 3px solid #7C3AED; }
  .genre-romance { border-left: 3px solid #EC4899; }
  .genre-scifi   { border-left: 3px solid #06B6D4; }
  .genre-mystery { border-left: 3px solid #F59E0B; }
  .genre-horror  { border-left: 3px solid #EF4444; }
  .genre-drama   { border-left: 3px solid #10B981; }

  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .stack-mobile { flex-direction: column !important; }
    .full-mobile { width: 100% !important; }
  }
`;
document.head.appendChild(style);

// ─── DATA ───────────────────────────────────────────────────────────────────
const STORIES = [
  { id:1, title:"The Last Cartographer", author:"Evelyn Marsh", genre:"Fantasy", reads:"124K", likes:"8.2K", cover:"#4C1D95", emoji:"🗺️", desc:"A mapmaker discovers her charts lead to worlds that shouldn't exist.", chapters:24, time:"6h" },
  { id:2, title:"Orbit of Two Moons", author:"Kai Sato", genre:"Sci-Fi", reads:"89K", likes:"5.6K", cover:"#0E7490", emoji:"🌙", desc:"Two astronauts stranded on Europa find more than survival instincts.", chapters:18, time:"4h" },
  { id:3, title:"Crimson Letters", author:"Sofia Reyes", genre:"Romance", reads:"213K", likes:"15.3K", cover:"#9D174D", emoji:"✉️", desc:"A series of anonymous love letters tears apart a small coastal town.", chapters:31, time:"8h" },
  { id:4, title:"The Hollow King", author:"Arden Cole", genre:"Fantasy", reads:"67K", likes:"4.1K", cover:"#312E81", emoji:"👑", desc:"A king who lost his soul must find it before the kingdom falls.", chapters:42, time:"11h" },
  { id:5, title:"Signal Static", author:"Priya Menon", genre:"Mystery", reads:"45K", likes:"3.8K", cover:"#78350F", emoji:"📻", desc:"A radio host starts receiving messages from a missing person.", chapters:15, time:"3h" },
  { id:6, title:"Neon Petals", author:"James Liu", genre:"Romance", reads:"156K", likes:"11.2K", cover:"#831843", emoji:"🌸", desc:"Two rival florists in a cyberpunk city discover their connection.", chapters:27, time:"7h" },
];

const GENRES = ["All","Fantasy","Romance","Sci-Fi","Mystery","Horror","Drama","Fan Fiction","Poetry","Thriller"];
const FEATURES = [
  { icon:"⚡", title:"Publish Instantly", desc:"Go from draft to published in seconds. No gatekeepers, no waiting lists, no rejections.", color: T.violet },
  { icon:"📊", title:"Deep Analytics", desc:"Understand your readers with chapter-level retention, demographics, and engagement heatmaps.", color: T.cyan },
  { icon:"🌍", title:"Build an Audience", desc:"Grow followers, share updates, and turn casual readers into devoted fans.", color: T.pink },
  { icon:"💬", title:"Community Feedback", desc:"Inline comments let readers react to specific passages, not just the story as a whole.", color: T.amber },
  { icon:"🎭", title:"Fan Fiction Support", desc:"Tag your work, link to source material, and join the thriving fanfic community.", color: T.emerald },
  { icon:"💰", title:"Earn From Writing", desc:"Accept tips, offer premium chapters, and build a subscription from your loyal readers.", color: "#F472B6" },
];

const TESTIMONIALS = [
  { name:"Zara Okonkwo", handle:"@zaraokonkwo", avatar:"ZO", text:"I published my first story three months ago. I now have 12,000 followers and two readers who paid for my premium chapters. StoryForge actually changed my life.", role:"Romance Author", stories:7 },
  { name:"Marcus Venn", handle:"@mvenn_writes", avatar:"MV", text:"The editor is the best I've used — including paid tools. Auto-save, chapter management, and the AI prompts when I hit writer's block. Genuinely remarkable.", role:"Fantasy Novelist", stories:3 },
  { name:"Hana Ikeda", handle:"@ikeda.hana", avatar:"HI", text:"As someone who came from AO3, the fan fiction tagging here is *chef's kiss*. Plus my readers can leave inline comments on specific lines. That's been game-changing.", role:"Fan Fiction Writer", stories:23 },
];

const STATS = [
  { label:"Stories Published", value:847000, suffix:"+" },
  { label:"Active Readers", value:2300000, suffix:"+" },
  { label:"Writers Joined", value:124000, suffix:"+" },
  { label:"Monthly Reads", value:18000000, suffix:"+" },
];

const CHALLENGES = [
  { title:"July Writing Sprint", desc:"Write 10,000 words in 30 days", badge:"🏅", participants:"2.3K", ends:"12 days" },
  { title:"Dystopia Anthology", desc:"Short story collection — open submissions", badge:"📚", participants:"891", ends:"3 days" },
  { title:"First Chapter Challenge", desc:"Hook your reader in 500 words or less", badge:"⚡", participants:"4.1K", ends:"19 days" },
];

const GENRE_COLORS = { Fantasy:"#7C3AED", "Sci-Fi":"#06B6D4", Romance:"#EC4899", Mystery:"#F59E0B", Horror:"#EF4444", Drama:"#10B981", "Fan Fiction":"#F472B6", Poetry:"#A78BFA", Thriller:"#FB923C" };

// ─── HELPERS ────────────────────────────────────────────────────────────────
const fmt = n => n >= 1000000 ? (n/1000000).toFixed(1)+"M" : n >= 1000 ? (n/1000).toFixed(0)+"K" : n;
const genreClass = g => `genre-${g.toLowerCase().replace(/[\s-]/g,"")}`;

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mOpen, setMOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { key:"home", label:"Home" },
    { key:"explore", label:"Explore" },
    { key:"community", label:"Community" },
  ];

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? "rgba(8,12,20,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg, ${T.violet}, ${T.pink})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✦</div>
          <span className="serif" style={{ fontSize:20, fontWeight:600, letterSpacing:-0.5 }}>StoryForge</span>
        </div>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display:"flex", gap:4, alignItems:"center" }}>
          {navItems.map(n => (
            <button key={n.key} className="btn-ghost" onClick={() => setPage(n.key)} style={{ color: page===n.key ? T.text : T.textMuted, fontWeight: page===n.key ? 600 : 400 }}>
              {n.label}
            </button>
          ))}
        </div>

        {/* Auth */}
        <div className="hide-mobile" style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button className="btn-ghost" onClick={() => setPage("dashboard")}>Dashboard</button>
          <button className="btn-primary" style={{ padding:"8px 20px", fontSize:14 }} onClick={() => setPage("editor")}>Start Writing</button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMOpen(!mOpen)} style={{ display:"none", background:"none", border:"none", color:T.text, fontSize:22, cursor:"pointer" }} className="show-mobile">☰</button>
      </div>

      {mOpen && (
        <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"12px 24px 16px" }}>
          {[...navItems, { key:"dashboard", label:"Dashboard" }, { key:"editor", label:"Start Writing" }].map(n => (
            <button key={n.key} onClick={() => { setPage(n.key); setMOpen(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"12px 0", background:"none", border:"none", color:T.text, fontSize:15, cursor:"pointer", borderBottom:`1px solid ${T.border}` }}>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HERO PARTICLE CANVAS ───────────────────────────────────────────────────
function InkCanvas() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(null);

  const GLYPHS = "✦ ✧ ⟨ ⟩ § ¶ ∞ ◊ ⌘ ✍ 📖 🖋 ❧ ☙".split(" ");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const spawn = () => {
      particles.current.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        alpha: 0,
        maxAlpha: Math.random() * 0.25 + 0.05,
        size: Math.random() * 14 + 10,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        life: 0,
        maxLife: Math.random() * 300 + 150,
        color: [
          `rgba(159,103,255,`,
          `rgba(236,72,153,`,
          `rgba(6,182,212,`,
          `rgba(248,250,252,`,
        ][Math.floor(Math.random() * 4)],
      });
    };

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W(), H());
      frame++;
      if (frame % 8 === 0 && particles.current.length < 60) spawn();

      particles.current = particles.current.filter(p => p.life < p.maxLife);
      particles.current.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const t = p.life / p.maxLife;
        p.alpha = t < 0.15 ? (t / 0.15) * p.maxAlpha : t > 0.7 ? ((1-t)/0.3) * p.maxAlpha : p.maxAlpha;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px 'Fraunces', serif`;
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fillText(p.glyph, p.x, p.y);
        ctx.restore();
      });

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

// ─── COUNTER ────────────────────────────────────────────────────────────────
function Counter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        const duration = 2000;
        const steps = 60;
        const step = value / steps;
        let cur = 0;
        const interval = setInterval(() => {
          cur = Math.min(cur + step, value);
          setCount(Math.floor(cur));
          if (cur >= value) clearInterval(interval);
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{fmt(count)}{suffix}</span>;
}

// ─── STORY CARD ─────────────────────────────────────────────────────────────
function StoryCard({ story, onClick }) {
  const gc = GENRE_COLORS[story.genre] || T.violet;
  return (
    <div className="card" onClick={onClick} style={{ cursor:"pointer", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* Cover */}
      <div style={{ height:160, background:`linear-gradient(145deg, ${story.cover}, ${story.cover}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, position:"relative" }}>
        {story.emoji}
        <div style={{ position:"absolute", top:10, right:10 }}>
          <span className="tag" style={{ background:`${gc}22`, color:gc, border:`1px solid ${gc}44` }}>{story.genre}</span>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:40, background:"linear-gradient(transparent, rgba(8,12,20,0.9))" }}/>
      </div>
      {/* Info */}
      <div style={{ padding:"14px 16px 16px", flex:1, display:"flex", flexDirection:"column", gap:8 }}>
        <div style={{ borderLeft:`3px solid ${gc}`, paddingLeft:10 }}>
          <div className="serif" style={{ fontSize:16, fontWeight:600, lineHeight:1.3, marginBottom:4 }}>{story.title}</div>
          <div style={{ fontSize:12, color:T.textMuted }}>by {story.author}</div>
        </div>
        <p style={{ fontSize:13, color:T.textMuted, lineHeight:1.5, flexGrow:1 }}>{story.desc}</p>
        <div style={{ display:"flex", gap:16, fontSize:12, color:T.textFaint, paddingTop:4, borderTop:`1px solid ${T.border}` }}>
          <span>👁 {story.reads}</span>
          <span>❤️ {story.likes}</span>
          <span>📖 {story.chapters} ch</span>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ setPage, setActiveStory }) {
  const [activeGenre, setActiveGenre] = useState("All");

  const filtered = activeGenre === "All" ? STORIES : STORIES.filter(s => s.genre === activeGenre);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
        <InkCanvas />
        {/* Glow orbs */}
        <div style={{ position:"absolute", top:"20%", left:"10%", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle, ${T.violet}20 0%, transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"20%", right:"10%", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${T.pink}18 0%, transparent 70%)`, pointerEvents:"none" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"120px 24px 80px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:700 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:20, border:`1px solid ${T.violet}44`, background:`${T.violet}12`, marginBottom:24 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:T.violet, animation:"reading-pulse 2s infinite" }}/>
              <span style={{ fontSize:13, color:T.violetLight }}>2.3M readers waiting for your story</span>
            </div>

            <h1 className="serif" style={{ fontSize:"clamp(48px, 7vw, 88px)", fontWeight:900, lineHeight:1.0, letterSpacing:-2, marginBottom:24 }}>
              Where Stories<br/>
              <span className="shimmer-text">Find Their</span><br/>
              Audience
            </h1>

            <p style={{ fontSize:"clamp(16px, 2vw, 20px)", color:T.textMuted, lineHeight:1.6, marginBottom:40, maxWidth:560 }}>
              Publish your stories, build a community, and share your imagination with readers around the world — no gatekeepers, no rejections, no limits.
            </p>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ fontSize:16, padding:"16px 32px", animation:"pulse-glow 3s infinite" }} onClick={() => setPage("editor")}>
                ✍️ Start Writing Free
              </button>
              <button className="btn-secondary" style={{ fontSize:16, padding:"16px 32px" }} onClick={() => setPage("explore")}>
                Explore Stories →
              </button>
            </div>

            {/* Social proof */}
            <div style={{ display:"flex", gap:24, marginTop:48, flexWrap:"wrap" }}>
              {[
                { val:"847K+", label:"Stories" },
                { val:"124K+", label:"Writers" },
                { val:"18M+", label:"Monthly Reads" },
              ].map(s => (
                <div key={s.label}>
                  <div className="serif" style={{ fontSize:28, fontWeight:700, color:T.text }}>{s.val}</div>
                  <div style={{ fontSize:13, color:T.textFaint }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating story preview cards */}
        <div className="hide-mobile" style={{ position:"absolute", right:"5%", top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:12, zIndex:1 }}>
          {STORIES.slice(0,3).map((s, i) => (
            <div key={s.id} style={{ background:T.surfaceHigh, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 16px", width:220, animation:`float ${3+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.7}s`, cursor:"pointer" }} onClick={() => { setActiveStory(s); setPage("story"); }}>
              <div style={{ fontSize:24, marginBottom:6 }}>{s.emoji}</div>
              <div className="serif" style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{s.title}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>by {s.author}</div>
              <div style={{ display:"flex", gap:8, marginTop:8, fontSize:11, color:T.textFaint }}>
                <span>👁 {s.reads}</span><span>❤️ {s.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"100px 24px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <p style={{ fontSize:13, color:T.violet, fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Everything You Need</p>
          <h2 className="serif" style={{ fontSize:"clamp(32px, 5vw, 52px)", fontWeight:700, letterSpacing:-1 }}>
            The platform writers<br/><span className="gradient-text">actually deserve</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card" style={{ padding:"28px 24px" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:`${f.color}18`, border:`1px solid ${f.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:14, color:T.textMuted, lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ maxWidth:1200, margin:"0 auto" }}/>

      {/* ── TRENDING STORIES ── */}
      <section style={{ padding:"100px 24px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ fontSize:13, color:T.pink, fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Trending Now</p>
            <h2 className="serif" style={{ fontSize:"clamp(28px, 4vw, 44px)", fontWeight:700, letterSpacing:-1 }}>Popular Stories</h2>
          </div>
          <button className="btn-secondary" onClick={() => setPage("explore")}>View All →</button>
        </div>

        {/* Genre filter */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
          {GENRES.slice(0,7).map(g => (
            <button key={g} onClick={() => setActiveGenre(g)} style={{
              padding:"6px 16px", borderRadius:20, border:`1px solid ${activeGenre===g ? T.violet : T.border}`,
              background: activeGenre===g ? `${T.violet}20` : "transparent",
              color: activeGenre===g ? T.violetLight : T.textMuted,
              fontSize:13, cursor:"pointer", fontFamily:"Inter, sans-serif", transition:"all 0.15s"
            }}>{g}</button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
          {filtered.map(s => <StoryCard key={s.id} story={s} onClick={() => { setActiveStory(s); setPage("story"); }} />)}
        </div>
      </section>

      <div className="divider" style={{ maxWidth:1200, margin:"0 auto" }}/>

      {/* ── STATS ── */}
      <section style={{ padding:"100px 24px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:24, padding:"64px 40px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${T.violet}, ${T.pink}, ${T.cyan})` }}/>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 className="serif" style={{ fontSize:"clamp(28px, 4vw, 44px)", fontWeight:700, letterSpacing:-1 }}>
              A growing universe of <span className="gradient-text">stories</span>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:40, textAlign:"center" }}>
            {STATS.map((s,i) => (
              <div key={i}>
                <div className="serif" style={{ fontSize:"clamp(36px, 5vw, 56px)", fontWeight:900, letterSpacing:-2, color:i%2===0?T.violetLight:T.pink }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize:14, color:T.textMuted, marginTop:6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"100px 24px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <p style={{ fontSize:13, color:T.cyan, fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Writer Stories</p>
          <h2 className="serif" style={{ fontSize:"clamp(28px, 4vw, 44px)", fontWeight:700, letterSpacing:-1 }}>Real voices,<br/><span className="gradient-text">real results</span></h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card" style={{ padding:"28px" }}>
              <div style={{ fontSize:32, color:T.violetLight, marginBottom:16, fontFamily:"serif" }}>"</div>
              <p style={{ fontSize:15, lineHeight:1.7, color:T.text, marginBottom:20 }}>{t.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg, ${T.violet}, ${T.pink})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{t.name}</div>
                  <div style={{ fontSize:12, color:T.textMuted }}>{t.role} · {t.stories} stories</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding:"100px 24px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ background:`linear-gradient(135deg, ${T.violet}30, ${T.pink}20)`, border:`1px solid ${T.violet}40`, borderRadius:24, padding:"80px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)" }}/>
          <div style={{ position:"relative" }}>
            <h2 className="serif" style={{ fontSize:"clamp(32px, 5vw, 64px)", fontWeight:900, letterSpacing:-2, marginBottom:20 }}>
              Your story is<br/><span className="shimmer-text">waiting to be told.</span>
            </h2>
            <p style={{ fontSize:18, color:T.textMuted, marginBottom:40, maxWidth:480, margin:"0 auto 40px" }}>
              Join 124,000+ writers publishing to readers who are hungry for exactly what you create.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ fontSize:16, padding:"16px 40px" }} onClick={() => setPage("editor")}>
                ✍️ Write Your First Story
              </button>
              <button className="btn-secondary" style={{ fontSize:16, padding:"16px 40px" }} onClick={() => setPage("explore")}>
                Browse Stories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${T.border}`, padding:"64px 24px 32px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:40, marginBottom:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:`linear-gradient(135deg, ${T.violet}, ${T.pink})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
              <span className="serif" style={{ fontSize:18, fontWeight:600 }}>StoryForge</span>
            </div>
            <p style={{ fontSize:13, color:T.textMuted, lineHeight:1.6, marginBottom:16 }}>Give every writer a place to publish, grow, and build an audience.</p>
            <div style={{ display:"flex", gap:12 }}>
              {["𝕏", "📸", "💬", "🎭"].map((icon, i) => (
                <div key={i} style={{ width:32, height:32, borderRadius:8, background:T.surfaceHigh, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:14 }}>{icon}</div>
              ))}
            </div>
          </div>
          {[
            { title:"Platform", links:["Explore","Trending","New Releases","Editor Picks","Writing Challenges"] },
            { title:"Writers", links:["Start Writing","Dashboard","Analytics","Monetize","Writer Pro"] },
            { title:"Company", links:["About","Blog","Careers","Press","Contact"] },
            { title:"Support", links:["Help Center","Privacy Policy","Terms of Service","Community Guidelines","Accessibility"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:14, letterSpacing:0.5 }}>{col.title}</h4>
              {col.links.map(l => <div key={l} style={{ fontSize:13, color:T.textMuted, marginBottom:10, cursor:"pointer", transition:"color 0.15s" }} onMouseEnter={e => e.target.style.color=T.text} onMouseLeave={e => e.target.style.color=T.textMuted}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:12, color:T.textFaint }}>© 2026 StoryForge. All rights reserved.</p>
          <p style={{ fontSize:12, color:T.textFaint }}>Made with ❤️ for writers everywhere</p>
        </div>
      </footer>
    </div>
  );
}

// ─── EXPLORE PAGE ────────────────────────────────────────────────────────────
function ExplorePage({ setPage, setActiveStory }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("Trending");
  const [view, setView] = useState("grid");

  const filtered = STORIES.filter(s =>
    (genre === "All" || s.genre === genre) &&
    (search === "" || s.title.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight:"100vh", padding:"96px 24px 64px", maxWidth:1200, margin:"0 auto" }}>
      <h1 className="serif" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:700, letterSpacing:-1.5, marginBottom:8 }}>Explore Stories</h1>
      <p style={{ color:T.textMuted, marginBottom:40 }}>Discover your next obsession from 847,000+ stories</p>

      {/* Search & controls */}
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200, position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.textFaint }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories, authors..." style={{ paddingLeft:36 }} />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ width:"auto", minWidth:140 }}>
          {["Trending","New Releases","Most Liked","Editor Picks"].map(o => <option key={o}>{o}</option>)}
        </select>
        <div style={{ display:"flex", gap:4, background:T.surfaceHigh, border:`1px solid ${T.border}`, borderRadius:10, padding:4 }}>
          {["grid","list"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding:"6px 12px", borderRadius:7, border:"none", background:view===v?T.surface:"transparent", color:view===v?T.text:T.textFaint, cursor:"pointer", fontSize:16, transition:"all 0.15s" }}>
              {v === "grid" ? "⊞" : "≡"}
            </button>
          ))}
        </div>
      </div>

      {/* Genre pills */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:36 }}>
        {GENRES.map(g => (
          <button key={g} onClick={() => setGenre(g)} style={{
            padding:"7px 18px", borderRadius:20, border:`1px solid ${genre===g ? (GENRE_COLORS[g]||T.violet) : T.border}`,
            background: genre===g ? `${GENRE_COLORS[g]||T.violet}18` : "transparent",
            color: genre===g ? (GENRE_COLORS[g]||T.violetLight) : T.textMuted,
            fontSize:13, cursor:"pointer", fontFamily:"Inter, sans-serif", transition:"all 0.15s", fontWeight: genre===g ? 600 : 400
          }}>{g}</button>
        ))}
      </div>

      {/* Editor Picks banner */}
      <div style={{ background:`linear-gradient(135deg, ${T.violet}20, ${T.cyan}10)`, border:`1px solid ${T.violet}30`, borderRadius:16, padding:"20px 24px", marginBottom:36, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:12, color:T.cyan, fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>✦ Editor's Pick</div>
          <div className="serif" style={{ fontSize:20, fontWeight:600 }}>This Week's Featured Story</div>
          <div style={{ fontSize:14, color:T.textMuted }}>The Last Cartographer by Evelyn Marsh</div>
        </div>
        <button className="btn-primary" style={{ padding:"10px 24px" }} onClick={() => { setActiveStory(STORIES[0]); setPage("story"); }}>Read Now</button>
      </div>

      {/* Results */}
      <div style={{ display: view === "grid" ? "grid" : "flex", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20, flexDirection:"column" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0", color:T.textMuted }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <p>No stories match your search. Try a different filter.</p>
          </div>
        )}
        {filtered.map(s => view === "grid"
          ? <StoryCard key={s.id} story={s} onClick={() => { setActiveStory(s); setPage("story"); }} />
          : (
            <div key={s.id} className="card" style={{ display:"flex", gap:16, padding:"16px", cursor:"pointer" }} onClick={() => { setActiveStory(s); setPage("story"); }}>
              <div style={{ width:64, height:64, borderRadius:12, background:`linear-gradient(145deg, ${s.cover}, ${s.cover}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{s.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div className="serif" style={{ fontSize:16, fontWeight:600 }}>{s.title}</div>
                    <div style={{ fontSize:13, color:T.textMuted }}>by {s.author}</div>
                  </div>
                  <span className="tag" style={{ background:`${GENRE_COLORS[s.genre]||T.violet}22`, color:GENRE_COLORS[s.genre]||T.violet, border:`1px solid ${GENRE_COLORS[s.genre]||T.violet}44` }}>{s.genre}</span>
                </div>
                <p style={{ fontSize:13, color:T.textMuted, marginTop:6 }}>{s.desc}</p>
                <div style={{ display:"flex", gap:16, marginTop:8, fontSize:12, color:T.textFaint }}>
                  <span>👁 {s.reads}</span><span>❤️ {s.likes}</span><span>📖 {s.chapters} ch</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── STORY DETAIL PAGE ───────────────────────────────────────────────────────
function StoryPage({ story, setPage }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { user:"ReadingFiend", text:"This is absolutely beautiful. The world-building in chapter 3 made me tear up.", time:"2h ago" },
    { user:"NightReader", text:"Cannot stop thinking about the ending of chapter 8. Please update soon!", time:"5h ago" },
  ]);
  const gc = GENRE_COLORS[story?.genre] || T.violet;

  if (!story) return null;

  return (
    <div style={{ minHeight:"100vh", padding:"88px 24px 64px", maxWidth:1100, margin:"0 auto" }}>
      <button className="btn-ghost" onClick={() => setPage("explore")} style={{ marginBottom:24, color:T.textMuted }}>← Back to Explore</button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"start" }}>
        <div style={{ flex:1 }}>
          {/* Header */}
          <div style={{ display:"flex", gap:24, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ width:140, height:200, borderRadius:16, background:`linear-gradient(145deg, ${story.cover}, ${story.cover}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:56, flexShrink:0, boxShadow:`0 20px 60px ${story.cover}60` }}>
              {story.emoji}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
                <span className="tag" style={{ background:`${gc}18`, color:gc, border:`1px solid ${gc}33` }}>{story.genre}</span>
                <span className="tag" style={{ background:`${T.amber}18`, color:T.amber, border:`1px solid ${T.amber}33` }}>Ongoing</span>
              </div>
              <h1 className="serif" style={{ fontSize:"clamp(24px,4vw,42px)", fontWeight:800, letterSpacing:-1, marginBottom:8 }}>{story.title}</h1>
              <p style={{ fontSize:15, color:T.textMuted, marginBottom:16 }}>by <strong style={{ color:T.text }}>{story.author}</strong></p>
              <p style={{ fontSize:15, lineHeight:1.7, color:T.textMuted, marginBottom:20 }}>{story.desc}</p>

              <div style={{ display:"flex", gap:24, fontSize:13, color:T.textFaint, marginBottom:24 }}>
                <span>👁 {story.reads} reads</span>
                <span>❤️ {story.likes} likes</span>
                <span>📖 {story.chapters} chapters</span>
                <span>⏱ {story.time} read</span>
              </div>

              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button className="btn-primary" onClick={() => setPage("reader")}>📖 Read Now</button>
                <button onClick={() => setLiked(!liked)} style={{ padding:"10px 20px", borderRadius:12, border:`1px solid ${liked ? T.pink : T.border}`, background:liked?`${T.pink}18`:"transparent", color:liked?T.pink:T.textMuted, cursor:"pointer", fontSize:14, fontFamily:"Inter", transition:"all 0.15s" }}>
                  {liked ? "❤️ Liked" : "🤍 Like"}
                </button>
                <button onClick={() => setBookmarked(!bookmarked)} style={{ padding:"10px 20px", borderRadius:12, border:`1px solid ${bookmarked ? T.amber : T.border}`, background:bookmarked?`${T.amber}18`:"transparent", color:bookmarked?T.amber:T.textMuted, cursor:"pointer", fontSize:14, fontFamily:"Inter", transition:"all 0.15s" }}>
                  {bookmarked ? "🔖 Saved" : "🔖 Save"}
                </button>
                <button onClick={() => setFollowing(!following)} style={{ padding:"10px 20px", borderRadius:12, border:`1px solid ${following ? T.violet : T.border}`, background:following?`${T.violet}18`:"transparent", color:following?T.violetLight:T.textMuted, cursor:"pointer", fontSize:14, fontFamily:"Inter", transition:"all 0.15s" }}>
                  {following ? "✓ Following" : "+ Follow Author"}
                </button>
              </div>
            </div>
          </div>

          {/* Chapter list */}
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:32 }}>
            <h3 style={{ fontWeight:600, marginBottom:16 }}>Chapters ({story.chapters})</h3>
            {[1,2,3,4,5].map(n => (
              <div key={n} onClick={() => setPage("reader")} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}`, cursor:"pointer" }} onMouseEnter={e => e.currentTarget.style.paddingLeft="8px"} onMouseLeave={e => e.currentTarget.style.paddingLeft="0"}>
                <div>
                  <div style={{ fontWeight:500, fontSize:14 }}>Chapter {n}: {["The Beginning","Into the Unknown","A Strange Map","The First Door","Beyond the Veil"][n-1]}</div>
                  <div style={{ fontSize:12, color:T.textFaint, marginTop:2 }}>~2,400 words · {n*5+10}K reads</div>
                </div>
                <span style={{ color:T.violet, fontSize:18 }}>→</span>
              </div>
            ))}
            <button className="btn-secondary" style={{ marginTop:16, width:"100%" }}>View All {story.chapters} Chapters</button>
          </div>

          {/* Comments */}
          <div>
            <h3 style={{ fontWeight:600, marginBottom:16 }}>Reader Comments</h3>
            <div style={{ display:"flex", gap:12, marginBottom:24 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg, ${T.violet}, ${T.pink})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>You</div>
              <div style={{ flex:1 }}>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts on this story..." rows={3} style={{ resize:"vertical" }}/>
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
                  <button className="btn-primary" style={{ padding:"8px 20px", fontSize:14 }} onClick={() => { if(comment.trim()) { setComments([{user:"You",text:comment,time:"just now"},...comments]); setComment(""); } }}>Post Comment</button>
                </div>
              </div>
            </div>
            {comments.map((c,i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom:20 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:T.surfaceHigh, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{c.user.slice(0,2).toUpperCase()}</div>
                <div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontWeight:600, fontSize:13 }}>{c.user}</span>
                    <span style={{ fontSize:12, color:T.textFaint }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize:14, color:T.textMuted, lineHeight:1.6 }}>{c.text}</p>
                  <button className="btn-ghost" style={{ fontSize:12, padding:"4px 8px", marginTop:4 }}>↩ Reply</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hide-mobile" style={{ width:260 }}>
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20, marginBottom:20 }}>
            <h4 style={{ fontWeight:600, marginBottom:16, fontSize:13, textTransform:"uppercase", letterSpacing:1, color:T.textMuted }}>About the Author</h4>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg, ${T.violet}, ${T.pink})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>
                {story.author.split(" ").map(n=>n[0]).join("")}
              </div>
              <div>
                <div style={{ fontWeight:600 }}>{story.author}</div>
                <div style={{ fontSize:12, color:T.textMuted }}>Fantasy · Romance</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:T.textMuted, lineHeight:1.6, marginBottom:16 }}>Bestselling author on StoryForge with 12 published works and a devoted following of 48K readers.</p>
            <button className="btn-primary" style={{ width:"100%", padding:"10px" }}>Follow Author</button>
          </div>

          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:20 }}>
            <h4 style={{ fontWeight:600, marginBottom:16, fontSize:13, textTransform:"uppercase", letterSpacing:1, color:T.textMuted }}>You Might Also Like</h4>
            {STORIES.filter(s => s.id !== story.id).slice(0,3).map(s => (
              <div key={s.id} style={{ display:"flex", gap:10, marginBottom:16, cursor:"pointer" }}>
                <div style={{ width:40, height:40, borderRadius:8, background:s.cover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{s.emoji}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:T.textFaint }}>by {s.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── READER PAGE ─────────────────────────────────────────────────────────────
function ReaderPage({ story, setPage }) {
  const [progress, setProgress] = useState(12);
  const [fontSize, setFontSize] = useState(17);
  const [darkMode, setDarkMode] = useState(true);
  const [distraction, setDistraction] = useState(false);
  const bg = darkMode ? "#0D1117" : "#FAF9F7";
  const fg = darkMode ? "#E2E8F0" : "#1A1A2E";
  const surfBg = darkMode ? "#111827" : "#FFFFFF";

  const SAMPLE_TEXT = `The map had been folded so many times that the creases had become canyons in the parchment, each one a small valley where ink had gathered and dried into raised ridges. Mira traced one with her fingernail, following it from the edge of the Known Territories all the way to the faded, almost illegible inscription that read: *Here, there be stories.*

She had inherited the map from her grandmother, who had inherited it from hers, all the way back to a woman whose name history had not thought worth preserving — only her work. The cartographers in Mira's family had never been the kind who drew the land as it was. They drew the land as it wanted to be.

The difference, her grandmother had explained with the patience of a river carving rock, was everything.

"A map that tells you what is already there," the old woman had said, spreading her hands over a table covered in charts and compasses, "is just a mirror. Any mirror can show you a reflection. But a map that shows you what *could* be there — that is a door."

Mira hadn't understood then. She was seven, and she cared more about the beautiful illustrations of sea creatures in the margins than the philosophy of cartography.

She understood now.

The crease she was following didn't lead to any city she recognized. It led to a blank space at the center of the map — a space that was not empty but *held*, like a breath before a word, like the pause between lightning and thunder. She had stared at that space for ten years, and every time she looked, it seemed slightly larger than before.

Tonight, for the first time, she could see something in it.

Not much. A line, maybe. The suggestion of a coastline. The ghost of mountains drawn in pencil so light it might have been made by someone who was afraid to commit — or by someone who knew the mountains weren't finished yet.

Her hands were shaking when she picked up her pen.`;

  useEffect(() => {
    const fn = () => {
      const el = document.getElementById("reader-content");
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      setProgress(Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)));
    };
    const el = document.getElementById("reader-content");
    if (el) { el.addEventListener("scroll", fn); return () => el.removeEventListener("scroll", fn); }
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:bg, color:fg, fontFamily:"'Fraunces', Georgia, serif", display:"flex", flexDirection:"column" }}>
      {/* Reading toolbar */}
      {!distraction && (
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:darkMode?"rgba(13,17,23,0.95)":"rgba(250,249,247,0.95)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${darkMode?T.border:"#E2E8F0"}`, padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button className="btn-ghost" onClick={() => setPage("story")} style={{ color:darkMode?T.textMuted:"#64748B" }}>← {story?.title}</button>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button className="btn-ghost" onClick={() => setFontSize(f => Math.max(13, f-1))} style={{ color:darkMode?T.textMuted:"#64748B", fontSize:16 }}>A-</button>
            <span style={{ fontSize:13, color:darkMode?T.textFaint:"#94A3B8", minWidth:30, textAlign:"center" }}>{fontSize}</span>
            <button className="btn-ghost" onClick={() => setFontSize(f => Math.min(24, f+1))} style={{ color:darkMode?T.textMuted:"#64748B", fontSize:18 }}>A+</button>
            <div style={{ width:1, height:20, background:darkMode?T.border:"#E2E8F0", margin:"0 4px" }}/>
            <button className="btn-ghost" onClick={() => setDarkMode(!darkMode)} style={{ fontSize:16 }}>{darkMode ? "☀️" : "🌙"}</button>
            <button className="btn-ghost" onClick={() => setDistraction(true)} style={{ fontSize:16, color:darkMode?T.textMuted:"#64748B" }}>⛶</button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ position:"fixed", top: distraction ? 0 : 56, left:0, right:0, zIndex:99, height:3, background:darkMode?"#1E293B":"#E2E8F0" }}>
        <div className="progress-bar" style={{ width:`${progress}%` }}/>
      </div>

      {/* Content */}
      <div id="reader-content" style={{ flex:1, overflowY:"auto", paddingTop: distraction ? 40 : 96 }}>
        <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px 120px" }}>
          {!distraction && (
            <div style={{ marginBottom:48, paddingBottom:32, borderBottom:`1px solid ${darkMode?T.border:"#E2E8F0"}` }}>
              <div style={{ fontSize:13, color:darkMode?T.textFaint:"#94A3B8", marginBottom:8 }}>Chapter 1</div>
              <h1 className="serif" style={{ fontSize:"clamp(24px,4vw,36px)", fontWeight:700, letterSpacing:-0.5, color:fg, marginBottom:8 }}>The Beginning</h1>
              <div style={{ fontSize:13, color:darkMode?T.textFaint:"#94A3B8" }}>{story?.author} · {story?.time} read · {progress}% complete</div>
            </div>
          )}

          {distraction && (
            <button onClick={() => setDistraction(false)} style={{ position:"fixed", top:12, right:12, background:"rgba(0,0,0,0.3)", border:"none", color:"#888", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:13 }}>Exit Focus</button>
          )}

          <div style={{ fontSize:fontSize, lineHeight:1.85, color:fg }}>
            {SAMPLE_TEXT.split("\n\n").map((para, i) => (
              <p key={i} style={{ marginBottom:"1.5em" }}>
                {para.split(/(\*[^*]+\*)/).map((part, j) =>
                  part.startsWith("*") && part.endsWith("*")
                    ? <em key={j} style={{ fontStyle:"italic", color:darkMode?T.violetLight:"#7C3AED" }}>{part.slice(1,-1)}</em>
                    : part
                )}
              </p>
            ))}
          </div>

          <div style={{ marginTop:64, display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:32, borderTop:`1px solid ${darkMode?T.border:"#E2E8F0"}` }}>
            <button style={{ padding:"12px 24px", borderRadius:12, border:`1px solid ${darkMode?T.border:"#E2E8F0"}`, background:"transparent", color:darkMode?T.textMuted:"#64748B", cursor:"pointer", fontFamily:"Inter" }}>← Prev Chapter</button>
            <span style={{ fontSize:13, color:darkMode?T.textFaint:"#94A3B8" }}>Ch 1 of {story?.chapters}</span>
            <button className="btn-primary" style={{ padding:"12px 24px" }}>Next Chapter →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ setPage }) {
  const data = [12, 45, 30, 78, 56, 90, 67, 110, 88, 134, 99, 145];
  const maxVal = Math.max(...data);

  return (
    <div style={{ minHeight:"100vh", padding:"88px 24px 64px", maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 className="serif" style={{ fontSize:"clamp(28px,4vw,42px)", fontWeight:700, letterSpacing:-1 }}>Author Dashboard</h1>
          <p style={{ color:T.textMuted, marginTop:4 }}>Welcome back — your readers are waiting</p>
        </div>
        <button className="btn-primary" onClick={() => setPage("editor")}>+ New Story</button>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:16, marginBottom:32 }}>
        {[
          { label:"Total Views", val:"48.2K", change:"+12%", color:T.violet },
          { label:"Followers", val:"2,341", change:"+8%", color:T.pink },
          { label:"Avg Completion", val:"74%", change:"+3%", color:T.cyan },
          { label:"Total Likes", val:"8,420", change:"+15%", color:T.amber },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:"20px" }}>
            <div style={{ fontSize:12, color:T.textFaint, marginBottom:8 }}>{s.label}</div>
            <div className="serif" style={{ fontSize:28, fontWeight:700, letterSpacing:-1, color:T.text }}>{s.val}</div>
            <div style={{ fontSize:12, color:T.emerald, marginTop:4 }}>{s.change} this month</div>
            <div style={{ height:2, background:s.color, borderRadius:1, marginTop:12, width:"60%" }}/>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:24, alignItems:"start" }}>
        <div>
          {/* Chart */}
          <div className="card" style={{ padding:24, marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h3 style={{ fontWeight:600 }}>Views Over Time</h3>
              <div style={{ display:"flex", gap:4 }}>
                {["7D","30D","3M","1Y"].map(p => (
                  <button key={p} style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${T.border}`, background: p==="30D"?T.violet:"transparent", color: p==="30D"?T.text:T.textFaint, cursor:"pointer", fontSize:12, fontFamily:"Inter" }}>{p}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
              {data.map((v,i) => (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", borderRadius:"4px 4px 0 0", height:(v/maxVal)*100, background:`linear-gradient(180deg, ${T.violet}, ${T.pink}60)`, minHeight:4 }}/>
                  <div style={{ fontSize:9, color:T.textFaint }}>M{i+1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stories table */}
          <div className="card" style={{ padding:24 }}>
            <h3 style={{ fontWeight:600, marginBottom:20 }}>Your Stories</h3>
            {STORIES.slice(0,4).map(s => (
              <div key={s.id} style={{ display:"flex", gap:16, alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ width:40, height:40, borderRadius:10, background:s.cover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:500, fontSize:14 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:T.textFaint }}>{s.chapters} chapters · {s.genre}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{s.reads}</div>
                  <div style={{ fontSize:11, color:T.textFaint }}>reads</div>
                </div>
                <button className="btn-ghost" style={{ fontSize:12 }} onClick={() => setPage("editor")}>Edit</button>
              </div>
            ))}
            <button className="btn-secondary" style={{ marginTop:16, width:"100%" }} onClick={() => setPage("editor")}>+ Create New Story</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hide-mobile" style={{ width:260 }}>
          <div className="card" style={{ padding:20, marginBottom:20 }}>
            <h4 style={{ fontWeight:600, marginBottom:16, fontSize:13, textTransform:"uppercase", letterSpacing:1, color:T.textMuted }}>Achievements</h4>
            {[
              { badge:"🏆", name:"First Story", desc:"Published your debut" },
              { badge:"🔥", name:"7-Day Streak", desc:"Writing consistency" },
              { badge:"⭐", name:"Top 100", desc:"Trending fantasy" },
              { badge:"💎", name:"10K Reads", desc:"Milestone reached" },
            ].map((a,i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:T.surfaceHigh, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{a.badge}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{a.name}</div>
                  <div style={{ fontSize:11, color:T.textFaint }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:20 }}>
            <h4 style={{ fontWeight:600, marginBottom:12, fontSize:13, textTransform:"uppercase", letterSpacing:1, color:T.textMuted }}>Upgrade to Pro</h4>
            <p style={{ fontSize:13, color:T.textMuted, marginBottom:14, lineHeight:1.6 }}>Get featured placement, advanced analytics, and early monetization access.</p>
            <button className="btn-primary" style={{ width:"100%", padding:"10px" }}>Upgrade — $9/mo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EDITOR PAGE ──────────────────────────────────────────────────────────────
function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chapter, setChapter] = useState("Chapter 1");
  const [saved, setSaved] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const autoSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  useEffect(() => {
    const t = setTimeout(autoSave, 2000);
    return () => clearTimeout(t);
  }, [content, title]);

  const handleAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:"You are a creative writing assistant embedded in StoryForge, a platform for writers. When given a writing prompt or request, provide a compelling, evocative continuation or suggestion in 150-250 words. Focus on vivid description, strong voice, and narrative momentum. Do not add meta-commentary — just the creative text itself.",
          messages:[{
            role:"user",
            content: content.trim()
              ? `Story context:\n\n${title ? `Title: ${title}\n\n` : ""}${content.slice(-500)}\n\nWriter's request: ${aiPrompt}`
              : aiPrompt
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setAiResponse(text);
    } catch(e) {
      setAiResponse("Unable to connect to the AI assistant right now. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Editor toolbar */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(8,12,20,0.95)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`, padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span className="serif" style={{ fontSize:16, fontWeight:600, color:T.textMuted }}>✦ Editor</span>
          <span style={{ color:T.border }}>·</span>
          <select value={chapter} onChange={e => setChapter(e.target.value)} style={{ width:"auto", minWidth:130, padding:"4px 10px", fontSize:13 }}>
            {["Chapter 1","Chapter 2","Chapter 3","+ New Chapter"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, color:T.textFaint }}>{wordCount} words</span>
          <span style={{ fontSize:12, color: saved ? T.emerald : T.textFaint }}>{saved ? "✓ Saved" : "Unsaved changes"}</span>
          <button className="btn-ghost" onClick={() => setShowAI(!showAI)} style={{ color:showAI?T.violetLight:T.textMuted, fontSize:13 }}>✨ AI Assist</button>
          <button className="btn-primary" style={{ padding:"7px 18px", fontSize:13 }}>Publish</button>
        </div>
      </div>

      <div style={{ flex:1, display:"flex", paddingTop:56 }}>
        {/* Main editor */}
        <div style={{ flex:1, padding:"48px clamp(24px, 8vw, 120px)" }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Story Title" style={{ background:"transparent", border:"none", fontSize:"clamp(28px,4vw,42px)", fontFamily:"'Fraunces', Georgia, serif", fontWeight:700, letterSpacing:-1, marginBottom:32, width:"100%", outline:"none" }}/>

          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
            {["B","I","U",'"',"H1","H2","—","···"].map(f => (
              <button key={f} style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${T.border}`, background:T.surfaceHigh, color:T.textMuted, cursor:"pointer", fontSize:13, fontFamily:"mono", transition:"all 0.1s" }}>{f}</button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Begin your story here. Write freely — auto-save will keep your work safe..."
            style={{ background:"transparent", border:"none", width:"100%", minHeight:"calc(100vh - 280px)", resize:"none", fontSize:17, lineHeight:1.8, fontFamily:"'Fraunces', Georgia, serif", outline:"none" }}
          />
        </div>

        {/* AI sidebar */}
        {showAI && (
          <div style={{ width:320, borderLeft:`1px solid ${T.border}`, padding:24, background:T.surface, overflowY:"auto", flexShrink:0 }}>
            <h3 style={{ fontWeight:600, marginBottom:6 }}>✨ AI Writing Assistant</h3>
            <p style={{ fontSize:12, color:T.textMuted, marginBottom:20, lineHeight:1.6 }}>Ask for a scene continuation, character description, plot idea, or any creative help.</p>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="e.g. Write a tense confrontation between the protagonist and the villain..."
              rows={4}
              style={{ marginBottom:10, resize:"vertical" }}
            />
            <button className="btn-primary" onClick={handleAI} style={{ width:"100%", marginBottom:20 }} disabled={loading}>
              {loading ? "Writing..." : "Generate"}
            </button>
            {loading && (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ width:24, height:24, border:`2px solid ${T.border}`, borderTopColor:T.violet, borderRadius:"50%", animation:"spin-slow 0.8s linear infinite", margin:"0 auto" }}/>
              </div>
            )}
            {aiResponse && (
              <div style={{ background:T.surfaceHigh, border:`1px solid ${T.border}`, borderRadius:12, padding:16 }}>
                <p style={{ fontSize:14, lineHeight:1.7, color:T.text, marginBottom:12 }}>{aiResponse}</p>
                <button className="btn-secondary" style={{ width:"100%", fontSize:13, padding:"8px" }} onClick={() => setContent(content + "\n\n" + aiResponse)}>
                  ↓ Insert into Story
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMMUNITY PAGE ───────────────────────────────────────────────────────────
function CommunityPage({ setPage }) {
  const [tab, setTab] = useState("challenges");
  const TABS = ["challenges","prompts","forums"];

  return (
    <div style={{ minHeight:"100vh", padding:"88px 24px 64px", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ marginBottom:40 }}>
        <p style={{ fontSize:13, color:T.emerald, fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Community</p>
        <h1 className="serif" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:700, letterSpacing:-1.5 }}>Write Together</h1>
        <p style={{ color:T.textMuted, marginTop:8 }}>Challenges, prompts, and conversations with 124,000 writers</p>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, background:T.surfaceHigh, borderRadius:12, padding:4, width:"fit-content", marginBottom:40 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 20px", borderRadius:9, border:"none", background:tab===t?T.surface:"transparent", color:tab===t?T.text:T.textMuted, cursor:"pointer", fontSize:14, fontFamily:"Inter", textTransform:"capitalize", fontWeight:tab===t?600:400, transition:"all 0.15s" }}>
            {t === "challenges" ? "🏆 Challenges" : t === "prompts" ? "💡 Prompts" : "💬 Forums"}
          </button>
        ))}
      </div>

      {tab === "challenges" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:20 }}>
          {CHALLENGES.map((c,i) => (
            <div key={i} className="card" style={{ padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontSize:36 }}>{c.badge}</span>
                <span className="tag" style={{ background:`${T.amber}18`, color:T.amber, border:`1px solid ${T.amber}33`, height:"fit-content" }}>Ends in {c.ends}</span>
              </div>
              <h3 style={{ fontWeight:600, fontSize:18, marginBottom:8 }}>{c.title}</h3>
              <p style={{ fontSize:14, color:T.textMuted, marginBottom:20 }}>{c.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, color:T.textFaint }}>👥 {c.participants} participants</span>
                <button className="btn-primary" style={{ padding:"8px 20px", fontSize:13 }}>Join Challenge</button>
              </div>
            </div>
          ))}
          <div className="card" style={{ padding:24, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:16, minHeight:200, border:`2px dashed ${T.border}` }}>
            <div style={{ fontSize:36 }}>✦</div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontWeight:600, marginBottom:4 }}>Start a Challenge</div>
              <div style={{ fontSize:13, color:T.textMuted }}>Create your own writing challenge for the community</div>
            </div>
            <button className="btn-secondary" style={{ fontSize:13 }}>Create Challenge</button>
          </div>
        </div>
      )}

      {tab === "prompts" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:20 }}>
          {[
            { prompt:"A letter is delivered to the wrong address — but the recipient realizes it was meant for them all along.", tags:["Romance","Mystery"] },
            { prompt:"The last bookstore on Earth closes its doors. A librarian hides the final copy of every book that ever existed.", tags:["Sci-Fi","Drama"] },
            { prompt:"Two strangers share a park bench in complete silence for an hour. When one gets up to leave, the other grabs their wrist.", tags:["Literary","Thriller"] },
            { prompt:"An astronaut returning from 10 years in space discovers that the world has moved on without her — but her home hasn't.", tags:["Sci-Fi","Family"] },
            { prompt:"The villain is right. Write the story from their perspective without making them likeable.", tags:["Fantasy","Literary"] },
            { prompt:"A map of the world as it will look in 500 years falls out of a library book. Someone realizes they drew it as a child.", tags:["Fantasy","Mystery"] },
          ].map((p, i) => (
            <div key={i} className="card" style={{ padding:20 }}>
              <p className="serif" style={{ fontSize:15, lineHeight:1.65, marginBottom:14, fontStyle:"italic", color:T.text }}>"{p.prompt}"</p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
                {p.tags.map(t => <span key={t} className="tag" style={{ background:T.surfaceHigh, color:T.textMuted, border:`1px solid ${T.border}`, fontSize:11 }}>{t}</span>)}
              </div>
              <button className="btn-secondary" style={{ width:"100%", fontSize:13, padding:"8px" }} onClick={() => setPage("editor")}>Write This →</button>
            </div>
          ))}
        </div>
      )}

      {tab === "forums" && (
        <div>
          {[
            { category:"Craft & Writing", threads:234, lastPost:"2m ago", icon:"✍️" },
            { category:"Genre Discussions", threads:891, lastPost:"5m ago", icon:"📚" },
            { category:"Feedback & Beta Readers", threads:156, lastPost:"12m ago", icon:"💬" },
            { category:"Publishing & Business", threads:78, lastPost:"1h ago", icon:"💼" },
            { category:"Fan Fiction Hub", threads:1245, lastPost:"1m ago", icon:"🎭" },
            { category:"Platform Announcements", threads:23, lastPost:"3h ago", icon:"📢" },
          ].map((f,i) => (
            <div key={i} className="card" style={{ display:"flex", gap:16, alignItems:"center", padding:"16px 20px", marginBottom:12, cursor:"pointer" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:T.surfaceHigh, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{f.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600 }}>{f.category}</div>
                <div style={{ fontSize:13, color:T.textFaint }}>{f.threads} threads</div>
              </div>
              <div style={{ fontSize:12, color:T.textFaint }}>Last post {f.lastPost}</div>
              <span style={{ color:T.violet, fontSize:18 }}>→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [activeStory, setActiveStory] = useState(null);

  const isReader = page === "reader";

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      {!isReader && <Nav page={page} setPage={setPage} />}
      {page === "home"      && <HomePage setPage={setPage} setActiveStory={setActiveStory} />}
      {page === "explore"   && <ExplorePage setPage={setPage} setActiveStory={setActiveStory} />}
      {page === "story"     && <StoryPage story={activeStory || STORIES[0]} setPage={setPage} />}
      {page === "reader"    && <ReaderPage story={activeStory || STORIES[0]} setPage={setPage} />}
      {page === "dashboard" && <DashboardPage setPage={setPage} />}
      {page === "editor"    && <EditorPage />}
      {page === "community" && <CommunityPage setPage={setPage} />}
    </div>
  );
}
