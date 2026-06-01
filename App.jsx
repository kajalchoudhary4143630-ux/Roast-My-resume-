import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════
//  Razorpay key — filled via Vercel Environment Variable
//  You do NOT need to touch this line manually
// ══════════════════════════════════════════════════
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

// ── STATIC DATA ────────────────────────────────────
const ROAST_EXAMPLES = [
  { weak: "Responsible for managing social media accounts", roast: "🔥 'Responsible for'?? Zero numbers. Zero impact. Basically invisible to every ATS scanner on the planet.", fixed: "Grew Instagram engagement 340% in 6 months via data-driven content strategy, generating 2.1M impressions." },
  { weak: "Helped with a project that improved sales", roast: "🔥 'Helped with'?? Did you hand someone a stapler? 'Improved sales' by HOW MUCH? Vagueness is a resume killer.", fixed: "Co-led product launch driving 52% YoY revenue growth ($1.2M incremental), coordinating 4 teams across 3 time zones." },
  { weak: "Good communication and team player", roast: "🔥 Every single person claims this. My refrigerator has good communication skills. Delete immediately.", fixed: "Presented quarterly roadmap to C-suite; facilitated 12 cross-department sprints resulting in 30% faster delivery." }
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Software Engineer @ Google", avatar: "PS", text: "Got rejected 14 times before using this. After fixing my resume, I landed 3 interviews in one week!" },
  { name: "Arjun Mehta", role: "Product Manager @ Flipkart", avatar: "AM", text: "The AI humbled me in 30 seconds. Best investment I made. Got my dream job 3 weeks later." },
  { name: "Sarah Johnson", role: "Data Analyst @ Meta", avatar: "SJ", text: "The hiring manager perspective feature is gold. Shows what a recruiter actually thinks. Game changer." },
  { name: "Rohan Kapoor", role: "Fresh Graduate, IIT Delhi", avatar: "RK", text: "As a fresher I had no idea what I was doing wrong. Fixed 11 issues, got campus placement at a top firm." },
  { name: "Anika Patel", role: "Marketing Lead @ Zomato", avatar: "AP", text: "Offended at first. Then re-read it. Fixed everything. Then got the job. 10/10 would roast again." },
  { name: "James Liu", role: "UX Designer @ Adobe", avatar: "JL", text: "The ATS score feature alone is worth it. Resume was getting filtered before any human saw it. Fixed in 20 mins." }
];

const FAQS = [
  { q: "Is the roast actually brutal or just generic?", a: "It's genuinely sharp. The AI calls out weak verbs, missing metrics, ATS failures, and format issues — by name. No sugarcoating." },
  { q: "What file formats do you support?", a: "PDF, DOCX, and TXT. PDF gives the most accurate formatting analysis. Max file size is 5MB." },
  { q: "Will my resume data be stored or shared?", a: "Your resume is processed in real-time and never stored permanently. We delete all files within 24 hours." },
  { q: "How is this different from Grammarly?", a: "Grammarly checks grammar. We analyze ATS compatibility, achievement framing, keyword density, industry benchmarks, and hiring psychology — all at once." },
  { q: "Can I roast the same resume multiple times?", a: "Free plan allows 1 roast/month. Pro plan is unlimited. Re-roast after every major edit!" },
  { q: "Is payment secure?", a: "Yes! Payments are processed by Razorpay — India's most trusted payment gateway. We never store your card details." }
];

const PLANS = [
  { name: "Free Roast", price: 0, features: ["1 resume roast / month", "Basic ATS check", "5 improvement suggestions", "Overall score"], cta: "Get Started Free", highlight: false },
  { name: "Pro Roast", price: 749, features: ["Unlimited resume roasts", "Full ATS analysis", "Keyword gap optimizer", "Before/after comparison", "Industry benchmarking", "Priority processing"], cta: "Start Pro — ₹749/mo", highlight: true, badge: "MOST POPULAR" },
  { name: "Career Pro", price: 2399, features: ["Everything in Pro", "LinkedIn optimization", "Cover letter roast", "1-on-1 expert review", "Job match scoring", "Dedicated advisor"], cta: "Career Pro — ₹2399/mo", highlight: false }
];

// ── STYLES ─────────────────────────────────────────
const gradText = { background: "linear-gradient(90deg,#FF6B35,#FF2D55)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
const glass = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 };

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#080808}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#FF6B35;border-radius:3px}
  .gbtn{background:linear-gradient(135deg,#FF6B35,#FF2D55);border:none;color:white;padding:14px 32px;border-radius:50px;font-size:16px;font-weight:700;cursor:pointer;transition:all .3s;box-shadow:0 4px 24px rgba(255,107,53,.35)}
  .gbtn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(255,107,53,.55)}
  .obtn{background:transparent;border:1px solid rgba(255,107,53,.5);color:#FF6B35;padding:14px 32px;border-radius:50px;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s}
  .obtn:hover{background:rgba(255,107,53,.1)}
  .fcard{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:28px;transition:all .3s}
  .fcard:hover{background:rgba(255,107,53,.06);border-color:rgba(255,107,53,.3);transform:translateY(-4px)}
  .pcard{border-radius:20px;padding:36px;transition:transform .3s}
  .pcard:hover{transform:translateY(-6px)}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .float{animation:float 4s ease-in-out infinite}
  .fadein{animation:fadeIn .5s ease forwards}
  textarea,input{font-family:'DM Sans',sans-serif}
  a{color:#FF6B35;text-decoration:none}
  a:hover{text-decoration:underline}
`;

// ── SMALL COMPONENTS ───────────────────────────────
function Navbar({ page, setPage }) {
  const scrollTo = id => { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100); };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(8,8,8,.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)", padding: "0 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setPage("home")}>
          <span style={{ fontSize: 24 }}>🔥</span>
          <span style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 800, ...gradText }}>RoastMyResume</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[["features","Features"],["how-it-works","How It Works"],["pricing","Pricing"]].map(([id,label]) => (
            <span key={id} onClick={() => scrollTo(id)} style={{ color: "#777", fontSize: 14, fontWeight: 500, cursor: "pointer" }} onMouseOver={e=>e.target.style.color="#FF6B35"} onMouseOut={e=>e.target.style.color="#777"}>{label}</span>
          ))}
        </div>
        <button className="gbtn" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => scrollTo("upload")}>Roast Mine Free →</button>
      </div>
    </nav>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.05)", padding: "40px 5% 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }} onClick={() => { setPage("home"); window.scrollTo(0,0); }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <span style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 800, ...gradText }}>RoastMyResume</span>
            </div>
            <p style={{ color: "#444", fontSize: 13 }}>Brutal honesty. Better careers.</p>
            <p style={{ color: "#444", fontSize: 13, marginTop: 6 }}>📧 support@roastmyresume.com</p>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#666", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Company</p>
              {[["contact","Contact Us"],["privacy","Privacy Policy"],["terms","Terms & Conditions"],["refund","Refund Policy"]].map(([pg,label]) => (
                <p key={pg} style={{ marginBottom: 8 }}>
                  <span onClick={() => { setPage(pg); window.scrollTo(0,0); }} style={{ color: "#555", fontSize: 14, cursor: "pointer" }} onMouseOver={e=>e.target.style.color="#FF6B35"} onMouseOut={e=>e.target.style.color="#555"}>{label}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.04)", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: "#333", fontSize: 12 }}>© 2025 RoastMyResume. All rights reserved.</p>
          <p style={{ color: "#333", fontSize: 12 }}>Made with 🔥 for job seekers everywhere</p>
        </div>
      </div>
    </footer>
  );
}

function PolicyPage({ title, children, setPage }) {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "white" }}>
      <style>{globalStyles}</style>
      <Navbar page={title} setPage={setPage} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "110px 5% 80px" }}>
        <button onClick={() => { setPage("home"); window.scrollTo(0,0); }} style={{ background: "none", border: "none", color: "#FF6B35", cursor: "pointer", fontSize: 14, marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>← Back to Home</button>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, marginBottom: 8 }}>{title}</h1>
        <p style={{ color: "#555", fontSize: 14, marginBottom: 40 }}>Last updated: June 2025</p>
        <div style={{ lineHeight: 1.85, fontSize: 15, color: "#bbb" }}>{children}</div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, color: "white", margin: "36px 0 12px" }}>{children}</h2>;
}
function Para({ children }) {
  return <p style={{ marginBottom: 16, color: "#aaa", lineHeight: 1.85 }}>{children}</p>;
}

// ── POLICY PAGES ───────────────────────────────────
function PrivacyPage({ setPage }) {
  return (
    <PolicyPage title="Privacy Policy" setPage={setPage}>
      <Para>At RoastMyResume, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</Para>
      <SectionTitle>1. Information We Collect</SectionTitle>
      <Para>We may collect the following types of information: your name and email address when you sign up or contact us; resume content you upload or paste for analysis; payment information processed securely through Razorpay (we never store card details); and usage data such as pages visited and features used.</Para>
      <SectionTitle>2. How We Use Your Information</SectionTitle>
      <Para>We use your information to provide and improve our resume roasting service; to process payments and send receipts; to respond to your support queries; and to send occasional product updates (you can unsubscribe anytime).</Para>
      <SectionTitle>3. Resume Data</SectionTitle>
      <Para>Resume content you submit is used solely for generating AI feedback. We do not store your resume permanently — all uploaded files are deleted within 24 hours. We never sell or share your resume data with any third party.</Para>
      <SectionTitle>4. Cookies</SectionTitle>
      <Para>We use minimal cookies to keep you logged in and to understand how our service is used. You can disable cookies in your browser settings, though some features may not work correctly.</Para>
      <SectionTitle>5. Third-Party Services</SectionTitle>
      <Para>We use Razorpay for payment processing and Anthropic's Claude API for AI analysis. Each of these services has their own privacy policy governing their data practices.</Para>
      <SectionTitle>6. Data Security</SectionTitle>
      <Para>We take reasonable technical and organizational measures to protect your data. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</Para>
      <SectionTitle>7. Your Rights</SectionTitle>
      <Para>You have the right to access, correct, or delete your personal data at any time. To make a request, contact us at support@roastmyresume.com.</Para>
      <SectionTitle>8. Contact</SectionTitle>
      <Para>Questions about this policy? Email us at support@roastmyresume.com and we'll respond within 2 business days.</Para>
    </PolicyPage>
  );
}

function TermsPage({ setPage }) {
  return (
    <PolicyPage title="Terms & Conditions" setPage={setPage}>
      <Para>By using RoastMyResume, you agree to these Terms and Conditions. Please read them carefully before using our service.</Para>
      <SectionTitle>1. Acceptance of Terms</SectionTitle>
      <Para>By accessing or using RoastMyResume, you confirm that you are at least 13 years of age and agree to be bound by these terms. If you do not agree, please do not use our service.</Para>
      <SectionTitle>2. Service Description</SectionTitle>
      <Para>RoastMyResume provides AI-powered resume feedback. The feedback is generated by an AI model and is intended to be helpful and constructive. It does not constitute professional career counseling or guarantee employment outcomes.</Para>
      <SectionTitle>3. User Responsibilities</SectionTitle>
      <Para>You agree not to upload resumes belonging to others without their consent; not to use our service for any unlawful purpose; not to attempt to reverse-engineer or misuse our AI systems; and to provide accurate information when creating an account or making payments.</Para>
      <SectionTitle>4. Intellectual Property</SectionTitle>
      <Para>All content, design, and technology on RoastMyResume is owned by us or our licensors. You may not copy, reproduce, or distribute any part of our service without written permission. Your resume content remains your property at all times.</Para>
      <SectionTitle>5. Payments & Subscriptions</SectionTitle>
      <Para>Paid plans are billed monthly. You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. We reserve the right to change pricing with 30 days notice.</Para>
      <SectionTitle>6. Disclaimer of Warranties</SectionTitle>
      <Para>RoastMyResume is provided "as is" without warranties of any kind. We do not guarantee that our AI feedback will result in job interviews or employment. Results may vary.</Para>
      <SectionTitle>7. Limitation of Liability</SectionTitle>
      <Para>To the fullest extent permitted by law, RoastMyResume shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service.</Para>
      <SectionTitle>8. Changes to Terms</SectionTitle>
      <Para>We may update these terms from time to time. Continued use of the service after changes constitutes your acceptance of the new terms.</Para>
      <SectionTitle>9. Contact</SectionTitle>
      <Para>For any questions regarding these terms, contact us at support@roastmyresume.com.</Para>
    </PolicyPage>
  );
}

function RefundPage({ setPage }) {
  return (
    <PolicyPage title="Refund Policy" setPage={setPage}>
      <Para>We want you to be happy with RoastMyResume. This Refund Policy explains when and how you can request a refund.</Para>
      <SectionTitle>1. Free Plan</SectionTitle>
      <Para>The Free plan costs nothing, so no refunds are applicable. You can use it without any financial commitment.</Para>
      <SectionTitle>2. Paid Plans — 7-Day Money Back Guarantee</SectionTitle>
      <Para>If you are not satisfied with your Pro Roast or Career Pro subscription, you may request a full refund within 7 days of your first payment. This applies to first-time purchases only.</Para>
      <SectionTitle>3. How to Request a Refund</SectionTitle>
      <Para>To request a refund, email us at support@roastmyresume.com with the subject line "Refund Request" and include your registered email address and payment ID (available in your Razorpay receipt). We will process your refund within 5–7 business days.</Para>
      <SectionTitle>4. Non-Refundable Situations</SectionTitle>
      <Para>Refunds will not be issued in the following cases: requests made after 7 days of purchase; accounts found to be in violation of our Terms & Conditions; renewals (only the first payment is eligible); and cases where the service has been used extensively.</Para>
      <SectionTitle>5. Subscription Cancellations</SectionTitle>
      <Para>You can cancel your subscription at any time. Cancelling stops future charges but does not automatically trigger a refund for the current billing period unless you are within the 7-day window.</Para>
      <SectionTitle>6. Processing Time</SectionTitle>
      <Para>Approved refunds are processed within 5–7 business days. The amount will be credited back to your original payment method via Razorpay.</Para>
      <SectionTitle>7. Contact</SectionTitle>
      <Para>Refund questions? Email support@roastmyresume.com — we're here to help and respond within 1 business day.</Para>
    </PolicyPage>
  );
}

function ContactPage({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const inp = { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "13px 16px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif" };
  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "white" }}>
      <style>{globalStyles}</style>
      <Navbar page="contact" setPage={setPage} />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "110px 5% 80px" }}>
        <button onClick={() => { setPage("home"); window.scrollTo(0,0); }} style={{ background: "none", border: "none", color: "#FF6B35", cursor: "pointer", fontSize: 14, marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>← Back to Home</button>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, marginBottom: 8 }}>Contact <span style={gradText}>Us</span></h1>
        <p style={{ color: "#777", fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>Have a question, feedback, or need help? We'd love to hear from you. We usually respond within 1 business day.</p>

        {/* Contact info card */}
        <div style={{ ...glass, padding: 24, marginBottom: 36, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF2D55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📧</div>
          <div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Email us directly at</p>
            <a href="mailto:support@roastmyresume.com" style={{ color: "#FF6B35", fontSize: 16, fontWeight: 700 }}>support@roastmyresume.com</a>
          </div>
        </div>

        {/* Contact form */}
        {!sent ? (
          <div style={{ ...glass, padding: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Send us a message</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Your Name</label>
                <input style={inp} placeholder="Priya Sharma" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Email Address</label>
                <input style={inp} placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Subject</label>
              <input style={inp} placeholder="I need help with..." value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Message</label>
              <textarea style={{ ...inp, minHeight: 140, resize: "vertical" }} placeholder="Write your message here..." value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} />
            </div>
            <button className="gbtn" style={{ width: "100%", fontSize: 16 }} onClick={() => { if (form.name && form.email && form.message) setSent(true); }}>Send Message →</button>
          </div>
        ) : (
          <div style={{ ...glass, padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Message Sent!</h3>
            <p style={{ color: "#888", lineHeight: 1.7 }}>Thanks for reaching out. We'll get back to you at <strong style={{ color: "#FF6B35" }}>{form.email}</strong> within 1 business day.</p>
          </div>
        )}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ── RAZORPAY ───────────────────────────────────────
function openRazorpay(plan, onSuccess) {
  const load = () => new Promise(res => {
    if (window.Razorpay) { res(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res(true); s.onerror = () => res(false);
    document.body.appendChild(s);
  });
  load().then(loaded => {
    if (!loaded) { alert("Payment gateway failed to load. Check your internet."); return; }
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: "INR",
      name: "RoastMyResume",
      description: plan.name,
      handler: res => onSuccess(res),
      theme: { color: "#FF6B35" }
    });
    rzp.on("payment.failed", r => alert("Payment failed: " + r.error.description));
    rzp.open();
  });
}

function SuccessModal({ plan, paymentId, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0f0f0f", border: "1px solid rgba(74,222,128,.25)", borderRadius: 20, padding: 40, width: "100%", maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Payment Successful!</h3>
        <p style={{ color: "#888", marginBottom: 20, lineHeight: 1.7 }}>Welcome to <strong style={{ color: "#FF6B35" }}>{plan.name}</strong>! Your account has been upgraded.</p>
        <div style={{ background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <p style={{ color: "#4ade80", fontSize: 13 }}>✓ Features activated &nbsp; ✓ Receipt sent to email</p>
        </div>
        {paymentId && <p style={{ color: "#444", fontSize: 11, marginBottom: 20 }}>Payment ID: {paymentId}</p>}
        <button className="gbtn" style={{ width: "100%" }} onClick={onClose}>Start Roasting →</button>
      </div>
    </div>
  );
}

// ── AI ROAST ───────────────────────────────────────
async function callClaudeRoast(resumeText) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 1000,
      system: `You are a brutally honest but constructive resume coach. Respond ONLY with valid JSON, no markdown:
{"overallScore":<0-100>,"atsScore":<0-100>,"readabilityScore":<0-100>,"impactScore":<0-100>,"roasts":[{"icon":"🔥","comment":"..."},{"icon":"📉","comment":"..."},{"icon":"😴","comment":"..."},{"icon":"🚨","comment":"..."},{"icon":"💡","comment":"..."}],"suggestions":["...","...","...","...","..."],"verdict":"<one punchy sentence>"}`,
      messages: [{ role: "user", content: `Roast this resume:\n\n${resumeText.slice(0, 3000)}` }]
    })
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── CIRCULAR PROGRESS ──────────────────────────────
function CircularProgress({ value, label, color }) {
  const r = 36, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#1a1a1a" strokeWidth="8" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 45 45)" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
        <text x="45" y="50" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{value}</text>
      </svg>
      <span style={{ color: "#888", fontSize: 12 }}>{label}</span>
    </div>
  );
}

function CountdownTimer() {
  const [t, setT] = useState({ h: 11, m: 59, s: 0 });
  useEffect(() => { const id = setInterval(() => setT(p => { let {h,m,s}=p; s--; if(s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=23;m=59;s=59;} return{h,m,s}; }), 1000); return ()=>clearInterval(id); }, []);
  const pad = n => String(n).padStart(2,"0");
  return <span style={{ fontFamily:"monospace",fontSize:22,color:"#FF6B35",fontWeight:800,letterSpacing:3 }}>{pad(t.h)}:{pad(t.m)}:{pad(t.s)}</span>;
}

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%",textAlign:"left",background:"none",border:"none",color:"white",padding:"20px 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:16,fontWeight:500 }}>
        {q}<span style={{ color:"#FF6B35",fontSize:24,display:"inline-block",transform:open?"rotate(45deg)":"rotate(0)",transition:"transform 0.3s",flexShrink:0,marginLeft:16 }}>+</span>
      </button>
      {open && <p style={{ color:"#888",paddingBottom:20,lineHeight:1.75,fontSize:15 }}>{a}</p>}
    </div>
  );
}

// ── HOME PAGE ──────────────────────────────────────
function HomePage({ setPage }) {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadState, setUploadState] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [roastData, setRoastData] = useState(null);
  const [aiError, setAiError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [manualText, setManualText] = useState("");
  const [useManual, setUseManual] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const fileRef = useRef();

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const runRoast = async (text) => {
    setUploadState("loading"); setProgress(0); setAiError(""); setRoastData(null);
    let p = 0;
    const tick = setInterval(() => { p += Math.random()*8; if(p>=90){p=90;clearInterval(tick);} setProgress(Math.round(p)); }, 200);
    try {
      const result = await callClaudeRoast(text);
      clearInterval(tick); setProgress(100);
      setTimeout(() => { setRoastData(result); setUploadState("done"); }, 400);
    } catch { clearInterval(tick); setAiError("AI connection failed. Please try again."); setUploadState("error"); }
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type === "text/plain") { const t = await file.text(); runRoast(t); }
    else runRoast(`Resume: ${file.name}. Please provide a realistic demo roast for a typical professional resume with objective, experience, education, skills sections.`);
  };

  const verdictColor = s => s >= 70 ? "#4ade80" : s >= 50 ? "#f59e0b" : "#FF2D55";

  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ paddingTop: 130, textAlign: "center", padding: "130px 5% 70px", maxWidth: 920, margin: "0 auto" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,107,53,.1)",border:"1px solid rgba(255,107,53,.3)",borderRadius:50,padding:"8px 18px",marginBottom:32 }}>
          <span>⚡</span><span style={{ fontSize:13,color:"#FF6B35",fontWeight:600 }}>50,000+ Resumes Roasted by Real AI</span>
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif",fontSize:"clamp(34px,6vw,68px)",fontWeight:800,lineHeight:1.1,marginBottom:24 }}>
          Your Resume Might Be the{" "}<span style={gradText}>Reason You're Not Getting Interviews.</span>
        </h1>
        <p style={{ fontSize:"clamp(16px,2vw,19px)",color:"#777",marginBottom:40,lineHeight:1.75,maxWidth:560,margin:"0 auto 40px" }}>Paste or upload your resume. Our AI gives you brutally honest feedback in seconds. No fluff. Just the truth.</p>
        <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:56 }}>
          <button className="gbtn" style={{ fontSize:17,padding:"16px 40px" }} onClick={() => scrollTo("upload")}>🔥 Roast My Resume</button>
          <button className="obtn" onClick={() => scrollTo("sample")}>See Sample ▶</button>
        </div>
        <div className="float" style={{ display:"inline-block",...glass,padding:26,textAlign:"left",maxWidth:360,width:"100%" }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}>
            <span style={{ color:"#666",fontSize:13 }}>resume_final_v3.pdf</span>
            <span style={{ background:"rgba(255,45,85,.15)",color:"#FF2D55",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700 }}>47/100 😬</span>
          </div>
          {["Objective","Experience","Skills","Achievements"].map((s,i)=>(
            <div key={s} style={{ marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ fontSize:12,color:"#bbb" }}>{s}</span>
                <span style={{ fontSize:12,color:["#FF2D55","#FF2D55","#f59e0b","#4ade80"][i] }}>{[32,48,61,78][i]}%</span>
              </div>
              <div style={{ height:4,background:"#181818",borderRadius:2 }}>
                <div style={{ height:"100%",width:`${[32,48,61,78][i]}%`,borderRadius:2,background:["#FF2D55","#FF2D55","#f59e0b","#4ade80"][i] }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:"rgba(255,107,53,.04)",borderTop:"1px solid rgba(255,107,53,.1)",borderBottom:"1px solid rgba(255,107,53,.1)",padding:"28px 5%" }}>
        <div style={{ maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:20,textAlign:"center" }}>
          {[["50K+","Resumes Roasted"],["89%","Interview Rate Up"],["4.9★","Avg Rating"],["2M+","Suggestions Given"]].map(([n,l])=>(
            <div key={l}><div style={{ fontFamily:"Syne",fontSize:32,fontWeight:800,...gradText }}>{n}</div><div style={{ color:"#666",fontSize:13,marginTop:4 }}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:"80px 5%",maxWidth:1200,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <h2 style={{ fontFamily:"Syne",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,marginBottom:12 }}>Everything Wrong With Your Resume,{" "}<span style={gradText}>Exposed.</span></h2>
          <p style={{ color:"#777",fontSize:17 }}>Six-point analysis covering every angle recruiters and ATS will judge you on.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18 }}>
          {[["🎯","ATS Score","Find out if your resume survives the robot screener before a human sees it."],["✍️","Grammar & Clarity","Flag passive voice, filler words, and weak sentence structure."],["🚀","Achievement Optimizer","Transform bland duties into quantified wins."],["🔑","Keyword Gaps","Find missing high-value keywords vs real job descriptions."],["🏭","Industry Benchmark","See how you stack up against others in your role."],["👔","Hiring Manager POV","What a recruiter thinks in those 7 seconds."]].map(([icon,title,desc])=>(
            <div key={title} className="fcard"><div style={{fontSize:28,marginBottom:12}}>{icon}</div><h3 style={{fontSize:16,fontWeight:700,marginBottom:8}}>{title}</h3><p style={{color:"#666",lineHeight:1.65,fontSize:14}}>{desc}</p></div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding:"80px 5%",background:"rgba(255,255,255,.01)" }}>
        <div style={{ maxWidth:900,margin:"0 auto",textAlign:"center" }}>
          <h2 style={{ fontFamily:"Syne",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,marginBottom:12 }}>From Upload to{" "}<span style={gradText}>Hired in 3 Steps</span></h2>
          <p style={{ color:"#777",fontSize:17,marginBottom:48 }}>Under 2 minutes start to finish.</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:24 }}>
            {[["📤","Paste or Upload","Drop your PDF, DOCX, or paste resume text directly."],["🔥","AI Roasts It","Claude AI analyzes 47 data points and generates your personalized roast."],["📈","Improve & Get Hired","Follow the fixes, re-roast, and walk into interviews with confidence."]].map(([icon,title,desc],i)=>(
              <div key={title} style={{...glass,padding:30,textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#FF2D55)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:18,fontWeight:900,color:"white"}}>{i+1}</div>
                <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
                <h3 style={{fontSize:17,fontWeight:700,marginBottom:8}}>{title}</h3>
                <p style={{color:"#666",lineHeight:1.65,fontSize:14}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE */}
      <section id="sample" style={{ padding:"80px 5%",maxWidth:1000,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:40 }}>
          <h2 style={{ fontFamily:"Syne",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,marginBottom:12 }}>See a Real{" "}<span style={gradText}>Roast in Action</span></h2>
        </div>
        <div style={{ display:"flex",gap:10,justifyContent:"center",marginBottom:24,flexWrap:"wrap" }}>
          {ROAST_EXAMPLES.map((_,i)=>(
            <button key={i} onClick={()=>setActiveTab(i)} style={{padding:"10px 22px",borderRadius:50,border:"none",cursor:"pointer",fontWeight:600,fontSize:14,background:activeTab===i?"linear-gradient(135deg,#FF6B35,#FF2D55)":"rgba(255,255,255,.05)",color:activeTab===i?"white":"#777"}}>Example {i+1}</button>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14 }}>
          {[{label:"😐 Original",content:ROAST_EXAMPLES[activeTab].weak,bg:"rgba(255,255,255,.02)",border:"rgba(255,255,255,.07)",color:"#bbb"},{label:"🔥 AI Roast",content:ROAST_EXAMPLES[activeTab].roast,bg:"rgba(255,45,85,.06)",border:"rgba(255,45,85,.2)",color:"#ff8fa3"},{label:"✅ Fixed",content:ROAST_EXAMPLES[activeTab].fixed,bg:"rgba(74,222,128,.04)",border:"rgba(74,222,128,.2)",color:"#86efac"}].map(({label,content,bg,border,color})=>(
            <div key={label} style={{background:bg,border:`1px solid ${border}`,borderRadius:14,padding:20}}>
              <div style={{fontSize:11,fontWeight:700,marginBottom:10,color:"#555",textTransform:"uppercase",letterSpacing:1}}>{label}</div>
              <p style={{color,lineHeight:1.72,fontSize:14}}>{content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD */}
      <section id="upload" style={{ padding:"80px 5%",background:"rgba(255,107,53,.02)",borderTop:"1px solid rgba(255,107,53,.07)" }}>
        <div style={{ maxWidth:720,margin:"0 auto",textAlign:"center" }}>
          <h2 style={{ fontFamily:"Syne",fontSize:"clamp(26px,4vw,42px)",fontWeight:800,marginBottom:12 }}>Get Your Real{" "}<span style={gradText}>AI Roast Now</span></h2>
          <p style={{ color:"#777",fontSize:16,marginBottom:32 }}>Powered by Claude AI — unique feedback for every resume.</p>
          {(uploadState==="idle"||uploadState==="error") && (
            <div>
              <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
                {["Upload File","Paste Text"].map((label,i)=>(
                  <button key={label} onClick={()=>setUseManual(i===1)} style={{padding:"9px 22px",borderRadius:50,border:"none",cursor:"pointer",fontWeight:600,fontSize:14,background:(useManual?i===1:i===0)?"linear-gradient(135deg,#FF6B35,#FF2D55)":"rgba(255,255,255,.05)",color:(useManual?i===1:i===0)?"white":"#777"}}>{label}</button>
                ))}
              </div>
              {!useManual ? (
                <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}} onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${dragging?"#FF6B35":"rgba(255,255,255,.1)"}`,borderRadius:20,padding:"50px 24px",cursor:"pointer",background:dragging?"rgba(255,107,53,.04)":"transparent",marginBottom:18}}>
                  <div style={{fontSize:40,marginBottom:12}}>📄</div>
                  <p style={{fontSize:16,fontWeight:600,marginBottom:6}}>Drag & drop your resume here</p>
                  <p style={{color:"#555",fontSize:13}}>PDF, DOCX, TXT supported</p>
                  <input ref={fileRef} type="file" style={{display:"none"}} accept=".pdf,.docx,.txt" onChange={e=>handleFile(e.target.files[0])} />
                </div>
              ) : (
                <textarea value={manualText} onChange={e=>setManualText(e.target.value)} placeholder="Paste your resume text here..." style={{width:"100%",minHeight:190,background:"#0f0f0f",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:18,color:"white",fontSize:14,lineHeight:1.65,resize:"vertical",marginBottom:16,outline:"none"}} />
              )}
              {aiError && <p style={{color:"#FF2D55",marginBottom:14,fontSize:14}}>⚠️ {aiError}</p>}
              {useManual && <button className="gbtn" style={{fontSize:16,padding:"14px 44px"}} onClick={()=>{if(manualText.trim().length<50){setAiError("Please paste more resume text.");return;}runRoast(manualText)}}>🔥 Roast It!</button>}
            </div>
          )}
          {uploadState==="loading" && (
            <div style={{...glass,padding:32}} className="fadein">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:15,fontWeight:600}}>🔥 Claude AI is roasting your resume...</span>
                <span style={{color:"#FF6B35",fontWeight:700}}>{progress}%</span>
              </div>
              <div style={{height:8,background:"#1a1a1a",borderRadius:4,marginBottom:12}}>
                <div style={{height:"100%",width:`${progress}%`,borderRadius:4,background:"linear-gradient(90deg,#FF6B35,#FF2D55)",transition:"width .25s"}} />
              </div>
              <p style={{color:"#555",fontSize:13}}>{progress<30?"Parsing structure...":progress<60?"Analyzing ATS compatibility...":progress<80?"Running achievement audit...":"Generating your roast..."}</p>
            </div>
          )}
          {uploadState==="done" && roastData && (
            <div className="fadein" style={{...glass,padding:28,textAlign:"left"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:10}}>
                <h3 style={{fontFamily:"Syne",fontSize:20,fontWeight:800}}>🔥 Your AI Roast Report</h3>
                <span style={{background:`rgba(${roastData.overallScore>=70?"74,222,128":roastData.overallScore>=50?"245,158,11":"255,45,85"},.15)`,color:verdictColor(roastData.overallScore),padding:"5px 14px",borderRadius:20,fontWeight:700,fontSize:13}}>
                  {roastData.overallScore>=70?"Pretty Good":roastData.overallScore>=50?"Needs Work":"Major Issues"}
                </span>
              </div>
              {roastData.verdict && <p style={{color:"#FF6B35",fontStyle:"italic",marginBottom:22,fontSize:14,lineHeight:1.6}}>"{roastData.verdict}"</p>}
              <div style={{display:"flex",justifyContent:"space-around",marginBottom:26,flexWrap:"wrap",gap:12}}>
                <CircularProgress value={roastData.overallScore} label="Overall" color={verdictColor(roastData.overallScore)} />
                <CircularProgress value={roastData.atsScore} label="ATS" color="#f59e0b" />
                <CircularProgress value={roastData.readabilityScore} label="Clarity" color="#60a5fa" />
                <CircularProgress value={roastData.impactScore} label="Impact" color="#c084fc" />
              </div>
              <h4 style={{fontSize:14,fontWeight:700,marginBottom:12,color:"#FF6B35"}}>🔥 The Roast</h4>
              {roastData.roasts?.map((r,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:10,padding:"12px 14px",background:"rgba(255,45,85,.05)",borderRadius:10,border:"1px solid rgba(255,45,85,.1)"}}>
                  <span style={{fontSize:16,flexShrink:0}}>{r.icon}</span>
                  <p style={{color:"#ccc",fontSize:13,lineHeight:1.65}}>{r.comment}</p>
                </div>
              ))}
              <h4 style={{fontSize:14,fontWeight:700,margin:"18px 0 12px",color:"#4ade80"}}>✅ Top Fixes</h4>
              {roastData.suggestions?.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"11px 14px",background:"rgba(74,222,128,.04)",borderRadius:10,border:"1px solid rgba(74,222,128,.1)"}}>
                  <span style={{color:"#4ade80",fontWeight:800,flexShrink:0}}>{i+1}.</span>
                  <p style={{color:"#bbb",fontSize:13,lineHeight:1.65}}>{s}</p>
                </div>
              ))}
              <div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap"}}>
                <button className="gbtn" onClick={()=>{setUploadState("idle");setRoastData(null);setManualText("");}}>🔄 Roast Again</button>
                <button className="obtn" onClick={()=>scrollTo("pricing")}>Unlock Unlimited →</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:"80px 5%",maxWidth:1100,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <h2 style={{ fontFamily:"Syne",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,marginBottom:12 }}>Simple,{" "}<span style={gradText}>Honest Pricing</span></h2>
          <p style={{ color:"#777",fontSize:17 }}>One great resume can change your entire career.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:20 }}>
          {PLANS.map(plan=>(
            <div key={plan.name} className="pcard" style={{background:plan.highlight?"linear-gradient(135deg,rgba(255,107,53,.13),rgba(255,45,85,.08))":"rgba(255,255,255,.03)",border:plan.highlight?"1px solid rgba(255,107,53,.4)":"1px solid rgba(255,255,255,.07)",position:"relative"}}>
              {plan.badge && <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#FF6B35,#FF2D55)",color:"white",padding:"4px 16px",borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:1,whiteSpace:"nowrap"}}>{plan.badge}</div>}
              <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>{plan.name}</h3>
              <div style={{marginBottom:20}}><span style={{fontFamily:"Syne",fontSize:42,fontWeight:800,...gradText}}>₹{plan.price}</span><span style={{color:"#555",fontSize:14}}>{plan.price>0?"/month":" forever"}</span></div>
              <ul style={{listStyle:"none",marginBottom:24}}>
                {plan.features.map(f=><li key={f} style={{color:"#aaa",fontSize:13,marginBottom:9,display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:"#4ade80",flexShrink:0}}>✓</span>{f}</li>)}
              </ul>
              <button className={plan.highlight?"gbtn":"obtn"} style={{width:"100%",fontSize:14,padding:"13px 0"}} onClick={()=>plan.price>0?openRazorpay(plan,res=>setSuccessData({plan,paymentId:res.razorpay_payment_id})):scrollTo("upload")}>{plan.cta}</button>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center",color:"#444",fontSize:12,marginTop:20}}>🔒 Payments secured by Razorpay • Cancel anytime • No hidden fees</p>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"72px 5%",background:"rgba(255,255,255,.01)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <h2 style={{ fontFamily:"Syne",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,textAlign:"center",marginBottom:44 }}>They Got{" "}<span style={gradText}>Roasted. Then Hired.</span></h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16 }}>
            {TESTIMONIALS.map(t=>(
              <div key={t.name} style={{...glass,padding:20}}>
                <div style={{color:"#FF6B35",marginBottom:8,fontSize:14}}>★★★★★</div>
                <p style={{color:"#bbb",lineHeight:1.72,fontSize:14,marginBottom:16}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#FF2D55)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{t.avatar}</div>
                  <div><div style={{fontWeight:700,fontSize:13}}>{t.name}</div><div style={{color:"#555",fontSize:12}}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"72px 5%",maxWidth:720,margin:"0 auto" }}>
        <h2 style={{ fontFamily:"Syne",fontSize:"clamp(26px,4vw,44px)",fontWeight:800,textAlign:"center",marginBottom:44 }}>Common{" "}<span style={gradText}>Questions</span></h2>
        {FAQS.map(f=><AccordionItem key={f.q} q={f.q} a={f.a} />)}
      </section>

      {/* URGENCY */}
      <section style={{ margin:"0 5% 72px",background:"linear-gradient(135deg,rgba(255,107,53,.12),rgba(255,45,85,.08))",border:"1px solid rgba(255,107,53,.2)",borderRadius:20,padding:"32px 36px",textAlign:"center" }}>
        <div style={{fontSize:20,marginBottom:10}}>🔥</div>
        <h3 style={{ fontFamily:"Syne",fontSize:"clamp(18px,3vw,28px)",fontWeight:800,marginBottom:10 }}>First Roast is{" "}<span style={gradText}>100% Free</span></h3>
        <p style={{ color:"#777",marginBottom:14 }}>No credit card. No signup. Offer expires in:</p>
        <CountdownTimer />
        <div style={{marginTop:20}}><button className="gbtn" style={{fontSize:16,padding:"14px 40px"}} onClick={()=>scrollTo("upload")}>Roast My Resume →</button></div>
      </section>

      {successData && <SuccessModal plan={successData.plan} paymentId={successData.paymentId} onClose={()=>setSuccessData(null)} />}
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch(page) {
      case "privacy": return <PrivacyPage setPage={setPage} />;
      case "terms":   return <TermsPage setPage={setPage} />;
      case "refund":  return <RefundPage setPage={setPage} />;
      case "contact": return <ContactPage setPage={setPage} />;
      default:
        return (
          <div style={{ background:"#080808",minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"white",overflowX:"hidden" }}>
            <style>{globalStyles}</style>
            <Navbar page="home" setPage={setPage} />
            <HomePage setPage={setPage} />
            <Footer setPage={setPage} />
          </div>
        );
    }
  };

  return renderPage();
}
