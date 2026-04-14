import { useState } from "react";

const data = {
  overall: { n: 49, newWarm: 5.2, newProf: 6.4, newAdhd: 6.3, oldWarm: 5.3, oldProf: 6.2, oldAdhd: 5.9, prefNew: 16, prefOld: 18, prefNone: 15 },
  experienced: { n: 33, newWarm: 4.9, newProf: 6.3, newAdhd: 6.2, oldWarm: 5.6, oldProf: 6.2, oldAdhd: 6.0, prefNew: 13, prefOld: 11, prefNone: 9 },
  fresh: { n: 16, newWarm: 5.8, newProf: 6.5, newAdhd: 6.6, oldWarm: 4.6, oldProf: 6.2, oldAdhd: 5.6, prefNew: 3, prefOld: 7, prefNone: 6 },
  visualsOnly: { n: 8, newWarm: 5.0, newProf: 6.5, newAdhd: 6.2, oldWarm: 5.9, oldProf: 6.1, oldAdhd: 5.8 },
  visualsTov: { n: 41, newWarm: 5.2, newProf: 6.3, newAdhd: 6.3, oldWarm: 5.2, oldProf: 6.3, oldAdhd: 5.9 },
};

const sections = [
  "summary", "verdict", "needle", "held-back", "personality", "audience", "recs"
];
const sectionLabels = {
  summary: "Executive Summary",
  verdict: "The Verdict",
  needle: "What Moved the Needle",
  "held-back": "What Held It Back",
  personality: "Brand Personality",
  audience: "Audience Lens",
  recs: "Recommendations",
};

function Bar({ value, max = 7, color = "#3B82F6", label, width = 200 }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 100, fontSize: 12, color: "#64748B", textAlign: "right", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <div style={{ width, height: 20, background: "#F1F5F9", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", minWidth: 28, fontFamily: "'DM Mono', monospace" }}>{value.toFixed(1)}</span>
    </div>
  );
}

function ScaleComparison({ d, showDelta = true }) {
  const metrics = [
    { key: "Warm", newVal: d.newWarm, oldVal: d.oldWarm },
    { key: "Prof", newVal: d.newProf, oldVal: d.oldProf },
    { key: "ADHD-fr.", newVal: d.newAdhd, oldVal: d.oldAdhd },
  ];
  return (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>New (blue)</div>
        {metrics.map(m => <Bar key={m.key} value={m.newVal} label={m.key} color="#3B82F6" />)}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Old (gold)</div>
        {metrics.map(m => <Bar key={m.key} value={m.oldVal} label={m.key} color="#D97706" />)}
      </div>
      {showDelta && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Delta (New−Old)</div>
          {metrics.map(m => {
            const delta = m.newVal - m.oldVal;
            const col = delta > 0.3 ? "#059669" : delta < -0.3 ? "#DC2626" : "#64748B";
            return (
              <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 100, fontSize: 12, color: "#64748B", textAlign: "right", fontFamily: "'DM Sans', sans-serif" }}>{m.key}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: col, fontFamily: "'DM Mono', monospace" }}>
                  {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({ children, color = "#E0F2FE", textColor = "#0369A1" }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, background: color, color: textColor, fontSize: 12, fontWeight: 600, margin: "2px 3px", fontFamily: "'DM Sans', sans-serif" }}>{children}</span>;
}

function Quote({ text, source }) {
  return (
    <div style={{ borderLeft: "3px solid #CBD5E1", paddingLeft: 14, margin: "10px 0", fontStyle: "italic", fontSize: 13, color: "#475569", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
      "{text}" <span style={{ fontStyle: "normal", fontSize: 11, color: "#94A3B8" }}>— {source}</span>
    </div>
  );
}

function Card({ title, children, accent = "#3B82F6" }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      {title && <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${accent}`, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>}
      {children}
    </div>
  );
}

function ThemeBar({ label, count, max, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <span style={{ width: 140, fontSize: 12, color: "#334155", textAlign: "right", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <div style={{ flex: 1, height: 16, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${(count / max) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 11, color: "#64748B", minWidth: 24, fontFamily: "'DM Mono', monospace" }}>{count}</span>
    </div>
  );
}

export default function Report() {
  const [active, setActive] = useState("summary");

  const content = {
    summary: (
      <div>
        <Card title="Bottom Line">
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#334155", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            The new (blue) design <strong>wins on professionalism (+0.2) and ADHD-friendliness (+0.4)</strong> but trades off warmth (−0.1) compared to the current gold design. Preference is essentially split — 16 new vs. 18 old, with 15 undecided. However, the real story is in the segments: <strong>fresh patients find the new design significantly warmer (+1.2)</strong>, while experienced patients find it colder (−0.7). The tone of voice intervention closes the warmth gap entirely: without ToV, old wins warmth by −0.9; with ToV, it's dead even.
          </p>
        </Card>
        <Card title="Study Design at a Glance">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
            <div><strong>Participants:</strong> 49 ADHD patients (US)</div>
            <div><strong>Segments:</strong> 33 experienced, 16 fresh</div>
            <div><strong>Design:</strong> A/B counterbalanced (27 AB, 22 BA)</div>
            <div><strong>Method:</strong> Unmoderated UT + rating scales</div>
            <div><strong>Test variants:</strong> Visuals only (n=8), Visuals+ToV (n=41)</div>
            <div><strong>Measures:</strong> Warmth, Professional, ADHD-friendly (/7)</div>
          </div>
        </Card>
        <Card title="Scale Scores — All Participants (n=49)" accent="#059669">
          <ScaleComparison d={data.overall} />
        </Card>
        <Card title="Preference Split" accent="#7C3AED">
          <div style={{ display: "flex", gap: 4, height: 36, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${(16/49)*100}%`, background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>16</div>
            <div style={{ width: `${(15/49)*100}%`, background: "#CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>15</div>
            <div style={{ width: `${(18/49)*100}%`, background: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>18</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", fontFamily: "'DM Sans', sans-serif" }}>
            <span>● New (blue): 33%</span><span>● No pref: 31%</span><span>● Old (gold): 37%</span>
          </div>
        </Card>
      </div>
    ),

    verdict: (
      <div>
        <Card title="Neither Design Wins Outright — But the New Design Has the Edge on What Matters Most">
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>
            Preference is statistically tied (33% new vs 37% old). But looking at the brand vision pillars, the new design outperforms on <strong>two of three</strong>: professionalism and ADHD-friendliness. Warmth is the one contested dimension — and it splits sharply by audience.
          </p>
        </Card>
        <Card title="Professionalism: Both Strong, New Edges Ahead" accent="#3B82F6">
          <ScaleComparison d={{ newWarm: data.overall.newProf, oldWarm: data.overall.oldProf, newProf: data.overall.newProf, oldProf: data.overall.oldProf, newAdhd: data.overall.newProf, oldAdhd: data.overall.oldProf }} showDelta={false} />
          <p style={{ fontSize: 13, color: "#475569", marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
            Both prototypes score ≥6.2 — professionalism is a baseline strength. 57% rated the new design 7/7. The clean layout, structured information, and medical team display drive this. Neither design needs major work here.
          </p>
          <Quote text="Very professional. Everything's laid out very nicely. Nice screenshots." source="EnderMaru, 23, fresh" />
          <Quote text="The information is really good to look at. Not a lot they have to scroll through." source="BS07, 38, experienced" />
        </Card>
        <Card title="ADHD-Friendliness: New Design Wins (6.3 vs 5.9)" accent="#059669">
          <p style={{ fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
            65% rated the new design 7/7 for ADHD-friendliness vs. 43% for old. The gap is driven by the new design's clearer information hierarchy, step-by-step layout, and content organization. However, both designs get dinged for excessive length and scroll fatigue.
          </p>
          <Quote text="It definitely makes it easy to understand the overall thrust of it." source="chrispaullover, 25, fresh" />
          <Quote text="There's an awful lot of reading, which isn't ADHD-friendly. It's hard for people like me to remain focused." source="GShock4117, 49, experienced" />
        </Card>
        <Card title="Warmth: The Contested Dimension (5.2 vs 5.3)" accent="#DC2626">
          <p style={{ fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
            Overall warmth is nearly identical, but this masks a stark segment split. The old design's gold palette reads as warm to experienced patients. The new design's blue palette, combined with ToV, actually reads warmer to fresh patients who haven't anchored to the gold.
          </p>
          <Quote text="The gold tone is nice. It's a lot more colorful and warm." source="GShock4117, 49, experienced" />
          <Quote text="Helpful, efficient, and accessible — the colors and overall vibe definitely feel warm." source="chrispaullover, 25, fresh" />
        </Card>
      </div>
    ),

    needle: (
      <div>
        <Card title="What Drove Positive Perception (2,172 positive tags coded)">
          <p style={{ fontSize: 13, color: "#475569", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Positive mentions across all 59 transcripts, both prototypes combined:</p>
          {[
            { label: "Informative content", count: 242, c: "#3B82F6" },
            { label: "Professionalism", count: 208, c: "#0369A1" },
            { label: "ADHD-friendly", count: 140, c: "#059669" },
            { label: "Easy / clean / simple", count: 127, c: "#10B981" },
            { label: "Warm feeling", count: 126, c: "#D97706" },
            { label: "App preview", count: 112, c: "#7C3AED" },
            { label: "Colors", count: 91, c: "#EC4899" },
            { label: "Layout / organization", count: 82, c: "#6366F1" },
            { label: "Provider faces", count: 76, c: "#0891B2" },
            { label: "Trust signals", count: 65, c: "#475569" },
          ].map(t => <ThemeBar key={t.label} {...t} max={242} color={t.c} />)}
        </Card>

        <Card title="🏥 Clinically Competent: What Drives It" accent="#0369A1">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>Provider faces + credentials</strong> (76 mentions): Showing real clinician photos with their specialties is one of the strongest trust builders. Participants frequently said seeing doctors made it feel "legitimate."</p>
            <p><strong>Evidence-based language</strong>: Both prototypes use clinical language well. Phrases like "evidence-based strategies" and medication mechanism explanations create credibility.</p>
            <p><strong>Accreditations</strong>: HIPAA badges, BBB accreditation, and Trustpilot ratings mentioned positively across transcripts.</p>
          </div>
          <Quote text="The accreditations at the bottom of the website — that's very important. It feels like a clinic that is legitimate." source="BinacaDelRio (fresh), 49" />
        </Card>

        <Card title="🤗 Personally Warm: What Drives It" accent="#D97706">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>Color palette</strong> (91 mentions): The #1 driver of warmth perception. Gold/pastel tones in the old design were repeatedly called "soothing," "inviting." The blue in the new design reads "professional" but not "warm" to experienced users — though fresh users respond well to it.</p>
            <p><strong>Smiling faces</strong>: Images of providers and patients smiling directly contribute to warmth. Multiple participants said "the smiling faces make it feel welcoming."</p>
            <p><strong>Tone of Voice</strong>: The ToV intervention adds +0.9 warmth points vs visuals-only. Phrases like "meet you where you are" and "your journey" are specifically called out as warm language.</p>
          </div>
          <Quote text="It's a combination of the pastel colors and the phrasing of the website — the phrasing seems very warm and compassionate." source="BinacaDelRio (fresh), 49" />
        </Card>

        <Card title="🧠 ADHD-Friendly: What Drives It" accent="#059669">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>Step-by-step layout</strong>: The 1-2-3-4 process flow is universally praised. It reduces cognitive load and gives a clear path forward.</p>
            <p><strong>App preview / dashboard</strong> (112 mentions): Showing what the user experience looks like post-signup is highly engaging. The carousel of app screens gets strong positive reactions.</p>
            <p><strong>Colored section breaks</strong>: Background color changes create visual separation that helps scanning. Participants with ADHD explicitly note this aids focus.</p>
            <p><strong>Horizontal carousels</strong>: Reduce vertical scroll fatigue. Medication comparisons in carousel format get better engagement than stacked layouts.</p>
          </div>
          <Quote text="I love a toolbox and how I can keep track of how it's going." source="Cinderali2, 40, experienced" />
          <Quote text="I like that you have that separation of two different color tone backgrounds." source="Bertha Smitheron, 26, experienced" />
        </Card>

        <Card title="🔤 Tone of Voice: The Hidden Multiplier" accent="#7C3AED">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p>The tone of voice addition <strong>closes the warmth gap entirely</strong>. Visuals-only: new design warmth is 0.9 points behind old. Visuals+ToV: dead even (5.2 vs 5.2). Key phrases that work:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              <Chip>"Meet you where you are"</Chip>
              <Chip>"Your journey"</Chip>
              <Chip>"As individual as you are"</Chip>
              <Chip>"We'll take into account your unique circumstances"</Chip>
              <Chip>"Medications don't change who you are"</Chip>
            </div>
          </div>
          <Quote text="The language speaks to warm and inviting and understanding." source="JoeyNeco17, 39, fresh" />
        </Card>

        <Card title="🛡️ Trust Signals: What Works Equally Well" accent="#475569">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            The following trust signals perform consistently across both designs — they're not differentiators but are essential table stakes:
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              <Chip color="#FEF3C7" textColor="#92400E">Provider photos + bios</Chip>
              <Chip color="#FEF3C7" textColor="#92400E">Patient reviews (Google-sourced)</Chip>
              <Chip color="#FEF3C7" textColor="#92400E">HIPAA compliance badge</Chip>
              <Chip color="#FEF3C7" textColor="#92400E">BBB accreditation</Chip>
              <Chip color="#FEF3C7" textColor="#92400E">Trustpilot rating</Chip>
              <Chip color="#FEF3C7" textColor="#92400E">State availability map</Chip>
            </div>
          </div>
        </Card>
      </div>
    ),

    "held-back": (
      <div>
        <Card title="What Undercut Brand Perception (706 negative tags coded)">
          {[
            { label: "Info overload", count: 66, c: "#DC2626" },
            { label: "Pricing concerns", count: 29, c: "#F59E0B" },
            { label: "Too much scrolling", count: 25, c: "#EA580C" },
            { label: "Cold / bland visuals", count: 20, c: "#6366F1" },
            { label: "Text too small", count: 15, c: "#7C3AED" },
            { label: "Spacing / crowding", count: 15, c: "#0891B2" },
            { label: "Insurance unclear", count: 13, c: "#059669" },
            { label: "Trust concerns", count: 9, c: "#475569" },
            { label: "AI-looking photos", count: 7, c: "#9333EA" },
            { label: "Feels salesy", count: 5, c: "#DC2626" },
          ].map(t => <ThemeBar key={t.label} {...t} max={66} color={t.c} />)}
        </Card>

        <Card title="⚠️ The Scroll-Content Paradox" accent="#EA580C">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p>The biggest tension in the data: participants praise the informative content (242 positive mentions) while simultaneously flagging information overload (66 negative) and scroll fatigue (25 negative). This is the #1 threat to ADHD-friendliness — the very audience this serves is the one most affected by long pages.</p>
            <p><strong>Both prototypes suffer from this equally.</strong> The solution isn't removing content — it's progressive disclosure (collapsible sections, "learn more" links, multi-page architecture).</p>
          </div>
          <Quote text="There's an awful lot of scrolling to get to the end. There's an awful lot of reading, which isn't ADHD-friendly." source="GShock4117, 49, experienced" />
          <Quote text="The first one was just a little bit too overwhelming. We're not gonna sit here and read this whole thing." source="Ash1984, 42, experienced" />
        </Card>

        <Card title="💰 Pricing as a Warmth Killer" accent="#F59E0B">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p>29 negative mentions about pricing — but the issue isn't just cost. It's the <strong>confusion about insurance</strong> (13 mentions). "No insurance needed" is read by many as "we don't take insurance" rather than the intended "you don't need insurance to start." This creates an unintended coldness: participants feel excluded if they have insurance and want to use it.</p>
          </div>
          <Quote text="Where it says no insurance needed — I wonder if they do take insurance, because that's something I'd want to use." source="Ash1984, 42, experienced" />
        </Card>

        <Card title="🎨 Cold Visuals in the New Design" accent="#6366F1">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p>20 mentions of "cold," "bland," "clinical," or "sterile" visuals — concentrated around the new (blue) design when viewed by experienced patients. The blue reads as medical/institutional rather than warm. This is partially offset by ToV but not fully resolved.</p>
          </div>
          <Quote text="It was just stark white to stark white and I was just like, ah. It didn't catch me." source="Fallon313, 30, fresh" />
          <Quote text="Cold. Doesn't really have anything that makes me feel excited." source="BS07, 38, experienced" />
        </Card>

        <Card title="📸 AI Photos Undermine Trust" accent="#9333EA">
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            <p>7 explicit mentions, but when flagged it's devastating — participants who notice AI-generated photos immediately shift to distrust. The old design's Trustpilot placement + AI hero images triggered a "sales pitch" reaction in some users.</p>
          </div>
          <Quote text="I don't like these AI pictures. Right off the bat, this looks more like a sales pitch to me." source="Cinderali2, 40, experienced" />
        </Card>
      </div>
    ),

    personality: (
      <div>
        <Card title="Three-Word Descriptions — Most Frequent">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>New Design (blue)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {[["professional", 14], ["informative", 17], ["organized", 12], ["simple", 9], ["clean", 7], ["helpful", 9], ["clear", 8], ["trustworthy", 5], ["comprehensive", 7], ["concise", 3], ["efficient", 4]].sort((a,b) => b[1]-a[1]).map(([w,c]) => (
                  <span key={w} style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: "#EFF6FF", color: "#1E40AF", fontSize: Math.min(9 + c, 18), fontWeight: c > 8 ? 700 : 500, fontFamily: "'DM Sans', sans-serif" }}>{w} ({c})</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Old Design (gold)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {[["informative", 16], ["professional", 12], ["friendly", 7], ["warm", 5], ["plain", 7], ["simple", 9], ["organized", 12], ["clean", 5], ["modern", 6], ["bland", 4], ["helpful", 6], ["comprehensive", 5], ["detailed", 4]].sort((a,b) => b[1]-a[1]).map(([w,c]) => (
                  <span key={w} style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: w==="bland"||w==="plain" ? "#FEE2E2" : "#FEF3C7", color: w==="bland"||w==="plain" ? "#991B1B" : "#92400E", fontSize: Math.min(9 + c, 18), fontWeight: c > 8 ? 700 : 500, fontFamily: "'DM Sans', sans-serif" }}>{w} ({c})</span>
                ))}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
            Both designs share a core identity: <strong>professional, informative, organized.</strong> The old design uniquely owns "warm" and "friendly" — but also attracts "bland" and "plain." The new design uniquely owns "clean," "efficient," "trustworthy."
          </p>
        </Card>

        <Card title="If This Website Were a Person…" accent="#7C3AED">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 8, textTransform: "uppercase" }}>New Design Personas</div>
              <p><strong>Dominant archetype: The Doctor / Professional</strong></p>
              <p>Described as: a doctor, a professional, a librarian, someone in a suit and tie who is "smart but friendly," "organized and get-to-the-point," "a nurse checking your vitals." One participant: "my mom — very organized, has everything together."</p>
              <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Maps well to → <strong>Clinically competent</strong> ✅</p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 8, textTransform: "uppercase" }}>Old Design Personas</div>
              <p><strong>Dominant archetype: The Favorite Teacher / Therapist</strong></p>
              <p>Described as: a friendly teacher, "your favorite high school teacher," a therapist, a counselor, "my daughter's pediatrician." Also: "friendly, supportive, optimistic." One participant: "a jail warden — just here to do its job and go home." (negative outlier)</p>
              <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Maps well to → <strong>Personally warm</strong> ✅</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#334155", marginTop: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            Insight: The brand vision needs BOTH archetypes. The new design nails the doctor; the old design nails the teacher. Neither fully achieves the vision alone.
          </p>
        </Card>
      </div>
    ),

    audience: (
      <div>
        <Card title="Experienced vs. Fresh: A Tale of Two Audiences" accent="#059669">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0369A1", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Experienced (n=33)</div>
              <ScaleComparison d={data.experienced} showDelta={true} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Fresh (n=16)</div>
              <ScaleComparison d={data.fresh} showDelta={true} />
            </div>
          </div>
        </Card>

        <Card title="The Key Segment Insight">
          <div style={{ fontSize: 14, lineHeight: 1.7, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>Experienced patients</strong> have an existing mental model of "what an ADHD clinic should feel like" — warm, personal, familiar. The gold palette matches this expectation. When they see the blue design, it feels colder than what they're used to (warmth drops 0.7 points). But they still rate it high on professionalism and ADHD-friendliness.</p>
            <p><strong>Fresh patients</strong> have no such anchor. They evaluate the designs on face value. The new design's clean organization, clear step-by-step flow, and professional tone registers as both warmer (+1.2!) and more ADHD-friendly (+1.0) than the old design. The old design's gold palette doesn't resonate as "warm" for them — it reads as cluttered or "too much."</p>
            <p style={{ marginTop: 8, padding: "8px 12px", background: "#F0FDF4", borderRadius: 8, fontWeight: 600 }}>
              ⚡ Implication: The new design is better optimized for acquisition (fresh patients). The old design better serves retention (experienced patients). A hybrid approach may be needed.
            </p>
          </div>
        </Card>

        <Card title="Tone of Voice Effect by Test Variant">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", marginBottom: 8, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Visuals Only (n=8)</div>
              <div style={{ fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                <p>NEW warmth: 5.0 vs OLD warmth: 5.9</p>
                <p style={{ fontWeight: 700, color: "#DC2626" }}>Δ warmth: −0.9 (old wins clearly)</p>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", marginBottom: 8, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Visuals + ToV (n=41)</div>
              <div style={{ fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                <p>NEW warmth: 5.2 vs OLD warmth: 5.2</p>
                <p style={{ fontWeight: 700, color: "#059669" }}>Δ warmth: 0.0 (fully equalized)</p>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#334155", marginTop: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            The tone of voice is doing critical work. Without it, the new design loses warmth. With it, parity is achieved. This makes ToV a must-ship element alongside any visual changes.
          </p>
        </Card>
      </div>
    ),

    recs: (
      <div>
        <Card title="🚀 Ship" accent="#059669">
          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>1. Tone of Voice — ship immediately.</strong> It's the single highest-ROI change. It closes the warmth gap (+0.9) at zero design cost. Key phrases to preserve: "meet you where you are," "your journey," "as individual as you are."</p>
            <p><strong>2. Step-by-step layout (1-2-3-4 flow).</strong> Universally praised across both segments. Keep in any design iteration.</p>
            <p><strong>3. Provider faces with credentials.</strong> One of the strongest trust builders. Ship with every design variant.</p>
            <p><strong>4. App preview carousel.</strong> 112 positive mentions. Shows the product experience and builds confidence in what users are buying into.</p>
            <p><strong>5. Trust signals footer</strong> (HIPAA, BBB, accreditations). Table stakes — ensure they persist in every iteration.</p>
          </div>
        </Card>

        <Card title="🔄 Iterate" accent="#F59E0B">
          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>6. Color palette: introduce warm accents into the blue design.</strong> The blue communicates professionalism but lacks warmth for experienced users. Test adding gold/amber/warm accents (section backgrounds, CTA buttons, illustrations) to the blue base. Don't abandon blue — augment it.</p>
            <p><strong>7. Progressive disclosure for content.</strong> Both designs are too long. Implement collapsible FAQ sections, "learn more" expandable blocks, and consider splitting the single-page layout into a tabbed or multi-page architecture. This directly addresses the #1 negative theme (information overload, 66 mentions).</p>
            <p><strong>8. Reframe insurance messaging.</strong> Change "No insurance needed" to something like "Start without insurance — FSA/HSA accepted" to avoid the unintended signal that insurance can't be used. This came up 13 times unprompted.</p>
            <p><strong>9. Horizontal carousels for medication comparisons.</strong> Explicitly requested by multiple participants. Reduces scroll fatigue for the medication section.</p>
          </div>
        </Card>

        <Card title="🚫 Kill" accent="#DC2626">
          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>10. AI-generated hero images.</strong> Replace with real patient/provider photos or illustrated visuals. When detected, AI photos immediately trigger distrust and a "sales pitch" perception.</p>
            <p><strong>11. Stacked vertical medication lists.</strong> Replace with horizontal carousel. Vertical stacking adds scroll fatigue in a section users actually want to engage with.</p>
          </div>
        </Card>

        <Card title="🧪 Test Next" accent="#7C3AED">
          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
            <p><strong>12. Hybrid color palette.</strong> Blue base + warm section accents. This is the highest-priority design test — it directly addresses the warmth gap while preserving the professionalism gains.</p>
            <p><strong>13. Progressive disclosure variant.</strong> Same content, shorter initial page with expandable sections. Measure impact on ADHD-friendliness and completion rates.</p>
            <p><strong>14. Segment-specific landing pages.</strong> Consider whether experienced ("continue your journey") and fresh ("get started") patients should see different hero sections — the data strongly suggests different needs.</p>
            <p><strong>15. Larger sample for fresh segment.</strong> Fresh n=16 is sufficient for qualitative insights but insufficient for confident quantitative claims. Next round should aim for n=25+ per segment.</p>
          </div>
        </Card>
      </div>
    ),
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#F8FAFC" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,700;9..144,800&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", padding: "32px 24px 20px", color: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#94A3B8", textTransform: "uppercase", marginBottom: 6 }}>MEDvidi UXR&D — Brand Perception Study 2025–26</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.2, fontFamily: "'Fraunces', serif" }}>Rebranding Impact Report</h1>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>New visuals + tone of voice vs. current design · n=49 · ADHD patients · Unmoderated concept test</p>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto", padding: "0 16px" }}>
          {sections.map(s => (
            <button
              key={s}
              onClick={() => setActive(s)}
              style={{
                padding: "12px 14px",
                fontSize: 12,
                fontWeight: active === s ? 700 : 500,
                color: active === s ? "#0F172A" : "#64748B",
                background: "none",
                border: "none",
                borderBottom: active === s ? "2px solid #3B82F6" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s ease",
              }}
            >
              {sectionLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 60px" }}>
        {content[active]}
      </div>
    </div>
  );
}
