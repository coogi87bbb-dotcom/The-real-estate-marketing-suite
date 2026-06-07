import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  ArrowUpRight, 
  Loader2, 
  Award,
  DollarSign,
  Megaphone,
  Briefcase,
  Layers,
  Send,
  Home,
  Calendar,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Shield,
  Clock,
  UserCheck
} from "lucide-react";

interface EmailItem {
  num: number;
  subject: string;
  body: string;
}

interface MilestoneItem {
  label: string;
  date: Date;
  note: string;
  dotClass: "dr" | "da" | "dg";
  daysText: string;
}

export default function DealCloserAI() {
  // Navigation tabs for the 7 tools
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string>("");

  // Helper to trigger toast copies
  const triggerCopyToast = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(`${label} copied!`);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // Safe HTML string Escaper
  const escapeText = (str: string) => {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  // Robust Section Extractor from Raw LLM texts
  const extractSectionContent = (text: string, label: string): string => {
    if (!text) return "";
    const escapedLabel = label.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    
    // Try [LABEL] format
    const re1 = new RegExp("\\[" + escapedLabel + "\\][ \\t]*:?[ \\t]*\\n?([\\s\\S]*?)(?=\\n\\s*\\[[A-Z]|$)", "i");
    let m = text.match(re1);
    if (m && m[1].trim()) return m[1].trim();
    
    // Try plain LABEL: format
    const re2 = new RegExp("(?:^|\\n)[ \\t]*" + escapedLabel + "[ \\t]*:[ \\t]*\\n?([\\s\\S]*?)(?=\\n[A-Z][A-Z][A-Z ]+:|\\n\\[|$)", "i");
    m = text.match(re2);
    if (m && m[1].trim()) return m[1].trim();
    
    return "";
  };

  // Common caller to the server proxy
  const callAIProxy = async (systemPrompt: string, userPrompt: string, maxTokens = 1800): Promise<string> => {
    try {
      const response = await fetch("/api/closer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userPrompt, maxTokens })
      });
      if (response.ok) {
        const data = await response.json();
        return data.content || "";
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }
    } catch (e: any) {
      console.error("[AI Call Error]: ", e);
      throw new Error(e.message || "Network error. Please try again.");
    }
  };

  /* ═══════════════════════════════════════════════════════
     TOOL 1 — COMMISSION CALCULATOR (real-time state)
  ═══════════════════════════════════════════════════════ */
  const [salePrice, setSalePrice] = useState<number>(485000);
  const [commRate, setCommRate] = useState<number>(6);
  const [listSplit, setListSplit] = useState<number>(50);
  const [buySplit, setBuySplit] = useState<number>(50);
  const [agentSplit, setAgentSplit] = useState<number>(80);
  const [fees, setFees] = useState<number>(350);

  const [grossComm, setGrossComm] = useState<number>(29100);
  const [yourSideGross, setYourSideGross] = useState<number>(14550);
  const [afterBroker, setAfterBroker] = useState<number>(11640);
  const [netTakeHome, setNetTakeHome] = useState<number>(11290);

  useEffect(() => {
    const gross = (salePrice * commRate) / 100;
    const sideGross = (gross * listSplit) / 100;
    const bkrShare = (sideGross * agentSplit) / 100;
    const takeHome = bkrShare - fees;

    setGrossComm(gross);
    setYourSideGross(sideGross);
    setAfterBroker(bkrShare);
    setNetTakeHome(takeHome);
  }, [salePrice, commRate, listSplit, agentSplit, fees]);

  const fmtCurrency = (v: number) => {
    return "$" + Math.max(0, Math.round(v)).toLocaleString("en-US");
  };

  /* ═══════════════════════════════════════════════════════
     TOOL 2 — AI MARKETING ENGINE
  ═══════════════════════════════════════════════════════ */
  const [mktSpecs, setMktSpecs] = useState<string>("4BR/3BA, 2,200 sqft, renovated kitchen, pool, corner lot, new roof 2023, 3-car garage...");
  const [mktNeighborhood, setMktNeighborhood] = useState<string>("Buckhead Atlanta, first-time buyers, luxury investors...");
  const [mktPrice, setMktPrice] = useState<string>("$525,000");

  const [mktLoading, setMktLoading] = useState<boolean>(false);
  const [mktError, setMktError] = useState<string>("");
  const [mktResults, setMktResults] = useState<{
    seo: string;
    positioning: string;
    roi: string;
    script: string;
  } | null>(null);

  const runMarketing = async () => {
    if (!mktSpecs.trim()) {
      alert("Please enter the property specs first.");
      return;
    }
    setMktLoading(true);
    setMktError("");
    setMktResults(null);

    const system = "You are a real estate marketing specialist with 40 years of experience and over $2 billion in sales. You have mastered SEO, social media, luxury positioning, and buyer psychology. Respond in plain text only. Do not use markdown, asterisks, pound signs, or bullet hyphens.";

    const prompt = `Property: ${mktSpecs}
Neighborhood/Target Market: ${mktNeighborhood || "not specified"}
Listing Price: ${mktPrice || "not specified"}

Generate exactly 4 sections. Use these EXACT section labels on their own line:

[SEO STRATEGY]
Write 5 high-converting SEO keywords for this property, then write a 90-word SEO meta description optimized for Zillow, Realtor.com, and Google.

[MARKET POSITIONING PITCH]
Write a 100-word market positioning pitch for listing presentations. Why does this home beat its competition right now?

[BUYER PROFIT ROI ANGLE]
Write a 100-word buyer-facing ROI pitch. Include equity potential, rental comp value, and appreciation angle.

[TIKTOK REEL SCRIPT]
Write a complete 30-second TikTok/Instagram Reel script with a strong hook, compelling middle, and call to action. Include relevant emojis. Make it viral-worthy.`;

    try {
      const raw = await callAIProxy(system, prompt, 1800);
      const seo = extractSectionContent(raw, "SEO STRATEGY") || raw;
      const positioning = extractSectionContent(raw, "MARKET POSITIONING PITCH");
      const roi = extractSectionContent(raw, "BUYER PROFIT ROI ANGLE");
      const script = extractSectionContent(raw, "TIKTOK REEL SCRIPT");

      setMktResults({ seo, positioning, roi, script });
    } catch (e: any) {
      setMktError(e.message);
    } finally {
      setMktLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     TOOL 3 — OFFER & COUNTER-OFFER GENERATOR
  ═══════════════════════════════════════════════════════ */
  const [offerSide, setOfferSide] = useState<string>("buyer");
  const [offerAsk, setOfferAsk] = useState<string>("499000");
  const [offerPrice, setOfferPrice] = useState<string>("472000");
  const [offerAddr, setOfferAddr] = useState<string>("142 Maple St — 3BR/2BA ranch, 90 days on market");
  const [offerDOM, setOfferDOM] = useState<string>("47");
  const [contInspect, setContInspect] = useState<boolean>(true);
  const [contFinance, setContFinance] = useState<boolean>(true);
  const [contAppraisal, setContAppraisal] = useState<boolean>(true);
  const [offerMotivation, setOfferMotivation] = useState<string>("medium");
  const [offerClose, setOfferClose] = useState<string>("30 days, flexible");
  const [offerTerms, setOfferTerms] = useState<string>("seller pays closing costs, include appliances, as-is");

  const [offerLoading, setOfferLoading] = useState<boolean>(false);
  const [offerError, setOfferError] = useState<string>("");
  const [offerResults, setOfferResults] = useState<{
    strategy: string;
    language: string;
    objections: string;
    walkAway: string;
  } | null>(null);

  const runOffer = async () => {
    if (!offerAsk.trim() || !offerPrice.trim()) {
      alert("Please enter both the asking price and the offer/counter price.");
      return;
    }
    setOfferLoading(true);
    setOfferError("");
    setOfferResults(null);

    const ask = parseFloat(offerAsk) || 0;
    const ofr = parseFloat(offerPrice) || 0;
    const diffPct = ask > 0 ? Math.abs(((ask - ofr) / ask) * 100).toFixed(1) : "0";
    const diffDir = ofr < ask ? "below asking" : (ofr > ask ? "above asking" : "at asking");

    const contingencies: string[] = [];
    if (contInspect) contingencies.push("Inspection");
    if (contFinance) contingencies.push("Financing");
    if (contAppraisal) contingencies.push("Appraisal");
    const contStr = contingencies.length ? contingencies.join(", ") : "No contingencies";

    const system = "You are a master real estate negotiator with 40 years of experience and over 3,000 closed transactions. You know every psychological and tactical lever in a real estate deal. You have coached hundreds of agents on negotiation. Respond in plain text only. No markdown, no asterisks, no pound signs.";

    const prompt = `I am representing the ${offerSide}.
Property: ${offerAddr || "subject property"}
List Price: $${ask.toLocaleString()}
Offer/Counter Price: $${ofr.toLocaleString()} (${diffPct}% ${diffDir})
Days on Market: ${offerDOM || "unknown"}
Contingencies: ${contStr}
Seller Motivation: ${offerMotivation}
Requested Closing: ${offerClose || "standard timeline"}
Special Terms: ${offerTerms || "none"}

Generate exactly 4 sections with these EXACT labels on their own lines:

[NEGOTIATION STRATEGY]
Write a 150-word expert negotiation playbook. What leverage do I have? What are the key risks? What is my opening move and fallback position? Be brutally specific.

[OFFER LANGUAGE]
Write the actual professional offer language to drop into a contract or email. Formal, specific, and airtight. Reference all contingencies and special terms listed above.

[OBJECTION RESPONSES]
Write 3 likely objections the other side will raise, each followed by my exact scripted response. Sharp, confident, and professional.

[WALK AWAY POINT]
Tell me exactly where my client's walk-away point should be and why, given all the facts above. Be specific with numbers.`;

    try {
      const raw = await callAIProxy(system, prompt, 2000);
      const strategy = extractSectionContent(raw, "NEGOTIATION STRATEGY") || raw;
      const language = extractSectionContent(raw, "OFFER LANGUAGE");
      const objections = extractSectionContent(raw, "OBJECTION RESPONSES");
      const walkAway = extractSectionContent(raw, "WALK AWAY POINT");

      setOfferResults({ strategy, language, objections, walkAway });
    } catch (e: any) {
      setOfferError(e.message);
    } finally {
      setOfferLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     TOOL 4 — FOLLOW-UP EMAIL SEQUENCE
  ═══════════════════════════════════════════════════════ */
  const [fuLeadType, setFuLeadType] = useState<string>("first_time_buyer");
  const [fuName, setFuName] = useState<string>("Marcus & Tanya");
  const [fuSituation, setFuSituation] = useState<string>("Pre-approved for $420K, looking in Midtown, saw 3 homes last week, price is main concern, lease ends in 4 months...");
  const [fuAgent, setFuAgent] = useState<string>("Keisha Williams, KW Metro");
  const [fuTone, setFuTone] = useState<string>("warm professional");

  const [fuLoading, setFuLoading] = useState<boolean>(false);
  const [fuError, setFuError] = useState<string>("");
  const [fuEmails, setFuEmails] = useState<EmailItem[]>([]);
  const [activeEmailIdx, setActiveEmailIdx] = useState<number>(0);

  const runFollowUp = async () => {
    setFuLoading(true);
    setFuError("");
    setFuEmails([]);
    setActiveEmailIdx(0);

    const system = "You are a top real estate agent with 40 years of experience and deep mastery of client psychology. You write emails that feel genuinely personal, never templated. Your sequences convert leads at 3x the industry average. Respond in plain text only. No markdown, no asterisks, no pound signs.";

    const prompt = `Client name: ${fuName || "the client"}
Lead type: ${fuLeadType.replace(/_/g, " ")}
Situation: ${fuSituation || "buyer/seller interest, details not specified"}
Agent name and brokerage: ${fuAgent || "Your Agent"}
Tone: ${fuTone}

Write a 5-email follow-up sequence. Format EXACTLY like this — each email must have these exact delimiter lines:

===EMAIL1START===
Subject: [write subject line here]
[write email body here]
===EMAIL1END===

===EMAIL2START===
Subject: [write subject line here]
[write email body here]
===EMAIL2END===

===EMAIL3START===
Subject: [write subject line here]
[write email body here]
===EMAIL3END===

===EMAIL4START===
Subject: [write subject line here]
[write email body here]
===EMAIL4END===

===EMAIL5START===
Subject: [write subject line here]
[write email body here]
===EMAIL5END===

Email 1: Immediate reconnect — reference their specific situation, feel personal
Email 2: Value-add — share a genuinely useful market insight or tip for their situation
Email 3: Social proof — brief story about a similar client you helped successfully
Email 4: Soft urgency — a real market condition or opportunity they might miss
Email 5: Final clean check-in — no pressure, keeps the door open professionally

Each email: 120-180 words. Make every email feel like a real human wrote it specifically for this client. No generic filler.`;

    try {
      const raw = await callAIProxy(system, prompt, 2400);
      const parsedEmails: EmailItem[] = [];

      for (let i = 1; i <= 5; i++) {
        const re = new RegExp(`===EMAIL${i}START===\\s*([\\s\\S]*?)===EMAIL${i}END===`, "i");
        const m = raw.match(re);
        if (m) {
          const block = m[1].trim();
          const subMatch = block.match(/^Subject:\s*(.+)/im);
          const subject = subMatch ? subMatch[1].trim() : `Email ${i}`;
          const body = block.replace(/^Subject:\s*.+[\r\n]?/im, "").trim();
          parsedEmails.push({ num: i, subject, body });
        }
      }

      if (parsedEmails.length === 0) {
        parsedEmails.push({ num: 1, subject: "Your Follow-Up Sequence", body: raw });
      }

      setFuEmails(parsedEmails);
    } catch (e: any) {
      setFuError(e.message);
    } finally {
      setFuLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     TOOL 5 — LISTING DESCRIPTION GENERATOR
  ═══════════════════════════════════════════════════════ */
  const [ldBedBath, setLdBedBath] = useState<string>("4BD / 3.5BA");
  const [ldSqft, setLdSqft] = useState<string>("2450");
  const [ldType, setLdType] = useState<string>("Single Family Home");
  const [ldFeatures, setLdFeatures] = useState<string>("Renovated chef's kitchen, quartz counters, SS appliances, primary suite with spa bath, resort-style pool, new HVAC 2023, hardwood floors...");
  const [ldLocation, setLdLocation] = useState<string>("Top-rated schools, walk to downtown, gated community...");
  const [ldBuyer, setLdBuyer] = useState<string>("Growing Families");
  const [ldPrice, setLdPrice] = useState<string>("$649,000");

  const [ldLoading, setLdLoading] = useState<boolean>(false);
  const [ldError, setLdError] = useState<string>("");
  const [ldResults, setLdResults] = useState<{
    mlsDesc: string;
    shortDesc: string;
    headlines: string;
    seoScore: string;
  } | null>(null);

  const runListing = async () => {
    if (!ldFeatures.trim()) {
      alert("Please enter the property features.");
      return;
    }
    setLdLoading(true);
    setLdError("");
    setLdResults(null);

    const system = "You are a master real estate copywriter with 40 years of experience. Your listing descriptions consistently sell homes faster and above asking price. You understand buyer psychology, SEO optimization for property platforms, and how to create emotional urgency in copy. Respond in plain text only. No markdown, no asterisks, no pound signs.";

    const prompt = `Property details:
Beds/Baths: ${ldBedBath || "not specified"}
Square Footage: ${ldSqft ? ldSqft + " sqft" : "not specified"}
Property Type: ${ldType}
Features and upgrades: ${ldFeatures}
Location highlights: ${ldLocation || "desirable neighborhood"}
Target buyer: ${ldBuyer}
Listing price: ${ldPrice || "priced competitively"}

Generate exactly 4 sections with these EXACT labels on their own lines:

[MLS DESCRIPTION]
Write a 200-250 word MLS listing description. Open with the single most emotionally compelling hook sentence. Build desire throughout. End with a strong call to action.

[SHORT DESCRIPTION]
Write a 75-word version for social media, flyers, and email blasts. Punchy and compelling.

[HEADLINE OPTIONS]
Write 5 compelling marketing headline options, numbered 1 through 5. These are for flyers, ads, and social posts.

[SEO SCORE]
Rate this listing description's SEO strength from 1 to 10. List the top 5 keywords naturally embedded in the description. Explain specifically what would push the score higher.`;

    try {
      const raw = await callAIProxy(system, prompt, 2000);
      const mlsDesc = extractSectionContent(raw, "MLS DESCRIPTION") || raw;
      const shortDesc = extractSectionContent(raw, "SHORT DESCRIPTION");
      const headlines = extractSectionContent(raw, "HEADLINE OPTIONS");
      const seoScore = extractSectionContent(raw, "SEO SCORE");

      setLdResults({ mlsDesc, shortDesc, headlines, seoScore });
    } catch (e: any) {
      setLdError(e.message);
    } finally {
      setLdLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     TOOL 6 — OPEN HOUSE PLAYBOOK
  ═══════════════════════════════════════════════════════ */
  const [ohAddr, setOhAddr] = useState<string>("318 Oak Blvd — 4BR colonial, $549K, Roswell GA");
  const [ohHighlights, setOhHighlights] = useState<string>("Just renovated, new roof, best school district in county, huge backyard, priced $30K below comps...");
  const [ohBudget, setOhBudget] = useState<string>("500");
  const [ohDate, setOhDate] = useState<string>("Sat May 31, 1–4 PM");
  const [ohVisitor, setOhVisitor] = useState<string>("mixed families investors and curious neighbors");

  const [ohLoading, setOhLoading] = useState<boolean>(false);
  const [ohError, setOhError] = useState<string>("");
  const [ohResults, setOhResults] = useState<{
    budgetBreakdown: string;
    agentScript: string;
    qualification: string;
    followUp: string;
  } | null>(null);

  const runOpenHouse = async () => {
    if (!ohAddr.trim()) {
      alert("Please enter the property address.");
      return;
    }
    setOhLoading(true);
    setOhError("");
    setOhResults(null);

    const system = "You are an elite real estate agent with 40 years of experience specializing in open house strategy. You have hosted over 4,000 open houses and convert leads at 3x the national average. You know instantly how to read visitors, qualify serious buyers, and convert tire-kickers. Respond in plain text only. No markdown, no asterisks, no pound signs.";

    const prompt = `Property: ${ohAddr}
Key Highlights: ${ohHighlights || "great home inside nice neighborhood"}
Budget: $${ohBudget || "300"}
Expected visitor type: ${ohVisitor}
Date and time: ${ohDate || "this weekend"}

Generate exactly 4 sections with these EXACT labels on their own lines:

[BUDGET BREAKDOWN]
Show how to allocate the $${ohBudget || "300"} budget for maximum ROI. Itemize staging items, food and drinks, signage, digital ads, and any other line items. Include specific dollar amounts for each. Make it practical and ready to execute.

[AGENT SCRIPT]
Write a complete word-for-word open house script including: warm greeting at the door, 3 property tour talking points that build desire, how to handle price objections without going below list, and the exact closing line that gets every visitor to give their contact info.

[LEAD QUALIFICATION QUESTIONS]
Write 6 questions to ask every visitor that reveal whether they are a real buyer, their timeline, their budget, and their true motivation — without feeling like an interrogation. Number them 1 through 6. Include a brief note on what each question reveals.

[FOLLOW UP PLAN]
Write 3 complete follow-up email templates:
Template A: For a Serious Buyer — ready, pre-approved, high interest
Template B: For an Undecided Maybe — showed interest but not committed
Template C: For a Neighbor or Tire-Kicker — probably not buying but may refer someone
Each template should be 80-100 words, ready to copy-paste.`;

    try {
      const raw = await callAIProxy(system, prompt, 2200);
      const budgetBreakdown = extractSectionContent(raw, "BUDGET BREAKDOWN") || raw;
      const agentScript = extractSectionContent(raw, "AGENT SCRIPT");
      const qualification = extractSectionContent(raw, "LEAD QUALIFICATION QUESTIONS");
      const followUp = extractSectionContent(raw, "FOLLOW UP PLAN");

      setOhResults({ budgetBreakdown, agentScript, qualification, followUp });
    } catch (e: any) {
      setOhError(e.message);
    } finally {
      setOhLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     TOOL 7 — TRANSACTION DEADLINE TRACKER
  ═══════════════════════════════════════════════════════ */
  const [tlContract, setTlContract] = useState<string>("");
  const [tlClose, setTlClose] = useState<string>("");
  const [tlType, setTlType] = useState<string>("conventional");
  const [tlState, setTlState] = useState<string>("Texas");
  const [tlHOA, setTlHOA] = useState<boolean>(true);
  const [tlSeptic, setTlSeptic] = useState<boolean>(false);

  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [tlLoading, setTlLoading] = useState<boolean>(false);
  const [tlError, setTlError] = useState<string>("");
  const [tlAIResults, setTlAIResults] = useState<{
    tips: string;
    checklist: string;
  } | null>(null);

  // Set default dates to easily generate on launch
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    const targetClose = new Date(today);
    targetClose.setDate(today.getDate() + 30);
    const formattedClose = targetClose.toISOString().split("T")[0];
    setTlContract(formattedToday);
    setTlClose(formattedClose);
  }, []);

  const runTimeline = async () => {
    if (!tlContract) {
      alert("Please enter the contract acceptance date.");
      return;
    }
    if (!tlClose) {
      alert("Please enter the target closing date.");
      return;
    }

    const contract = new Date(tlContract + "T12:00:00");
    const closing = new Date(tlClose + "T12:00:00");
    const totalDays = Math.round((closing.getTime() - contract.getTime()) / 86400000);

    if (totalDays <= 0) {
      alert("Closing date must be after the contract date.");
      return;
    }
    if (totalDays > 365) {
      alert("Timeline seems too long (over 1 year). Please check your dates.");
      return;
    }

    const addDays = (base: Date, n: number) => {
      const d = new Date(base.getTime());
      d.setDate(d.getDate() + Math.min(n, totalDays));
      return d;
    };

    const fmtDate = (d: Date) => {
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    };

    const dotCls = (d: Date): "dr" | "da" | "dg" => {
      const diff = Math.round((d.getTime() - Date.now()) / 86400000);
      if (diff < 0) return "dr";
      if (diff <= 3) return "dr";
      if (diff <= 7) return "da";
      return "dg";
    };

    const daysLbl = (d: Date): string => {
      const diff = Math.round((d.getTime() - Date.now()) / 86400000);
      if (diff < 0) return Math.abs(diff) + "d ago";
      if (diff === 0) return "TODAY ⚠️";
      if (diff === 1) return "1 day left ⚠️";
      return diff + " days left";
    };

    const isCash = tlType === "cash";
    const isVA = tlType === "va";
    const isFHA = tlType === "fha";
    const inspDays = isCash ? 7 : 10;
    const apprOrd = isCash ? 0 : (isVA ? 18 : 14);
    const apprDl = isCash ? 0 : (isVA ? 25 : 21);
    const loanCommit = isCash ? 0 : Math.round(totalDays * 0.72);
    const titleDays = Math.round(totalDays * 0.42);

    const list: MilestoneItem[] = [];
    list.push({ label: "📋 Contract Acceptance", date: contract, note: "Day 0 — Start ALL clocks immediately.", dotClass: dotCls(contract), daysText: daysLbl(contract) });
    
    if (!isCash) {
      const appDate = addDays(contract, 3);
      list.push({ label: "📑 Loan Application Submitted", date: appDate, note: "Buyer must formally apply — do not let this drift past day 3.", dotClass: dotCls(appDate), daysText: daysLbl(appDate) });
    }

    const inspDate = addDays(contract, inspDays);
    list.push({ label: "🔍 Inspection Period Deadline", date: inspDate, note: `${inspDays} days — schedule inspection within 24 hrs of acceptance.`, dotClass: dotCls(inspDate), daysText: daysLbl(inspDate) });
    
    if (tlHOA) {
      const hoaDate = addDays(contract, inspDays);
      list.push({ label: "🏘️ HOA Docs Requested", date: hoaDate, note: "Request same day as inspection — boards are slow, budgets take time.", dotClass: dotCls(hoaDate), daysText: daysLbl(hoaDate) });
    }
    
    if (tlSeptic) {
      const septicDate = addDays(contract, inspDays + 2);
      list.push({ label: "💧 Septic Inspection", date: septicDate, note: "Book immediately — certified inspectors book up fast.", dotClass: dotCls(septicDate), daysText: daysLbl(septicDate) });
    }
    
    if (!isCash) {
      const orderDate = addDays(contract, apprOrd);
      const appDlDate = addDays(contract, apprDl);
      const commitDate = addDays(contract, loanCommit);

      list.push({ label: "📬 Appraisal Ordered", date: orderDate, note: `Day ${apprOrd} — order early, appraisers run 1-2 week backlogs.`, dotClass: dotCls(orderDate), daysText: daysLbl(orderDate) });
      list.push({ label: "🏡 Appraisal Deadline", date: appDlDate, note: `Day ${apprDl} — a low value can kill the deal without a renegotiation clause.`, dotClass: dotCls(appDlDate), daysText: daysLbl(appDlDate) });
      list.push({ label: "💳 Loan Commitment Deadline", date: commitDate, note: `Day ${commitDate} — lender must formally commit. Missing this can void the contract.`, dotClass: dotCls(commitDate), daysText: daysLbl(commitDate) });
    }

    const searchDate = addDays(contract, titleDays);
    list.push({ label: "📁 Title Search Cleared", date: searchDate, note: `Day ${titleDays} — any lien or cloud on title must be flagged and resolved now.`, dotClass: dotCls(searchDate), daysText: daysLbl(searchDate) });

    const walkthroughDate = addDays(contract, totalDays - 1);
    list.push({ label: "🔐 Final Walkthrough", date: walkthroughDate, note: "24–48 hrs before closing — verify all agreed repairs completed, condition unchanged.", dotClass: dotCls(walkthroughDate), daysText: daysLbl(walkthroughDate) });

    const wireDate = addDays(contract, totalDays - 1);
    list.push({ label: "💰 Wire Funds / Cashier's Check", date: wireDate, note: "Always verify wire instructions by phone — wire fraud is rampant.", dotClass: dotCls(wireDate), daysText: daysLbl(wireDate) });

    list.push({ label: "🎉 CLOSING DAY", date: closing, note: "The finish line — stay on schedule and celebrate your client!", dotClass: dotCls(closing), daysText: daysLbl(closing) });

    // Sort Milestones
    list.sort((a, b) => a.date.getTime() - b.date.getTime());
    setMilestones(list);

    // Call AI Tips
    setTlLoading(true);
    setTlError("");
    setTlAIResults(null);

    const system = "You are a real estate transaction coordinator and licensed broker with 40 years of experience and thousands of closed deals across all 50 states. Respond in plain text only. No markdown, no asterisks, no pound signs.";
    
    const extras: string[] = [];
    if (tlHOA) extras.push("HOA approval required");
    if (tlSeptic) extras.push("septic inspection needed");

    const prompt = `Transaction details:
Loan type: ${tlType}
State: ${tlState || "not specified"}
Days from contract to close: ${totalDays}
${extras.length ? "Special conditions: " + extras.join(", ") + "\n" : ""}

Generate exactly 2 sections with these EXACT labels on their own lines:

[EXPERT TIPS]
Write 5 specific expert warnings and pro tips for this exact transaction type that most agents miss or overlook. Be brutally specific about what kills deals and what saves them. Number each tip 1 through 5.

[AGENT CHECKLIST]
Write a 10-item week-by-week action checklist for the agent from contract to close. Organize by timing (Week 1, Week 2, etc.). Number each item.`;

    try {
      const raw = await callAIProxy(system, prompt, 1600);
      const tips = extractSectionContent(raw, "EXPERT TIPS") || raw;
      const checklist = extractSectionContent(raw, "AGENT CHECKLIST");
      setTlAIResults({ tips, checklist });
    } catch (e: any) {
      setTlError(e.message);
    } finally {
      setTlLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#070B16] text-[#f4f0e6] py-10 px-4 sm:px-6 relative selection:bg-[#ffd700]/25 selection:text-[#ffd700] font-sans">
      
      {/* Golden Radial Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#d4af37]/10 via-transparent to-transparent pointer-events-none blur-3xl rounded-full" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">

        {/* Brand Masterpiece Header */}
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-[#d4af37]/30 rounded-full shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#ffd700]" />
            <span className="text-[10px] font-mono font-black tracking-widest text-[#ffd700] uppercase">
              Perryman's Elite Suite
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase select-none">
              The Deal Closer AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono font-medium tracking-wide">
              Full Arsenal Edition — 7 Standard High-Converting Power Tools
            </p>
          </div>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mx-auto" />
        </div>

        {/* Copied Text Notification */}
        {copiedText && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#ffd700] text-black px-4 py-2.5 rounded-lg shadow-2xl font-mono text-[11px] font-bold border border-white/20 animate-fadeIn flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 stroke-[3]" />
            <span>{copiedText}</span>
          </div>
        )}

        {/* ----------------- SEVEN TOOLS DOCK PLATFORM NAVIGATION ----------------- */}
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-7 gap-1.5 p-1 bg-[#101626]/80 rounded-2xl border border-slate-800/80 shadow-inner">
          {[
            { id: 0, label: "Commission", emoji: "💵" },
            { id: 1, label: "Marketing", emoji: "📢" },
            { id: 2, label: "Offer Setup", emoji: "🤝" },
            { id: 3, label: "Follow-Up", emoji: "📧" },
            { id: 4, label: "Listing Copy", emoji: "🏠" },
            { id: 5, label: "Open House", emoji: "🗝️" },
            { id: 6, label: "Deadlines", emoji: "📅" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-gradient-to-b from-[#ffd700] to-amber-500 text-black font-black shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 font-bold"
              }`}
            >
              <span className="text-lg leading-none">{tab.emoji}</span>
              <span className="text-[10px] uppercase font-mono tracking-wider truncate w-full">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ----------------- PRIMARY WORKSPACE ENGINE CARDS ----------------- */}
        <div className="bg-[#0A0D19]/90 border border-[#d4af37]/35 rounded-3xl shadow-2xl relative overflow-hidden p-6 sm:p-8 space-y-6">
          
          {/* TAB 0: Commission Split & Net Buyer Sheet */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold uppercase text-[#ffd700] flex items-center gap-2">
                  <span>👑 Commission Split &amp; Net Sheet Calculator</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Know your exact take-home on every deal before you hang up the phone. No back-of-napkin calculations on closing day.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Property Sale Price ($)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    placeholder="e.g. 485000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Total Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={commRate}
                    onChange={(e) => setCommRate(Number(e.target.value) || 0)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    placeholder="e.g. 6"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Commission Split — Listing Side vs Buyer Side (%)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">LISTING SIDE %</span>
                      <input
                        type="number"
                        value={listSplit}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setListSplit(val);
                          setBuySplit(100 - val);
                        }}
                        className="w-12 bg-transparent text-right text-xs text-white font-bold focus:outline-none"
                      />
                    </div>
                    <div className="bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">BUYER SIDE %</span>
                      <input
                        type="number"
                        value={buySplit}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setBuySplit(val);
                          setListSplit(100 - val);
                        }}
                        className="w-12 bg-transparent text-right text-xs text-white font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Your Agent-to-Broker Split (you keep %)</label>
                  <input
                    type="number"
                    value={agentSplit}
                    onChange={(e) => setAgentSplit(Number(e.target.value) || 0)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    placeholder="e.g. 80"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Transaction Fees &amp; Other Costs ($)</label>
                  <input
                    type="number"
                    value={fees}
                    onChange={(e) => setFees(Number(e.target.value) || 0)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    placeholder="e.g. 350"
                  />
                </div>
              </div>

              {/* Stat Output Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
                <div className="bg-[#04060B] border border-slate-800 rounded-2xl p-4.5 space-y-1 text-center">
                  <span className="text-[8.5px] font-mono text-slate-400 uppercase font-black block leading-none">Gross Commission</span>
                  <p className="text-lg font-black text-white">{fmtCurrency(grossComm)}</p>
                </div>
                <div className="bg-[#04060B] border border-slate-800 rounded-2xl p-4.5 space-y-1 text-center">
                  <span className="text-[8.5px] font-mono text-slate-400 uppercase font-black block leading-none">Your Side Gross</span>
                  <p className="text-lg font-black text-white">{fmtCurrency(yourSideGross)}</p>
                </div>
                <div className="bg-[#04060B] border border-slate-800 rounded-2xl p-4.5 space-y-1 text-center">
                  <span className="text-[8.5px] font-mono text-slate-400 uppercase font-black block leading-none">After Broker split</span>
                  <p className="text-lg font-black text-white">{fmtCurrency(afterBroker)}</p>
                </div>
                <div className="bg-[#04060B] border border-yellow-600/35 rounded-2xl p-4.5 space-y-1 text-center">
                  <span className="text-[8.5px] font-mono text-amber-400 uppercase font-black block leading-none">Your Net Take Home</span>
                  <p className="text-lg font-black text-emerald-400 font-mono">{fmtCurrency(netTakeHome)}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: AI Marketing Engine */}
          {activeTab === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold uppercase text-[#ffd700] flex items-center gap-2">
                  <span>📣 AI Marketing &amp; Strategy Engine</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Full specialist package: SEO strategy, market positioning pitch, buyer ROI angle, and viral social script — generated instantly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Property Specs &amp; Key Assets</label>
                  <textarea
                    rows={3}
                    value={mktSpecs}
                    onChange={(e) => setMktSpecs(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ffd700] font-medium leading-relaxed"
                    placeholder="e.g. 4BR/3BA, 2,200 sqft, renovated kitchen, pool, corner lot, new roof 2023, 3-car garage..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Target Market / Neighborhood</label>
                    <input
                      type="text"
                      value={mktNeighborhood}
                      onChange={(e) => setMktNeighborhood(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. Buckhead Atlanta, first-time buyers, luxury investors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Listing Price</label>
                    <input
                      type="text"
                      value={mktPrice}
                      onChange={(e) => setMktPrice(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. $525,000"
                    />
                  </div>
                </div>

                <button
                  onClick={runMarketing}
                  disabled={mktLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {mktLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Crafting Moat Blueprints...</span>
                    </>
                  ) : (
                    <span>⚡ Generate Full Strategy Package</span>
                  )}
                </button>
              </div>

              {mktError && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                  ❌ {mktError}
                </div>
              )}

              {mktResults && (
                <div className="space-y-4 pt-2">
                  <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    
                    {[
                      { title: "📊 SEO Strategy", content: mktResults.seo },
                      { title: "🏆 Market Positioning Pitch", content: mktResults.positioning },
                      { title: "💰 Buyer ROI & Profit Angle", content: mktResults.roi },
                      { title: "📹 TikTok / Reel Script", content: mktResults.script }
                    ].map((sec, idx) => (
                      <div key={idx} className="bg-[#03060B] p-5 space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black text-amber-400 uppercase">
                          <span>{sec.title}</span>
                          <button
                            onClick={() => triggerCopyToast(sec.content, sec.title)}
                            className="p-1 px-2.5 bg-[#0F1626] border border-slate-700/80 rounded hover:border-[#ffd700] text-[#ffd700] flex items-center gap-1 font-mono uppercase font-black"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300 text-xs font-semibold font-sans">{sec.content || "(No section returned)"}</p>
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Offer & Counter Generator */}
          {activeTab === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold uppercase text-[#ffd700] flex items-center gap-2">
                  <span>🤝 Offer &amp; Counter-Offer Generator</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Complete negotiation playbook + professional contract and email offer language in 30 seconds.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">You Are Representing</label>
                    <select
                      value={offerSide}
                      onChange={(e) => setOfferSide(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    >
                      <option value="buyer">The Buyer</option>
                      <option value="seller">The Seller</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Asking / List Price ($)</label>
                    <input
                      type="number"
                      value={offerAsk}
                      onChange={(e) => setOfferAsk(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 499000"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Offer / Counter Price ($)</label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 472000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Property Address / Description</label>
                    <input
                      type="text"
                      value={offerAddr}
                      onChange={(e) => setOfferAddr(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 142 Maple St — 3BR/2BA ranch"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Days on Market</label>
                    <input
                      type="number"
                      value={offerDOM}
                      onChange={(e) => setOfferDOM(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 47"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Contingencies</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="bg-[#0E1524] border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contInspect}
                        onChange={(e) => setContInspect(e.target.checked)}
                        className="accent-[#ffd700] h-4 w-4"
                      />
                      <span>Inspection</span>
                    </label>
                    <label className="bg-[#0E1524] border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contFinance}
                        onChange={(e) => setContFinance(e.target.checked)}
                        className="accent-[#ffd700] h-4 w-4"
                      />
                      <span>Financing</span>
                    </label>
                    <label className="bg-[#0E1524] border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contAppraisal}
                        onChange={(e) => setContAppraisal(e.target.checked)}
                        className="accent-[#ffd700] h-4 w-4"
                      />
                      <span>Appraisal</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Seller Motivation Level</label>
                    <select
                      value={offerMotivation}
                      onChange={(e) => setOfferMotivation(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    >
                      <option value="unknown">Unknown — Not sure</option>
                      <option value="low">Low — Testing the market</option>
                      <option value="medium">Medium — Ready to move in 60–90 days</option>
                      <option value="high">High — Needs to close fast</option>
                      <option value="distressed">Distressed — Pre-foreclosure / divorce / estate</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Closing Timeline</label>
                    <input
                      type="text"
                      value={offerClose}
                      onChange={(e) => setOfferClose(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 30 days, flexible"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Special Terms or Concessions</label>
                  <textarea
                    rows={2}
                    value={offerTerms}
                    onChange={(e) => setOfferTerms(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ffd700] font-medium leading-relaxed"
                    placeholder="e.g. seller pays closing costs, include appliances, leaseback 30 days..."
                  />
                </div>

                <button
                  onClick={runOffer}
                  disabled={offerLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {offerLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Assembling Playbooks...</span>
                    </>
                  ) : (
                    <span>⚔️ Generate Negotiation Strategy &amp; Contract Language</span>
                  )}
                </button>
              </div>

              {offerError && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                  ❌ {offerError}
                </div>
              )}

              {offerResults && (
                <div className="space-y-4 pt-2">
                  <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    
                    {[
                      { title: "⚔️ Negotiation Strategy", content: offerResults.strategy },
                      { title: "📄 Contract / Email Language", content: offerResults.language },
                      { title: "🛡️ Objection Responses", content: offerResults.objections },
                      { title: "🚪 Walk-Away Analysis", content: offerResults.walkAway }
                    ].map((sec, idx) => (
                      <div key={idx} className="bg-[#03060B] p-5 space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black text-amber-400 uppercase">
                          <span>{sec.title}</span>
                          <button
                            onClick={() => triggerCopyToast(sec.content, sec.title)}
                            className="p-1 px-2.5 bg-[#0F1626] border border-slate-700/80 rounded hover:border-[#ffd700] text-[#ffd700] flex items-center gap-1 font-mono uppercase font-black"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300 text-xs font-semibold font-sans">{sec.content || "(No section returned)"}</p>
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Client Follow-Up Drip Sequence */}
          {activeTab === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold uppercase text-[#ffd700] flex items-center gap-2">
                  <span>📧 Client Follow-Up Email Sequence</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Stop losing transactions to radio silence. Get a personalized 5-email nurturing drip calibrated for your specific lead type.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Lead Type / Cohort</label>
                    <select
                      value={fuLeadType}
                      onChange={(e) => setFuLeadType(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    >
                      <option value="first_time_buyer">First-Time Buyer</option>
                      <option value="move_up_buyer">Move-Up Buyer (selling + buying)</option>
                      <option value="investor">Real Estate Investor</option>
                      <option value="relocating">Corporate Relocation</option>
                      <option value="downsizer">Empty Nester / Downsizer</option>
                      <option value="seller_lead">Potential Seller Lead</option>
                      <option value="open_house_visitor">Open House Visitor</option>
                      <option value="cold_lead">Cold Lead (30+ days no contact)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Client Name(s)</label>
                    <input
                      type="text"
                      value={fuName}
                      onChange={(e) => setFuName(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. Marcus & Tanya"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Their Situation (more context = higher conversion)</label>
                  <textarea
                    rows={2}
                    value={fuSituation}
                    onChange={(e) => setFuSituation(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ffd700] font-medium leading-relaxed"
                    placeholder="Describe their budget, locations, search objections, lease expirations, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Your Name &amp; Brokerage</label>
                    <input
                      type="text"
                      value={fuAgent}
                      onChange={(e) => setFuAgent(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. Keisha Williams, KW Metro"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Sequence Pitch Tone</label>
                    <select
                      value={fuTone}
                      onChange={(e) => setFuTone(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    >
                      <option value="warm professional">Warm &amp; Professional</option>
                      <option value="direct with urgency">Direct with Urgency</option>
                      <option value="consultative advisor">Consultative / Advisor</option>
                      <option value="casual and friendly">Casual &amp; Friendly</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={runFollowUp}
                  disabled={fuLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {fuLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Drafting Sequence...</span>
                    </>
                  ) : (
                    <span>📧 Generate 5-Email Follow-Up Drip Sequence</span>
                  )}
                </button>
              </div>

              {fuError && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                  ❌ {fuError}
                </div>
              )}

              {fuEmails.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="bg-[#03060B] border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4">
                    
                    {/* Horizontal Email Tab Bar */}
                    <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
                      {fuEmails.map((em, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveEmailIdx(idx)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                            activeEmailIdx === idx
                              ? "bg-[#ffd700] text-black"
                              : "bg-[#0E1524] text-slate-400 hover:text-white"
                          }`}
                        >
                          Email {em.num}
                        </button>
                      ))}
                    </div>

                    {/* Active Email View */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-450 uppercase tracking-widest block select-none">
                        <span>Email {fuEmails[activeEmailIdx].num} of {fuEmails.length}</span>
                        <button
                          onClick={() => triggerCopyToast(`Subject: ${fuEmails[activeEmailIdx].subject}\n\n${fuEmails[activeEmailIdx].body}`, `Email ${fuEmails[activeEmailIdx].num}`)}
                          className="px-2 py-1 bg-[#101626] border border-slate-700 rounded hover:border-[#ffd700] text-[#ffd700] flex items-center gap-1 text-[10px] uppercase font-bold"
                        >
                          <Copy className="h-3 w-3" /> Copy Email Template
                        </button>
                      </div>

                      <div className="bg-[#070A14] p-4.5 rounded-xl border border-slate-800/80 font-sans space-y-3 text-xs leading-relaxed text-slate-350">
                        <p className="text-white font-extrabold border-b border-slate-900 pb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-450 mr-2 select-none">Subject:</span>
                          {fuEmails[activeEmailIdx].subject}
                        </p>
                        <p className="whitespace-pre-wrap font-medium">{fuEmails[activeEmailIdx].body}</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Listing Description Generator */}
          {activeTab === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold uppercase text-[#ffd700] flex items-center gap-2">
                  <span>🏠 Listing Description Generator</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  MLS-ready agent descriptions compiled with natural SEO keywords and built-in strength metrics.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block font-sans">Beds / Baths</label>
                    <input
                      type="text"
                      value={ldBedBath}
                      onChange={(e) => setLdBedBath(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 4BD / 3.5BA"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block font-sans">Square Footage</label>
                    <input
                      type="number"
                      value={ldSqft}
                      onChange={(e) => setLdSqft(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 2450"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block font-sans">Property Type</label>
                    <select
                      value={ldType}
                      onChange={(e) => setLdType(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    >
                      <option value="Single Family Home">Single Family Home</option>
                      <option value="Condo / Townhome">Condo / Townhome</option>
                      <option value="Luxury Estate">Luxury Estate</option>
                      <option value="Investment / Multi-family">Investment / Multi-family</option>
                      <option value="Land / Lot">Land / Lot</option>
                      <option value="Commercial Property">Commercial Property</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Top Features &amp; Upgrades (list all characteristics)</label>
                  <textarea
                    rows={2}
                    value={ldFeatures}
                    onChange={(e) => setLdFeatures(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ffd700] font-medium leading-relaxed"
                    placeholder="Chef kitchen, pool, hardwood floors, newly replaced HVAC..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Neighborhood &amp; Location Selling Points</label>
                  <input
                    type="text"
                    value={ldLocation}
                    onChange={(e) => setLdLocation(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    placeholder="e.g. Top-rated schools, walk to downtown, gated community..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Target Buyer Profile</label>
                    <select
                      value={ldBuyer}
                      onChange={(e) => setLdBuyer(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    >
                      <option value="Growing Families">Growing Families</option>
                      <option value="Young Professionals">Young Professionals</option>
                      <option value="Luxury Buyers">Luxury Buyers</option>
                      <option value="Investors">Investors / ROI Focus</option>
                      <option value="Retirees and Downsizers">Retirees / Downsizers</option>
                      <option value="First-Time Buyers">First-Time Buyers</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Listing Price</label>
                    <input
                      type="text"
                      value={ldPrice}
                      onChange={(e) => setLdPrice(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. $649,000"
                    />
                  </div>
                </div>

                <button
                  onClick={runListing}
                  disabled={ldLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {ldLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Evaluating Copy...</span>
                    </>
                  ) : (
                    <span>✍️ Generate MLS Listing &amp; SEO Score</span>
                  )}
                </button>
              </div>

              {ldError && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                  ❌ {ldError}
                </div>
              )}

              {ldResults && (
                <div className="space-y-4 pt-2">
                  <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    
                    {[
                      { title: "🏠 Full MLS Description (200–250 words)", content: ldResults.mlsDesc },
                      { title: "📱 Short Version — Social / Flyers / Email", content: ldResults.shortDesc },
                      { title: "💡 Headline Options (5)", content: ldResults.headlines },
                      { title: "📊 SEO Strength Score & Keywords", content: ldResults.seoScore }
                    ].map((sec, idx) => (
                      <div key={idx} className="bg-[#03060B] p-5 space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black text-amber-400 uppercase">
                          <span>{sec.title}</span>
                          <button
                            onClick={() => triggerCopyToast(sec.content, sec.title)}
                            className="p-1 px-2.5 bg-[#0F1626] border border-slate-700/80 rounded hover:border-[#ffd700] text-[#ffd700] flex items-center gap-1 font-mono uppercase font-black"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300 text-xs font-semibold font-sans">{sec.content || "(No section returned)"}</p>
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Open House ROI & Script Builder */}
          {activeTab === 5 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold uppercase text-[#ffd700] flex items-center gap-2">
                  <span>🗝️ Open House ROI &amp; Script Builder</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Stop winging open houses. Compile staging budget allocation plans, micro-lead scripts, and post-visit loops.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Property Address &amp; Description</label>
                  <input
                    type="text"
                    value={ohAddr}
                    onChange={(e) => setOhAddr(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    placeholder="e.g. 318 Oak Blvd — 4BR colonial, $549K, Roswell GA"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Top 5 Property Highlights</label>
                  <textarea
                    rows={2}
                    value={ohHighlights}
                    onChange={(e) => setOhHighlights(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ffd700] font-medium leading-relaxed"
                    placeholder="e.g. Just renovated, brand-new HVAC, zoned to highest-tier schools..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Open House Budget ($)</label>
                    <input
                      type="number"
                      value={ohBudget}
                      onChange={(e) => setOhBudget(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. 500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Date &amp; Time</label>
                    <input
                      type="text"
                      value={ohDate}
                      onChange={(e) => setOhDate(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. Sat May 31, 1–4 PM"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Expected Visitor Mix</label>
                  <select
                    value={ohVisitor}
                    onChange={(e) => setOhVisitor(e.target.value)}
                    className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                  >
                    <option value="mixed families investors and curious neighbors">Mixed — Families, Investors &amp; Neighbors</option>
                    <option value="luxury buyers">Luxury Buyers Only</option>
                    <option value="first-time buyers">Mostly First-Time Buyers</option>
                    <option value="investment-focused buyers">Investment-Focused Buyers</option>
                  </select>
                </div>

                <button
                  onClick={runOpenHouse}
                  disabled={ohLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {ohLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Coordinating Staging...</span>
                    </>
                  ) : (
                    <span>🗝️ Generate Complete Open House Playbook</span>
                  )}
                </button>
              </div>

              {ohError && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                  ❌ {ohError}
                </div>
              )}

              {ohResults && (
                <div className="space-y-4 pt-2">
                  <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    
                    {[
                      { title: "💵 Budget Allocation & ROI Plan", content: ohResults.budgetBreakdown },
                      { title: "🎤 Word-for-Word Agent Script", content: ohResults.agentScript },
                      { title: "🔍 Lead Qualification Questions (6)", content: ohResults.qualification },
                      { title: "📬 Structured Post-Event Follow-Up templates", content: ohResults.followUp }
                    ].map((sec, idx) => (
                      <div key={idx} className="bg-[#03060B] p-5 space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black text-amber-400 uppercase">
                          <span>{sec.title}</span>
                          <button
                            onClick={() => triggerCopyToast(sec.content, sec.title)}
                            className="p-1 px-2.5 bg-[#0F1626] border border-slate-700/80 rounded hover:border-[#ffd700] text-[#ffd700] flex items-center gap-1 font-mono uppercase font-black"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300 text-xs font-semibold font-sans">{sec.content || "(No section returned)"}</p>
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Transaction Deadline Tracker & Buffer Alerts */}
          {activeTab === 6 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold uppercase text-[#ffd700] flex items-center gap-2">
                  <span>📅 Transaction Deadline Tracker</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Prevent contract drift or escrow penalties. Enter contract validation params below for a dynamic milestoning grid.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Contract Acceptance Date</label>
                    <input
                      type="date"
                      value={tlContract}
                      onChange={(e) => setTlContract(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ffd700] font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Target Closing Date</label>
                    <input
                      type="date"
                      value={tlClose}
                      onChange={(e) => setTlClose(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ffd700] font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Loan / Transaction Type</label>
                    <select
                      value={tlType}
                      onChange={(e) => setTlType(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                    >
                      <option value="conventional">Conventional Loan</option>
                      <option value="fha">FHA Loan</option>
                      <option value="va">VA Loan</option>
                      <option value="cash">Cash Purchase</option>
                      <option value="jumbo">Jumbo / Non-Conforming</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">State Jurisdiction (affects statutory limits)</label>
                    <input
                      type="text"
                      value={tlState}
                      onChange={(e) => setTlState(e.target.value)}
                      className="w-full bg-[#0E1524] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffd700] font-bold"
                      placeholder="e.g. Texas, Atlanta, Georgia"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Special Contract Addenda / Conditions</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="bg-[#0E1524] border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tlHOA}
                        onChange={(e) => setTlHOA(e.target.checked)}
                        className="accent-[#ffd700] h-4 w-4"
                      />
                      <span>HOA Approval Required</span>
                    </label>
                    <label className="bg-[#0E1524] border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tlSeptic}
                        onChange={(e) => setTlSeptic(e.target.checked)}
                        className="accent-[#ffd700] h-4 w-4"
                      />
                      <span>Septic Inspection Needed</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={runTimeline}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  <span>📋 Compile Absolute Transaction Milestones Timeline</span>
                </button>
              </div>

              {milestones.length > 0 && (
                <div className="space-y-5 pt-3">
                  
                  {/* Dynamic Timeline milestone row mapping */}
                  <div className="bg-[#03060B] border border-slate-800 rounded-2xl p-5 space-y-3 divide-y divide-slate-900">
                    <span className="text-[9px] font-mono text-[#ffd700] block uppercase font-black tracking-widest pb-1 select-none">
                      PROGRAMMATIC ESCROW PIPELINE MILESTONES
                    </span>

                    {milestones.map((m, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 pt-3 text-xs leading-normal">
                        <div className="flex items-start gap-2.5">
                          {/* Colored Date Badge Node */}
                          <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                            m.dotClass === "dr" ? "bg-red-500 shadow-md shadow-red-500/20 animate-pulse" : 
                            m.dotClass === "da" ? "bg-amber-500 text-amber-500" : "bg-emerald-500"
                          }`} />
                          <div>
                            <span className="font-extrabold text-[#ffd700] block">{m.label}</span>
                            <span className="text-slate-400 font-medium text-[11px] block mt-0.5">{m.note}</span>
                          </div>
                        </div>

                        <div className="text-right font-mono shrink-0 select-none">
                          <span className="text-white font-bold block">{m.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className={`text-[10px] block font-semibold ${
                            m.dotClass === "dr" ? "text-red-400" : m.dotClass === "da" ? "text-amber-400" : "text-emerald-400"
                          }`}>{m.daysText}</span>
                        </div>
                      </div>
                    ))}

                    <div className="bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-xl text-[#ffd700] text-[10.5px] leading-relaxed font-semibold font-sans mt-4 pt-3 flex items-start gap-2 select-none">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <span><strong>Always verify</strong> these contractual deadlines with your broker representing Perryman's local closing guidelines. Escrow laws and state addenda dictate priority. Milestones incorporate +1 day safety buffer.</span>
                    </div>
                  </div>

                  {tlLoading && (
                    <div className="flex flex-col items-center justify-center py-6 gap-2 text-xs">
                      <Loader2 className="h-6 w-6 animate-spin text-[#ffd700]" />
                      <span className="font-mono text-slate-400">Loading master transaction co-pilot scripts...</span>
                    </div>
                  )}

                  {tlError && (
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                      ❌ Could not formulate transaction tips: {tlError}
                    </div>
                  )}

                  {tlAIResults && (
                    <div className="space-y-4">
                      
                      <div className="bg-[#03060B] p-5 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black text-amber-400 uppercase">
                          <span>🧠 Expert Tips for Your Transaction Type</span>
                          <button
                            onClick={() => triggerCopyToast(tlAIResults.tips, "Expert tips")}
                            className="p-1 px-2.5 bg-[#0F1626] border border-slate-700/80 rounded hover:border-[#ffd700] text-[#ffd700] flex items-center gap-1 font-mono uppercase font-black"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-semibold font-sans">{tlAIResults.tips}</p>
                      </div>

                      <div className="bg-[#03060B] p-5 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black text-amber-400 uppercase">
                          <span>✅ Agent Week-by-Week Action Checklist</span>
                          <button
                            onClick={() => triggerCopyToast(tlAIResults.checklist, "Agent checklist")}
                            className="p-1 px-2.5 bg-[#0F1626] border border-slate-700/80 rounded hover:border-[#ffd700] text-[#ffd700] flex items-center gap-1 font-mono uppercase font-black"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-semibold font-sans">{tlAIResults.checklist}</p>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>
          )}

        </div>

        {/* ---------------- REGIONAL MANAGEMENT MONOPOLY (SEO) ---------------- */}
        <div id="monopoly-block" className="bg-[#0A0D18]/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 text-center sm:text-left shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
              Want Absolute Local Market Monopoly?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans font-semibold">
              We build completely automated local SEO infrastructure, execute advanced search keyword tracking, and manage full-scale marketing distribution campaigns for elite real estate firms.
            </p>
          </div>

          <div className="flex justify-center sm:justify-start">
            <a
              href="https://docs.google.com/forms/d/1ofLBY7eHXGKhDoFuKb1zXgw7xuAZt-h6tzGuXfRSp68/preview"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#111827] hover:bg-slate-900 text-white font-mono font-black text-xs rounded-xl shadow-lg transition-all align-middle select-none border border-slate-700/60 cursor-pointer"
            >
              <span>Apply for Dedicated Regional Management</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[#ffd700]" />
            </a>
          </div>
        </div>

        {/* ---------------- PRODUCTION SYSTEMS FOOTER ---------------- */}
        <div id="verified-systems" className="text-center space-y-3 pt-6 border-t border-slate-900 select-none">
          <span className="text-[9.5px] font-mono text-[#ffd700] block uppercase tracking-widest font-black">
            Verified Production Systems
          </span>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed font-sans font-semibold">
            To deploy the matrices in our master vault at maximum scale, elite agents use the following standardized operational blueprints.
          </p>
          <div className="flex justify-center gap-3">
            <a 
              href="https://chatgpt.com" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-1.5 bg-[#1F2937]/50 hover:bg-[#1F2937] text-white font-mono text-[11px] rounded-lg border border-slate-800/80 transition-all cursor-pointer flex items-center gap-1.5 tracking-wider font-extrabold uppercase"
            >
              <span>Launch Engine</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 text-[#ffd700]" />
            </a>
          </div>

          <div className="space-y-2 pt-6 border-t border-slate-900/40 text-[10px] font-mono text-slate-550 leading-relaxed text-slate-500">
            <p className="font-bold text-slate-400">
              © 2026 Perryman’s Assets, LLC. All Rights Reserved.
            </p>
            <p className="max-w-2xl mx-auto italic font-medium">
              Disclaimer & Terms: The digital tools, systems, frameworks, and matrices provided within this toolkit are for informational and business acceleration purposes only. Perryman’s Assets, LLC does not guarantee specific transaction volumes, income increases, or specific market performance. Unauthorized duplication, reverse-engineering, or digital scraping of this platform wrapper or its nested assets is strictly prohibited and will be prosecuted to the fullest extent of corporate trademark and property law. Transactions are securely managed off-site via PCI-Compliant Stripe architecture.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
