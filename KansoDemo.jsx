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
      { value: 45, suffix: "K€", label: "Économies récupérées", color: EM,
        info: { title: "Économies totales YTD", calc: "Litiges récupérés (28K€) + Fuites évitées (11K€) + Hausses refusées (6K€) = 45K€", source: "Consolidation Cockpit DAF — hypothèse conservatrice sur 12 mois, PME 10M€ CA" }},
      { value: 3.8, suffix: "×", label: "ROI plateforme", color: V,
        info: { title: "Retour sur investissement", calc: "45K€ d'économies ÷ 11 880€ (990€/mois × 12) = ROI ×3,8 — hypothèse basse, première année. Le ROI s'améliore chaque année.", source: "Coût palier Standard (990€/mois). Le success fee D&R auto-finance 12 à 31 mois d'abonnement en plus." }},
      { value: 8, suffix: "", label: "Fuites bloquées", color: AM,
        info: { title: "Factures bloquées avant paiement", calc: "8 factures avec anomalies détectées par Invoice Watchdog en temps réel, soit 11K€ de surcoûts évités", source: "Module Invoice Watchdog — alertes statut 'Bloqué'" }},
      { value: 5, suffix: " jours", label: "Déploiement", color: CY,
        info: { title: "Temps de mise en service", calc: "J1: Data Vault · J2-J3: Litige Killer · J4: Invoice Watchdog · J5: Cockpit DAF", source: "Roadmap standard Kanso-Ops. Export ERP = 30min IT." }},
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
      "supplier-watchtower": { suppliers: 38, alerts: 5, darkBuying: 2, sparkline: [62,63,65,67,69,71,73,75,76,78,80,82] },
      "sentinel": { indices: 14, refused: "6K€", clauses: 6, sparkline: [0,0,1,1,2,3,3,4,4,5,5,6] },
      "cockpit-daf": { savings: "45K€", roi: "×3,8", trend: "+12% vs N-1", sparkline: [2,5,9,14,19,24,28,32,36,39,42,45] },
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
      cockpitRoi: "×3,8",
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
    margin: "10%",
    heroKpis: [
      { value: 450, suffix: "K€", label: "Économies récupérées", color: EM,
        info: { title: "Économies totales YTD", calc: "Litiges récupérés (280K€) + Fuites évitées (105K€) + Hausses refusées (65K€) = 450K€", source: "Consolidation Cockpit DAF — hypothèse conservatrice sur 12 mois, ETI 150M€ CA" }},
      { value: 38, suffix: "×", label: "ROI plateforme", color: V,
        info: { title: "Retour sur investissement", calc: "450K€ d'économies ÷ 11 880€ (990€/mois × 12) = ROI ×38 — et le success fee D&R auto-finance 12 à 31 mois d'abonnement en plus", source: "Coût palier Standard (990€/mois). Le ROI s'améliore chaque année." }},
      { value: 52, suffix: "", label: "Fuites bloquées", color: AM,
        info: { title: "Factures bloquées avant paiement", calc: "52 factures avec anomalies détectées par Invoice Watchdog, soit 105K€ de surcoûts évités", source: "Module Invoice Watchdog — alertes statut 'Bloqué'" }},
      { value: 5, suffix: " jours", label: "Déploiement", color: CY,
        info: { title: "Temps de mise en service", calc: "J1: Data Vault · J2-J3: Litige Killer · J4: Invoice Watchdog · J5: Cockpit DAF", source: "Même délai PME/ETI. L'architecture est identique, seuls les volumes changent." }},
    ],
    effortCommercial: {
      savings: "450K€",
      caEquiv: "4,5M€",
      caEquivShort: "4,5M€",
      moisProspection: "12 à 18 mois",
      explication: "Avec une marge nette de 10%, il faut générer 4,5M€ de nouveau CA pour obtenir le même résultat net. Soit 12 à 18 mois de prospection commerciale pour une ETI.",
    },
    modules: {
      "data-vault": { docs: 12840, types: 10, sync: "4×/jour", sparkline: [40,150,380,700,1100,1800,3200,4800,6800,8800,10900,12840] },
      "litige-killer": { detected: 142, recovered: "280K€", rate: "77%", sparkline: [4,10,22,38,52,68,82,95,108,120,132,142] },
      "invoice-watchdog": { blocked: 52, saved: "105K€", realtime: "< 2min", sparkline: [2,5,10,16,22,28,33,38,42,46,49,52] },
      "supplier-watchtower": { suppliers: 210, alerts: 28, darkBuying: 9, sparkline: [66,65,67,69,71,73,75,77,79,81,84,86] },
      "sentinel": { indices: 36, refused: "65K€", clauses: 22, sparkline: [0,3,8,14,22,30,38,44,50,55,60,65] },
      "cockpit-daf": { savings: "450K€", roi: "×38", trend: "+20% vs N-1", sparkline: [15,45,90,145,200,255,300,340,375,405,430,450] },
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
      cockpitSavings: "450K€",
      cockpitRoi: "×38",
      cockpitTrend: "+20% vs N-1",
    },
    impact: {
      savings: 450000,
      costSub: 11880,
      caEquiv: "4,5M€",
      caEquivCalc: "450K€ ÷ 10% marge nette = 4,5M€ de CA à générer pour le même résultat",
      hoursEquiv: "1 400h",
      hoursCalc: "~18h par litige × 78 litiges traités manuellement évités = 1 404h · Coût horaire DAF ~85€ = 119K€",
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
  { id: "data-vault", icon: "🗄️", name: "Data Vault", tagline: "Un seul point d'entrée pour toutes vos données achats", color: CY, tier: "Pilote",
    features: ["Classification IA automatique (factures, contrats, BDC, devis…)","Index central exploitable par tous les modules","Synchronisation SharePoint — vos données restent chez vous","Glisser-déposer, sync auto, import API"] },
  { id: "litige-killer", icon: "⚔️", name: "Litige Killer v3", tagline: "Détectez les écarts. Récupérez le cash.", color: RD, tier: "Pilote",
    features: ["Moteur DETECT : 4 règles (écart prix, erreur virgule, doublons, grille tarifaire)","Graduation Diplomatique automatique (Relance douce → Escalade DAF)","Liasses de Preuve PDF exportables","Auto-résolution quand l'avoir arrive"] },
  { id: "invoice-watchdog", icon: "🔍", name: "Invoice Watchdog", tagline: "Bloquez les fuites AVANT de payer", color: AM, tier: "Standard",
    features: ["Même moteur que Litige Killer, en temps réel","Chaque nouvelle facture analysée automatiquement","Bloquer / Valider / Escalader / Transférer au LK","Zéro fuite — plus aucune erreur ne passe inaperçue"] },
  { id: "supplier-watchtower", icon: "🏰", name: "Supplier Watchtower v7", tagline: "Scoring fournisseurs — pilotez votre panel", color: V, tier: "Standard",
    features: ["Score composite 5 axes (conformité, litiges, dépendance, santé fi., réactivité)","Suivi certifications (alertes 30j/90j avant expiration)","Détection achats sauvages (dépenses > 10K€/an sans contrat)","Briefing pré-RDV : tout savoir avant de négocier"] },
  { id: "sentinel", icon: "📡", name: "Sentinel", tagline: "Indices de marché — contrez les hausses injustifiées", color: EM, tier: "Performance",
    features: ["Indices marché multi-sources (INSEE, Eurostat, BdF, Perplexity)","Extraction IA des clauses de révision + validation humaine","Simulation hausse fournisseur vs réalité marché","Pression prix par catégorie (chaud / tiède / froid / baisse)"] },
  { id: "cockpit-daf", icon: "🎯", name: "Cockpit DAF", tagline: "Vue stratégique — pilotez, reportez, décidez", color: RS, tier: "Pilote",
    features: ["7 onglets : Économies, Conformité, Risque, Performance, Équipe, Prix, Cartographie","S'adapte automatiquement aux modules activés","Rapports mensuels & annuels PDF automatiques","Le DAF transmet à sa direction sans effort"] },
];

const TIERS = [
  { name: "Pilote", price: "490", modules: ["Data Vault","Litige Killer","Cockpit DAF"], highlight: false, color: CY, value: "Récupération cash + vue performance" },
  { name: "Standard", price: "990", modules: ["+ Invoice Watchdog","+ Supplier Watchtower"], highlight: false, color: V, value: "Zéro fuite + panel sous contrôle" },
  { name: "Performance", price: "1 490", modules: ["+ Sentinel","Cockpit complet (7 onglets)","Tous les modules inclus"], highlight: true, color: EM, value: "ROI maximal — négociation data-driven + pilotage total" },
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
  return <span ref={ref}>{prefix}{decimals > 0 ? val.toFixed(decimals).replace(".",",") : Math.round(val).toLocaleString("fr-FR")}{suffix}</span>;
}

function Sparkline({ data, color = V, width = 120, height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i/(data.length-1))*width},${height-((v-min)/range)*(height-4)-2}`).join(" ");
  const gid = `sg-${color.replace("#","")}`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#${gid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DonutChart({ value, max = 100, color = EM, size = 64, strokeWidth = 6, label }) {
  const r = (size - strokeWidth) / 2, c = 2 * Math.PI * r, offset = c * (1 - Math.min(value/max,1));
  return (
    <div style={{ position:"relative",width:size,height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={S[700]} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <span style={{ fontSize:13,fontWeight:700,color:S[50] }}>{Math.round(value)}%</span>
        {label && <span style={{ fontSize:7,color:S[400],marginTop:-2 }}>{label}</span>}
      </div>
    </div>
  );
}

// ═══ INFO BUBBLE ═══
function InfoBubble({ info, color = V }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        width:18,height:18,borderRadius:"50%",border:`1.5px solid ${S[500]}`,
        background:"transparent",color:S[400],fontSize:10,fontWeight:700,
        cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",
        transition:"all 0.2s",lineHeight:1,padding:0,fontFamily:"inherit",
        verticalAlign:"middle",marginLeft:4,
      }}>i</button>
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position:"fixed",inset:0,zIndex:9999,
          background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",
          display:"flex",alignItems:"center",justifyContent:"center",
          animation:"fadeInUp 0.15s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:360,maxWidth:"90vw",padding:20,borderRadius:14,
            background:S[850],border:`1px solid ${color}33`,
            boxShadow:`0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${color}15`,
          }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <span style={{ fontSize:13,fontWeight:700,color }}>{info.title}</span>
              <button onClick={() => setOpen(false)} style={{
                width:24,height:24,borderRadius:6,border:`1px solid ${S[700]}`,
                background:"transparent",color:S[400],fontSize:14,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",
              }}>×</button>
            </div>
            <div style={{ fontSize:12,color:S[300],lineHeight:1.7,marginBottom:12 }}>
              <strong style={{ color:S[200] }}>Calcul :</strong> {info.calc}
            </div>
            <div style={{ fontSize:11,color:S[500],lineHeight:1.5,paddingTop:10,borderTop:`1px solid ${S[700]}` }}>
              📊 {info.source}
            </div>
          </div>
        </div>
      )}
    </>
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
            <div style={{ height:4,borderRadius:2,background:S[700] }}>
              <div style={{ height:"100%",borderRadius:2,width:`${a.score}%`,background:a.score>=70?EM:a.score>=50?AM:RD,transition:"width 1s" }}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12,fontSize:11,color:S[400],textAlign:"center" }}>
        KANSO-OPS détecte automatiquement les fournisseurs non conformes et suit votre progression
      </div>
    </div>
  );
}

// ═══ INVOICE JOURNEY ═══
function InvoiceJourney({ profile }) {
  const p = PROFILES[profile];
  const steps = [
    { icon: "📨", label: "Réception", sub: "ERP → SharePoint", color: S[400] },
    { icon: "🗄️", label: "Data Vault", sub: "Classifié en < 5s", color: CY },
    { icon: "🔍", label: "Watchdog", sub: "Anomalie détectée", color: AM },
    { icon: "⚔️", label: "Litige Killer", sub: "Réclamation auto", color: RD },
    { icon: "📡", label: "Sentinel", sub: "Vérif. marché", color: EM },
    { icon: "🎯", label: "Cockpit", sub: "Économie consolidée", color: RS },
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
      <div className="impact-grid" style={{ marginBottom:20 }}>
        <div style={{ padding:16,borderRadius:12,background:"rgba(30,41,59,0.5)",textAlign:"center" }}>
          <div style={{ fontSize:11,color:S[500],marginBottom:4 }}>
            Équivalent effort commercial
            <InfoBubble info={{ title: "Conversion économies → CA équivalent", calc: d.caEquivCalc, source: `Marge nette industrielle : ~10% (hypothèse conservatrice). CA ${p.ca}.` }} color={EM}/>
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
            <InfoBubble info={{ title: "Ratio coût/bénéfice annuel", calc: `Abonnement annuel : ${d.costSub.toLocaleString("fr-FR")}€ · Économies générées : ${d.savings.toLocaleString("fr-FR")}€ · Ratio : ${Math.round(d.savings/d.costSub)}×`, source: "Facturation Kanso-Ops vs économies réelles consolidées dans le Cockpit DAF." }} color={RS}/>
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

// ═══ DASHBOARD PREVIEW PAGE ═══
function DashboardPreview({ profile }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: "cockpit", icon: "🎯", name: "Cockpit DAF", color: RS },
    { id: "lk", icon: "⚔️", name: "Litige Killer", color: RD },
    { id: "iw", icon: "🔍", name: "Invoice Watchdog", color: AM },
    { id: "sw", icon: "🏰", name: "Watchtower", color: V },
    { id: "sentinel", icon: "📡", name: "Sentinel", color: EM },
    { id: "dv", icon: "🗄️", name: "Data Vault", color: CY },
  ];
  const p = PROFILES[profile];

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
          <div style={{ flex:1,textAlign:"center",fontSize:11,color:S[500],fontFamily:"monospace" }}>
            app.kanso-ops.com — {tabs[activeTab].name}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:20,minHeight:380 }}>
          {activeTab === 0 && <CockpitPreview p={p}/>}
          {activeTab === 1 && <LKPreview p={p}/>}
          {activeTab === 2 && <IWPreview p={p}/>}
          {activeTab === 3 && <SWPreview p={p}/>}
          {activeTab === 4 && <SentinelPreview p={p}/>}
          {activeTab === 5 && <DVPreview p={p}/>}
        </div>
      </div>
    </div>
  );
}

function MockKPI({ label, value, color, small }) {
  return (
    <div style={{ padding:small?"10px":"14px",borderRadius:12,background:"rgba(30,41,59,0.6)",border:`1px solid ${S[800]}`,textAlign:"center",flex:1 }}>
      <div style={{ fontSize:small?16:22,fontWeight:800,color }}>{value}</div>
      <div style={{ fontSize:small?9:10,color:S[500],marginTop:2 }}>{label}</div>
    </div>
  );
}

function MockTable({ headers, rows, color }) {
  return (
    <div style={{ borderRadius:10,overflow:"hidden",border:`1px solid ${S[800]}`,fontSize:11 }}>
      <div style={{ display:"grid",gridTemplateColumns:`repeat(${headers.length},1fr)`,background:S[850],padding:"8px 12px",gap:8 }}>
        {headers.map((h,i) => <div key={i} style={{ fontWeight:600,color:S[400] }}>{h}</div>)}
      </div>
      {rows.map((row,i) => (
        <div key={i} style={{ display:"grid",gridTemplateColumns:`repeat(${headers.length},1fr)`,padding:"8px 12px",gap:8,borderTop:`1px solid ${S[850]}` }}>
          {row.map((cell,j) => <div key={j} style={{ color: typeof cell === 'object' ? cell.color : S[300] }}>{typeof cell === 'object' ? cell.text : cell}</div>)}
        </div>
      ))}
    </div>
  );
}

function CockpitPreview({ p }) {
  const tabs = ["Économies & ROI","Conformité","Risque","Performance","Équipe","Prix","Cartographie"];
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <span style={{ fontSize:20 }}>🎯</span>
        <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Cockpit Dirigeant</div><div style={{ fontSize:10,color:S[500] }}>Vue stratégique de la performance achats</div></div>
      </div>
      <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
        {tabs.map((t,i) => <span key={i} style={{ padding:"5px 10px",borderRadius:6,fontSize:10,fontWeight:i===0?700:400,background:i===0?`${V}20`:S[850],color:i===0?VL:S[500],border:`1px solid ${i===0?V+"30":"transparent"}` }}>{t}</span>)}
      </div>
      <div style={{ display:"flex",gap:12,marginBottom:16 }}>
        <MockKPI label="Économies YTD" value={p.modules["cockpit-daf"].savings} color={EM}/>
        <MockKPI label="ROI" value={p.modules["cockpit-daf"].roi} color={V}/>
        <MockKPI label="Conformité" value="87%" color={CY}/>
        <MockKPI label="Score panel" value="82/100" color={AM}/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Économies par source</div>
          {[{l:"Litiges",v:55,c:RD},{l:"Fuites évitées",v:25,c:AM},{l:"Hausses refusées",v:20,c:EM}].map((b,i) => (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
              <span style={{ fontSize:9,color:S[400],width:80 }}>{b.l}</span>
              <div style={{ flex:1,height:6,borderRadius:3,background:S[800] }}><div style={{ height:"100%",borderRadius:3,width:`${b.v}%`,background:b.c }}/></div>
              <span style={{ fontSize:9,color:b.c,width:24,textAlign:"right" }}>{b.v}%</span>
            </div>
          ))}
        </div>
        <div style={{ padding:14,borderRadius:10,background:"rgba(30,41,59,0.4)",border:`1px solid ${S[800]}` }}>
          <div style={{ fontSize:10,color:S[500],marginBottom:8 }}>Tendance 12 mois</div>
          <Sparkline data={p.modules["cockpit-daf"].sparkline} color={EM} width={200} height={60}/>
        </div>
      </div>
    </div>
  );
}

function LKPreview({ p }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <span style={{ fontSize:20 }}>⚔️</span>
        <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Litige Killer v3</div><div style={{ fontSize:10,color:S[500] }}>Détection des écarts — Récupération cash</div></div>
      </div>
      <div style={{ display:"flex",gap:12,marginBottom:16 }}>
        <MockKPI label="Écarts détectés" value={p.modules["litige-killer"].detected} color={RD}/>
        <MockKPI label="Cash récupéré" value={p.modules["litige-killer"].recovered} color={EM}/>
        <MockKPI label="Taux récup." value={p.modules["litige-killer"].rate} color={V}/>
      </div>
      <MockTable
        headers={["Fournisseur","Règle","Écart","Montant","Statut"]}
        rows={[
          ["ACME Industries","R1 — Écart prix","+12%",{text:"15 280€",color:RD},{text:"⏳ En cours",color:AM}],
          ["DELRIN Compo.","R2 — Erreur virgule","×10",{text:"8 450€",color:RD},{text:"✅ Résolu",color:EM}],
          ["PROTO Méca.","R3 — Doublon","100%",{text:"3 200€",color:RD},{text:"✅ Auto-résolu",color:EM}],
          ["SIGMA Elect.","R4 — Hors grille","+22%",{text:"6 780€",color:RD},{text:"🔴 Escalade",color:RS}],
        ]}
      />
    </div>
  );
}

function IWPreview({ p }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <span style={{ fontSize:20 }}>🔍</span>
        <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Invoice Watchdog</div><div style={{ fontSize:10,color:S[500] }}>Alertes temps réel — Avant paiement</div></div>
      </div>
      <div style={{ display:"flex",gap:12,marginBottom:16 }}>
        <MockKPI label="Bloquées" value={p.modules["invoice-watchdog"].blocked} color={AM}/>
        <MockKPI label="Fuites évitées" value={p.modules["invoice-watchdog"].saved} color={EM}/>
        <MockKPI label="Délai détection" value={p.modules["invoice-watchdog"].realtime} color={CY}/>
      </div>
      <div style={{ padding:12,borderRadius:10,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",marginBottom:12,display:"flex",alignItems:"center",gap:10 }}>
        <span style={{ fontSize:16 }}>🚨</span>
        <div>
          <div style={{ fontSize:12,fontWeight:700,color:RD }}>Alerte temps réel — Paiement bloqué</div>
          <div style={{ fontSize:10,color:S[400] }}>FA-2026-0847 · ACME Industries · Écart prix +12% · Impact 15 280€</div>
        </div>
        <div style={{ marginLeft:"auto",display:"flex",gap:6 }}>
          <span style={{ padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:"rgba(239,68,68,0.15)",color:RD }}>Bloquer</span>
          <span style={{ padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:"rgba(16,185,129,0.15)",color:EM }}>Valider</span>
        </div>
      </div>
      <MockTable
        headers={["Facture","Fournisseur","Anomalie","Impact","Action"]}
        rows={[
          ["FA-2026-0912","PROTO Méca.","Doublon",{text:"3 200€",color:AM},{text:"🔴 Bloqué",color:RD}],
          ["FA-2026-0908","SIGMA Elect.","Hors grille",{text:"1 890€",color:AM},{text:"✅ Validé",color:EM}],
          ["FA-2026-0901","ACME Ind.","Écart prix",{text:"5 670€",color:AM},{text:"↗️ Transf. LK",color:V}],
        ]}
      />
    </div>
  );
}

function SWPreview({ p }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <span style={{ fontSize:20 }}>🏰</span>
        <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Supplier Watchtower v7</div><div style={{ fontSize:10,color:S[500] }}>Scoring fournisseurs & alertes panel</div></div>
      </div>
      <div style={{ display:"flex",gap:12,marginBottom:16 }}>
        <MockKPI label="Fournisseurs" value={p.modules["supplier-watchtower"].suppliers} color={V}/>
        <MockKPI label="Alertes" value={p.modules["supplier-watchtower"].alerts} color={AM}/>
        <MockKPI label="Achats sauvages" value={p.modules["supplier-watchtower"].darkBuying} color={RD}/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
        {[
          {name:"ACME Industries",score:82,trend:"+3",risk:"Faible"},
          {name:"PROTO Mécanique",score:54,trend:"-8",risk:"Élevé"},
          {name:"SIGMA Électronique",score:91,trend:"+1",risk:"Minimal"},
          {name:"DELRIN Composants",score:67,trend:"-2",risk:"Moyen"},
        ].map((f,i) => (
          <div key={i} style={{ padding:12,borderRadius:10,background:"rgba(30,41,59,0.5)",border:`1px solid ${S[800]}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div>
              <div style={{ fontSize:11,fontWeight:600,color:S[200] }}>{f.name}</div>
              <div style={{ fontSize:9,color:f.risk==="Faible"||f.risk==="Minimal"?EM:f.risk==="Moyen"?AM:RD,marginTop:2 }}>Risque {f.risk}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:18,fontWeight:800,color:f.score>=80?EM:f.score>=60?AM:RD }}>{f.score}</div>
              <div style={{ fontSize:9,color:f.trend.startsWith("+")?EM:RD }}>{f.trend} pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentinelPreview({ p }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <span style={{ fontSize:20 }}>📡</span>
        <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Sentinel</div><div style={{ fontSize:10,color:S[500] }}>Indices de marché & clauses de révision</div></div>
      </div>
      <div style={{ display:"flex",gap:12,marginBottom:16 }}>
        <MockKPI label="Indices suivis" value={p.modules["sentinel"].indices} color={EM}/>
        <MockKPI label="Hausses refusées" value={p.modules["sentinel"].refused} color={EM}/>
        <MockKPI label="Clauses extraites" value={p.modules["sentinel"].clauses} color={V}/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
        <div style={{ padding:14,borderRadius:10,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.12)",textAlign:"center" }}>
          <div style={{ fontSize:9,color:S[500],marginBottom:4 }}>Hausse demandée</div>
          <div style={{ fontSize:28,fontWeight:900,color:RD }}>+8%</div>
          <div style={{ fontSize:9,color:S[500] }}>par le fournisseur</div>
        </div>
        <div style={{ padding:14,borderRadius:10,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.12)",textAlign:"center" }}>
          <div style={{ fontSize:9,color:S[500],marginBottom:4 }}>Hausse réelle</div>
          <div style={{ fontSize:28,fontWeight:900,color:EM }}>+2,3%</div>
          <div style={{ fontSize:9,color:S[500] }}>INSEE + Eurostat</div>
        </div>
      </div>
      <div style={{ padding:10,borderRadius:8,background:"rgba(16,185,129,0.08)",textAlign:"center",fontSize:12,fontWeight:700,color:EM }}>
        💰 Économie démontrable : 5,7% d'écart injustifié
      </div>
    </div>
  );
}

function DVPreview({ p }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <span style={{ fontSize:20 }}>🗄️</span>
        <div><div style={{ fontSize:14,fontWeight:700,color:S[100] }}>Data Vault</div><div style={{ fontSize:10,color:S[500] }}>Ingestion & classification IA</div></div>
      </div>
      <div style={{ display:"flex",gap:12,marginBottom:16 }}>
        <MockKPI label="Documents" value={p.modules["data-vault"].docs.toLocaleString("fr-FR")} color={CY}/>
        <MockKPI label="Types" value={p.modules["data-vault"].types} color={V}/>
        <MockKPI label="Sync" value={p.modules["data-vault"].sync} color={EM}/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12 }}>
        {[{t:"Factures",n:48,c:RD},{t:"Contrats",n:22,c:V},{t:"BDC",n:15,c:CY},{t:"Devis",n:10,c:AM},{t:"Autres",n:5,c:S[400]}].map((d,i) => (
          <div key={i} style={{ textAlign:"center",padding:10,borderRadius:8,background:`${d.c}08`,border:`1px solid ${d.c}15` }}>
            <div style={{ fontSize:18,fontWeight:800,color:d.c }}>{d.n}%</div>
            <div style={{ fontSize:9,color:S[400] }}>{d.t}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:10,borderRadius:8,background:"rgba(6,182,212,0.06)",fontSize:11,color:S[400],textAlign:"center" }}>
        📁 Classification IA : {">"}98% de précision · Drag & drop + sync SharePoint auto
      </div>
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
          <div style={{ fontSize:10,color:S[400] }}>Économies YTD</div>
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
        {["Économies & ROI","Conformité","Risque","Performance","Équipe","Prix","Cartographie"].map((t,i) => (
          <span key={i} style={{ padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:i===0?600:400,background:i===0?`${V}15`:S[850],color:i===0?VL:S[500],border:`1px solid ${i===0?V+"20":"transparent"}` }}>{t}</span>
        ))}
      </div>
      <div style={{ marginTop:12,padding:"10px 14px",borderRadius:10,background:"rgba(139,92,246,0.06)",fontSize:12,color:S[400],textAlign:"center" }}>
        📄 Rapport mensuel PDF généré automatiquement — le DAF forwarde à sa direction
      </div>
    </div>
  );
}

// ═══ FLOW DIAGRAM ═══
function FlowDiagram() {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"24px 0" }}>
      <div className="flow-grid">
        <FlowNode icon="🏭" label="ERP" sub="Export 30min" color={S[500]}/>
        <FlowArrow/>
        <FlowNode icon="🗄️" label="Data Vault" sub="Classe & indexe" color={CY}/>
        <FlowArrow/>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <FlowNode icon="⚔️" label="Litige Killer" sub="Passé (24 mois)" color={RD} sm/>
          <FlowNode icon="🔍" label="Watchdog" sub="Temps réel" color={AM} sm/>
          <FlowNode icon="📡" label="Sentinel" sub="Indices marché" color={EM} sm/>
        </div>
        <FlowArrow/>
        <FlowNode icon="🏰" label="Watchtower" sub="Score panel" color={V}/>
        <FlowArrow/>
        <FlowNode icon="🎯" label="Cockpit DAF" sub="Vue direction" color={RS}/>
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
  return (
    <div style={{ padding:sm?"8px 12px":"14px 16px",borderRadius:12,textAlign:"center",background:`${color}10`,border:`1px solid ${color}22`,transition:"all 0.3s ease" }}>
      <div style={{ fontSize:sm?18:24,marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:sm?11:13,fontWeight:700,color:S[200] }}>{label}</div>
      <div style={{ fontSize:sm?9:10,color:S[500],marginTop:1 }}>{sub}</div>
    </div>
  );
}
function FlowArrow() {
  return <div className="flow-arrow" style={{ fontSize:16,color:S[600],textAlign:"center",flexShrink:0,animation:"slide-right 1.8s ease-in-out infinite" }}>→</div>;
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
  const [customCA, setCustomCA] = useState("");

  const p = PROFILES[profile];

  // Custom CA calculations (tout en K€)
  const customCAValue = parseFloat(customCA.replace(/\s/g, "").replace(",","."));
  const hasCustomCA = !isNaN(customCAValue) && customCAValue > 0;
  const customSavingsK = hasCustomCA ? Math.round(customCAValue * 4.5) : 0; // ~0.45% du CA en K€
  const customCAEquivK = hasCustomCA ? Math.round(customSavingsK / 0.10) : 0; // CA équiv à 10% marge en K€
  const customROI = hasCustomCA ? Math.round(customSavingsK / 11.88 * 10) / 10 : 0; // vs 990€/mois = 11.88K€/an

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
    { title: "Data Vault classe et indexe", description: "La facture est automatiquement classifiée, indexée et rendue exploitable par tous les modules.", module: "data-vault", visual: "classify" },
    { title: "Invoice Watchdog détecte une anomalie", description: `Le prix unitaire est ${p.scenario.gap} supérieur au contrat en vigueur. Alerte immédiate AVANT paiement.`, module: "invoice-watchdog", visual: "alert" },
    { title: "Litige Killer lance la récupération", description: "Graduation Diplomatique : relance automatique, liasse de preuves, escalade si nécessaire.", module: "litige-killer", visual: "graduation" },
    { title: "Sentinel vérifie la hausse demandée", description: `Le fournisseur justifie par la hausse des matières premières. Sentinel dit : le marché est à ${p.scenario.marketActual}, pas ${p.scenario.marketClaimed}.`, module: "sentinel", visual: "market" },
    { title: "Le Cockpit DAF consolide", description: `${p.scenario.cockpitSavings} d'économies YTD. ROI ${p.scenario.cockpitRoi}. Rapport automatique envoyé à la direction.`, module: "cockpit-daf", visual: "cockpit" },
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
        .reveal{opacity:0;transform:translateY(30px);transition:all 0.8s cubic-bezier(0.16,1,0.3,1)}
        .reveal.visible{opacity:1;transform:translateY(0)}
        .glass{background:rgba(30,41,59,0.5);backdrop-filter:blur(16px);border:1px solid rgba(148,163,184,0.08);border-radius:16px}
        .glass-hover:hover{border-color:rgba(139,92,246,0.3);box-shadow:0 8px 32px rgba(139,92,246,0.1);transform:translateY(-2px)}
        .kanso-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:10px;border:none;font-family:inherit;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.25s ease;letter-spacing:0.01em}
        .kanso-btn-primary{background:linear-gradient(135deg,${V} 0%,${VD} 100%);color:white}
        .kanso-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(139,92,246,0.4)}
        .kanso-btn-ghost{background:transparent;color:${S[300]};border:1px solid ${S[600]}}
        .kanso-btn-ghost:hover{border-color:${V};color:${VL}}
        .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;letter-spacing:0.03em;text-transform:uppercase}
        .scenario-step{padding:20px 24px;border-radius:14px;cursor:pointer;transition:all 0.35s cubic-bezier(0.16,1,0.3,1);border:1px solid transparent}
        .scenario-step.active{background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.3)}
        .scenario-step:hover:not(.active){background:rgba(139,92,246,0.04)}
        .tier-card{padding:32px 28px;border-radius:18px;transition:all 0.35s ease;position:relative;overflow:hidden}
        .scenario-grid{display:grid;grid-template-columns:340px 1fr;gap:32px;align-items:start}
        .flow-grid{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:8px;width:100%;max-width:850px}
        .impact-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .effort-row{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap}
        .effort-sep{width:1px;height:48px;background:${S[700]};flex-shrink:0}
        @media(max-width:768px){
          .scenario-grid{grid-template-columns:1fr !important;gap:20px}
          .flow-grid{grid-template-columns:1fr !important;gap:12px}
          .flow-grid .flow-arrow{transform:rotate(90deg)}
          .impact-grid{grid-template-columns:1fr !important}
          .effort-row{flex-direction:column;gap:12px}
          .effort-sep{width:80px;height:1px}
          .hero-kpi-grid{grid-template-columns:1fr 1fr !important}
          .modules-grid{grid-template-columns:1fr !important}
        }
        @media(max-width:480px){
          .hero-kpi-grid{grid-template-columns:1fr !important}
        }
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${S[700]};border-radius:3px}
      `}</style>

      {/* ═══ STICKY NAV ═══ */}
      <nav style={{
        position:"sticky",top:0,zIndex:50,padding:"10px 24px",
        background:"rgba(2,6,23,0.85)",backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${S[800]}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,
      }}>
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
            <div style={{ position:"absolute",top:-120,left:"50%",transform:"translateX(-50%)",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",pointerEvents:"none" }}/>
            <div style={{ position:"relative",zIndex:1,maxWidth:900,margin:"0 auto" }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,marginBottom:24,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.2)",fontSize:13,fontWeight:500,color:VL }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:EM,boxShadow:`0 0 8px ${EM}` }}/> Simulation {p.label} · CA {p.ca}
              </div>
              <h1 style={{ fontSize:"clamp(36px,6vw,62px)",fontWeight:900,lineHeight:1.05,marginBottom:20,letterSpacing:"-0.03em",background:`linear-gradient(135deg,${S[50]} 0%,${S[300]} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
                Récupérez le cash.<br/>
                <span style={{ background:`linear-gradient(135deg,${V} 0%,${CY} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Bloquez les fuites.</span>
              </h1>
              <p style={{ fontSize:18,color:S[400],maxWidth:600,margin:"0 auto 40px",lineHeight:1.6,fontWeight:300 }}>
                KANSO-OPS se branche au-dessus de votre ERP en 5 jours.<br/>Pas de projet d'intégration. Pas de consultants. Vos données restent chez vous.
              </p>

              {/* Hero KPIs with info bubbles */}
              <div className="hero-kpi-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:16,maxWidth:750,margin:"0 auto 40px" }}>
                {p.heroKpis.map((kpi,i) => (
                  <div key={`${profile}-${i}`} style={{ padding:20,borderRadius:14,textAlign:"center",background:"rgba(30,41,59,0.4)",border:`1px solid rgba(148,163,184,0.06)`,transition:"all 0.3s" }}>
                    <div style={{ fontSize:32,fontWeight:800,color:kpi.color,marginBottom:4 }}>
                      <AnimatedCounter end={kpi.value} suffix={kpi.suffix} duration={2000+i*300} decimals={kpi.value % 1 !== 0 ? 1 : 0}/>
                      <InfoBubble info={kpi.info} color={kpi.color}/>
                    </div>
                    <div style={{ fontSize:12,color:S[400],fontWeight:500 }}>{kpi.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
                <button className="kanso-btn kanso-btn-primary" onClick={() => { document.getElementById("scenario")?.scrollIntoView({ behavior:"smooth" }); }}>▶ Voir le scénario en action</button>
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
                  background:`linear-gradient(90deg, ${EM}, ${V})`,
                }}/>
                <div style={{ fontSize:13,color:S[400],marginBottom:8,fontWeight:500 }}>
                  💡 Ces <span style={{ color:EM,fontWeight:800 }}>{p.effortCommercial.savings}</span> récupérés, c'est l'équivalent de :
                </div>
                <div className="effort-row">
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36,fontWeight:900,color:EM,lineHeight:1 }}>{p.effortCommercial.caEquivShort}</div>
                    <div style={{ fontSize:12,color:S[400],marginTop:4 }}>de nouveau CA à aller chercher</div>
                  </div>
                  <div className="effort-sep"/>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36,fontWeight:900,color:V,lineHeight:1 }}>{p.effortCommercial.moisProspection}</div>
                    <div style={{ fontSize:12,color:S[400],marginTop:4 }}>de prospection commerciale</div>
                  </div>
                </div>
                <div style={{ fontSize:11,color:S[500],marginTop:12,textAlign:"center",lineHeight:1.5 }}>
                  {p.effortCommercial.explication}
                  <InfoBubble info={{ title:"Conversion économies → effort commercial", calc: `${p.effortCommercial.savings} d'économies = résultat net pur. Pour obtenir le même résultat net par la vente, avec une marge nette de ${p.margin}, il faudrait générer ${p.effortCommercial.caEquiv} de CA additionnel.`, source: "Marge nette industrie : ~10% (hypothèse haute). Même avec 10%, l'effort commercial reste considérable." }} color={EM}/>
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
                <p style={{ color:S[400],marginTop:8,fontSize:14 }}>Chaque euro récupéré, c'est 10€ de CA que vous n'avez pas besoin d'aller chercher</p>
              </div>
              <ImpactBlock profile={profile}/>
            </div>
          </section>

          {/* ═══ LIVE SCENARIO ═══ */}
          <section id="scenario" data-reveal style={{ padding:"60px 24px",maxWidth:1100,margin:"0 auto" }}>
            <div className={`reveal ${sv("scenario")?"visible":""}`}>
              <div style={{ textAlign:"center",marginBottom:48 }}>
                <span className="tag" style={{ background:"rgba(245,158,11,0.15)",color:AM,marginBottom:12 }}>⚡ Scénario en direct</span>
                <h2 style={{ fontSize:36,fontWeight:800,marginTop:12,letterSpacing:"-0.02em" }}>De la facture à l'économie</h2>
                <p style={{ color:S[400],marginTop:8,fontSize:15 }}>Suivez le parcours d'une facture à travers la plateforme — en temps réel</p>
              </div>
              <div className="scenario-grid">
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
                  <div style={{ display:"flex",gap:8,marginTop:12,paddingLeft:4,alignItems:"center",flexWrap:"wrap" }}>
                    <button className="kanso-btn kanso-btn-ghost" style={{ padding:"8px 14px",fontSize:12 }} onClick={() => setScenarioStep(s => Math.max(0, s - 1))}>
                      ← Préc.
                    </button>
                    <button className="kanso-btn kanso-btn-ghost" style={{ padding:"8px 14px",fontSize:12 }} onClick={() => setScenarioStep(s => Math.min(scenarioSteps.length - 1, s + 1))}>
                      Suiv. →
                    </button>
                    <button className="kanso-btn kanso-btn-ghost" style={{ padding:"8px 14px",fontSize:12,borderColor:scenarioPlaying?`${V}66`:undefined,color:scenarioPlaying?VL:undefined }} onClick={() => { if (!scenarioPlaying) { setScenarioStep(0); } setScenarioPlaying(!scenarioPlaying); }}>
                      {scenarioPlaying ? "⏸ Pause" : "▶ Auto"}
                    </button>
                    <span style={{ fontSize:10,color:S[600] }}>{scenarioStep + 1}/{scenarioSteps.length}</span>
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
                    padding:24,cursor:"pointer",transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    borderColor:activeModule===mod.id?`${mod.color}44`:undefined,
                    background:activeModule===mod.id?`${mod.color}08`:undefined,
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
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,background:"rgba(30,41,59,0.5)",border:`1px solid rgba(148,163,184,0.08)`,fontSize:12,color:S[300],fontWeight:500 }}>
                    <span>{b.icon}</span>{b.text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ CTA + SIMULATEUR CA ═══ */}
          <section id="cta" data-reveal style={{ padding:"60px 24px",maxWidth:900,margin:"0 auto" }}>
            <div className={`reveal ${sv("cta")?"visible":""}`}>
              <div style={{
                padding:40,borderRadius:20,textAlign:"center",position:"relative",overflow:"hidden",
                background:"linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(16,185,129,0.08) 100%)",
                border:"1px solid rgba(139,92,246,0.2)",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${V},${EM})` }}/>
                <div style={{ fontSize:28,fontWeight:800,marginBottom:8,letterSpacing:"-0.02em" }}>
                  Combien récupéreriez-<span style={{ color:EM }}>vous</span> ?
                </div>
                <p style={{ fontSize:14,color:S[400],marginBottom:28,maxWidth:500,margin:"0 auto 28px" }}>
                  Entrez votre chiffre d'affaires — on vous montre l'impact estimé sur votre trésorerie
                </p>

                {/* CA Input */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:24,flexWrap:"wrap" }}>
                  <div style={{
                    display:"flex",alignItems:"center",gap:8,padding:"12px 20px",borderRadius:12,
                    background:"rgba(30,41,59,0.6)",border:`2px solid ${customCA?V+"66":S[700]}`,
                    transition:"all 0.3s",
                  }}>
                    <span style={{ fontSize:14,color:S[400] }}>CA annuel :</span>
                    <input
                      type="text"
                      value={customCA}
                      onChange={e => setCustomCA(e.target.value)}
                      placeholder="ex: 25"
                      style={{
                        background:"transparent",border:"none",outline:"none",
                        color:S[50],fontSize:24,fontWeight:800,fontFamily:"inherit",
                        width:100,textAlign:"center",
                      }}
                    />
                    <span style={{ fontSize:14,color:S[400] }}>M€</span>
                  </div>
                </div>

                {/* Results */}
                {hasCustomCA && (
                  <div style={{ animation:"fadeInScale 0.4s ease",marginBottom:28 }}>
                    <div className="effort-row" style={{ marginBottom:16 }}>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:42,fontWeight:900,color:EM,lineHeight:1 }}>{customSavingsK >= 1000 ? `${(customSavingsK/1000).toFixed(1).replace(".",",")}M€` : `${customSavingsK}K€`}</div>
                        <div style={{ fontSize:12,color:S[400],marginTop:4 }}>d'économies estimées / an</div>
                      </div>
                      <div className="effort-sep"/>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:42,fontWeight:900,color:V,lineHeight:1 }}>×{customROI >= 100 ? Math.round(customROI) : customROI.toFixed(1).replace(".",",")}</div>
                        <div style={{ fontSize:12,color:S[400],marginTop:4 }}>ROI vs abonnement</div>
                      </div>
                      <div className="effort-sep"/>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:42,fontWeight:900,color:AM,lineHeight:1 }}>{customCAEquivK >= 1000 ? `${(customCAEquivK/1000).toFixed(1).replace(".",",")}M€` : `${customCAEquivK}K€`}</div>
                        <div style={{ fontSize:12,color:S[400],marginTop:4 }}>de CA équivalent à générer</div>
                      </div>
                    </div>
                    <div style={{ fontSize:11,color:S[500],lineHeight:1.5 }}>
                      Estimation conservatrice : ~0,45% du CA récupéré · Marge nette 10% · Abonnement 990€/mois
                      <InfoBubble info={{ title:"Méthodologie d'estimation", calc: `${customCAValue}M€ × 0,45% = ${customSavingsK >= 1000 ? (customSavingsK/1000).toFixed(1).replace(".",",") + "M" : customSavingsK + "K"}€ de récupération estimée. Basé sur : écarts prix (60%), doublons & erreurs (25%), hausses injustifiées (15%). Le Flash Audit gratuit donne le chiffre exact pour votre entreprise.`, source: "Taux de récupération observé : 0,3% à 0,8% du CA selon le secteur. 0,45% est l'hypothèse médiane conservatrice." }} color={EM}/>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <a href="https://calendly.com/kanso-ops/flash-audit" target="_blank" rel="noopener noreferrer" className="kanso-btn kanso-btn-primary" style={{ textDecoration:"none",fontSize:16,padding:"16px 36px" }}>
                  🎯 Réserver un Flash Audit gratuit
                </a>
                <p style={{ fontSize:12,color:S[500],marginTop:12 }}>30 min · Gratuit · Sans engagement · On analyse vos données, vous décidez</p>
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
                {TIERS.map((tier) => (
                  <div key={tier.name} style={{
                    padding:"32px 28px",borderRadius:18,transition:"all 0.35s ease",position:"relative",overflow:"hidden",
                    background:tier.highlight?`${tier.color}08`:"rgba(30,41,59,0.5)",
                    border:tier.highlight?`2px solid ${tier.color}44`:`1px solid rgba(148,163,184,0.08)`,
                  }}>
                    {tier.highlight && <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${EM},${CY})`,borderRadius:"18px 18px 0 0" }}/>}
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                      <div style={{ width:10,height:10,borderRadius:"50%",background:tier.color,boxShadow:`0 0 12px ${tier.color}66` }}/>
                      <span style={{ fontWeight:700,fontSize:18 }}>{tier.name}</span>
                      {tier.highlight && <span className="tag" style={{ background:`${EM}20`,color:EM,marginLeft:"auto" }}>Recommandé</span>}
                    </div>
                    <div style={{ marginBottom:20 }}>
                      <span style={{ fontSize:42,fontWeight:900,letterSpacing:"-0.03em" }}>{tier.price}</span>
                      <span style={{ fontSize:15,color:S[400],marginLeft:4 }}>€/mois</span>
                    </div>
                    <div style={{ fontSize:13,color:tier.highlight?EM:S[400],fontWeight:600,marginBottom:16 }}>{tier.value}</div>
                    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                      {tier.modules.map((m,j) => <div key={j} style={{ display:"flex",alignItems:"center",gap:8,fontSize:13,color:S[300] }}><span style={{ color:tier.highlight?EM:S[500],fontSize:12 }}>✓</span>{m}</div>)}
                    </div>
                    {tier.highlight && (
                      <div style={{ marginTop:16,padding:"10px 14px",borderRadius:10,background:`${EM}08`,border:`1px solid ${EM}15`,fontSize:11,color:S[400],textAlign:"center" }}>
                        💡 ROI ×3,8 dès la 1ère année (PME) — ×38 pour une ETI
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"center",marginTop:48,padding:"32px 24px",borderRadius:16,background:"rgba(139,92,246,0.04)",border:"1px solid rgba(139,92,246,0.1)" }}>
                <div style={{ fontSize:20,fontWeight:700,marginBottom:8 }}>On ne touche pas à votre ERP.</div>
                <p style={{ fontSize:14,color:S[400],maxWidth:500,margin:"0 auto",lineHeight:1.6 }}>
                  Pas de projet d'intégration, pas de consultants SAP, pas de risque sur votre production.<br/>Votre IT configure un export en 30 minutes — on gère le reste.
                </p>
                <div style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:16,fontSize:13,fontWeight:600,color:VL }}>C'est pour ça qu'on est opérationnels en 5 jours, pas en 6 mois.</div>
                <div style={{ marginTop:24 }}>
                  <a href="https://calendly.com/kanso-ops/flash-audit" target="_blank" rel="noopener noreferrer" className="kanso-btn kanso-btn-primary" style={{ textDecoration:"none" }}>
                    🎯 Réserver un Flash Audit gratuit
                  </a>
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
      <footer style={{ borderTop:`1px solid ${S[800]}` }}>
        {/* CTA Footer */}
        <div style={{
          padding:"48px 24px",textAlign:"center",
          background:"linear-gradient(180deg, rgba(139,92,246,0.04) 0%, transparent 100%)",
        }}>
          <div style={{ fontSize:24,fontWeight:800,marginBottom:8,letterSpacing:"-0.02em" }}>
            Prêt à récupérer votre cash ?
          </div>
          <p style={{ fontSize:14,color:S[400],marginBottom:24,maxWidth:450,margin:"0 auto 24px" }}>
            Le Flash Audit est gratuit. En 30 minutes, on vous dit combien vous pouvez récupérer.
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <a href="https://calendly.com/kanso-ops/flash-audit" target="_blank" rel="noopener noreferrer" className="kanso-btn kanso-btn-primary" style={{ textDecoration:"none",fontSize:15,padding:"14px 32px" }}>
              🎯 Réserver un Flash Audit gratuit
            </a>
            <a href="mailto:sebastien@kanso-ops.com" className="kanso-btn kanso-btn-ghost" style={{ textDecoration:"none",fontSize:14 }}>
              ✉️ sebastien@kanso-ops.com
            </a>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ padding:"20px 24px",textAlign:"center",borderTop:`1px solid ${S[850]}` }}>
          <div style={{ fontSize:18,fontWeight:800,marginBottom:6,letterSpacing:"-0.02em" }}><span style={{ color:V }}>KANSO</span>-OPS</div>
          <p style={{ fontSize:11,color:S[600] }}>Performance achats pour PME & ETI industrielles · 10-250M€ CA · Déploiement 5 jours</p>
        </div>
      </footer>
    </div>
  );
}
