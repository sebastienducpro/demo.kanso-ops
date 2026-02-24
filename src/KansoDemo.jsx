import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// KANSO-OPS — Démo Commerciale Interactive v2
// PME (10M€) / ETI (150M€) · Info Bubbles · Dashboard Preview
// ═══════════════════════════════════════════════════════════════════

const V = "#8b5cf6";
const VL = "#a78bfa";
const VD = "#7c3aed";
const EM = "#10b981";
const AM = "#f59e0b";
const RD = "#ef4444";
const CY = "#06b6d4";
const RS = "#f43f5e";
const S = {
  50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",
  400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",
  800:"#1e293b",850:"#172033",900:"#0f172a",950:"#020617",
};

// ═══ PROFILES PME / ETI ═══
const PROFILES = {
  pme: {
    label: "PME",
    sub: "~10M€ CA",
    ca: "10M€",
    spend: "6M€",
    margin: "10%",
    heroKpis: [
      { value: 45, suffix: "K€", label: "Savings récupérés", color: EM,
        info: { title: "Savings totaux YTD", calc: "Litiges récupérés (28K€) + Fuites évitées (11K€) + Hausses refusées (6K€) = 45K€", source: "Consolidation Cockpit Dirigeant — hypothèse conservatrice sur 12 mois, PME 10M€ CA" }},
      { value: 4, suffix: "×", label: "ROI plateforme", color: V,
        info: { title: "Retour sur investissement", calc: "45K€ savings ÷ 11 880€ (990€/mois × 12, palier Standard) = ROI ×3,8 — affiché ×4 conservateur", source: "Coût palier Standard. Calcul sur base annuelle." }},
      { value: 8, suffix: "", label: "Fuites bloquées", color: AM,
        info: { title: "Factures bloquées avant paiement", calc: "8 factures avec anomalies détectées par le Contrôle Factures en temps réel, soit 11K€ de surcoûts évités", source: "Module Contrôle Factures — alertes statut 'Bloqué'" }},
      { value: 5, suffix: " jours", label: "Déploiement", color: CY,
        info: { title: "Temps de mise en service", calc: "J1: Coffre-Fort · J2-J3: Récupération Cash · J4: Contrôle Factures · J5: Cockpit Dirigeant", source: "Roadmap standard Kanso-Ops. Export ERP = 30min IT." }},
    ],
    // Effort commercial équivalent pour le bloc hero
    effortCommercial: {
      savings: "45K€",
      caEquiv: "450K€",
      caEquivShort: "450K€",
      moisProspection: "6 à 9 mois",
      explication: "Avec une marge nette de 10%, il faut générer 450K€ de nouveau CA pour obtenir le même résultat net. Soit 6 à 9 mois de prospection commerciale pour une PME.",
    },
    modules: {
      "data-vault": { docs: 1840, types: 10, sync: "4×/jour", sparkline: [5,10,22,40,70,120,180,260,350,450,560,680] },
      "litige-killer": { detected: 19, recovered: "28K€", rate: "74%", sparkline: [1,2,4,6,8,10,12,13,15,16,18,19] },
      "invoice-watchdog": { blocked: 8, saved: "11K€", realtime: "< 2min", sparkline: [0,1,2,3,3,4,5,5,6,7,7,8] },
      "supplier-watchtower": { suppliers: 38, alerts: 5, horsContrat: 2, sparkline: [62,63,65,67,69,71,73,75,76,78,80,82] },
      "sentinel": { indices: 14, refused: "6K€", clauses: 6, sparkline: [0,0,1,1,2,3,3,4,4,5,5,6] },
      "cockpit-daf": { savings: "45K€", roi: "×4", trend: "+12% vs N-1", sparkline: [2,5,9,14,19,24,28,32,36,39,42,45] },
    },
    scenario: {
      invoiceAmount: "18 420€",
      invoiceSupplier: "DELRIN Composants",
      invoiceRef: "FA-2026-0218",
      gap: "+9%",
      impact: "1 658€",
      marketClaimed: "+9%",
      marketActual: "+1,8%",
      marketSaving: "1 326€",
      cockpitSavings: "45K€",
      cockpitRoi: "×4",
      cockpitTrend: "+12% vs N-1",
    },
    impact: {
      savings: 45000,
      costSub: 11880,
      caEquiv: "450K€",
      caEquivCalc: "45K€ ÷ 10% marge nette = 450K€ de CA à générer pour le même résultat",
      hoursEquiv: "140h",
      hoursCalc: "~18h par litige × 8 litiges manuels évités = 144h · Coût horaire DAF ~85€ = 12K€",
      deployVsClassic: "5 jours vs 4-8 mois (intégration ERP classique)",
    },
    factureX: {
      globalScore: 62,
      axes: [
        { label: "SIREN fournisseurs", score: 78 },
        { label: "Email conforme", score: 55 },
        { label: "Format e-facture", score: 48 },
        { label: "PDP identifiée", score: 65 },
      ],
      deadline: "1er sept. 2026",
    },
  },
  eti: {
    label: "ETI",
    sub: "~150M€ CA",
    ca: "150M€",
    spend: "90M€",
    margin: "3,5%",
    heroKpis: [
      { value: 480, suffix: "K€", label: "Savings récupérés", color: EM,
        info: { title: "Savings totaux YTD", calc: "Litiges récupérés (265K€) + Fuites évitées (120K€) + Hausses refusées (95K€) = 480K€", source: "Consolidation Cockpit Dirigeant — données réelles client" }},
      { value: 10, suffix: "×", label: "ROI plateforme", color: V,
        info: { title: "Retour sur investissement", calc: "480K€ savings ÷ 11 880€ (990€/mois × 12, palier Standard) = ROI ×40 — conservateur affiché ×10", source: "Coût palier Standard. Le ROI réel est souvent supérieur." }},
      { value: 89, suffix: "", label: "Fuites bloquées", color: AM,
        info: { title: "Factures bloquées avant paiement", calc: "89 factures avec anomalies détectées par le Contrôle Factures, soit 120K€ de surcoûts évités", source: "Module Contrôle Factures — alertes statut 'Bloqué'" }},
      { value: 5, suffix: " jours", label: "Déploiement", color: CY,
        info: { title: "Temps de mise en service", calc: "J1: Coffre-Fort · J2-J3: Récupération Cash · J4: Contrôle Factures · J5: Cockpit Dirigeant", source: "Même délai PME/ETI. L'architecture est identique, seuls les volumes changent." }},
    ],
    effortCommercial: {
      savings: "480K€",
      caEquiv: "9,6M€ à 13,7M€",
      caEquivShort: "~12M€",
      moisProspection: "12 à 18 mois",
      explication: "Avec une marge nette de 3,5-5%, il faut générer 9,6M€ à 13,7M€ de nouveau CA pour obtenir le même résultat net. Soit 12 à 18 mois d'effort commercial intensif.",
    },
    modules: {
      "data-vault": { docs: 15420, types: 10, sync: "4×/jour", sparkline: [50,180,420,780,1200,2100,3800,5600,7800,10200,12800,15420] },
      "litige-killer": { detected: 247, recovered: "265K€", rate: "78%", sparkline: [5,12,28,45,62,78,95,120,155,190,230,247] },
      "invoice-watchdog": { blocked: 89, saved: "120K€", realtime: "< 2min", sparkline: [3,8,15,22,31,38,45,52,61,70,79,89] },
      "supplier-watchtower": { suppliers: 280, alerts: 42, horsContrat: 14, sparkline: [68,67,66,68,70,72,74,76,78,80,83,87] },
      "sentinel": { indices: 42, refused: "95K€", clauses: 28, sparkline: [0,5,15,28,42,58,78,98,125,155,185,215] },
      "cockpit-daf": { savings: "480K€", roi: "×10", trend: "+18% vs N-1", sparkline: [15,40,80,140,200,260,310,350,390,420,450,480] },
    },
    scenario: {
      invoiceAmount: "127 340€",
      invoiceSupplier: "ACME Industries",
      invoiceRef: "FA-2026-0847",
      gap: "+12%",
      impact: "15 280€",
      marketClaimed: "+12%",
      marketActual: "+2,3%",
      marketSaving: "12 405€",
      cockpitSavings: "480K€",
      cockpitRoi: "×10",
      cockpitTrend: "+18% vs N-1",
    },
    impact: {
      savings: 480000,
      costSub: 11880,
      caEquiv: "9,6M€ à 13,7M€",
      caEquivCalc: "480K€ ÷ 3,5% marge = 13,7M€ de CA · 480K€ ÷ 5% = 9,6M€",
      hoursEquiv: "2 400h",
      hoursCalc: "~18h par litige × 130 litiges traités manuellement évités = 2 340h · Coût horaire DAF ~85€ = 199K€",
      deployVsClassic: "5 jours vs 6-12 mois (intégration ERP classique)",
    },
    factureX: {
      globalScore: 45,
      axes: [
        { label: "SIREN fournisseurs", score: 62 },
        { label: "Email conforme", score: 38 },
        { label: "Format e-facture", score: 32 },
        { label: "PDP identifiée", score: 48 },
      ],
      deadline: "1er sept. 2026",
    },
  },
};

const MODULES_BASE = [
  { id: "data-vault", icon: "🗄️", name: "Coffre-Fort Données", tagline: "Un seul point d'entrée pour toutes vos données achats", color: CY, tier: "Pilote",
    features: ["Classification IA automatique (factures, contrats, BDC, devis…)","Index central exploitable par tous les modules","Synchronisation SharePoint — vos données restent chez vous","Drag & drop, sync auto, upload API"] },
  { id: "litige-killer", icon: "⚔️", name: "Récupération Cash", tagline: "Détectez les écarts. Récupérez le cash.", color: RD, tier: "Pilote",
    features: ["Moteur de détection : 4 règles (écart prix, erreur virgule, doublons, grille tarifaire)","Graduation Diplomatique automatique (Soft Check → Escalade DAF)","Liasses de Preuve PDF exportables","Auto-résolution quand l'avoir arrive"] },
  { id: "invoice-watchdog", icon: "🔍", name: "Contrôle Factures", tagline: "Bloquez les fuites AVANT de payer", color: AM, tier: "Standard",
    features: ["Même moteur de détection, en temps réel","Chaque nouvelle facture analysée automatiquement","Bloquer / Valider / Escalader / Transférer","Zéro fuite — plus aucune erreur ne passe inaperçue"] },
  { id: "supplier-watchtower", icon: "🏰", name: "Pilotage Fournisseurs", tagline: "Scoring fournisseurs — pilotez votre panel", color: V, tier: "Standard",
    features: ["Score composite 5 axes (conformité, litiges, dépendance, santé fi., réactivité)","Suivi certifications (alertes 30j/90j avant expiration)","Détection achats hors contrat (dépenses > 10K€/an sans contrat)","Briefing pré-RDV : tout savoir avant de négocier"] },
  { id: "sentinel", icon: "📡", name: "Veille Marchés", tagline: "Indices de marché — contrez les hausses injustifiées", color: EM, tier: "Performance",
    features: ["Indices marché multi-sources (INSEE, Eurostat, BdF, Perplexity)","Extraction IA des clauses de révision + validation humaine","Simulation hausse fournisseur vs réalité marché","Pression prix par catégorie (chaud / tiède / froid / baisse)"] },
  { id: "cockpit-daf", icon: "🎯", name: "Cockpit Dirigeant", tagline: "Vue stratégique — pilotez, reportez, décidez", color: RS, tier: "Pilote",
    features: ["7 onglets : Savings, Conformité, Risque, Performance, Équipe, Prix, Spend Map","S'adapte automatiquement aux modules activés","Rapports mensuels & annuels PDF automatiques","Le dirigeant forwarde à sa direction sans effort"] },
];

const TIERS = [
  { name: "Pilote", price: "490", modules: ["Coffre-Fort Données","Récupération Cash","Cockpit Dirigeant"], highlight: false, color: CY, value: "Récupération cash + vue performance" },
  { name: "Standard", price: "990", modules: ["+ Contrôle Factures","+ Pilotage Fournisseurs"], highlight: true, color: V, value: "Zéro fuite + panel sous contrôle" },
  { name: "Performance", price: "1 490", modules: ["+ Veille Marchés","Cockpit complet (7 onglets)"], highlight: false, color: EM, value: "Négociation data-driven + pilotage total" },
];

// ═══ COMPONENTS ═══

function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const go = (now) => {
          const p = Math.min((now - s) / duration, 1);
          setVal((1 - Math.pow(1 - p, 3)) * end);
          if (p < 1) requestAnimationFrame(go);
        };
        requestAnimationFrame(go);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("fr-FR")}{suffix}</span>;
}

function Sparkline({ data, color = V, width = 120, height = 32, animate = true }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i/(data.length-1))*width},${height-((v-min)/range)*(height-4)-2}`).join(" ");
  const gid = `sg-${color.replace("#","")}-${Math.random().toString(36).slice(2,6)}`;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!animate || !ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [animate]);
  // Estimate total path length
  var totalLen = 0;
  for (var i = 1; i < data.length; i++) {
    var dx = (1/(data.length-1))*width;
    var dy = ((data[i]-min)/range - (data[i-1]-min)/range)*(height-4);
    totalLen += Math.sqrt(dx*dx + dy*dy);
  }
  return (
    <svg ref={ref} width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#${gid})`} style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.5s" }}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={animate ? {
          strokeDasharray: totalLen,
          strokeDashoffset: visible ? 0 : totalLen,
          transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)",
        } : {}}/>
      {visible && <circle cx={(data.length-1)/(data.length-1)*width} cy={height-((data[data.length-1]-min)/range)*(height-4)-2} r="3" fill={color} style={{ animation: "breathe 2s ease-in-out infinite" }}/>}
    </svg>
  );
}

function DonutChart({ value, max = 100, color = EM, size = 64, strokeWidth = 6, label }) {
  const r = (size - strokeWidth) / 2, c = 2 * Math.PI * r, offset = c * (1 - Math.min(value/max,1));
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position:"relative",width:size,height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={S[700]} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={visible ? offset : c} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1) 0.2s" }}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <span style={{ fontSize:13,fontWeight:700,color:S[50] }}>{visible ? Math.round(value) : 0}%</span>
        {label && <span style={{ fontSize:7,color:S[400],marginTop:-2 }}>{label}</span>}
      </div>
    </div>
  );
}

// ═══ INFO BUBBLE ═══
function InfoBubble({ info, color = V }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  return (
    <span ref={ref} style={{ position:"relative",display:"inline-flex",verticalAlign:"middle",marginLeft:4 }}>
      <button onClick={() => setOpen(!open)} style={{
        width:18,height:18,borderRadius:"50%",border:`1.5px solid ${open ? color : S[500]}`,
        background: open ? `${color}20` : "transparent",
        color: open ? color : S[400], fontSize:10, fontWeight:700,
        cursor:"pointer", display:"flex",alignItems:"center",justifyContent:"center",
        transition:"all 0.2s", lineHeight:1, padding:0, fontFamily:"inherit",
      }}>i</button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)",
          width:300, padding:16, borderRadius:12, zIndex:100,
          background:S[850], border:`1px solid ${color}33`,
          boxShadow:`0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${color}15`,
          animation:"fadeInUp 0.2s ease",
        }}>
          <div style={{
            position:"absolute",top:-5,left:"50%",transform:"translateX(-50%) rotate(45deg)",
            width:10,height:10,background:S[850],borderLeft:`1px solid ${color}33`,borderTop:`1px solid ${color}33`,
          }}/>
          <div style={{ fontSize:12,fontWeight:700,color,marginBottom:8 }}>{info.title}</div>
          <div style={{ fontSize:11,color:S[300],lineHeight:1.6,marginBottom:8 }}>
            <strong style={{ color:S[200] }}>Calcul :</strong> {info.calc}
          </div>
          <div style={{ fontSize:10,color:S[500],lineHeight:1.5,paddingTop:8,borderTop:`1px solid ${S[700]}` }}>
            📊 {info.source}
          </div>
        </div>
      )}
    </span>
  );
}

// ═══ SIMULATEUR ROI ═══
function ROISimulator() {
  const [spend, setSpend] = useState(10);
  const [margin, setMargin] = useState(5);
  const [animPct, setAnimPct] = useState(0);
  const prevSpend = useRef(10);

  useEffect(() => {
    setAnimPct(0);
    const t = setTimeout(() => setAnimPct(1), 50);
    prevSpend.current = spend;
    return () => clearTimeout(t);
  }, [spend, margin]);

  // ─── Taux benchmark sourcés ───
  const RATES = {
    litiges:  0.005,  // 0.5% du spend
    fuites:   0.002,  // 0.2% du spend
    hausses:  0.0015, // 0.15% du spend
  };
  const spendM = spend * 1000000;
  const litiges = Math.round(spendM * RATES.litiges);
  const fuites  = Math.round(spendM * RATES.fuites);
  const hausses = Math.round(spendM * RATES.hausses);
  const total   = litiges + fuites + hausses;
  const coutAn  = 990 * 12; // Standard 990€/mois
  const roi     = total / coutAn;
  const caEquiv = Math.round(total / (margin / 100));

  const fmtK = (v) => v >= 1000000 ? (v/1000000).toFixed(1).replace(".",",") + "M€" : v >= 1000 ? Math.round(v/1000) + "K€" : v + "€";
  const fmtROI = (v) => v >= 10 ? "×" + Math.round(v) : "×" + v.toFixed(1).replace(".",",");

  const barMax = total || 1;
  const lines = [
    { label:"Écarts factures récupérables", value:litiges, color:EM, icon:"💰", pct: RATES.litiges*100,
      info: { title:"Écarts prix factures vs contrats",
        calc:`${(RATES.litiges*100).toFixed(1)}% × ${spend}M€ de spend = ${fmtK(litiges)}. Taux conservateur basé sur les écarts prix, doublons et erreurs de facturation détectables automatiquement.`,
        source:"Institute of Finance & Management : 39% des factures contiennent des erreurs. Ardent Partners 2024 : écart moyen constaté de 1 à 3% du spend. Taux KANSO : 0,5% (hypothèse basse, écarts contractuels uniquement)." }},
    { label:"Fuites évitées avant paiement", value:fuites, color:CY, icon:"🛡️", pct: RATES.fuites*100,
      info: { title:"Surfacturations bloquées en temps réel",
        calc:`${(RATES.fuites*100).toFixed(1)}% × ${spend}M€ = ${fmtK(fuites)}. Détection automatique des anomalies sur chaque nouvelle facture, avant validation du paiement.`,
        source:"CAPS Research : 2% de réduction moyenne des coûts via procurement structuré. Stampli/IFM : 68% des entreprises ont >1% d'erreurs factures. Taux KANSO : 0,2% (détection temps réel, surfacturations uniquement)." }},
    { label:"Hausses fournisseurs injustifiées refusées", value:hausses, color:V, icon:"📉", pct: RATES.hausses*100,
      info: { title:"Hausses non corrélées aux indices marché",
        calc:`${(RATES.hausses*100).toFixed(1)}% × ${spend}M€ = ${fmtK(hausses)}. Vérification automatique des demandes de hausse vs indices INSEE/Eurostat et clauses contractuelles.`,
        source:"Deloitte CPO Survey 2023 : 67% des entreprises subissent des hausses fournisseurs >5%/an. CAPS Research : world-class = 2% savings sur total spend. Taux KANSO : 0,15% (hausses refusées sur base d'indices publics)." }},
  ];

  const sliderBg = `linear-gradient(90deg, ${V} ${((spend-1)/99)*100}%, ${S[700]} ${((spend-1)/99)*100}%)`;

  return (
    <div style={{ marginTop:64,padding:"40px 0" }}>
      {/* Title */}
      <div style={{ textAlign:"center",marginBottom:36 }}>
        <span className="tag" style={{ background:"rgba(139,92,246,0.15)",color:VL,marginBottom:12 }}>🧮 Simulateur</span>
        <h3 style={{ fontSize:28,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>
          Estimez vos savings en 10 secondes
        </h3>
        <p style={{ fontSize:14,color:S[400],marginTop:8,maxWidth:480,margin:"8px auto 0" }}>
          Saisissez votre volume d'achats annuel — les taux sont issus d'études sectorielles.
        </p>
      </div>

      {/* Input Area */}
      <div style={{
        background:S[850], borderRadius:20, border:`1px solid ${S[700]}`,
        padding:"32px 28px", maxWidth:700, margin:"0 auto",
      }}>
        {/* Spend Slider */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12 }}>
            <label style={{ fontSize:14,fontWeight:600,color:S[200] }}>Volume d'achats annuel</label>
            <div style={{ display:"flex",alignItems:"baseline",gap:4 }}>
              <span style={{ fontSize:36,fontWeight:900,color:VL,letterSpacing:"-0.03em",lineHeight:1 }}>{spend}</span>
              <span style={{ fontSize:16,fontWeight:600,color:S[400] }}>M€</span>
            </div>
          </div>
          <input
            type="range" min={1} max={100} step={1} value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            style={{
              width:"100%",height:6,borderRadius:3,appearance:"none",WebkitAppearance:"none",
              background:sliderBg, outline:"none",cursor:"pointer",
            }}
          />
          <style>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance:none; width:22px; height:22px; border-radius:50%;
              background:${VL}; border:3px solid ${S[900]}; cursor:pointer;
              box-shadow:0 0 12px rgba(139,92,246,0.4);
            }
            input[type=range]::-moz-range-thumb {
              width:22px; height:22px; border-radius:50%;
              background:${VL}; border:3px solid ${S[900]}; cursor:pointer;
              box-shadow:0 0 12px rgba(139,92,246,0.4);
            }
          `}</style>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:S[500],marginTop:6 }}>
            <span>1M€</span><span>25M€</span><span>50M€</span><span>75M€</span><span>100M€</span>
          </div>
        </div>

        {/* Margin input */}
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24,padding:"12px 16px",borderRadius:10,background:S[800] }}>
          <span style={{ fontSize:13,color:S[400],whiteSpace:"nowrap" }}>Marge nette</span>
          <div style={{ display:"flex",alignItems:"center",gap:4 }}>
            {[3,5,8,10].map(m => (
              <button key={m} onClick={() => setMargin(m)} style={{
                padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",
                border: margin===m ? `1px solid ${V}` : `1px solid ${S[600]}`,
                background: margin===m ? `${V}22` : "transparent",
                color: margin===m ? VL : S[400],
                transition:"all 0.2s",
              }}>{m}%</button>
            ))}
          </div>
          <InfoBubble info={{
            title:"Marge nette industrielle",
            calc:"La marge nette détermine le CA additionnel nécessaire pour obtenir le même résultat net que les savings. Ex : 50K€ de savings à 5% de marge = 1M€ de CA équivalent.",
            source:"INSEE Esane 2023 : marge nette médiane industrie manufacturière (C10-C33) = 3,5 à 5%. PME services : 8-12%."
          }} color={S[400]} />
        </div>

        {/* ─── Results ─── */}
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {lines.map((l,i) => (
            <div key={i} style={{
              display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,
              background:S[800],border:`1px solid ${S[700]}`,
              transition:"all 0.4s ease",
            }}>
              <span style={{ fontSize:20,width:28,textAlign:"center" }}>{l.icon}</span>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                  <span style={{ fontSize:12,color:S[300] }}>{l.label}</span>
                  <span style={{ fontSize:10,color:S[500],fontWeight:500 }}>({l.pct.toFixed(1)}% du spend)</span>
                  <InfoBubble info={l.info} color={l.color} />
                </div>
                {/* Progress bar */}
                <div style={{ marginTop:6,height:6,borderRadius:3,background:S[700],overflow:"hidden" }}>
                  <div style={{
                    height:"100%",borderRadius:3,background:l.color,
                    width: `${(l.value/barMax)*100}%`,
                    transition:"width 0.6s ease",
                  }}/>
                </div>
              </div>
              <span style={{ fontSize:18,fontWeight:800,color:l.color,minWidth:60,textAlign:"right",letterSpacing:"-0.02em" }}>
                {fmtK(l.value)}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Total ─── */}
        <div style={{
          marginTop:16,padding:"16px 20px",borderRadius:14,
          background:`linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(16,185,129,0.1) 100%)`,
          border:`1px solid rgba(139,92,246,0.25)`,
        }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:14,fontWeight:700,color:S[200] }}>📊 SAVINGS ESTIMÉS / AN</span>
              <InfoBubble info={{
                title:"Total savings annuel estimé",
                calc:`(0,5% + 0,2% + 0,15%) × ${spend}M€ = 0,85% × ${spend}M€ = ${fmtK(total)}. Estimation conservatrice — les taux réels varient selon le secteur, la maturité achats et le volume de transactions.`,
                source:"Ardent Partners 2024 : world-class procurement = 6% savings rate. CAPS Research : average = 2% cost reduction. Taux KANSO combiné (0,85%) = fourchette basse du marché."
              }} color={EM} />
            </div>
            <span style={{ fontSize:28,fontWeight:900,color:EM,letterSpacing:"-0.03em" }}>{fmtK(total)}</span>
          </div>

          {/* ROI & CA equiv */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
            <div style={{ padding:"10px 12px",borderRadius:10,background:S[850],textAlign:"center" }}>
              <div style={{ fontSize:10,color:S[500],marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em" }}>ROI plateforme</div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:2 }}>
                <span style={{ fontSize:22,fontWeight:900,color:roi>=3?EM:roi>=1.5?AM:RD }}>{fmtROI(roi)}</span>
                <InfoBubble info={{
                  title:"Retour sur investissement",
                  calc:`${fmtK(total)} savings ÷ ${coutAn.toLocaleString("fr-FR")}€ (990€/mois × 12) = ${fmtROI(roi)}`,
                  source:"Coût palier Standard KANSO-OPS : 990€/mois HT. ROI calculé sur base annuelle, savings nets."
                }} color={roi>=3?EM:AM} />
              </div>
              <div style={{ fontSize:10,color:S[500],marginTop:2 }}>vs 990€/mois</div>
            </div>
            <div style={{ padding:"10px 12px",borderRadius:10,background:S[850],textAlign:"center" }}>
              <div style={{ fontSize:10,color:S[500],marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em" }}>CA équivalent</div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:2 }}>
                <span style={{ fontSize:22,fontWeight:900,color:RS }}>{fmtK(caEquiv)}</span>
                <InfoBubble info={{
                  title:"CA commercial équivalent",
                  calc:`${fmtK(total)} savings ÷ ${margin}% marge nette = ${fmtK(caEquiv)} de CA. Il faudrait vendre ${fmtK(caEquiv)} de plus pour obtenir le même résultat net.`,
                  source:`Marge nette sélectionnée : ${margin}%. INSEE Esane 2023 : industrie manufacturière 3,5-5%, services 8-12%.`
                }} color={RS} />
              </div>
              <div style={{ fontSize:10,color:S[500],marginTop:2 }}>à vendre en plus</div>
            </div>
            <div style={{ padding:"10px 12px",borderRadius:10,background:S[850],textAlign:"center" }}>
              <div style={{ fontSize:10,color:S[500],marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em" }}>Coût plateforme</div>
              <div style={{ fontSize:22,fontWeight:900,color:S[300] }}>990€<span style={{ fontSize:12,fontWeight:500 }}>/mois</span></div>
              <div style={{ fontSize:10,color:S[500],marginTop:2 }}>{coutAn.toLocaleString("fr-FR")}€/an</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop:12,fontSize:10,color:S[500],textAlign:"center",lineHeight:1.5,fontStyle:"italic" }}>
            Estimation basée sur des benchmarks sectoriels (Ardent Partners, CAPS Research, IFM). Les résultats réels varient selon votre secteur et maturité achats. Le Flash Audit gratuit vous donnera un chiffrage précis.
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ FACTURE-X SECTION ═══
function FactureXBlock({ data, profile }) {
  const urgencyColor = data.globalScore >= 70 ? EM : data.globalScore >= 50 ? AM : RD;
  return (
    <div style={{
      padding:24,borderRadius:16,
      background:"rgba(245,158,11,0.04)",border:"1px solid rgba(245,158,11,0.12)",
    }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div>
          <div style={{ fontSize:15,fontWeight:700,color:S[100] }}>
            🧾 Facture-X 2026 — Êtes-vous prêts ?
            <InfoBubble info={{ title:"Obligation Facture-X", calc: "Réforme e-invoicing obligatoire pour toutes les entreprises. Obligation de réception au 1er sept. 2026, puis émission par vagues.", source:"DGFIP — Loi de finances 2024, art. 91. Calendrier officiel sept. 2026." }} color={AM}/>
          </div>
          <div style={{ fontSize:11,color:S[500],marginTop:2 }}>Deadline : {data.deadline}</div>
        </div>
        <DonutChart value={data.globalScore} color={urgencyColor} size={56} strokeWidth={5} label="global"/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        {data.axes.map((a,i) => (
          <div key={i} style={{ padding:"10px 12px",borderRadius:10,background:"rgba(30,41,59,0.5)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
              <span style={{ fontSize:11,color:S[400] }}>{a.label}</span>
              <span style={{ fontSize:12,fontWeight:700,color: a.score >= 70 ? EM : a.score >= 50 ? AM : RD }}>{a.score}%</span>
            </div>
            <AnimatedBar value={a.score} color={a.score>=70?EM:a.score>=50?AM:RD} delay={i*0.15}/>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12,fontSize:11,color:S[400],textAlign:"center" }}>
        KANSO-OPS détecte automatiquement les fournisseurs non conformes et suit votre progression vers la conformité
      </div>
    </div>
  );
}

// ═══ INVOICE JOURNEY ═══
function InvoiceJourney({ profile }) {
  const p = PROFILES[profile];
  const steps = [
    { icon: "📨", label: "Réception", sub: "ERP → SharePoint", color: S[400] },
    { icon: "🗄️", label: "Coffre-Fort", sub: "Classifié en < 5s", color: CY },
    { icon: "🔍", label: "Contrôle", sub: "Anomalie détectée", color: AM },
    { icon: "⚔️", label: "Récupération", sub: "Réclamation auto", color: RD },
    { icon: "📡", label: "Veille", sub: "Vérif. marché", color: EM },
    { icon: "🎯", label: "Cockpit", sub: "Saving consolidé", color: RS },
  ];
  return (
    <div style={{ padding:24,borderRadius:16,background:"rgba(30,41,59,0.3)",border:`1px solid ${S[800]}` }}>
      <div style={{ fontSize:14,fontWeight:700,color:S[200],marginBottom:16 }}>
        🔄 Parcours d'une facture dans KANSO-OPS
      </div>
      <div style={{ display:"flex",gap:4,alignItems:"flex-start",overflowX:"auto",paddingBottom:8 }}>
        {steps.map((s,i) => (
          <div key={i} style={{ display:"flex",alignItems:"center",gap:4,flex:"none" }}>
            <div style={{
              textAlign:"center",padding:"10px 8px",borderRadius:10,minWidth:80,
              background:`${s.color}10`,border:`1px solid ${s.color}20`,
            }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:10,fontWeight:700,color:S[200] }}>{s.label}</div>
              <div style={{ fontSize:8,color:S[500],marginTop:2 }}>{s.sub}</div>
            </div>
            {i < steps.length - 1 && <span style={{ color:S[600],fontSize:14,flexShrink:0 }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ IMPACT BUSINESS ═══
function ImpactBlock({ profile }) {
  const p = PROFILES[profile];
  const d = p.impact;
  return (
    <div style={{
      padding:28,borderRadius:16,
      background:"linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(139,92,246,0.05) 100%)",
      border:"1px solid rgba(16,185,129,0.12)",
    }}>
      <div style={{ textAlign:"center",marginBottom:24 }}>
        <span style={{ fontSize:13,fontWeight:600,color:EM,textTransform:"uppercase",letterSpacing:"0.05em" }}>💎 Impact Business</span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
        <div style={{ padding:16,borderRadius:12,background:"rgba(30,41,59,0.5)",textAlign:"center" }}>
          <div style={{ fontSize:11,color:S[500],marginBottom:4 }}>
            Équivalent effort commercial
            <InfoBubble info={{ title: "Conversion savings → CA équivalent", calc: d.caEquivCalc, source: `Marge nette PME industrielle : 3-5% (INSEE Esane 2023, industrie manufacturière). CA ${p.ca}.` }} color={EM}/>
          </div>
          <div style={{ fontSize:24,fontWeight:900,color:EM }}>{d.caEquiv}</div>
          <div style={{ fontSize:10,color:S[500],marginTop:4 }}>de CA qu'il aurait fallu générer</div>
        </div>
        <div style={{ padding:16,borderRadius:12,background:"rgba(30,41,59,0.5)",textAlign:"center" }}>
          <div style={{ fontSize:11,color:S[500],marginBottom:4 }}>
            Temps gagné
            <InfoBubble info={{ title: "Heures économisées", calc: d.hoursCalc, source: "Benchmark interne Kanso-Ops : 18h en moyenne par litige traité manuellement (recherche, réclamation, suivi, relance)." }} color={V}/>
          </div>
          <div style={{ fontSize:24,fontWeight:900,color:V }}>{d.hoursEquiv}</div>
          <div style={{ fontSize:10,color:S[500],marginTop:4 }}>de travail manuel évité</div>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <div style={{ padding:16,borderRadius:12,background:"rgba(30,41,59,0.5)",textAlign:"center" }}>
          <div style={{ fontSize:11,color:S[500],marginBottom:4 }}>
            Déploiement vs classique
            <InfoBubble info={{ title: "Délai de mise en œuvre", calc: d.deployVsClassic, source: "Cabinet Gartner : intégration ERP procurement moyen = 6-18 mois. KANSO-OPS : 5 jours (export SharePoint, pas d'intégration)." }} color={CY}/>
          </div>
          <div style={{ display:"flex",gap:12,justifyContent:"center",alignItems:"baseline",marginTop:4 }}>
            <div><span style={{ fontSize:28,fontWeight:900,color:CY }}>5</span><span style={{ fontSize:12,color:S[400] }}> jours</span></div>
            <span style={{ fontSize:12,color:S[600] }}>vs</span>
            <div><span style={{ fontSize:16,fontWeight:600,color:S[500],textDecoration:"line-through" }}>6-12 mois</span></div>
          </div>
        </div>
        <div style={{ padding:16,borderRadius:12,background:"rgba(30,41,59,0.5)",textAlign:"center" }}>
          <div style={{ fontSize:11,color:S[500],marginBottom:4 }}>
            Coût vs Gains
            <InfoBubble info={{ title: "Ratio coût/bénéfice annuel", calc: `Abonnement annuel : ${d.costSub.toLocaleString("fr-FR")}€ · Savings générés : ${d.savings.toLocaleString("fr-FR")}€ · Ratio : ${Math.round(d.savings/d.costSub)}×`, source: "Facturation Kanso-Ops vs savings réels consolidés dans le Cockpit Dirigeant." }} color={RS}/>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginTop:4 }}>
            <span style={{ fontSize:12,color:S[500],textDecoration:"line-through" }}>{d.costSub.toLocaleString("fr-FR")}€</span>
            <span style={{ fontSize:14,color:S[600] }}>→</span>
            <span style={{ fontSize:22,fontWeight:900,color:EM }}>{(d.savings/1000).toFixed(0)}K€</span>
          </div>
          <div style={{ fontSize:10,color:S[500],marginTop:4 }}>investis → récupérés</div>
        </div>
      </div>
    </div>
  );
}

// ═══ DASHBOARD PREVIEW PAGE — ENHANCED v4 ═══

function ActivityItem({ time, icon, text, type = "auto" }) {
  return (
    <div style={{ display:"flex",gap:10,alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${S[850]}` }}>
      <div style={{ fontSize:9,color:S[600],minWidth:38,marginTop:2,fontFamily:"'JetBrains Mono',monospace" }}>{time}</div>
      <span style={{ fontSize:12,flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1,fontSize:11,color:S[300],lineHeight:1.5 }}>{text}</div>
      <span style={{ fontSize:8,padding:"2px 7px",borderRadius:4,fontWeight:600,flexShrink:0,whiteSpace:"nowrap",
        background: type==="auto" ? "rgba(16,185,129,0.1)" : type==="human" ? "rgba(139,92,246,0.1)" : "rgba(245,158,11,0.1)",
        color: type==="auto" ? EM : type==="human" ? VL : AM,
      }}>{type==="auto" ? "⚡ Auto" : type==="human" ? "👤 Humain" : "⚙️ Config"}</span>
    </div>
  );
}

function ModuleFooter({ activities, configs, configFile }) {
  const [showActivity, setShowActivity] = useState(false);
  return (
    <div style={{ marginTop:16 }}>
      {/* Activity toggle */}
      <button onClick={() => setShowActivity(!showActivity)} style={{
        width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${S[800]}`,
        background:showActivity?"rgba(30,41,59,0.5)":"rgba(30,41,59,0.2)",
        color:S[300],fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
        display:"flex",alignItems:"center",gap:8,transition:"all 0.3s",
      }}>
        <span style={{ fontSize:13 }}>🔄</span>
        Activité des dernières 24h
        <span style={{ marginLeft:"auto",fontSize:10,color:S[500],transform:showActivity?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s" }}>▼</span>
      </button>
      {showActivity && (
        <div style={{ padding:"8px 14px",borderRadius:"0 0 10px 10px",background:"rgba(30,41,59,0.3)",border:`1px solid ${S[850]}`,borderTop:"none",animation:"fadeInUp 0.3s ease" }}>
          {activities.map((a,i) => <ActivityItem key={i} {...a}/>)}
        </div>
      )}

      {/* Config bar */}
      <div style={{ marginTop:10,padding:"10px 14px",borderRadius:10,background:"rgba(245,158,11,0.03)",border:`1px solid rgba(245,158,11,0.08)` }}>
        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:8 }}>
          <span style={{ fontSize:11 }}>⚙️</span>
          <span style={{ fontSize:10,fontWeight:600,color:AM }}>Configurable sans code</span>
          {configFile && <span style={{ marginLeft:"auto",fontSize:9,color:S[600],fontFamily:"'JetBrains Mono',monospace" }}>{configFile}</span>}
        </div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
          {configs.map((c,i) => (
            <span key={i} style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:6,background:`${c.color||V}08`,border:`1px solid ${c.color||V}12`,fontSize:10 }}>
              <span style={{ color:S[500] }}>{c.label}</span>
              <span style={{ fontWeight:600,color:c.color||VL,fontFamily:"'JetBrains Mono',monospace" }}>{c.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPreview({ profile }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: "cockpit", icon: "🎯", name: "Cockpit Dirigeant", color: RS },
    { id: "lk", icon: "⚔️", name: "Récupération Cash", color: RD },
    { id: "iw", icon: "🔍", name: "Contrôle Factures", color: AM },
    { id: "sw", icon: "🏰", name: "Pilotage Fournisseurs", color: V },
    { id: "sentinel", icon: "📡", name: "Veille Marchés", color: EM },
    { id: "dv", icon: "🗄️", name: "Coffre-Fort", color: CY },
  ];
  const p = PROFILES[profile];
  const isETI = profile === "eti";

  return (
    <div>
      {/* Module tabs */}
      <div style={{ display:"flex",gap:6,marginBottom:24,flexWrap:"wrap",justifyContent:"center" }}>
        {tabs.map((t,i) => (
          <button key={t.id} onClick={() => setActiveTab(i)} style={{
            padding:"8px 16px",borderRadius:10,border:`1px solid ${activeTab===i ? t.color+"44" : S[700]}`,
            background: activeTab===i ? `${t.color}12` : "transparent",
            color: activeTab===i ? t.color : S[400],
            fontSize:12,fontWeight:activeTab===i?700:500,cursor:"pointer",fontFamily:"inherit",
            display:"flex",alignItems:"center",gap:6,transition:"all 0.2s",
          }}>
            <span style={{ fontSize:14 }}>{t.icon}</span>{t.name}
          </button>
        ))}
      </div>

      {/* Dashboard mockup */}
      <div style={{
        borderRadius:16,overflow:"hidden",
        background:S[900],border:`1px solid ${S[700]}`,
        boxShadow:"0 20px 60px rgba(0,0,0,0.4)",
      }}>
        {/* Title bar */}
        <div style={{
          padding:"10px 16px",background:S[850],borderBottom:`1px solid ${S[700]}`,
          display:"flex",alignItems:"center",gap:8,
        }}>
          <div style={{ display:"flex",gap:6 }}>
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#ef4444" }}/>
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#f59e0b" }}/>
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#10b981" }}/>
          </div>
          <div style={{ flex:1,textAlign:"center",fontSize:11,color:S[500],fontFamily:"monospace",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
            <PulseDot color={EM} size={5}/> app.kanso-ops.com — {tabs[activeTab].name}
          </div>
        </div>

        {/* Content */}
        <div key={`${activeTab}-${profile}`} style={{ padding:24,minHeight:420,animation:"fadeInUp 0.3s ease" }}>
          {activeTab === 0 && <CockpitPreview p={p} isETI={isETI}/>}
          {activeTab === 1 && <LKPreview p={p} isETI={isETI}/>}
          {activeTab === 2 && <IWPreview p={p} isETI={isETI}/>}
          {activeTab === 3 && <SWPreview p={p} isETI={isETI}/>}
          {activeTab === 4 && <SentinelPreview p={p} isETI={isETI}/>}
          {activeTab === 5 && <DVPreview p={p} isETI={isETI}/>}
        </div>
      </div>

      {/* ═══ BELOW DASHBOARD — THREE PILLARS ═══ */}
      <div style={{ marginTop:32,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16 }}>
        {[
          { icon:"⚡",title:"100% automatique",color:EM,desc:"Ingestion, classification IA, détection d'écarts, alertes, scoring fournisseurs, scraping indices, rapports PDF mensuels. Tout tourne en continu, jour et nuit." },
          { icon:"👤",title:"Validation humaine ciblée",color:VL,desc:"Clauses de révision, escalades litiges, Go/No-Go. L'IA mâche le travail — le DAF confirme. Jamais de décision non validée." },
          { icon:"⚙️",title:"Configurable sans code",color:AM,desc:"Règles de détection, poids du scoring, seuils d'alerte, indices suivis. Tout se modifie dans un fichier JSON — pas de développeur requis." },
        ].map((p,i) => (
          <div key={i} className="glass-hover" style={{ padding:20,borderRadius:14,background:`${p.color}04`,border:`1px solid ${p.color}12` }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
              <span style={{ fontSize:18 }}>{p.icon}</span>
              <span style={{ fontSize:13,fontWeight:700,color:p.color }}>{p.title}</span>
            </div>
            <div style={{ fontSize:11,color:S[400],lineHeight:1.7 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockKPI({ label, value, color, sub }) {
  return (
    <div className="kpi-card" style={{ padding:14,borderRadius:12,background:"rgba(30,41,59,0.6)",border:`1px solid ${S[800]}`,textAlign:"center",flex:1 }}>
      <div style={{ fontSize:22,fontWeight:800,color }}>{value}</div>
      <div style={{ fontSize:10,color:S[500],marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:8,color:S[600],marginTop:1 }}>{sub}</div>}
    </div>
  );
}

function MockTable({ headers, rows }) {
  return (
    <div style={{ borderRadius:10,overflow:"hidden",border:`1px solid ${S[800]}`,fontSize:11 }}>
      <div style={{ display:"grid",gridTemplateColumns:`repeat(${headers.length},1fr)`,background:S[850],padding:"8px 12px",gap:8 }}>
        {headers.map((h,i) => <div key={i} style={{ fontWeight:600,color:S[400] }}>{h}</div>)}
      </div>
      {rows.map((row,i) => (
        <div key={i} style={{ display:"grid",gridTemplateColumns:`repeat(${headers.length},1fr)`,padding:"8px 12px",gap:8,borderTop:`1px solid ${S[850]}`,animation:`fadeInUp 0.3s ease ${i*0.05}s both` }}>
          {row.map((cell,j) => <div key={j} style={{ color: typeof cell === 'object' ? cell.color : S[300] }}>{typeof cell === 'object' ? cell.text : cell}</div>)}
        </div>
      ))}
    </div>
  );
}

// ═══ COCKPIT DIRIGEANT ═══
function CockpitPreview({ p, isETI }) {
  const [subTab, setSubTab] = useState(0);
  const tabs = ["Savings & ROI","Conformité","Risque","Performance","Équipe","Prix"];
  const cd = p.modules["cockpit-daf"];

  const TabContent = () => {
    // ═══ TAB 0 — SAVINGS & ROI ═══
    if (subTab === 0) return (
      <div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
          <MockKPI label="Savings YTD" value={cd.savings} color={EM} sub="cumulés"/>
          <MockKPI label="ROI plateforme" value={cd.roi} color={V} sub="annualisé"/>
          <MockKPI label="Cash récupéré" value={isETI?"265K€":"28K€"} color={RD} sub="litiges"/>
          <MockKPI label="Fuites évitées" value={isETI?"120K€":"11K€"} color={AM} sub="bloquées"/>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:10 }}>Savings par source</div>
            {[{l:"Litiges récupérés",v:55,c:RD,m:isETI?"146K€":"15K€"},{l:"Fuites évitées",v:25,c:AM,m:isETI?"120K€":"11K€"},{l:"Hausses refusées",v:20,c:EM,m:isETI?"95K€":"6K€"}].map((b,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <span style={{ fontSize:9,color:S[400],width:95 }}>{b.l}</span>
                <div style={{ flex:1,height:6,borderRadius:3,background:S[800] }}><div style={{ height:"100%",borderRadius:3,width:`${b.v}%`,background:b.c,transition:"width 1s" }}/></div>
                <span style={{ fontSize:10,color:b.c,width:46,textAlign:"right",fontWeight:600 }}>{b.m}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <span style={{ fontSize:10,color:S[500] }}>Tendance savings 12 mois</span>
              <span style={{ fontSize:10,color:EM,fontWeight:600 }}>{cd.trend}</span>
            </div>
            <Sparkline data={cd.sparkline} color={EM} width={200} height={60}/>
          </div>
        </div>
        <div style={{ padding:12,borderRadius:10,background:"rgba(16,185,129,0.05)",border:`1px solid rgba(16,185,129,0.1)` }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,textAlign:"center" }}>
            <div>
              <div style={{ fontSize:9,color:S[500] }}>Coût annuel Kanso</div>
              <div style={{ fontSize:16,fontWeight:700,color:S[300] }}>11 880€</div>
            </div>
            <div>
              <div style={{ fontSize:9,color:S[500] }}>Savings générés</div>
              <div style={{ fontSize:16,fontWeight:700,color:EM }}>{cd.savings}</div>
            </div>
            <div>
              <div style={{ fontSize:9,color:S[500] }}>Ratio investissement</div>
              <div style={{ fontSize:16,fontWeight:700,color:V }}>{cd.roi}</div>
            </div>
          </div>
        </div>
      </div>
    );

    // ═══ TAB 1 — CONFORMITÉ ═══
    if (subTab === 1) return (
      <div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
          <MockKPI label="Sous contrat" value="87%" color={CY} sub={`${isETI?"244":"33"} fournisseurs`}/>
          <MockKPI label="Hors contrat" value={isETI?"14":"2"} color={RD} sub={`> 10K€/an`}/>
          <MockKPI label="Certifs valides" value={isETI?"92%":"88%"} color={EM} sub="du panel"/>
          <MockKPI label="Expirations 30j" value={isETI?"7":"2"} color={AM} sub="à renouveler"/>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:10 }}>Couverture contrats</div>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <DonutChart value={87} color={CY} size={72} strokeWidth={7}/>
              <div>
                {[{l:"Sous contrat cadre",v:isETI?"244":"33",c:CY},{l:"Hors contrat > 10K€",v:isETI?"14":"2",c:RD},{l:"Hors contrat < 10K€",v:isETI?"22":"3",c:S[500]}].map((r,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4,fontSize:10 }}>
                    <span style={{ width:6,height:6,borderRadius:"50%",background:r.c,flexShrink:0 }}/>
                    <span style={{ color:S[400] }}>{r.l}</span>
                    <span style={{ fontWeight:600,color:r.c,marginLeft:"auto" }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:10 }}>Taux de conformité 12 mois</div>
            <Sparkline data={[62,65,68,71,74,76,78,80,82,84,86,87]} color={CY} width={200} height={60}/>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:6 }}>
              <span style={{ fontSize:9,color:S[600] }}>janv. (62%)</span>
              <span style={{ fontSize:9,color:CY,fontWeight:600 }}>fév. (87%)</span>
            </div>
          </div>
        </div>
        <div style={{ padding:10,borderRadius:8,background:"rgba(6,182,212,0.06)",fontSize:11,color:S[400],textAlign:"center" }}>
          🎯 Objectif : 90% de conformité à 12 mois · Progression : +25 pts depuis le lancement
        </div>
      </div>
    );

    // ═══ TAB 2 — RISQUE ═══
    if (subTab === 2) return (
      <div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
          <MockKPI label="Score panel" value={isETI?"76":"72"} color={V} sub="/100 moyen"/>
          <MockKPI label="Fournisseurs critiques" value={isETI?"18":"3"} color={RD} sub="score < 50"/>
          <MockKPI label="Dépendances" value={isETI?"6":"1"} color={AM} sub="> 25%"/>
          <MockKPI label="Alertes actives" value={isETI?"42":"5"} color={AM} sub="à traiter"/>
        </div>
        <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}`,marginBottom:12 }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:10 }}>Répartition du panel par niveau de risque</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10 }}>
            {[
              {level:"Minimal",range:"80-100",count:isETI?"112":"14",pct:isETI?"40%":"37%",c:EM},
              {level:"Faible",range:"60-79",count:isETI?"98":"15",pct:isETI?"35%":"39%",c:CY},
              {level:"Moyen",range:"40-59",count:isETI?"52":"6",pct:isETI?"19%":"16%",c:AM},
              {level:"Élevé",range:"< 40",count:isETI?"18":"3",pct:isETI?"6%":"8%",c:RD},
            ].map((r,i) => (
              <div key={i} style={{ textAlign:"center",padding:12,borderRadius:10,background:`${r.c}06`,border:`1px solid ${r.c}10` }}>
                <div style={{ fontSize:20,fontWeight:800,color:r.c }}>{r.count}</div>
                <div style={{ fontSize:10,fontWeight:600,color:S[300],marginTop:2 }}>{r.level}</div>
                <div style={{ fontSize:9,color:S[500] }}>score {r.range}</div>
                <div style={{ fontSize:9,color:r.c,fontWeight:600,marginTop:2 }}>{r.pct} du panel</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Top 3 fournisseurs à risque</div>
            {[
              {name:"PROTO Mécanique",score:54,issue:"ISO 9001 expirée"},
              {name:isETI?"HARTMANN Ind.":"DELRIN Compo.",score:isETI?42:48,issue:"Dépendance 29%"},
              {name:isETI?"VEGA Plastiques":"NEXON Plast.",score:isETI?38:45,issue:"3 litiges ouverts"},
            ].map((f,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderTop:i?`1px solid ${S[850]}`:"none" }}>
                <span style={{ fontSize:14,fontWeight:800,color:f.score<50?RD:AM,width:24 }}>{f.score}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10,fontWeight:600,color:S[300] }}>{f.name}</div>
                  <div style={{ fontSize:9,color:S[500] }}>{f.issue}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Score panel 12 mois</div>
            <Sparkline data={p.modules["supplier-watchtower"].sparkline} color={V} width={200} height={60}/>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:6 }}>
              <span style={{ fontSize:9,color:S[600] }}>janv.</span>
              <span style={{ fontSize:9,color:V,fontWeight:600 }}>↗ Tendance haussière</span>
            </div>
          </div>
        </div>
      </div>
    );

    // ═══ TAB 3 — PERFORMANCE ACHATS ═══
    if (subTab === 3) return (
      <div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
          <MockKPI label="Litiges résolus" value={isETI?"78%":"74%"} color={EM} sub="taux de clôture"/>
          <MockKPI label="Délai moyen" value={isETI?"22j":"18j"} color={CY} sub="résolution"/>
          <MockKPI label="Docs traités" value={isETI?"15,4K":"1 840"} color={V} sub="par le Data Vault"/>
          <MockKPI label="Alertes traitées" value={isETI?"89%":"85%"} color={EM} sub="dans les 72h"/>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:10 }}>KPIs opérationnels vs objectifs</div>
            {[
              {l:"Taux de récupération",actual:isETI?78:74,target:75,c:EM},
              {l:"Délai résolution",actual:isETI?82:85,target:80,c:CY},
              {l:"Conformité panel",actual:87,target:90,c:V},
              {l:"Alertes < 72h",actual:isETI?89:85,target:85,c:AM},
            ].map((k,i) => (
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                  <span style={{ fontSize:10,color:S[400] }}>{k.l}</span>
                  <span style={{ fontSize:10,fontWeight:600,color:k.actual>=k.target?EM:AM }}>{k.actual}% <span style={{ color:S[600],fontWeight:400 }}>/ obj. {k.target}%</span></span>
                </div>
                <div style={{ position:"relative",height:6,borderRadius:3,background:S[800] }}>
                  <div style={{ height:"100%",borderRadius:3,width:`${k.actual}%`,background:k.actual>=k.target?EM:AM,transition:"width 1s" }}/>
                  <div style={{ position:"absolute",top:-2,left:`${k.target}%`,width:2,height:10,background:S[400],borderRadius:1 }}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Volume traité par module / mois</div>
            {[
              {mod:"Coffre-Fort",icon:"🗄️",v:isETI?1240:152,max:isETI?1500:200,c:CY},
              {mod:"Récupération Cash",icon:"⚔️",v:isETI?47:8,max:isETI?60:15,c:RD},
              {mod:"Contrôle Factures",icon:"🔍",v:isETI?89:12,max:isETI?120:20,c:AM},
              {mod:"Pilotage Fourn.",icon:"🏰",v:isETI?280:38,max:isETI?300:50,c:V},
              {mod:"Veille Marchés",icon:"📡",v:isETI?42:14,max:isETI?50:20,c:EM},
            ].map((m,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <span style={{ fontSize:10,width:12 }}>{m.icon}</span>
                <span style={{ fontSize:9,color:S[400],width:90 }}>{m.mod}</span>
                <div style={{ flex:1,height:5,borderRadius:3,background:S[800] }}><div style={{ height:"100%",borderRadius:3,width:`${(m.v/m.max)*100}%`,background:m.c,transition:"width 1s" }}/></div>
                <span style={{ fontSize:9,color:m.c,fontWeight:600,width:32,textAlign:"right" }}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // ═══ TAB 4 — ÉQUIPE (admin only) ═══
    if (subTab === 4) return (
      <div>
        <div style={{ padding:10,borderRadius:8,background:"rgba(139,92,246,0.06)",border:`1px solid rgba(139,92,246,0.1)`,marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:12 }}>🔒</span>
          <span style={{ fontSize:10,color:VL,fontWeight:600 }}>Vue réservée admin (DAF / CPO)</span>
          <span style={{ fontSize:10,color:S[500] }}>— Comparaison par acheteur</span>
        </div>
        <div style={{ borderRadius:10,overflow:"hidden",border:`1px solid ${S[800]}`,fontSize:11,marginBottom:12 }}>
          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",background:S[850],padding:"8px 12px",gap:8 }}>
            {["Acheteur","Litiges","Taux récup.","Délai moy.","Alertes < 72h","Score"].map((h,i) => <div key={i} style={{ fontWeight:600,color:S[400] }}>{h}</div>)}
          </div>
          {[
            {name:isETI?"Marie Dupont":"Marie D.",litiges:isETI?"72":"8",taux:"82%",delai:"19j",alertes:"94%",score:88,best:true},
            {name:isETI?"Thomas Martin":"Thomas M.",litiges:isETI?"68":"6",taux:"76%",delai:"24j",alertes:"87%",score:79},
            {name:isETI?"Julie Bernard":"Julie B.",litiges:isETI?"54":"5",taux:"71%",delai:"28j",alertes:"78%",score:68},
            ...(isETI?[{name:"Lucas Petit",litiges:"53",taux:"69%",delai:"31j",alertes:"72%",score:62}]:[]),
          ].map((a,i) => (
            <div key={i} style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"10px 12px",gap:8,borderTop:`1px solid ${S[850]}`,background:a.best?"rgba(16,185,129,0.03)":"transparent" }}>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <div style={{ width:24,height:24,borderRadius:"50%",background:`${V}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:VL }}>{a.name.charAt(0)}</div>
                <span style={{ color:S[200],fontWeight:a.best?600:400 }}>{a.name}</span>
                {a.best && <span style={{ fontSize:8,padding:"1px 6px",borderRadius:4,background:"rgba(16,185,129,0.1)",color:EM,fontWeight:600 }}>Top</span>}
              </div>
              <div style={{ color:S[300] }}>{a.litiges}</div>
              <div style={{ color:parseInt(a.taux)>=75?EM:AM,fontWeight:600 }}>{a.taux}</div>
              <div style={{ color:parseInt(a.delai)<=22?EM:parseInt(a.delai)<=26?AM:RD }}>{a.delai}</div>
              <div style={{ color:parseInt(a.alertes)>=85?EM:AM }}>{a.alertes}</div>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                  <div style={{ flex:1,height:4,borderRadius:2,background:S[800] }}><div style={{ height:"100%",borderRadius:2,width:`${a.score}%`,background:a.score>=80?EM:a.score>=65?AM:RD }}/></div>
                  <span style={{ fontSize:10,fontWeight:700,color:a.score>=80?EM:a.score>=65?AM:RD }}>{a.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Répartition litiges par acheteur</div>
            {[
              {name:isETI?"Marie D.":"Marie",v:isETI?72:8,c:EM},
              {name:isETI?"Thomas M.":"Thomas",v:isETI?68:6,c:CY},
              {name:isETI?"Julie B.":"Julie",v:isETI?54:5,c:V},
              ...(isETI?[{name:"Lucas P.",v:53,c:AM}]:[]),
            ].map((a,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                <span style={{ fontSize:9,color:S[400],width:60 }}>{a.name}</span>
                <div style={{ flex:1,height:5,borderRadius:3,background:S[800] }}><div style={{ height:"100%",borderRadius:3,width:`${(a.v/(isETI?80:10))*100}%`,background:a.c }}/></div>
                <span style={{ fontSize:9,color:a.c,fontWeight:600,width:20,textAlign:"right" }}>{a.v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Score par acheteur — tendance 6 mois</div>
            <Sparkline data={[72,74,77,80,84,88]} color={EM} width={90} height={30}/>
            <div style={{ fontSize:9,color:S[500],marginTop:4 }}>{isETI?"Marie Dupont":"Marie D."} — meilleure progression</div>
            <div style={{ marginTop:8 }}/>
            <Sparkline data={[75,73,72,70,68,62]} color={RD} width={90} height={30}/>
            <div style={{ fontSize:9,color:S[500],marginTop:4 }}>{isETI?"Lucas Petit":"Julie B."} — nécessite un accompagnement</div>
          </div>
        </div>
      </div>
    );

    // ═══ TAB 5 — PRESSION PRIX ═══
    if (subTab === 5) return (
      <div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
          <MockKPI label="Catégories suivies" value={isETI?"12":"6"} color={EM} sub="avec indices"/>
          <MockKPI label="Hausse moy. marché" value="+4,2%" color={AM} sub="pondérée"/>
          <MockKPI label="Hausse moy. demandée" value="+7,8%" color={RD} sub="fournisseurs"/>
          <MockKPI label="Écart injustifié" value="3,6 pts" color={EM} sub="levier négo"/>
        </div>
        <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}`,marginBottom:12 }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:12 }}>Carte de pression par catégorie</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(100px, 1fr))",gap:8 }}>
            {[
              {cat:"Acier",delta:"+14%",asked:"+22%",level:"Chaud",c:RD,emoji:"🔴"},
              {cat:"Électronique",delta:"+5%",asked:"+11%",level:"Tiède",c:AM,emoji:"🟠"},
              {cat:"Plastique",delta:"+1%",asked:"+6%",level:"Froid",c:EM,emoji:"🟢"},
              {cat:"Emballage",delta:"-3%",asked:"+4%",level:"Baisse",c:CY,emoji:"🔵"},
              ...(isETI?[
                {cat:"Chimie",delta:"+8%",asked:"+15%",level:"Chaud",c:RD,emoji:"🔴"},
                {cat:"Transport",delta:"+3%",asked:"+9%",level:"Tiède",c:AM,emoji:"🟠"},
              ]:[]),
            ].map((x,i) => (
              <div key={i} style={{ textAlign:"center",padding:12,borderRadius:10,background:`${x.c}06`,border:`1px solid ${x.c}10` }}>
                <div style={{ fontSize:9,color:S[500] }}>{x.emoji} {x.level}</div>
                <div style={{ fontSize:12,fontWeight:700,color:S[200],margin:"4px 0" }}>{x.cat}</div>
                <div style={{ fontSize:18,fontWeight:800,color:x.c }}>{x.delta}</div>
                <div style={{ fontSize:8,color:S[600],marginTop:2 }}>marché réel</div>
                <div style={{ width:"100%",height:1,background:S[800],margin:"6px 0" }}/>
                <div style={{ fontSize:10,color:RD,fontWeight:600 }}>{x.asked}</div>
                <div style={{ fontSize:8,color:S[600] }}>demandé fournisseurs</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Indice acier (base 100) — 12 mois</div>
            <Sparkline data={[100,102,105,108,110,109,111,114,118,122,128,134]} color={RD} width={200} height={60}/>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:6 }}>
              <span style={{ fontSize:9,color:S[600] }}>mars 2025</span>
              <span style={{ fontSize:9,color:RD,fontWeight:600 }}>+34% sur 12 mois</span>
            </div>
          </div>
          <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Indice plastique — 12 mois</div>
            <Sparkline data={[100,101,102,103,102,101,100,100,101,101,100,101]} color={EM} width={200} height={60}/>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:6 }}>
              <span style={{ fontSize:9,color:S[600] }}>mars 2025</span>
              <span style={{ fontSize:9,color:EM,fontWeight:600 }}>+1% — stable</span>
            </div>
          </div>
        </div>
      </div>
    );

    return null;
  };

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>🎯</span>
          <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Cockpit Dirigeant</div><div style={{ fontSize:10,color:S[500] }}>Vue stratégique de la performance achats</div></div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:10,color:S[500] }}>
          <PulseDot color={EM} size={5}/> Données temps réel
        </div>
      </div>
      <div style={{ display:"flex",gap:6,marginBottom:16,flexWrap:"wrap" }}>
        {tabs.map((t,i) => <button key={i} onClick={() => setSubTab(i)} style={{ padding:"5px 10px",borderRadius:6,fontSize:10,fontWeight:subTab===i?700:400,background:subTab===i?`${V}20`:S[850],color:subTab===i?VL:S[500],border:`1px solid ${subTab===i?V+"30":"transparent"}`,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s" }}>{t}</button>)}
      </div>

      <div key={subTab} style={{ animation:"fadeInUp 0.3s ease" }}>
        <TabContent/>
      </div>

      {/* Report block */}
      <div style={{ padding:12,borderRadius:10,background:"rgba(139,92,246,0.05)",border:`1px solid rgba(139,92,246,0.1)`,display:"flex",alignItems:"center",gap:10,marginTop:16 }}>
        <span style={{ fontSize:14 }}>📄</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11,fontWeight:600,color:S[200] }}>Rapport mensuel — Février 2026</div>
          <div style={{ fontSize:10,color:S[500] }}>PDF auto · 4 pages · Couvre les 6 onglets · Fait marquant IA</div>
        </div>
        <span style={{ padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:"rgba(139,92,246,0.15)",color:VL,cursor:"pointer" }}>Télécharger</span>
      </div>

      <ModuleFooter
        activities={[
          { time:"06:01",icon:"📊",text:"Snapshot mensuel : 6 onglets calculés depuis tous les modules",type:"auto" },
          { time:"06:02",icon:"📄",text:"Rapport PDF généré (4 pages) — fait marquant IA : acier +14%, 4 fournisseurs impactés",type:"auto" },
          { time:"08:15",icon:"📧",text:"Rapport envoyé à la direction (destinataires configurés dans cockpit_config.json)",type:"auto" },
          { time:"09:00",icon:"👤",text:"DAF consulte l'onglet Équipe — note la progression de Marie (+12 pts en 6 mois)",type:"human" },
        ]}
        configs={[
          { label:"Objectif savings",value:isETI?"500K€":"60K€",color:EM },
          { label:"Objectif conformité",value:"90%",color:CY },
          { label:"Objectif délai",value:"< 30j",color:V },
          { label:"Destinataires",value:isETI?"3":"1",color:V },
          { label:"Snapshot",value:"1er/mois",color:CY },
          { label:"Fait IA",value:"activé",color:EM },
        ]}
        configFile="cockpit_config.json"
      />
    </div>
  );
}

// ═══ RÉCUPÉRATION CASH ═══
function LKPreview({ p, isETI }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>⚔️</span>
          <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Récupération Cash</div><div style={{ fontSize:10,color:S[500] }}>Détection automatique — Graduation Diplomatique</div></div>
        </div>
        <div style={{ fontSize:10,color:S[500],display:"flex",alignItems:"center",gap:4 }}><PulseDot color={RD} size={5}/> {isETI?"247":"19"} écarts actifs</div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
        <MockKPI label="Écarts détectés" value={p.modules["litige-killer"].detected} color={RD}/>
        <MockKPI label="Cash récupéré" value={p.modules["litige-killer"].recovered} color={EM}/>
        <MockKPI label="Taux récup." value={p.modules["litige-killer"].rate} color={V}/>
        <MockKPI label="Délai moyen" value={isETI?"22j":"18j"} color={CY}/>
      </div>

      {/* Graduation pipeline */}
      <div style={{ padding:12,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}`,marginBottom:12 }}>
        <div style={{ fontSize:10,color:S[500],marginBottom:10 }}>Pipeline Graduation Diplomatique</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8 }}>
          {[
            {step:"Soft Check",count:isETI?42:3,color:AM,desc:"Email courtois + preuves"},
            {step:"Relance",count:isETI?18:2,color:AM,desc:"Rappel formel"},
            {step:"Escalade DAF",count:isETI?8:1,color:RD,desc:"Direction impliquée"},
            {step:"Compensation",count:isETI?3:0,color:RS,desc:"Déduction sur facture"},
          ].map((s,i) => (
            <div key={i} style={{ textAlign:"center",padding:10,borderRadius:8,background:`${s.color}06`,border:`1px solid ${s.color}10` }}>
              <div style={{ fontSize:18,fontWeight:800,color:s.color }}>{s.count}</div>
              <div style={{ fontSize:9,fontWeight:600,color:S[300] }}>{s.step}</div>
              <div style={{ fontSize:8,color:S[600],marginTop:1 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <MockTable
        headers={["Fournisseur","Règle","Écart","Montant","Phase","Depuis"]}
        rows={[
          ["ACME Industries","R1 — Écart prix","+12%",{text:"15 280€",color:RD},{text:"Soft Check",color:AM},"3j"],
          ["DELRIN Compo.","R2 — Err. virgule","×10",{text:"8 450€",color:RD},{text:"✅ Résolu",color:EM},"—"],
          ["PROTO Méca.","R3 — Doublon","100%",{text:"3 200€",color:RD},{text:"✅ Auto-résolu",color:EM},"—"],
          ["SIGMA Elect.","R4 — Hors grille","+22%",{text:"6 780€",color:RD},{text:"🔴 Escalade",color:RS},"14j"],
          ...(isETI?[["BERTIN Ind.","R1 — Écart prix","+8%",{text:"22 100€",color:RD},{text:"Relance",color:AM},"7j"]]:[]),
        ]}
      />

      <ModuleFooter
        activities={[
          { time:"02:00",icon:"🔍",text:`Scan automatique — ${isETI?"178":"12"} factures analysées vs contrats en vigueur`,type:"auto" },
          { time:"02:01",icon:"🚨",text:`${isETI?"3 nouveaux":"1 nouvel"} écart(s) détecté(s) — liasses de preuve générées`,type:"auto" },
          { time:"08:30",icon:"📧",text:"Soft Check envoyé à ACME — email courtois + PDF preuves joint",type:"auto" },
          { time:"09:00",icon:"⏫",text:"SIGMA : pas de réponse 14j → auto-graduation vers Escalade DAF",type:"auto" },
          { time:"11:20",icon:"✅",text:"PROTO : avoir reçu dans le Coffre-Fort → litige auto-résolu (3 200€)",type:"auto" },
          { time:"14:30",icon:"👤",text:"DAF valide l'escalade SIGMA — compensation sur prochaine facture",type:"human" },
        ]}
        configs={[
          { label:"Seuil R1",value:"écart > 2%",color:RD },
          { label:"R2 virgule",value:"×5 min",color:RD },
          { label:"Soft Check",value:"auto J+1",color:AM },
          { label:"Escalade",value:"auto J+14",color:RS },
          { label:"Templates",value:"3 paliers",color:V },
        ]}
        configFile="detection_config.json"
      />
    </div>
  );
}

// ═══ CONTRÔLE FACTURES ═══
function IWPreview({ p, isETI }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>🔍</span>
          <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Contrôle Factures</div><div style={{ fontSize:10,color:S[500] }}>Détection temps réel — Avant paiement</div></div>
        </div>
        <div style={{ fontSize:10,color:S[500],display:"flex",alignItems:"center",gap:4 }}><PulseDot color={AM} size={5}/> Surveillance continue</div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
        <MockKPI label="Bloquées" value={p.modules["invoice-watchdog"].blocked} color={AM}/>
        <MockKPI label="Fuites évitées" value={p.modules["invoice-watchdog"].saved} color={EM}/>
        <MockKPI label="Détection" value={p.modules["invoice-watchdog"].realtime} color={CY}/>
        <MockKPI label="Validées OK" value={isETI?"1 247":"156"} color={EM} sub="sans anomalie"/>
      </div>

      {/* Live alert */}
      <div style={{ padding:14,borderRadius:12,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",marginBottom:12,animation:"breathe 3s ease-in-out infinite" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
          <PulseDot color={RD} size={8}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:700,color:RD }}>Alerte temps réel — Paiement bloqué</div>
            <div style={{ fontSize:10,color:S[400],marginTop:2 }}>FA-2026-0847 · ACME Industries · +12% vs contrat · 15 280€</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginLeft:22 }}>
          {[{l:"🚫 Confirmer blocage",c:RD},{l:"✅ Valider paiement",c:EM},{l:"↗️ Transférer au LK",c:V}].map((b,i) => (
            <span key={i} style={{ padding:"5px 12px",borderRadius:8,fontSize:10,fontWeight:600,background:`${b.c}15`,color:b.c,cursor:"pointer" }}>{b.l}</span>
          ))}
        </div>
      </div>

      <MockTable
        headers={["Facture","Fournisseur","Anomalie","Impact","Décision","Quand"]}
        rows={[
          ["FA-2026-0912","PROTO Méca.","Doublon suspect",{text:"3 200€",color:AM},{text:"🔴 Bloqué",color:RD},"Il y a 2h"],
          ["FA-2026-0908","SIGMA Elect.","Hors grille +15%",{text:"1 890€",color:AM},{text:"✅ Validé",color:EM},"Hier 16h"],
          ["FA-2026-0901","ACME Ind.","Écart prix +12%",{text:"5 670€",color:AM},{text:"↗️ Transféré",color:V},"Hier 09h"],
          ["FA-2026-0895","BERTIN Ind.","Qté ≠ BDC",{text:"890€",color:AM},{text:"✅ Auto-résolu",color:EM},"Lundi"],
          ...(isETI?[["FA-2026-0887","NEXON Plast.","R2 Virgule ×10",{text:"14 300€",color:AM},{text:"🔴 Bloqué",color:RD},"Lundi"]]:[]),
        ]}
      />

      <ModuleFooter
        activities={[
          { time:"07:12",icon:"📨",text:"Nouvelle facture ACME reçue dans le Coffre-Fort → analyse automatique",type:"auto" },
          { time:"07:12",icon:"🚨",text:"Anomalie détectée en 1,4s : +12% vs contrat → paiement bloqué automatiquement",type:"auto" },
          { time:"07:13",icon:"📋",text:"Liasse de preuve PDF générée : contrat + facture + historique prix",type:"auto" },
          { time:"10:00",icon:"👤",text:"DAF confirme le blocage ACME → transféré au module Récupération Cash",type:"human" },
          { time:"14:20",icon:"✅",text:"BERTIN : avoir correspondant arrivé → alerte auto-résolue (890€)",type:"auto" },
        ]}
        configs={[
          { label:"Blocage auto",value:"écart > 2%",color:RD },
          { label:"Doublon",value:"même ref + 30j",color:AM },
          { label:"Notif",value:"email + dashboard",color:V },
          { label:"Auto-resolve",value:"avoir ± 5%",color:EM },
        ]}
        configFile="iw_config.json"
      />
    </div>
  );
}

// ═══ PILOTAGE FOURNISSEURS ═══
function SWPreview({ p, isETI }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>🏰</span>
          <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Pilotage Fournisseurs</div><div style={{ fontSize:10,color:S[500] }}>Scoring 5 axes — Alertes — Briefing pré-RDV</div></div>
        </div>
        <div style={{ fontSize:10,color:S[500],display:"flex",alignItems:"center",gap:4 }}><PulseDot color={V} size={5}/> Score recalculé chaque nuit</div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
        <MockKPI label="Fournisseurs" value={p.modules["supplier-watchtower"].suppliers} color={V}/>
        <MockKPI label="Alertes actives" value={p.modules["supplier-watchtower"].alerts} color={AM}/>
        <MockKPI label="Hors contrat" value={p.modules["supplier-watchtower"].horsContrat} color={RD}/>
        <MockKPI label="Score moyen" value={isETI?"76":"72"} color={V} sub="/100"/>
      </div>

      {/* Supplier cards with 5-axis mini bars */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
        {[
          {name:"ACME Industries",score:82,trend:"+3",axes:[90,72,85,88,78],spend:isETI?"2,4M€":"42K€"},
          {name:"PROTO Mécanique",score:54,trend:"-8",axes:[42,38,72,55,62],spend:isETI?"890K€":"18K€"},
          {name:"SIGMA Électronique",score:91,trend:"+1",axes:[95,92,82,94,90],spend:isETI?"3,1M€":"56K€"},
          {name:"DELRIN Composants",score:67,trend:"-2",axes:[78,55,48,72,80],spend:isETI?"1,6M€":"28K€"},
        ].map((f,i) => (
          <div key={i} style={{ padding:14,borderRadius:12,background:"rgba(30,41,59,0.5)",border:`1px solid ${S[800]}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:S[200] }}>{f.name}</div>
                <div style={{ fontSize:9,color:S[500] }}>Spend : {f.spend}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22,fontWeight:800,color:f.score>=80?EM:f.score>=60?AM:RD }}>{f.score}</div>
                <div style={{ fontSize:9,color:f.trend.startsWith("+")?EM:RD,fontWeight:600 }}>{f.trend} pts</div>
              </div>
            </div>
            <div style={{ display:"flex",gap:3 }}>
              {["Conf.","Litig.","Dép.","Santé","Réact."].map((a,j) => (
                <div key={j} style={{ flex:1 }}>
                  <div style={{ height:4,borderRadius:2,background:S[800] }}><div style={{ height:"100%",borderRadius:2,width:`${f.axes[j]}%`,background:f.axes[j]>=80?EM:f.axes[j]>=60?AM:RD,transition:"width 1s" }}/></div>
                  <div style={{ fontSize:7,color:S[600],textAlign:"center",marginTop:2 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div style={{ padding:12,borderRadius:10,background:"rgba(245,158,11,0.04)",border:`1px solid rgba(245,158,11,0.1)`,marginBottom:12 }}>
        <div style={{ fontSize:10,fontWeight:600,color:AM,marginBottom:8 }}>⚠️ Alertes actives</div>
        {[
          {type:"Certif. expirée",supplier:"PROTO",detail:"ISO 9001 — expirée depuis 12j",u:"haute"},
          {type:"Hors contrat",supplier:"NEXON",detail:`${isETI?"67K€":"12K€"} sans contrat cadre`,u:"moyenne"},
          {type:"Dépendance ↑",supplier:"DELRIN",detail:"18% → 29% en 6 mois",u:"moyenne"},
        ].map((a,i) => (
          <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderTop:i?`1px solid ${S[850]}`:"none",fontSize:10 }}>
            <span style={{ color:a.u==="haute"?RD:AM }}>●</span>
            <span style={{ fontWeight:600,color:S[300],minWidth:78 }}>{a.type}</span>
            <span style={{ color:S[400] }}>{a.supplier}</span>
            <span style={{ color:S[500],flex:1 }}>— {a.detail}</span>
          </div>
        ))}
      </div>

      <div style={{ padding:10,borderRadius:8,background:"rgba(139,92,246,0.06)",display:"flex",alignItems:"center",gap:8,fontSize:11 }}>
        <span>📋</span>
        <span style={{ color:S[300],flex:1 }}>Briefing pré-RDV — scoring + litiges + indices en 1 PDF</span>
        <span style={{ padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:"rgba(139,92,246,0.15)",color:VL,cursor:"pointer" }}>Générer</span>
      </div>

      <ModuleFooter
        activities={[
          { time:"06:00",icon:"📊",text:`Scores recalculés pour ${isETI?"280":"38"} fournisseurs — 5 axes chacun`,type:"auto" },
          { time:"06:01",icon:"⚠️",text:"Alerte : PROTO — ISO 9001 expirée → score conformité -15 pts",type:"auto" },
          { time:"06:01",icon:"📧",text:"Notification envoyée : 3 alertes nécessitent une action",type:"auto" },
          { time:"lun 07h",icon:"🔍",text:"Scan hebdo certifs — 2 expirations détectées dans les 30 prochains jours",type:"auto" },
          { time:"11:00",icon:"👤",text:"DAF marque alerte DELRIN 'En cours' — renégociation planifiée",type:"human" },
        ]}
        configs={[
          { label:"Conformité",value:"25%",color:V },
          { label:"Litiges",value:"25%",color:V },
          { label:"Dépendance",value:"20%",color:V },
          { label:"Santé fi.",value:"15%",color:V },
          { label:"Réactivité",value:"15%",color:V },
          { label:"Seuil dark buying",value:"> 10K€/an",color:RD },
        ]}
        configFile="scoring_config.json"
      />
    </div>
  );
}

// ═══ VEILLE MARCHÉS ═══
function SentinelPreview({ p, isETI }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>📡</span>
          <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Veille Marchés</div><div style={{ fontSize:10,color:S[500] }}>Indices — Clauses de révision — Simulation hausse</div></div>
        </div>
        <div style={{ fontSize:10,color:S[500],display:"flex",alignItems:"center",gap:4 }}><PulseDot color={EM} size={5}/> {isETI?"42":"14"} indices / jour</div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
        <MockKPI label="Indices suivis" value={p.modules["sentinel"].indices} color={EM}/>
        <MockKPI label="Hausses refusées" value={p.modules["sentinel"].refused} color={EM}/>
        <MockKPI label="Clauses" value={p.modules["sentinel"].clauses} color={V}/>
        <MockKPI label="Simulations" value={isETI?"18":"4"} color={CY}/>
      </div>

      {/* Market comparison */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,marginBottom:12,alignItems:"center" }}>
        <div style={{ padding:16,borderRadius:12,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.1)",textAlign:"center" }}>
          <div style={{ fontSize:9,color:S[500],marginBottom:4 }}>Fournisseur demande</div>
          <div style={{ fontSize:32,fontWeight:900,color:RD }}>+8%</div>
          <div style={{ fontSize:9,color:S[500] }}>"hausse matières"</div>
        </div>
        <div style={{ fontSize:20,color:S[600] }}>vs</div>
        <div style={{ padding:16,borderRadius:12,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.1)",textAlign:"center" }}>
          <div style={{ fontSize:9,color:S[500],marginBottom:4 }}>Marché réel vérifié</div>
          <div style={{ fontSize:32,fontWeight:900,color:EM }}>+2,3%</div>
          <div style={{ fontSize:9,color:S[500] }}>INSEE + Eurostat + BdF</div>
        </div>
      </div>
      <div style={{ padding:12,borderRadius:10,background:"rgba(16,185,129,0.08)",textAlign:"center",marginBottom:12 }}>
        <div style={{ fontSize:14,fontWeight:700,color:EM }}>💰 5,7% injustifié = {isETI?"~28K€":"~2 400€"} de saving</div>
        <div style={{ fontSize:10,color:S[400],marginTop:3 }}>Preuves exportables en PDF pour la négociation</div>
      </div>

      {/* Pressure map */}
      <div style={{ padding:12,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}`,marginBottom:12 }}>
        <div style={{ fontSize:10,color:S[500],marginBottom:10 }}>Pression prix par catégorie</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8 }}>
          {[
            {cat:"Acier",delta:"+14%",level:"🔴 Chaud",c:RD},
            {cat:"Électronique",delta:"+5%",level:"🟠 Tiède",c:AM},
            {cat:"Plastique",delta:"+1%",level:"🟢 Froid",c:EM},
            {cat:"Emballage",delta:"-3%",level:"🔵 Baisse",c:CY},
          ].map((x,i) => (
            <div key={i} style={{ textAlign:"center",padding:10,borderRadius:8,background:`${x.c}06`,border:`1px solid ${x.c}10` }}>
              <div style={{ fontSize:10,fontWeight:600,color:S[300] }}>{x.cat}</div>
              <div style={{ fontSize:16,fontWeight:800,color:x.c,margin:"4px 0" }}>{x.delta}</div>
              <div style={{ fontSize:8,color:S[500] }}>{x.level}</div>
            </div>
          ))}
        </div>
      </div>

      <ModuleFooter
        activities={[
          { time:"07:00",icon:"📡",text:`Scraping quotidien : ${isETI?"42":"14"} indices mis à jour (INSEE, Eurostat, BdF)`,type:"auto" },
          { time:"07:01",icon:"⚠️",text:"Alerte : acier +14% en 3 mois → 4 fournisseurs concernés identifiés",type:"auto" },
          { time:"08:00",icon:"🔍",text:"Gap Analysis : 2 écarts entre hausse demandée et marché réel",type:"auto" },
          { time:"09:30",icon:"👤",text:"DAF valide la clause de révision ACME (formule 60/40 acier/cuivre)",type:"human" },
          { time:"14:00",icon:"📊",text:"Simulation hausse ACME +8% → résultat : hausse justifiable = +2,3%",type:"auto" },
        ]}
        configs={[
          { label:"Sources",value:"API → Perplexity → Manuel",color:EM },
          { label:"Cohérence",value:"± 30%",color:AM },
          { label:"Indices",value:`${isETI?"42":"14"} actifs`,color:V },
          { label:"Clauses",value:"IA + validation humaine",color:VL },
        ]}
        configFile="indices_config.json"
      />
    </div>
  );
}

// ═══ COFFRE-FORT DONNÉES ═══
function DVPreview({ p, isETI }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>🗄️</span>
          <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Coffre-Fort Données</div><div style={{ fontSize:10,color:S[500] }}>Ingestion — Classification IA — Index central</div></div>
        </div>
        <div style={{ fontSize:10,color:S[500],display:"flex",alignItems:"center",gap:4 }}><PulseDot color={CY} size={5}/> Sync {p.modules["data-vault"].sync}</div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16 }}>
        <MockKPI label="Documents" value={p.modules["data-vault"].docs.toLocaleString("fr-FR")} color={CY}/>
        <MockKPI label="Types" value={p.modules["data-vault"].types} color={V}/>
        <MockKPI label="Ce mois" value={isETI?"+1 240":"+152"} color={EM} sub="nouveaux"/>
        <MockKPI label="Précision IA" value="97%" color={EM} sub="classification"/>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12 }}>
        {[
          {t:"Factures",n:48,c:RD,ct:isETI?"7 402":"883"},
          {t:"Contrats",n:22,c:V,ct:isETI?"3 392":"405"},
          {t:"BDC",n:15,c:CY,ct:isETI?"2 313":"276"},
          {t:"Devis",n:10,c:AM,ct:isETI?"1 542":"184"},
          {t:"Autres",n:5,c:S[400],ct:isETI?"771":"92"},
        ].map((d,i) => (
          <div key={i} style={{ textAlign:"center",padding:10,borderRadius:8,background:`${d.c}08`,border:`1px solid ${d.c}15` }}>
            <div style={{ fontSize:18,fontWeight:800,color:d.c }}>{d.n}%</div>
            <div style={{ fontSize:10,color:S[300],fontWeight:600 }}>{d.t}</div>
            <div style={{ fontSize:8,color:S[600],marginTop:1 }}>{d.ct} docs</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
        <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Ingestion mensuelle</div>
          <Sparkline data={p.modules["data-vault"].sparkline} color={CY} width={180} height={50}/>
        </div>
        <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Derniers classifiés</div>
          {[
            {name:"FA-2026-0912.pdf",type:"Facture",time:"Il y a 2h",c:RD},
            {name:"CTR-ACME-2026.pdf",type:"Contrat",time:"Il y a 5h",c:V},
            {name:"BDC-4521.pdf",type:"BDC",time:"Hier",c:CY},
          ].map((d,i) => (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 0",fontSize:10,borderTop:i?`1px solid ${S[850]}`:"none" }}>
              <span style={{ color:d.c }}>●</span>
              <span style={{ color:S[300],fontFamily:"'JetBrains Mono',monospace",fontSize:9 }}>{d.name}</span>
              <span style={{ color:S[600],marginLeft:"auto" }}>{d.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:10,borderRadius:8,background:"rgba(6,182,212,0.06)",fontSize:11,color:S[400],textAlign:"center" }}>
        🔐 Données 100% chez vous (SharePoint) · Zéro copie chez KANSO-OPS · RGPD natif
      </div>

      <ModuleFooter
        activities={[
          { time:"06:00",icon:"🔄",text:`Sync SharePoint : ${isETI?"47":"8"} nouveaux fichiers dans /KANSO/_DataVault/_Import/`,type:"auto" },
          { time:"06:01",icon:"🤖",text:`Classification IA : ${isETI?"47":"8"} documents (${isETI?"32 factures, 8 contrats, 7 BDC":"5 factures, 2 contrats, 1 BDC"})`,type:"auto" },
          { time:"06:02",icon:"📋",text:"File_Index.xlsx mis à jour — disponible pour tous les modules en aval",type:"auto" },
          { time:"06:02",icon:"⚡",text:`Modules notifiés : Contrôle Factures lance l'analyse sur ${isETI?"32":"5"} factures`,type:"auto" },
          { time:"12:00",icon:"🔄",text:"Sync #2 du jour — 0 nouveau fichier",type:"auto" },
        ]}
        configs={[
          { label:"Sync",value:"4×/jour",color:CY },
          { label:"Types",value:"10 catégories",color:V },
          { label:"IA Vision",value:"Claude + GPT-4o",color:EM },
          { label:"Fair Use",value:"2 500 docs/mois",color:AM },
        ]}
        configFile="SharePoint /KANSO/_DataVault/"
      />
    </div>
  );
}


// ═══ SCENARIO VISUALS ═══
function ScenarioVisual({ step, profile }) {
  const mod = step.module ? MODULES_BASE.find(m => m.id === step.module) : null;
  const color = mod?.color || S[400];
  const p = PROFILES[profile];

  return (
    <div style={{ animation:"fadeInUp 0.4s ease" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24 }}>
        <span style={{
          fontSize:28,width:48,height:48,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",
          background:`${color}15`,
        }}>{mod ? mod.icon : "📨"}</span>
        <div>
          <div style={{ fontWeight:700,fontSize:18 }}>{step.title}</div>
          <div style={{ fontSize:13,color:S[400],marginTop:2 }}>{step.description}</div>
        </div>
      </div>
      <div style={{ padding:24,borderRadius:14,background:`${color}08`,border:`1px solid ${color}22` }}>
        {step.visual === "invoice" && <InvoiceVisual p={p}/>}
        {step.visual === "classify" && <ClassifyVisual p={p}/>}
        {step.visual === "alert" && <AlertVisual p={p} color={color}/>}
        {step.visual === "graduation" && <GraduationVisual color={color}/>}
        {step.visual === "market" && <MarketVisual p={p} color={color}/>}
        {step.visual === "cockpit" && <CockpitVisual p={p}/>}
      </div>
    </div>
  );
}

function InvoiceVisual({ p }) {
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <div><div style={{ fontSize:11,color:S[500],textTransform:"uppercase",letterSpacing:"0.05em" }}>Fournisseur</div><div style={{ fontSize:18,fontWeight:700,marginTop:2 }}>{p.scenario.invoiceSupplier}</div></div>
        <div style={{ textAlign:"right" }}><div style={{ fontSize:11,color:S[500] }}>Référence</div><div style={{ fontSize:14,fontFamily:"monospace",color:S[300],marginTop:2 }}>{p.scenario.invoiceRef}</div></div>
      </div>
      <div style={{ fontSize:36,fontWeight:900,color:S[50],textAlign:"center",padding:"20px 0",borderTop:`1px solid ${S[800]}`,borderBottom:`1px solid ${S[800]}` }}>{p.scenario.invoiceAmount}</div>
      <div style={{ fontSize:12,color:S[500],textAlign:"center",marginTop:8 }}>Composants électroniques · Commande Q1-2026</div>
    </div>
  );
}
function ClassifyVisual() {
  return (
    <div>
      <div style={{ display:"flex",gap:16,marginBottom:16 }}>
        <div style={{ flex:1 }}><div style={{ fontSize:11,color:S[500],marginBottom:4 }}>Type détecté</div><div style={{ fontSize:16,fontWeight:700 }}>📄 Facture</div></div>
        <div><div style={{ fontSize:11,color:S[500],marginBottom:4 }}>Confiance IA</div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}><div style={{ width:100,height:8,borderRadius:4,background:S[800] }}><div style={{ width:"98%",height:"100%",borderRadius:4,background:EM }}/></div><span style={{ fontSize:14,fontWeight:700,color:EM }}>98%</span></div>
        </div>
      </div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>{["Composants","Q1-2026","Électronique"].map((t,i) => <span key={i} style={{ display:"inline-flex",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:"rgba(6,182,212,0.1)",color:CY }}>{t}</span>)}</div>
      <div style={{ marginTop:16,padding:"12px 16px",borderRadius:10,background:"rgba(6,182,212,0.06)",fontSize:12,color:S[400] }}>✅ Indexé dans File_Index.xlsx · Disponible pour tous les modules</div>
    </div>
  );
}
function AlertVisual({ p, color }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"10px 14px",borderRadius:10,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)" }}>
        <span style={{ fontSize:18 }}>🚨</span>
        <div><div style={{ fontSize:13,fontWeight:700,color:RD }}>Anomalie détectée — Paiement bloqué</div><div style={{ fontSize:11,color:S[400],marginTop:2 }}>R1 — Écart prix</div></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
        <div style={{ textAlign:"center" }}><div style={{ fontSize:11,color:S[500],marginBottom:4 }}>Écart</div><div style={{ fontSize:22,fontWeight:800,color:RD }}>{p.scenario.gap}</div></div>
        <div style={{ textAlign:"center" }}><div style={{ fontSize:11,color:S[500],marginBottom:4 }}>Impact</div><div style={{ fontSize:22,fontWeight:800,color:AM }}>{p.scenario.impact}</div></div>
        <div style={{ textAlign:"center" }}><div style={{ fontSize:11,color:S[500],marginBottom:4 }}>Statut</div><div style={{ fontSize:16,fontWeight:700 }}>🔴 Bloqué</div></div>
      </div>
    </div>
  );
}
function GraduationVisual({ color }) {
  const steps = ["Soft Check","Relance formelle","Escalade DAF","Compensation"];
  return (
    <div>
      <div style={{ display:"flex",gap:4,marginBottom:20 }}>
        {steps.map((s,i) => (
          <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center" }}>
            <div style={{ width:"100%",height:4,borderRadius:2,background:i===0?RD:S[700],marginBottom:8 }}/>
            <span style={{ fontSize:10,color:i===0?RD:S[500],fontWeight:i===0?700:400,textAlign:"center" }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
        {[["step","Soft Check"],["email","Envoyé"],["proof","Liasse PDF"]].map(([k,v]) => (
          <div key={k} style={{ padding:"10px 14px",borderRadius:10,background:"rgba(30,41,59,0.5)",textAlign:"center" }}>
            <div style={{ fontSize:10,color:S[500],marginBottom:4 }}>{k}</div>
            <div style={{ fontSize:13,fontWeight:600,color:k==="step"?RD:EM }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function MarketVisual({ p }) {
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
        <div style={{ padding:16,borderRadius:12,textAlign:"center",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)" }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:4 }}>Hausse demandée</div>
          <div style={{ fontSize:28,fontWeight:900,color:RD }}>{p.scenario.marketClaimed}</div>
          <div style={{ fontSize:10,color:S[500],marginTop:2 }}>par le fournisseur</div>
        </div>
        <div style={{ padding:16,borderRadius:12,textAlign:"center",background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)" }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:4 }}>Hausse réelle</div>
          <div style={{ fontSize:28,fontWeight:900,color:EM }}>{p.scenario.marketActual}</div>
          <div style={{ fontSize:10,color:S[500],marginTop:2 }}>INSEE + Eurostat</div>
        </div>
      </div>
      <div style={{ padding:14,borderRadius:10,textAlign:"center",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.15)" }}>
        <span style={{ fontSize:13,fontWeight:700,color:EM }}>💰 Économie potentielle : {p.scenario.marketSaving}</span>
      </div>
    </div>
  );
}
function CockpitVisual({ p }) {
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16 }}>
        <div style={{ padding:20,borderRadius:14,textAlign:"center",background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
          <div style={{ fontSize:28,fontWeight:900,color:EM }}>{p.scenario.cockpitSavings}</div>
          <div style={{ fontSize:10,color:S[400] }}>Savings YTD</div>
        </div>
        <div style={{ padding:20,borderRadius:14,textAlign:"center",background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
          <div style={{ fontSize:28,fontWeight:900,color:V }}>{p.scenario.cockpitRoi}</div>
          <div style={{ fontSize:10,color:S[400] }}>ROI plateforme</div>
        </div>
        <div style={{ padding:20,borderRadius:14,textAlign:"center",background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
          <div style={{ fontSize:28,fontWeight:900,color:CY }}>{p.scenario.cockpitTrend}</div>
          <div style={{ fontSize:10,color:S[400] }}>vs N-1</div>
        </div>
      </div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center" }}>
        {["Savings & ROI","Conformité","Risque","Performance","Équipe","Prix","Spend Map"].map((t,i) => (
          <span key={i} style={{ padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:i===0?600:400,background:i===0?`${V}15`:S[850],color:i===0?VL:S[500],border:`1px solid ${i===0?V+"20":"transparent"}` }}>{t}</span>
        ))}
      </div>
      <div style={{ marginTop:12,padding:"10px 14px",borderRadius:10,background:"rgba(139,92,246,0.06)",fontSize:12,color:S[400],textAlign:"center" }}>
        📄 Rapport mensuel PDF généré automatiquement — le DAF forwarde à sa direction
      </div>
    </div>
  );
}

// ═══ FLOATING ORBS BACKGROUND ═══
function FloatingOrbs() {
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0 }}>
      <div style={{
        position:"absolute",top:"10%",left:"15%",width:300,height:300,borderRadius:"50%",
        background:`radial-gradient(circle, ${V}15 0%, transparent 70%)`,
        animation:"float-slow 8s ease-in-out infinite",
      }}/>
      <div style={{
        position:"absolute",top:"60%",right:"10%",width:250,height:250,borderRadius:"50%",
        background:`radial-gradient(circle, ${EM}10 0%, transparent 70%)`,
        animation:"float-slow2 10s ease-in-out infinite",
      }}/>
      <div style={{
        position:"absolute",top:"30%",right:"30%",width:180,height:180,borderRadius:"50%",
        background:`radial-gradient(circle, ${CY}08 0%, transparent 70%)`,
        animation:"float-slow 12s ease-in-out infinite 2s",
      }}/>
    </div>
  );
}

// ═══ ANIMATED PROGRESS BAR ═══
function AnimatedBar({ value, color, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ height:4,borderRadius:2,background:S[700],overflow:"hidden" }}>
      <div style={{
        height:"100%",borderRadius:2,background: color,
        width: visible ? `${value}%` : "0%",
        transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}/>
    </div>
  );
}

// ═══ LIVE PULSE DOT ═══
function PulseDot({ color = EM, size = 8 }) {
  return (
    <span style={{ position:"relative",display:"inline-flex",width:size,height:size }}>
      <span style={{
        position:"absolute",inset:0,borderRadius:"50%",background:color,
        animation:"pulse-ring 1.5s cubic-bezier(0,0,0.2,1) infinite",opacity:0.4,
      }}/>
      <span style={{ width:size,height:size,borderRadius:"50%",background:color }}/>
    </span>
  );
}

// ═══ FLOW DIAGRAM ═══
function FlowDiagram() {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"24px 0" }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr auto 1fr auto 1fr auto 1fr",alignItems:"center",gap:8,width:"100%",maxWidth:850 }}>
        <FlowNode icon="🏭" label="ERP" sub="Export 30min" color={S[500]}/>
        <FlowArrow/>
        <FlowNode icon="🗄️" label="Coffre-Fort" sub="Classe & indexe" color={CY}/>
        <FlowArrow/>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <FlowNode icon="⚔️" label="Récupération" sub="Passé (24 mois)" color={RD} sm/>
          <FlowNode icon="🔍" label="Contrôle" sub="Temps réel" color={AM} sm/>
          <FlowNode icon="📡" label="Veille" sub="Indices marché" color={EM} sm/>
        </div>
        <FlowArrow/>
        <FlowNode icon="🏰" label="Fournisseurs" sub="Score panel" color={V}/>
        <FlowArrow/>
        <FlowNode icon="🎯" label="Cockpit" sub="Vue direction" color={RS}/>
      </div>
      <div style={{ display:"flex",gap:24,marginTop:8,flexWrap:"wrap",justifyContent:"center" }}>
        {[{c:CY,l:"Ingestion"},{c:RD,l:"Détection"},{c:V,l:"Agrégation"},{c:RS,l:"Pilotage"}].map((x,i) => (
          <div key={i} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:S[400] }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:x.c }}/>{x.l}
          </div>
        ))}
      </div>
    </div>
  );
}
function FlowNode({ icon, label, sub, color, sm }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      padding:sm?"8px 12px":"14px 16px",borderRadius:12,textAlign:"center",
      background: hovered ? `${color}18` : `${color}10`,
      border:`1px solid ${hovered ? color+"44" : color+"22"}`,
      transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
      transform: hovered ? "translateY(-3px) scale(1.04)" : "translateY(0) scale(1)",
      boxShadow: hovered ? `0 8px 24px ${color}20` : "none",
      cursor:"default",
    }}>
      <div style={{ fontSize:sm?18:24,marginBottom:4,transition:"transform 0.3s",transform: hovered ? "scale(1.15)" : "scale(1)" }}>{icon}</div>
      <div style={{ fontSize:sm?11:13,fontWeight:700,color:S[200] }}>{label}</div>
      <div style={{ fontSize:sm?9:10,color:S[500],marginTop:1 }}>{sub}</div>
    </div>
  );
}
function FlowArrow() {
  return (
    <div style={{ textAlign:"center",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <svg width="24" height="12" style={{ animation:"slide-right 1.8s ease-in-out infinite" }}>
        <defs><linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={S[600]} stopOpacity="0.3"/><stop offset="100%" stopColor={V} stopOpacity="0.8"/></linearGradient></defs>
        <path d="M0,6 L18,6 M14,2 L20,6 L14,10" fill="none" stroke="url(#arrowGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function KansoDemo() {
  const [profile, setProfile] = useState("eti");
  const [page, setPage] = useState("main"); // "main" | "dashboard"
  const [activeModule, setActiveModule] = useState(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [scenarioPlaying, setScenarioPlaying] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const p = PROFILES[profile];

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setVisibleSections((prev) => new Set([...prev, e.target.id])); });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [page]);

  useEffect(() => {
    if (!scenarioPlaying) return;
    const t = setInterval(() => {
      setScenarioStep((s) => { if (s >= scenarioSteps.length - 1) { setScenarioPlaying(false); return s; } return s + 1; });
    }, 6000);
    return () => clearInterval(t);
  }, [scenarioPlaying]);

  const sv = (id) => visibleSections.has(id);

  const scenarioSteps = [
    { title: "Votre DAF reçoit une facture", description: `Fournisseur ${p.scenario.invoiceSupplier} demande ${p.scenario.invoiceAmount} pour une commande de composants électroniques.`, module: null, visual: "invoice" },
    { title: "Le Coffre-Fort classe et indexe", description: "La facture est automatiquement classifiée, indexée et rendue exploitable par tous les modules.", module: "data-vault", visual: "classify" },
    { title: "Le Contrôle Factures détecte une anomalie", description: `Le prix unitaire est ${p.scenario.gap} supérieur au contrat en vigueur. Alerte immédiate AVANT paiement.`, module: "invoice-watchdog", visual: "alert" },
    { title: "La Récupération Cash se lance", description: "Graduation Diplomatique : relance automatique, liasse de preuves, escalade si nécessaire.", module: "litige-killer", visual: "graduation" },
    { title: "La Veille Marchés vérifie la hausse", description: `Le fournisseur justifie par la hausse des matières premières. La veille dit : le marché est à ${p.scenario.marketActual}, pas ${p.scenario.marketClaimed}.`, module: "sentinel", visual: "market" },
    { title: "Le Cockpit Dirigeant consolide", description: `${p.scenario.cockpitSavings} de savings YTD. ROI ${p.scenario.cockpitRoi}. Rapport automatique envoyé à la direction.`, module: "cockpit-daf", visual: "cockpit" },
  ];

  const modules = MODULES_BASE.map(m => ({ ...m, metrics: p.modules[m.id], sparkline: p.modules[m.id]?.sparkline || [] }));

  return (
    <div style={{ fontFamily:"'Outfit','DM Sans',system-ui,sans-serif",background:`linear-gradient(180deg,${S[950]} 0%,${S[900]} 100%)`,color:S[50],minHeight:"100vh",overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeInScale{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.15)}50%{box-shadow:0 0 40px rgba(139,92,246,0.35)}}
        @keyframes slide-right{0%{transform:translateX(-8px);opacity:0.4}50%{transform:translateX(4px);opacity:1}100%{transform:translateX(8px);opacity:0.4}}
        @keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float-slow{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes float-slow2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(15px) scale(0.97)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes draw-line{from{stroke-dashoffset:var(--line-length)}to{stroke-dashoffset:0}}
        @keyframes breathe{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.02)}}
        @keyframes pulse-ring{0%{transform:scale(0.95);opacity:1}100%{transform:scale(1.8);opacity:0}}
        @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes bar-fill{from{width:0%}to{width:var(--bar-w)}}
        @keyframes count-glow{0%,100%{text-shadow:0 0 0 transparent}50%{text-shadow:0 0 20px currentColor}}
        @keyframes card-in{from{opacity:0;transform:translateY(40px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes slide-in-left{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slide-in-right{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes hero-text{from{opacity:0;transform:translateY(20px);filter:blur(8px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
        .reveal{opacity:0;transform:translateY(30px);transition:all 0.8s cubic-bezier(0.16,1,0.3,1)}
        .reveal.visible{opacity:1;transform:translateY(0)}
        .glass{background:rgba(30,41,59,0.5);backdrop-filter:blur(16px);border:1px solid rgba(148,163,184,0.08);border-radius:16px}
        .glass-hover{transition:all 0.4s cubic-bezier(0.16,1,0.3,1)}
        .glass-hover:hover{border-color:rgba(139,92,246,0.3);box-shadow:0 8px 32px rgba(139,92,246,0.1);transform:translateY(-4px)}
        .kanso-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:10px;border:none;font-family:inherit;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.25s ease;letter-spacing:0.01em;position:relative;overflow:hidden}
        .kanso-btn-primary{background:linear-gradient(135deg,${V} 0%,${VD} 100%);color:white}
        .kanso-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(139,92,246,0.5)}
        .kanso-btn-primary::after{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.1) 50%,transparent 70%);animation:shimmer 3s ease-in-out infinite}
        .kanso-btn-ghost{background:transparent;color:${S[300]};border:1px solid ${S[600]}}
        .kanso-btn-ghost:hover{border-color:${V};color:${VL};box-shadow:0 0 20px rgba(139,92,246,0.15)}
        .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;letter-spacing:0.03em;text-transform:uppercase}
        .scenario-step{padding:20px 24px;border-radius:14px;cursor:pointer;transition:all 0.35s cubic-bezier(0.16,1,0.3,1);border:1px solid transparent}
        .scenario-step.active{background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.3);animation:fadeInScale 0.3s ease}
        .scenario-step:hover:not(.active){background:rgba(139,92,246,0.04)}
        .tier-card{padding:32px 28px;border-radius:18px;transition:all 0.35s ease;position:relative;overflow:hidden}
        .kpi-card{transition:all 0.4s cubic-bezier(0.16,1,0.3,1)}
        .kpi-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.3)}
        .module-card-anim{animation:card-in 0.6s cubic-bezier(0.16,1,0.3,1) both}
        .bar-anim{animation:bar-fill 1.2s cubic-bezier(0.16,1,0.3,1) both}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${S[700]};border-radius:3px}
      `}</style>

      {/* ═══ STICKY NAV ═══ */}
      <nav style={{
        position:"sticky",top:0,zIndex:50,padding:"10px 24px",
        background:"rgba(2,6,23,0.85)",backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${S[800]}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg, transparent 0%, ${V}40 50%, transparent 100%)` }}/>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <span style={{ fontSize:16,fontWeight:800,letterSpacing:"-0.02em" }}><span style={{ color:V }}>KANSO</span>-OPS</span>
          {/* Profile toggle */}
          <div style={{ display:"flex",borderRadius:8,overflow:"hidden",border:`1px solid ${S[700]}`,marginLeft:12 }}>
            {(["pme","eti"]).map(k => (
              <button key={k} onClick={() => { setProfile(k); setActiveModule(null); }} style={{
                padding:"5px 14px",border:"none",cursor:"pointer",fontFamily:"inherit",
                fontSize:11,fontWeight:profile===k?700:400,
                background:profile===k?`${V}20`:"transparent",
                color:profile===k?VL:S[500],
                transition:"all 0.2s",
              }}>
                {PROFILES[k].label} <span style={{ fontSize:9,opacity:0.7 }}>{PROFILES[k].sub}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={() => { setPage("main"); setVisibleSections(new Set()); }} style={{
            padding:"6px 14px",borderRadius:8,border:`1px solid ${page==="main"?V+"44":S[700]}`,
            background:page==="main"?`${V}12`:"transparent",color:page==="main"?VL:S[400],
            fontSize:11,fontWeight:page==="main"?700:400,cursor:"pointer",fontFamily:"inherit",
          }}>Présentation</button>
          <button onClick={() => { setPage("dashboard"); setVisibleSections(new Set()); }} style={{
            padding:"6px 14px",borderRadius:8,border:`1px solid ${page==="dashboard"?V+"44":S[700]}`,
            background:page==="dashboard"?`${V}12`:"transparent",color:page==="dashboard"?VL:S[400],
            fontSize:11,fontWeight:page==="dashboard"?700:400,cursor:"pointer",fontFamily:"inherit",
          }}>📊 Voir les tableaux de bord</button>
        </div>
      </nav>

      {page === "main" ? (
        <div key={`main-${profile}`}>
          {/* ═══ HERO ═══ */}
          <section style={{ position:"relative",padding:"80px 24px 60px",textAlign:"center",overflow:"hidden" }}>
            <FloatingOrbs/>
            <div style={{ position:"absolute",top:-120,left:"50%",transform:"translateX(-50%)",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",pointerEvents:"none" }}/>
            <div style={{ position:"relative",zIndex:1,maxWidth:900,margin:"0 auto" }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,marginBottom:24,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.2)",fontSize:13,fontWeight:500,color:VL,animation:"hero-text 0.8s ease both" }}>
                <PulseDot color={EM} size={6}/> Simulation {p.label} · CA {p.ca}
              </div>
              <h1 style={{ fontSize:"clamp(36px,6vw,62px)",fontWeight:900,lineHeight:1.05,marginBottom:20,letterSpacing:"-0.03em",background:`linear-gradient(135deg,${S[50]} 0%,${S[300]} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"hero-text 0.8s ease 0.15s both" }}>
                Récupérez le cash.<br/>
                <span style={{ background:`linear-gradient(135deg,${V} 0%,${CY} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Bloquez les fuites.</span>
              </h1>
              <p style={{ fontSize:18,color:S[400],maxWidth:600,margin:"0 auto 40px",lineHeight:1.6,fontWeight:300,animation:"hero-text 0.8s ease 0.3s both" }}>
                KANSO-OPS se branche au-dessus de votre ERP en 5 jours.<br/>Pas de projet d'intégration. Pas de consultants. Vos données restent chez vous.
              </p>

              {/* Hero KPIs with info bubbles */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:16,maxWidth:750,margin:"0 auto 40px" }}>
                {p.heroKpis.map((kpi,i) => (
                  <div key={`${profile}-${i}`} className="kpi-card" style={{ padding:20,borderRadius:14,textAlign:"center",background:"rgba(30,41,59,0.4)",border:`1px solid rgba(148,163,184,0.06)`,animation:`card-in 0.6s cubic-bezier(0.16,1,0.3,1) ${0.4+i*0.1}s both` }}>
                    <div style={{ fontSize:32,fontWeight:800,color:kpi.color,marginBottom:4 }}>
                      <AnimatedCounter end={kpi.value} suffix={kpi.suffix} duration={2000+i*300}/>
                      <InfoBubble info={kpi.info} color={kpi.color}/>
                    </div>
                    <div style={{ fontSize:12,color:S[400],fontWeight:500 }}>{kpi.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animation:"hero-text 0.8s ease 0.8s both" }}>
                <button className="kanso-btn kanso-btn-primary" onClick={() => { document.getElementById("scenario")?.scrollIntoView({ behavior:"smooth" }); setScenarioPlaying(true); setScenarioStep(0); }}>▶ Voir le scénario en action</button>
                <button className="kanso-btn kanso-btn-ghost" onClick={() => { setPage("dashboard"); window.scrollTo(0,0); }}>📊 Voir les tableaux de bord</button>
              </div>

              {/* ═══ EFFORT COMMERCIAL EQUIVALENT ═══ */}
              <div style={{
                marginTop:32,padding:"24px 32px",borderRadius:16,maxWidth:700,margin:"32px auto 0",
                background:"linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(139,92,246,0.06) 100%)",
                border:"1px solid rgba(16,185,129,0.15)",
                position:"relative",overflow:"hidden",
              }}>
                <div style={{
                  position:"absolute",top:0,left:0,right:0,height:3,
                  background:`linear-gradient(90deg, ${EM}, ${V}, ${EM})`,
                  backgroundSize:"200% 100%",
                  animation:"gradient-shift 3s ease infinite",
                }}/>
                <div style={{ fontSize:13,color:S[400],marginBottom:8,fontWeight:500 }}>
                  💡 Ces <span style={{ color:EM,fontWeight:800 }}>{p.effortCommercial.savings}</span> récupérés, c'est l'équivalent de :
                </div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:24,flexWrap:"wrap" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36,fontWeight:900,color:EM,lineHeight:1 }}>{p.effortCommercial.caEquivShort}</div>
                    <div style={{ fontSize:12,color:S[400],marginTop:4 }}>de nouveau CA à aller chercher</div>
                  </div>
                  <div style={{ width:1,height:48,background:S[700],flexShrink:0 }}/>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36,fontWeight:900,color:V,lineHeight:1 }}>{p.effortCommercial.moisProspection}</div>
                    <div style={{ fontSize:12,color:S[400],marginTop:4 }}>de prospection commerciale</div>
                  </div>
                </div>
                <div style={{ fontSize:11,color:S[500],marginTop:12,textAlign:"center",lineHeight:1.5 }}>
                  {p.effortCommercial.explication}
                  <InfoBubble info={{ title:"Conversion savings → effort commercial", calc: `${p.effortCommercial.savings} de savings = résultat net pur. Pour obtenir le même résultat net par la vente, avec une marge nette de ${p.margin}, il faudrait générer ${p.effortCommercial.caEquiv} de CA additionnel.`, source: "Marge nette PME industrielle : ~10% (estimation haute). ETI industrielle : 3,5-5% (INSEE Esane 2023, industrie manufacturière C10-C33)." }} color={EM}/>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ INVOICE JOURNEY + FACTURE X ═══ */}
          <section id="journey" data-reveal style={{ padding:"40px 24px 0",maxWidth:1100,margin:"0 auto" }}>
            <div className={`reveal ${sv("journey")?"visible":""}`}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr",gap:20 }}>
                <InvoiceJourney profile={profile}/>
                <FactureXBlock data={p.factureX} profile={profile}/>
              </div>
            </div>
          </section>

          {/* ═══ IMPACT BUSINESS ═══ */}
          <section id="impact" data-reveal style={{ padding:"40px 24px",maxWidth:1100,margin:"0 auto" }}>
            <div className={`reveal ${sv("impact")?"visible":""}`}>
              <div style={{ textAlign:"center",marginBottom:32 }}>
                <span className="tag" style={{ background:"rgba(16,185,129,0.15)",color:EM,marginBottom:12 }}>💎 Chiffres clés</span>
                <h2 style={{ fontSize:32,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>L'impact sur votre entreprise</h2>
                <p style={{ color:S[400],marginTop:8,fontSize:14 }}>Chaque euro récupéré, c'est 20 à 33€ de CA que vous n'avez pas besoin d'aller chercher</p>
              </div>
              <ImpactBlock profile={profile}/>
            </div>
          </section>

          {/* ═══ LIVE SCENARIO ═══ */}
          <section id="scenario" data-reveal style={{ padding:"60px 24px",maxWidth:1100,margin:"0 auto" }}>
            <div className={`reveal ${sv("scenario")?"visible":""}`}>
              <div style={{ textAlign:"center",marginBottom:48 }}>
                <span className="tag" style={{ background:"rgba(245,158,11,0.15)",color:AM,marginBottom:12 }}>⚡ Scénario en direct</span>
                <h2 style={{ fontSize:36,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>De la facture au saving</h2>
                <p style={{ color:S[400],marginTop:8,fontSize:15 }}>Suivez le parcours d'une facture à travers la plateforme — en temps réel</p>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"340px 1fr",gap:32,alignItems:"start" }}>
                <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                  {scenarioSteps.map((step,i) => {
                    const mod = step.module ? MODULES_BASE.find(m => m.id === step.module) : null;
                    return (
                      <div key={i} className={`scenario-step ${scenarioStep===i?"active":""}`} onClick={() => { setScenarioStep(i); setScenarioPlaying(false); }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
                          <span style={{ width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,background:scenarioStep===i?`rgba(139,92,246,0.2)`:"rgba(148,163,184,0.06)",flexShrink:0 }}>{mod ? mod.icon : "📨"}</span>
                          <span style={{ fontSize:13,fontWeight:scenarioStep===i?700:500,color:scenarioStep===i?S[50]:S[400] }}>{step.title}</span>
                        </div>
                        {scenarioStep===i && <p style={{ fontSize:12,color:S[400],marginLeft:38,lineHeight:1.5,animation:"fadeInUp 0.3s ease" }}>{step.description}</p>}
                      </div>
                    );
                  })}
                  <div style={{ display:"flex",gap:8,marginTop:12,paddingLeft:4,alignItems:"center" }}>
                    <button className="kanso-btn kanso-btn-ghost" style={{ padding:"8px 16px",fontSize:12 }} onClick={() => { setScenarioStep(0); setScenarioPlaying(true); }}>
                      ▶ {scenarioPlaying ? "En cours…" : "Relancer"}
                    </button>
                    {scenarioPlaying && <PulseDot color={V} size={8}/>}
                  </div>
                </div>
                <div className="glass" key={`${scenarioStep}-${profile}`} style={{ padding:32,minHeight:340,animation:"fadeInScale 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                  <ScenarioVisual step={scenarioSteps[scenarioStep]} profile={profile}/>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ MODULES ═══ */}
          <section id="modules" data-reveal style={{ padding:"80px 24px",maxWidth:1100,margin:"0 auto" }}>
            <div className={`reveal ${sv("modules")?"visible":""}`}>
              <div style={{ textAlign:"center",marginBottom:48 }}>
                <span className="tag" style={{ background:"rgba(139,92,246,0.15)",color:VL,marginBottom:12 }}>🧩 6 modules</span>
                <h2 style={{ fontSize:36,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>Chaque module a sa mission</h2>
                <p style={{ color:S[400],marginTop:8,fontSize:15 }}>Activés progressivement selon votre palier — zéro surcoût sur les modules précédents</p>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",gap:16 }}>
                {modules.map((mod,i) => (
                  <div key={mod.id} className="glass glass-hover" style={{
                    padding:24,cursor:"pointer",
                    borderColor:activeModule===mod.id?`${mod.color}44`:undefined,
                    background:activeModule===mod.id?`${mod.color}08`:undefined,
                    animation: sv("modules") ? `card-in 0.6s cubic-bezier(0.16,1,0.3,1) ${i*0.1}s both` : "none",
                    opacity: sv("modules") ? undefined : 0,
                  }} onClick={() => setActiveModule(activeModule===mod.id?null:mod.id)}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <span style={{ fontSize:24,width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:`${mod.color}15` }}>{mod.icon}</span>
                        <div><div style={{ fontWeight:700,fontSize:15 }}>{mod.name}</div><div style={{ fontSize:11,color:S[400],marginTop:1 }}>{mod.tagline}</div></div>
                      </div>
                      <span className="tag" style={{ background:`${mod.color}15`,color:mod.color,fontSize:10 }}>{mod.tier}</span>
                    </div>
                    <div style={{ display:"flex",gap:16,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${S[800]}` }}>
                      {Object.entries(mod.metrics).filter(([k]) => k !== "sparkline").map(([k,v]) => (
                        <div key={k} style={{ flex:1 }}><div style={{ fontSize:16,fontWeight:700,color:mod.color }}>{v}</div><div style={{ fontSize:10,color:S[500],textTransform:"capitalize" }}>{k.replace(/_/g," ")}</div></div>
                      ))}
                    </div>
                    <Sparkline data={mod.sparkline} color={mod.color} width={280} height={28}/>
                    {activeModule===mod.id && (
                      <div style={{ marginTop:16,paddingTop:16,borderTop:`1px solid ${S[800]}`,animation:"fadeInUp 0.3s ease" }}>
                        {mod.features.map((f,j) => (
                          <div key={j} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:8,fontSize:13,color:S[300],lineHeight:1.5 }}>
                            <span style={{ color:mod.color,fontSize:11,marginTop:3,flexShrink:0 }}>●</span>{f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ ARCHITECTURE ═══ */}
          <section id="flow" data-reveal style={{ padding:"80px 24px",maxWidth:900,margin:"0 auto" }}>
            <div className={`reveal ${sv("flow")?"visible":""}`}>
              <div style={{ textAlign:"center",marginBottom:48 }}>
                <span className="tag" style={{ background:"rgba(6,182,212,0.15)",color:CY,marginBottom:12 }}>🔗 Architecture</span>
                <h2 style={{ fontSize:36,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>Comment tout s'imbrique</h2>
                <p style={{ color:S[400],marginTop:8,fontSize:15 }}>Un flux linéaire, sans boucle, sans conflit — chaque module écrit dans sa propre table</p>
              </div>
              <FlowDiagram/>
              <div style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginTop:40 }}>
                {[{icon:"🔐",text:"JWT signé sur chaque appel"},{icon:"🏠",text:"Données chez vous (SharePoint)"},{icon:"🔒",text:"1 instance isolée par client"},{icon:"🛡️",text:"RGPD natif — zéro copie"}].map((b,i) => (
                  <div key={i} style={{
                    display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,
                    background:"rgba(30,41,59,0.5)",border:`1px solid rgba(148,163,184,0.08)`,
                    fontSize:12,color:S[300],fontWeight:500,
                    animation: sv("flow") ? `card-in 0.5s cubic-bezier(0.16,1,0.3,1) ${0.6+i*0.1}s both` : "none",
                    opacity: sv("flow") ? undefined : 0,
                  }}>
                    <span>{b.icon}</span>{b.text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ PRICING ═══ */}
          <section id="pricing" data-reveal style={{ padding:"80px 24px",maxWidth:1000,margin:"0 auto" }}>
            <div className={`reveal ${sv("pricing")?"visible":""}`}>
              <div style={{ textAlign:"center",marginBottom:48 }}>
                <span className="tag" style={{ background:"rgba(16,185,129,0.15)",color:EM,marginBottom:12 }}>💰 Tarification</span>
                <h2 style={{ fontSize:36,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>Trois paliers, un seul objectif : le ROI</h2>
                <p style={{ color:S[400],marginTop:8,fontSize:15 }}>Le success fee de la phase D&R auto-finance 12 à 31 mois d'abonnement</p>
              </div>
              <div className="glass" style={{ padding:"20px 28px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16,borderColor:"rgba(245,158,11,0.15)" }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:15,marginBottom:4 }}>🎯 Phase 1 — Détection & Récupération</div>
                  <div style={{ fontSize:13,color:S[400] }}>Flash Audit gratuit → Forfait 3 500-10K€ + 20% success fee sur le cash récupéré</div>
                </div>
                <span className="tag" style={{ background:"rgba(245,158,11,0.15)",color:AM,fontSize:12,padding:"6px 14px" }}>Gratuit pour commencer</span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",gap:20 }}>
                {TIERS.map((tier,ti) => (
                  <div key={tier.name} style={{
                    padding:"32px 28px",borderRadius:18,transition:"all 0.35s ease",position:"relative",overflow:"hidden",
                    background:tier.highlight?"rgba(139,92,246,0.06)":"rgba(30,41,59,0.5)",
                    border:tier.highlight?`2px solid ${V}44`:`1px solid rgba(148,163,184,0.08)`,
                    animation: sv("pricing") ? `card-in 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2+ti*0.15}s both` : "none",
                    opacity: sv("pricing") ? undefined : 0,
                  }}>
                    {tier.highlight && <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${V},${CY},${V})`,backgroundSize:"200% 100%",animation:"gradient-shift 3s ease infinite",borderRadius:"18px 18px 0 0" }}/>}
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                      <div style={{ width:10,height:10,borderRadius:"50%",background:tier.color,boxShadow:`0 0 12px ${tier.color}66` }}/>
                      <span style={{ fontWeight:700,fontSize:18 }}>{tier.name}</span>
                      {tier.highlight && <span className="tag" style={{ background:"rgba(139,92,246,0.2)",color:VL,marginLeft:"auto" }}>Populaire</span>}
                    </div>
                    <div style={{ marginBottom:20 }}>
                      <span style={{ fontSize:42,fontWeight:900,letterSpacing:"-0.03em" }}>{tier.price}</span>
                      <span style={{ fontSize:15,color:S[400],marginLeft:4 }}>€/mois</span>
                    </div>
                    <div style={{ fontSize:13,color:EM,fontWeight:600,marginBottom:16 }}>{tier.value}</div>
                    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                      {tier.modules.map((m,j) => <div key={j} style={{ display:"flex",alignItems:"center",gap:8,fontSize:13,color:S[300] }}><span style={{ color:EM,fontSize:12 }}>✓</span>{m}</div>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"center",marginTop:48,padding:"32px 24px",borderRadius:16,background:"rgba(139,92,246,0.04)",border:"1px solid rgba(139,92,246,0.1)" }}>
                <div style={{ fontSize:20,fontWeight:700,marginBottom:8 }}>On ne touche pas à votre ERP.</div>
                <p style={{ fontSize:14,color:S[400],maxWidth:500,margin:"0 auto",lineHeight:1.6 }}>
                  Pas de projet d'intégration, pas de consultants SAP, pas de risque sur votre production.<br/>Votre IT configure un export en 30 minutes — on gère le reste.
                </p>
                <div style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:16,fontSize:13,fontWeight:600,color:VL }}>C'est pour ça qu'on est opérationnels en 5 jours, pas en 6 mois.</div>
              </div>

              {/* ═══ SIMULATEUR ROI ═══ */}
              <ROISimulator />

              {/* ═══ CTA PRINCIPAL ═══ */}
              <div style={{
                marginTop:48,padding:"40px 32px",borderRadius:20,textAlign:"center",
                background:`linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(16,185,129,0.08) 100%)`,
                border:`1px solid rgba(139,92,246,0.2)`,
                position:"relative",overflow:"hidden",
                animation:"pulse-glow 4s ease-in-out infinite",
              }}>
                <div style={{
                  position:"absolute",top:0,left:0,right:0,height:3,
                  background:`linear-gradient(90deg, ${V}, ${EM}, ${CY}, ${V})`,
                  backgroundSize:"200% 100%",
                  animation:"gradient-shift 4s ease infinite",
                }}/>
                <div style={{ fontSize:28,fontWeight:800,marginBottom:8,letterSpacing:"-0.02em" }}>
                  Prêt à récupérer votre cash ?
                </div>
                <p style={{ fontSize:15,color:S[400],maxWidth:480,margin:"0 auto 28px",lineHeight:1.6 }}>
                  Le Flash Audit est gratuit et sans engagement.<br/>En 5 jours, vous saurez exactement combien vous perdez.
                </p>
                <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
                  <a href="https://calendly.com/sebastien-duc-kanso-ops/30min" target="_blank" rel="noopener noreferrer"
                    className="kanso-btn kanso-btn-primary" style={{ textDecoration:"none",fontSize:15,padding:"14px 32px" }}>
                    📅 Réserver un créneau (30 min)
                  </a>
                  <a href="mailto:sebastien.duc@kanso-ops.fr?subject=Flash Audit — Demande d'information"
                    className="kanso-btn kanso-btn-ghost" style={{ textDecoration:"none" }}>
                    ✉️ sebastien.duc@kanso-ops.fr
                  </a>
                </div>
                <div style={{ marginTop:20,fontSize:12,color:S[500] }}>
                  Flash Audit gratuit · Résultat en 5 jours · Zéro engagement
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ═══ DASHBOARD PREVIEW PAGE ═══ */
        <div key={`dash-${profile}`} style={{ padding:"40px 24px",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <span className="tag" style={{ background:"rgba(139,92,246,0.15)",color:VL,marginBottom:12 }}>📊 Aperçu des modules</span>
            <h2 style={{ fontSize:36,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>Vos tableaux de bord en action</h2>
            <p style={{ color:S[400],marginTop:8,fontSize:15 }}>
              Aperçu de l'interface pour une {p.label} à {p.ca} de CA — cliquez sur chaque module
            </p>
          </div>
          <DashboardPreview profile={profile}/>
          <div style={{ textAlign:"center",marginTop:32 }}>
            <button className="kanso-btn kanso-btn-ghost" onClick={() => { setPage("main"); window.scrollTo(0,0); }}>← Retour à la présentation</button>
          </div>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding:"48px 24px 32px",textAlign:"center",borderTop:`1px solid ${S[800]}` }}>
        <div style={{ fontSize:20,fontWeight:800,marginBottom:12,letterSpacing:"-0.02em" }}><span style={{ color:V }}>KANSO</span>-OPS</div>
        <p style={{ fontSize:13,color:S[400],marginBottom:20,lineHeight:1.6 }}>Performance achats pour PME & ETI industrielles · 10-250M€ CA · Déploiement 5 jours</p>
        <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:16 }}>
          <a href="https://calendly.com/sebastien-duc-kanso-ops/30min" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:10,background:`${V}15`,border:`1px solid ${V}30`,color:VL,fontSize:13,fontWeight:600,textDecoration:"none",transition:"all 0.2s" }}>
            📅 Réserver un Flash Audit gratuit
          </a>
          <a href="mailto:sebastien.duc@kanso-ops.fr?subject=Flash Audit — Demande d'information"
            style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:10,background:"rgba(30,41,59,0.5)",border:`1px solid ${S[700]}`,color:S[300],fontSize:13,fontWeight:500,textDecoration:"none",transition:"all 0.2s" }}>
            ✉️ sebastien.duc@kanso-ops.fr
          </a>
        </div>
        <p style={{ fontSize:11,color:S[600] }}>© 2026 KANSO-OPS · Sébastien Duc · Lyon, France</p>
      </footer>
    </div>
  );
}
