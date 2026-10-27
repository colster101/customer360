// Customer Single View: React UI on the Halstack tokens.
// Sample data only. Replace the DATA object with FSO records once the
// instance has Financial Services Operations Core installed.
import React, { useState } from "react";

const TOKENS = {
  canvas: "#FBFBFB", surface: "#FFFFFF", border: "#DEDEDE",
  ink: "#333333", inkMuted: "#5B5B5B", accent: "#267FBF", accentStrong: "#1D6091",
  accentSoft: "#F8FCFF", ok: "#2A673B", warn: "#7F5121", danger: "#A92C37",
  orange: "#D58A35", green: "#39884F", red: "#E33248",
  yellowSoft: "#FEFBEF", yellowLine: "#FCEDAE", yellowInk: "#6C5A12",
  redSoft: "#FFF7F6", redLine: "#FFE6E4",
};

const ago = (d) => new Date(Date.now() - d * 86400000);
const fmt = (d) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const money = (n) => "£" + Number(n).toLocaleString("en-GB", { maximumFractionDigits: 0 });

// Sample data, shaped to the seven blocks. Field names here are placeholders.
const DATA = [
  {
    id: "CUS-1001",
    party: { name: "Harbourline Logistics Ltd", type: "Corporate", parent: "Northwind Holdings plc (group)",
      ids: ["CRM: HL-8842", "Broker ref: BRK-3319"], kyc: "Verified", sanctions: "Clear", marketing: "Opted out",
      vulnerable: false, updated: ago(2),
      relations: [{ who: "Mara Ellison", role: "Director, policyholder contact" }, { who: "Jon Pike", role: "Fleet manager, claimant contact" }] },
    policies: [
      { line: "Motor fleet", ref: "MF-22817", status: "Active", end: "2027-02-28", premium: 48200, limit: "£10m", excess: "£2,500", broker: "Ashgrove Broking", updated: ago(1) },
      { line: "Property damage", ref: "PD-40913", status: "Active", end: "2027-01-14", premium: 22750, limit: "£25m", excess: "£10,000", broker: "Ashgrove Broking", updated: ago(1) },
      { line: "Employers liability", ref: "EL-10288", status: "Renewal pending", end: "2026-10-31", premium: 6100, limit: "£10m", excess: "None", broker: "Stonebridge Re", updated: ago(9) },
    ],
    risk: { score: 62, band: "Medium", lossRatio: 41, losses: 4, surveyDue: "2026-12-10", conditions: ["Fleet telematics required by 31 Jan 2027"], updated: ago(14) },
    claims: [
      { ref: "CL-7741", policy: "MF-22817", date: "2026-08-19", type: "Third-party collision", status: "Open", reserve: 14500, paid: 3200 },
      { ref: "CL-7102", policy: "PD-40913", date: "2026-02-04", type: "Water damage", status: "Closed", reserve: 0, paid: 8900 },
    ],
    money: { due: 0, arrears: 0, lastPayment: ago(12), method: "Direct debit", commission: 9840, recoveries: 2100, updated: ago(1) },
    interactions: [
      { date: ago(1), channel: "Email", text: "Broker requested renewal quote for EL-10288." },
      { date: ago(3), channel: "Phone", text: "Collision reported at Unit 4 depot. CL-7741 opened." },
      { date: ago(60), channel: "Complaint", text: "Delay on CL-7102 settlement. Resolved." },
    ],
    actions: ["Chase EL-10288 renewal terms before 31 Oct", "Request telematics install date", "Schedule property survey (due 10 Dec)"],
  },
  {
    id: "CUS-1002",
    party: { name: "Priya and Sam Holloway", type: "Personal", parent: "None",
      ids: ["CRM: CU-20417"], kyc: "Verified", sanctions: "Clear", marketing: "Opted in",
      vulnerable: true, updated: ago(5),
      relations: [{ who: "Sam Holloway", role: "Joint policyholder" }, { who: "Priya Holloway", role: "Joint policyholder" }] },
    policies: [
      { line: "Home", ref: "HO-90455", status: "Active", end: "2027-05-31", premium: 684, limit: "£450,000", excess: "£250", broker: "Direct", updated: ago(5) },
      { line: "Motor", ref: "MO-31208", status: "Active", end: "2027-04-09", premium: 812, limit: "Comprehensive", excess: "£300", broker: "Direct", updated: ago(5) },
    ],
    risk: { score: 28, band: "Low", lossRatio: 0, losses: 0, surveyDue: null, conditions: [], updated: ago(30) },
    claims: [],
    money: { due: 0, arrears: 0, lastPayment: ago(4), method: "Monthly card", commission: 0, recoveries: 0, updated: ago(4) },
    interactions: [
      { date: ago(4), channel: "Portal", text: "Large-print correspondence requested." },
      { date: ago(40), channel: "Phone", text: "Asked about alternative contact method for vulnerability support." },
    ],
    actions: ["Confirm vulnerability support plan is recorded", "Review home sum insured (last valued 2024)"],
  },
];

const attention = (c) => c.policies.filter((p) => /pending/i.test(p.status)).length
  + c.claims.filter((k) => k.status === "Open").length + (c.party.vulnerable ? 1 : 0);

const toneFor = (s) => (/active|open|verified|clear|low|opted in/i.test(s) ? TOKENS.ok : /pending|medium|opted out/i.test(s) ? TOKENS.warn : TOKENS.inkMuted);

const Card = ({ title, updated, children, full }) => (
  <section style={{ ...styles.card, gridColumn: full ? "1 / -1" : undefined }}>
    <div style={styles.cardHead}>
      <h2 style={styles.h2}>{title}</h2>
      {updated && <span style={styles.fresh}>Updated {fmt(updated)}</span>}
    </div>
    {children}
  </section>
);

const Row = ({ k, children }) => (
  <tr><td style={styles.keyCell}>{k}</td><td style={styles.td}>{children}</td></tr>
);

export default function CustomerSingleView() {
  const [currentId, setCurrentId] = useState(DATA[0].id);
  const c = DATA.find((x) => x.id === currentId);
  const openClaims = c.claims.filter((k) => k.status === "Open");
  const totalPremium = c.policies.reduce((a, p) => a + p.premium, 0);
  const openReserve = openClaims.reduce((a, k) => a + k.reserve, 0);

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandName}>Customer Single View</div>
          <div style={styles.brandSub}>SmartApp prototype</div>
        </div>
        <div style={styles.navLabel}>Customers</div>
        {DATA.map((x) => {
          const n = attention(x);
          const active = x.id === currentId;
          return (
            <button key={x.id} onClick={() => setCurrentId(x.id)} aria-current={active}
              style={{ ...styles.navItem, ...(active ? styles.navActive : {}) }}>
              {x.party.name}
              {n > 0 && <span style={styles.badge}>{n}</span>}
            </button>
          );
        })}
      </aside>

      <div style={styles.main}>
        <header style={styles.topbar}>
          <span style={styles.crumb}>Customers</span>
          <h1 style={styles.h1}>{c.party.name}</h1>
          <span style={styles.topRight}>Sample data · each block shows its source's last update</span>
        </header>

        <main style={styles.content}>
          <div style={{ ...styles.kpis, gridColumn: "1 / -1" }}>
            <Kpi v={c.policies.length} l="Policies" />
            <Kpi v={money(totalPremium)} l="Annual premium" />
            <Kpi v={openClaims.length} l="Open claims" tone={openClaims.length ? "warn" : "ok"} />
            <Kpi v={money(openReserve)} l="Open reserves" tone={openReserve ? "warn" : "ok"} />
            <Kpi v={c.risk.band} l={`Risk band (${c.risk.score})`} tone={c.risk.band === "Low" ? "ok" : "warn"} />
            <Kpi v={money(c.money.arrears)} l="Arrears" tone={c.money.arrears ? "danger" : "ok"} />
          </div>

          {(c.party.vulnerable || c.policies.some((p) => /pending/i.test(p.status)) || openClaims.length > 0) && (
            <Card title="Needs attention" full>
              {c.party.vulnerable && <div style={styles.flagDanger}>Vulnerable customer flag: check support plan before any outbound contact</div>}
              {c.policies.filter((p) => /pending/i.test(p.status)).map((p) => (
                <div key={p.ref} style={styles.flag}>{p.line} ({p.ref}) renews {p.end}</div>
              ))}
              {openClaims.map((k) => <div key={k.ref} style={styles.flag}>Open claim {k.ref}: reserve {money(k.reserve)}</div>)}
            </Card>
          )}

          <Card title="1. Identity and relationships" updated={c.party.updated}>
            <div style={styles.sub}>{c.party.type} · {c.id}</div>
            <table style={styles.table}><tbody>
              <Row k="Name">{c.party.name}</Row>
              <Row k="Group parent">{c.party.parent}</Row>
              <Row k="Identifiers">{c.party.ids.join(" · ")}</Row>
              <Row k="KYC"><span style={{ color: toneFor(c.party.kyc) }}>{c.party.kyc}</span></Row>
              <Row k="Sanctions / PEP"><span style={{ color: toneFor(c.party.sanctions) }}>{c.party.sanctions}</span></Row>
              <Row k="Marketing"><span style={{ color: toneFor(c.party.marketing) }}>{c.party.marketing}</span></Row>
            </tbody></table>
            <div style={{ ...styles.sub, marginTop: 10 }}>Related parties</div>
            <table style={styles.table}><tbody>
              {c.party.relations.map((r) => <tr key={r.who}><td style={styles.td}>{r.who}</td><td style={styles.muted}>{r.role}</td></tr>)}
            </tbody></table>
          </Card>

          <Card title="2. Policies held" full>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Line</th><th style={styles.th}>Ref</th><th style={styles.th}>Status</th><th style={styles.th}>Renews</th><th style={styles.th}>Premium</th><th style={styles.th}>Broker</th></tr></thead>
              <tbody>
                {c.policies.map((p) => (
                  <tr key={p.ref}>
                    <td style={styles.td}>{p.line}<div style={styles.muted}>Limit {p.limit} · Excess {p.excess}</div></td>
                    <td style={styles.td}>{p.ref}</td>
                    <td style={{ ...styles.td, color: toneFor(p.status) }}>{p.status}</td>
                    <td style={styles.td}>{p.end}</td>
                    <td style={styles.td}>{money(p.premium)}</td>
                    <td style={styles.td}>{p.broker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="3. Risk profile" updated={c.risk.updated}>
            <table style={styles.table}><tbody>
              <Row k="Score">{c.risk.score} ({c.risk.band})</Row>
              <Row k="Loss ratio (5 yr)">{c.risk.lossRatio}%</Row>
              <Row k="Losses (5 yr)">{c.risk.losses}</Row>
              <Row k="Next survey">{c.risk.surveyDue || "None due"}</Row>
            </tbody></table>
            {c.risk.conditions.map((x) => <div key={x} style={styles.flag}>{x}</div>)}
          </Card>

          <Card title="4. Claims" full>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Claim</th><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Status</th><th style={styles.th}>Reserve</th><th style={styles.th}>Paid</th></tr></thead>
              <tbody>
                {c.claims.length ? c.claims.map((k) => (
                  <tr key={k.ref}>
                    <td style={styles.td}>{k.ref}<div style={styles.muted}>{k.policy}</div></td>
                    <td style={styles.td}>{k.date}</td>
                    <td style={styles.td}>{k.type}</td>
                    <td style={{ ...styles.td, color: toneFor(k.status) }}>{k.status}</td>
                    <td style={styles.td}>{money(k.reserve)}</td>
                    <td style={styles.td}>{money(k.paid)}</td>
                  </tr>
                )) : <tr><td colSpan={6} style={styles.muted}>No claims on record</td></tr>}
              </tbody>
            </table>
          </Card>

          <Card title="5. Money" updated={c.money.updated}>
            <table style={styles.table}><tbody>
              <Row k="Premium due">{money(c.money.due)}</Row>
              <Row k="Arrears">{money(c.money.arrears)}</Row>
              <Row k="Last payment">{fmt(c.money.lastPayment)}</Row>
              <Row k="Method">{c.money.method}</Row>
              <Row k="Commission (YTD)">{money(c.money.commission)}</Row>
              <Row k="Recoveries">{money(c.money.recoveries)}</Row>
            </tbody></table>
          </Card>

          <Card title="6. Interactions" updated={c.interactions[0]?.date} full>
            <ul style={styles.timeline}>
              {c.interactions.map((i, idx) => (
                <li key={idx} style={styles.timelineItem}>
                  <time style={styles.muted}>{fmt(i.date)} · {i.channel}</time>
                  <div>{i.text}</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="7. Next actions">
            <ul style={{ paddingLeft: 18 }}>
              {c.actions.map((a) => <li key={a} style={{ marginBottom: 6 }}>{a}</li>)}
            </ul>
          </Card>
        </main>
        <footer style={styles.footer}>Invented sample data only. No real customers, addresses or policies.</footer>
      </div>
    </div>
  );
}

function Kpi({ v, l, tone }) {
  const color = tone === "warn" ? TOKENS.orange : tone === "danger" ? TOKENS.red : tone === "ok" ? TOKENS.green : TOKENS.accent;
  return (
    <div style={{ ...styles.kpi, borderTopColor: color }}>
      <div style={styles.kpiV}>{v}</div>
      <div style={styles.kpiL}>{l}</div>
    </div>
  );
}

const styles = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "'Open Sans', 'Segoe UI', Arial, sans-serif", background: TOKENS.canvas, color: TOKENS.ink, fontSize: 14 },
  sidebar: { width: 224, minWidth: 224, background: TOKENS.surface, borderRight: `1px solid ${TOKENS.border}`, display: "flex", flexDirection: "column" },
  brand: { padding: "16px 20px 12px", borderBottom: `1px solid ${TOKENS.border}` },
  brandName: { fontSize: 16, fontWeight: 700 },
  brandSub: { fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: TOKENS.inkMuted, marginTop: 2 },
  navLabel: { fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: TOKENS.inkMuted, padding: "14px 20px 6px" },
  navItem: { display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", color: TOKENS.inkMuted, background: "none", border: 0, width: "100%", textAlign: "left", font: "inherit", cursor: "pointer" },
  navActive: { background: TOKENS.accentSoft, color: TOKENS.accentStrong, fontWeight: 600, boxShadow: `inset 3px 0 0 ${TOKENS.accent}` },
  badge: { marginLeft: "auto", borderRadius: 999, padding: "1px 8px", fontSize: 11, fontWeight: 700, color: "#fff", background: TOKENS.accent },
  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: { background: TOKENS.surface, borderBottom: `1px solid ${TOKENS.border}`, padding: "0 24px", minHeight: 56, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  crumb: { color: TOKENS.inkMuted, fontSize: 12 },
  h1: { fontSize: 16, fontWeight: 700, margin: 0 },
  topRight: { marginLeft: "auto", color: TOKENS.inkMuted, fontSize: 12 },
  content: { padding: "20px 24px 32px", display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", maxWidth: 1200, width: "100%" },
  kpis: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 },
  kpi: { background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderTop: "3px solid", borderRadius: 4, padding: "12px 14px" },
  kpiV: { fontSize: 20, fontWeight: 700 },
  kpiL: { fontSize: 12, color: TOKENS.inkMuted, marginTop: 2 },
  card: { background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 4, padding: "14px 16px", minWidth: 0 },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: 600, margin: 0 },
  fresh: { fontSize: 12, color: TOKENS.inkMuted, whiteSpace: "nowrap" },
  sub: { color: TOKENS.inkMuted, fontSize: 12, marginBottom: 8 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: `1px solid ${TOKENS.border}`, color: TOKENS.inkMuted, fontWeight: 600, fontSize: 12 },
  td: { textAlign: "left", padding: "6px 4px", borderBottom: `1px solid ${TOKENS.border}`, verticalAlign: "top" },
  keyCell: { textAlign: "left", padding: "6px 4px", borderBottom: `1px solid ${TOKENS.border}`, color: TOKENS.inkMuted, width: "40%", verticalAlign: "top" },
  muted: { color: TOKENS.inkMuted, fontSize: 12 },
  flag: { fontSize: 12, padding: "8px 10px", borderRadius: 4, marginBottom: 6, background: TOKENS.yellowSoft, border: `1px solid ${TOKENS.yellowLine}`, color: TOKENS.yellowInk },
  flagDanger: { fontSize: 12, padding: "8px 10px", borderRadius: 4, marginBottom: 6, background: TOKENS.redSoft, border: `1px solid ${TOKENS.redLine}`, color: TOKENS.danger },
  timeline: { listStyle: "none", padding: 0, margin: 0 },
  timelineItem: { borderLeft: `2px solid ${TOKENS.accent}`, padding: "2px 0 12px 12px" },
  footer: { textAlign: "center", color: TOKENS.inkMuted, fontSize: 12, padding: 16 },
};
