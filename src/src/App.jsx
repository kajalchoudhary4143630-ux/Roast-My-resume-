import { useState, useEffect, useRef } from "react";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const ROAST_EXAMPLES = [
  { weak: "Responsible for managing social media accounts", roast: "🔥 'Responsible for'?? Zero numbers. Zero impact. Basically invisible to every ATS scanner on the planet.", fixed: "Grew Instagram engagement 340% in 6 months via data-driven content strategy, generating 2.1M impressions." },
  { weak: "Helped with a project that improved sales", roast: "🔥 'Helped with'?? Did you hand someone a stapler? 'Improved sales' by HOW MUCH? Vagueness is a resume killer.", fixed: "Co-led product launch driving 52% YoY revenue growth ($1.2M incremental), coordinating 4 teams across 3 time zones." },
  { weak: "Good communication and team player", roast: "🔥 Every single person claims this. My refrigerator has good communication skills. Delete immediately.", fixed: "Presented quarterly roadmap to C-suite; facilitated 12 cross-department sprints resulting in 30% faster delivery." }
];
