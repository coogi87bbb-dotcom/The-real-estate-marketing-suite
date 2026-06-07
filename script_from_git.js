
'use strict';

/* ═══════════════════════════════
   NAVIGATION
═══════════════════════════════ */
function showPanel(id, btn) {
  document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('#mainNav button').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════
   TOAST / COPY
═══════════════════════════════ */
function showToast() {
  var t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2000);
}
function copyText(txt) {
  if (!txt) return;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(txt).then(showToast).catch(function(){ fallbackCopy(txt); });
  } else {
    fallbackCopy(txt);
  }
}
function fallbackCopy(txt) {
  var ta = document.createElement('textarea');
  ta.value = txt;
  ta.style.cssText = 'position:fixed;opacity:0;top:-999px;left:-999px;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); showToast(); } catch(e) { alert('Copy failed — please select text manually.'); }
  document.body.removeChild(ta);
}

/* ═══════════════════════════════
   UI HELPERS
═══════════════════════════════ */
function showLoading(id) { document.getElementById(id).classList.add('show'); }
function hideLoading(id) { document.getElementById(id).classList.remove('show'); }
function disableBtn(id)  { var el = document.getElementById(id); if(el) el.disabled = true; }
function enableBtn(id)   { var el = document.getElementById(id); if(el) el.disabled = false; }
function clearEl(id)     { document.getElementById(id).innerHTML = ''; }
function showEl(id)      { document.getElementById(id).style.display = 'block'; }
function hideEl(id)      { document.getElementById(id).style.display = 'none'; }

function showError(containerId, msg) {
  document.getElementById(containerId).innerHTML =
    '<div class="err-box">&#10060; ' + escHTML(msg) + '<br><small style="opacity:.7">Check your connection and try again.</small></div>';
}

function escHTML(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ═══════════════════════════════
   SECTION CARD BUILDER
   Uses a closure-based store so
   copy buttons always have content
═══════════════════════════════ */
var _store = {};
var _storeIdx = 0;

function makeSection(title, content) {
  var key = 'k' + (++_storeIdx);
  var safeContent = content && content.trim() ? content.trim() : '(This section had no content — try regenerating.)';
  _store[key] = safeContent;
  return '<div class="section-result">' +
    '<div class="sr-head"><span>' + title + '</span>' +
    '<button class="btn btn-sm" onclick="copyText(_store[\'' + key + '\'])">Copy</button></div>' +
    '<div class="sr-body">' + escHTML(safeContent) + '</div>' +
    '</div>';
}

/* ═══════════════════════════════
   AI API  (OpenAI-compatible, CORS-enabled)
═══════════════════════════════ */
var _AI_BASE = 'https://api.manus.im/api/llm-proxy/v1';
var _AI_KEY  = 'sk-Kdc58KKRTPCFeJyiAdqqJN';
var _AI_MODEL = 'gemini-2.5-flash';

async function callClaude(systemPrompt, userPrompt, maxTokens) {
  var tokens = maxTokens || 1800;
  var res = await fetch(_AI_BASE + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + _AI_KEY
    },
    body: JSON.stringify({
      model: _AI_MODEL,
      max_tokens: tokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   }
      ]
    })
  });
  if (!res.ok) {
    var errData = {};
    try { errData = await res.json(); } catch(e) {}
    var errMsg = (errData.error && errData.error.message) ? errData.error.message : ('HTTP error ' + res.status);
    throw new Error(errMsg);
  }
  var data = await res.json();
  if (!data.choices || !data.choices.length) throw new Error('No content returned from API.');
  return data.choices[0].message.content || '';
}

/* ═══════════════════════════════
   SECTION EXTRACTOR
   Robust — handles both
   [LABEL]: content  and
   LABEL: content  formats
═══════════════════════════════ */
function extractSection(text, label) {
  if (!text) return '';
  // Try [LABEL] format first
  var escapedLabel = label.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  var re1 = new RegExp('\\[' + escapedLabel + '\\][ \\t]*:?[ \\t]*\\n?([\\s\\S]*?)(?=\\n\\s*\\[[A-Z]|$)', 'i');
  var m = text.match(re1);
  if (m && m[1].trim()) return m[1].trim();
  // Try plain LABEL: format
  var re2 = new RegExp('(?:^|\\n)[ \\t]*' + escapedLabel + '[ \\t]*:[ \\t]*\\n?([\\s\\S]*?)(?=\\n[A-Z][A-Z][A-Z ]+:|\\n\\[|$)', 'i');
  m = text.match(re2);
  if (m && m[1].trim()) return m[1].trim();
  return '';
}

/* ═══════════════════════════════════════════════════════
   TOOL 1 — COMMISSION CALCULATOR (real-time, no API)
═══════════════════════════════════════════════════════ */
function calcCommission() {
  var price  = parseFloat(document.getElementById('salePrice').value)  || 0;
  var rate   = parseFloat(document.getElementById('commRate').value)    || 0;
  var list   = parseFloat(document.getElementById('listSplit').value)   || 50;
  var agent  = parseFloat(document.getElementById('agentSplit').value)  || 80;
  var fees   = parseFloat(document.getElementById('fees').value)        || 0;
  var gross     = price * rate / 100;
  var yourGross = gross * list / 100;
  var afterBkr  = yourGross * agent / 100;
  var net       = afterBkr - fees;
  var fmt = function(v){ return '$' + Math.max(0, v).toLocaleString('en-US', { maximumFractionDigits: 0 }); };
  document.getElementById('grossComm').textContent     = fmt(gross);
  document.getElementById('yourSideGross').textContent = fmt(yourGross);
  document.getElementById('afterBroker').textContent   = fmt(afterBkr);
  document.getElementById('netTakeHome').textContent   = fmt(net);
}

/* ═══════════════════════════════════════════════════════
   TOOL 2 — AI MARKETING ENGINE
═══════════════════════════════════════════════════════ */
async function runMarketing() {
  var specs = document.getElementById('mktSpecs').value.trim();
  var nbhd  = document.getElementById('mktNeighborhood').value.trim();
  var price = document.getElementById('mktPrice').value.trim();
  if (!specs) { alert('Please enter the property specs first.'); return; }

  disableBtn('mktBtn');
  showLoading('mktLoading');
  clearEl('mktResults');

  var system = 'You are a real estate marketing specialist with 40 years of experience and over $2 billion in sales. You have mastered SEO, social media, luxury positioning, and buyer psychology. Respond in plain text only. Do not use markdown, asterisks, pound signs, or bullet hyphens.';

  var prompt = 'Property: ' + specs + '\n' +
    'Neighborhood/Target Market: ' + (nbhd || 'not specified') + '\n' +
    'Listing Price: ' + (price || 'not specified') + '\n\n' +
    'Generate exactly 4 sections. Use these EXACT section labels on their own line:\n\n' +
    '[SEO STRATEGY]\n' +
    'Write 5 high-converting SEO keywords for this property, then write a 90-word SEO meta description optimized for Zillow, Realtor.com, and Google.\n\n' +
    '[MARKET POSITIONING PITCH]\n' +
    'Write a 100-word market positioning pitch for listing presentations. Why does this home beat its competition right now?\n\n' +
    '[BUYER PROFIT ROI ANGLE]\n' +
    'Write a 100-word buyer-facing ROI pitch. Include equity potential, rental comp value, and appreciation angle.\n\n' +
    '[TIKTOK REEL SCRIPT]\n' +
    'Write a complete 30-second TikTok/Instagram Reel script with a strong hook, compelling middle, and call to action. Include relevant emojis. Make it viral-worthy.';

  try {
    var raw = await callClaude(system, prompt, 1800);
    var s1 = extractSection(raw, 'SEO STRATEGY');
    var s2 = extractSection(raw, 'MARKET POSITIONING PITCH');
    var s3 = extractSection(raw, 'BUYER PROFIT ROI ANGLE');
    var s4 = extractSection(raw, 'TIKTOK REEL SCRIPT');
    document.getElementById('mktResults').innerHTML =
      makeSection('📊 SEO Strategy', s1 || raw) +
      makeSection('🏆 Market Positioning Pitch', s2) +
      makeSection('💰 Buyer ROI & Profit Angle', s3) +
      makeSection('📹 TikTok / Reel Script', s4);
  } catch(e) {
    showError('mktResults', e.message);
  }

  hideLoading('mktLoading');
  enableBtn('mktBtn');
}

/* ═══════════════════════════════════════════════════════
   TOOL 3 — OFFER & COUNTER-OFFER GENERATOR
═══════════════════════════════════════════════════════ */
async function runOffer() {
  var askRaw = document.getElementById('offerAsk').value.trim();
  var offRaw = document.getElementById('offerPrice').value.trim();
  if (!askRaw || !offRaw) { alert('Please enter both the asking price and the offer/counter price.'); return; }

  var side  = document.getElementById('offerSide').value;
  var ask   = parseFloat(askRaw);
  var ofr   = parseFloat(offRaw);
  var addr  = document.getElementById('offerAddr').value.trim() || 'the subject property';
  var dom   = document.getElementById('offerDOM').value.trim()  || 'unknown';
  var motiv = document.getElementById('offerMotivation').value;
  var close = document.getElementById('offerClose').value.trim() || 'standard timeline';
  var terms = document.getElementById('offerTerms').value.trim() || 'none';

  var conts = [];
  if (document.getElementById('contInspect').checked)   conts.push('Inspection');
  if (document.getElementById('contFinance').checked)   conts.push('Financing');
  if (document.getElementById('contAppraisal').checked) conts.push('Appraisal');
  var contingencyStr = conts.length ? conts.join(', ') : 'No contingencies';

  var diffPct = ask > 0 ? Math.abs(((ask - ofr) / ask) * 100).toFixed(1) : '0';
  var diffDir = ofr < ask ? 'below asking' : (ofr > ask ? 'above asking' : 'at asking');

  disableBtn('offerBtn');
  showLoading('offerLoading');
  clearEl('offerResults');

  var system = 'You are a master real estate negotiator with 40 years of experience and over 3,000 closed transactions. You know every psychological and tactical lever in a real estate deal. You have coached hundreds of agents on negotiation. Respond in plain text only. No markdown, no asterisks, no pound signs.';

  var prompt = 'I am representing the ' + side + '.\n' +
    'Property: ' + addr + '\n' +
    'List Price: $' + ask.toLocaleString() + '\n' +
    'Offer/Counter Price: $' + ofr.toLocaleString() + ' (' + diffPct + '% ' + diffDir + ')\n' +
    'Days on Market: ' + dom + '\n' +
    'Contingencies: ' + contingencyStr + '\n' +
    'Seller Motivation: ' + motiv + '\n' +
    'Requested Closing: ' + close + '\n' +
    'Special Terms: ' + terms + '\n\n' +
    'Generate exactly 4 sections with these EXACT labels on their own lines:\n\n' +
    '[NEGOTIATION STRATEGY]\n' +
    'Write a 150-word expert negotiation playbook. What leverage do I have? What are the key risks? What is my opening move and fallback position? Be brutally specific.\n\n' +
    '[OFFER LANGUAGE]\n' +
    'Write the actual professional offer language to drop into a contract or email. Formal, specific, and airtight. Reference all contingencies and special terms listed above.\n\n' +
    '[OBJECTION RESPONSES]\n' +
    'Write 3 likely objections the other side will raise, each followed by my exact scripted response. Sharp, confident, and professional.\n\n' +
    '[WALK AWAY POINT]\n' +
    'Tell me exactly where my client\'s walk-away point should be and why, given all the facts above. Be specific with numbers.';

  try {
    var raw = await callClaude(system, prompt, 2000);
    var s1 = extractSection(raw, 'NEGOTIATION STRATEGY');
    var s2 = extractSection(raw, 'OFFER LANGUAGE');
    var s3 = extractSection(raw, 'OBJECTION RESPONSES');
    var s4 = extractSection(raw, 'WALK AWAY POINT');
    document.getElementById('offerResults').innerHTML =
      makeSection('⚔️ Negotiation Strategy', s1 || raw) +
      makeSection('📄 Offer Language', s2) +
      makeSection('🛡️ Objection Responses', s3) +
      makeSection('🚪 Walk-Away Analysis', s4);
  } catch(e) {
    showError('offerResults', e.message);
  }

  hideLoading('offerLoading');
  enableBtn('offerBtn');
}

/* ═══════════════════════════════════════════════════════
   TOOL 4 — FOLLOW-UP EMAIL SEQUENCE
═══════════════════════════════════════════════════════ */
var _emails = [];

async function runFollowUp() {
  var leadType  = document.getElementById('fuLeadType').value;
  var clientName= document.getElementById('fuName').value.trim()      || 'the client';
  var situation = document.getElementById('fuSituation').value.trim() || 'interested buyer or seller, details not provided';
  var agentName = document.getElementById('fuAgent').value.trim()     || 'Your Agent';
  var tone      = document.getElementById('fuTone').value;

  disableBtn('fuBtn');
  showLoading('fuLoading');
  hideEl('fuResults');
  _emails = [];

  var system = 'You are a top real estate agent with 40 years of experience and deep mastery of client psychology. You write emails that feel genuinely personal, never templated. Your sequences convert leads at 3x the industry average. Respond in plain text only. No markdown, no asterisks, no pound signs.';

  // Use numbered delimiters that are highly reliable to parse
  var prompt = 'Client name: ' + clientName + '\n' +
    'Lead type: ' + leadType.replace(/_/g, ' ') + '\n' +
    'Situation: ' + situation + '\n' +
    'Agent name and brokerage: ' + agentName + '\n' +
    'Tone: ' + tone + '\n\n' +
    'Write a 5-email follow-up sequence. Format EXACTLY like this — each email must have these exact delimiter lines:\n\n' +
    '===EMAIL1START===\n' +
    'Subject: [write subject line here]\n' +
    '[write email body here]\n' +
    '===EMAIL1END===\n\n' +
    '===EMAIL2START===\n' +
    'Subject: [write subject line here]\n' +
    '[write email body here]\n' +
    '===EMAIL2END===\n\n' +
    '(continue same pattern for emails 3, 4, 5)\n\n' +
    'Email 1: Immediate reconnect — reference their specific situation, feel personal\n' +
    'Email 2: Value-add — share a genuinely useful market insight or tip for their situation\n' +
    'Email 3: Social proof — brief story about a similar client you helped successfully\n' +
    'Email 4: Soft urgency — a real market condition or opportunity they might miss\n' +
    'Email 5: Final clean check-in — no pressure, keeps the door open professionally\n\n' +
    'Each email: 120-180 words. Make every email feel like a real human wrote it specifically for this client. No generic filler.';

  try {
    var raw = await callClaude(system, prompt, 2400);
    // Parse with reliable delimiters
    for (var i = 1; i <= 5; i++) {
      var re = new RegExp('===EMAIL' + i + 'START===\\s*([\\s\\S]*?)===EMAIL' + i + 'END===', 'i');
      var m = raw.match(re);
      if (m) {
        var block = m[1].trim();
        var subMatch = block.match(/^Subject:\s*(.+)/im);
        var subject = subMatch ? subMatch[1].trim() : 'Email ' + i;
        var body = block.replace(/^Subject:\s*.+[\r\n]?/im, '').trim();
        _emails.push({ num: i, subject: subject, body: body });
      }
    }
    // Fallback if delimiters failed
    if (_emails.length === 0) {
      _emails.push({ num: 1, subject: 'Your Follow-Up Sequence', body: raw });
    }
    renderEmailTab(0);
    showEl('fuResults');
  } catch(e) {
    hideEl('fuResults');
    showError('fuLoading', e.message);
    // Re-show error inside a visible area
    document.getElementById('fuLoading').classList.remove('show');
    document.getElementById('fuBtn').parentNode.insertAdjacentHTML('beforeend',
      '<div class="err-box">&#10060; ' + escHTML(e.message) + '</div>');
  }

  hideLoading('fuLoading');
  enableBtn('fuBtn');
}

function renderEmailTab(idx) {
  if (!_emails.length) return;
  idx = Math.min(Math.max(parseInt(idx, 10), 0), _emails.length - 1);
  var e = _emails[idx];
  // Render tabs
  var tabsHTML = _emails.map(function(em, i){
    return '<button class="etab' + (i === idx ? ' active' : '') + '" onclick="renderEmailTab(' + i + ')">Email ' + em.num + '</button>';
  }).join('');
  document.getElementById('emailTabs').innerHTML = tabsHTML;
  // Counter
  document.getElementById('emailCounter').textContent = 'Email ' + e.num + ' of ' + _emails.length;
  // Body
  document.getElementById('emailBody').textContent = 'Subject: ' + e.subject + '\n\n' + e.body;
}

function copyActiveEmail() {
  var body = document.getElementById('emailBody').textContent;
  copyText(body);
}

/* ═══════════════════════════════════════════════════════
   TOOL 5 — LISTING DESCRIPTION GENERATOR
═══════════════════════════════════════════════════════ */
async function runListing() {
  var features = document.getElementById('ldFeatures').value.trim();
  if (!features) { alert('Please enter the property features.'); return; }

  var bedBath  = document.getElementById('ldBedBath').value.trim() || 'not specified';
  var sqft     = document.getElementById('ldSqft').value.trim();
  var propType = document.getElementById('ldType').value;
  var location = document.getElementById('ldLocation').value.trim() || 'desirable neighborhood';
  var buyer    = document.getElementById('ldBuyer').value;
  var listPrice= document.getElementById('ldPrice').value.trim()  || 'priced competitively';

  disableBtn('ldBtn');
  showLoading('ldLoading');
  clearEl('ldResults');

  var system = 'You are a master real estate copywriter with 40 years of experience. Your listing descriptions consistently sell homes faster and above asking price. You understand buyer psychology, SEO optimization for property platforms, and how to create emotional urgency in copy. Respond in plain text only. No markdown, no asterisks, no pound signs.';

  var prompt = 'Property details:\n' +
    'Beds/Baths: ' + bedBath + '\n' +
    'Square Footage: ' + (sqft ? sqft + ' sqft' : 'not specified') + '\n' +
    'Property Type: ' + propType + '\n' +
    'Features and upgrades: ' + features + '\n' +
    'Location highlights: ' + location + '\n' +
    'Target buyer: ' + buyer + '\n' +
    'Listing price: ' + listPrice + '\n\n' +
    'Generate exactly 4 sections with these EXACT labels on their own lines:\n\n' +
    '[MLS DESCRIPTION]\n' +
    'Write a 200-250 word MLS listing description. Open with the single most emotionally compelling hook sentence. Build desire throughout. End with a strong call to action.\n\n' +
    '[SHORT DESCRIPTION]\n' +
    'Write a 75-word version for social media, flyers, and email blasts. Punchy and compelling.\n\n' +
    '[HEADLINE OPTIONS]\n' +
    'Write 5 compelling marketing headline options, numbered 1 through 5. These are for flyers, ads, and social posts.\n\n' +
    '[SEO SCORE]\n' +
    'Rate this listing description\'s SEO strength from 1 to 10. List the top 5 keywords naturally embedded in the description. Explain specifically what would push the score higher.';

  try {
    var raw = await callClaude(system, prompt, 2000);
    var s1 = extractSection(raw, 'MLS DESCRIPTION');
    var s2 = extractSection(raw, 'SHORT DESCRIPTION');
    var s3 = extractSection(raw, 'HEADLINE OPTIONS');
    var s4 = extractSection(raw, 'SEO SCORE');
    document.getElementById('ldResults').innerHTML =
      makeSection('📝 Full MLS Description (200–250 words)', s1 || raw) +
      makeSection('📱 Short Version — Social / Flyers / Email', s2) +
      makeSection('💡 Headline Options (5)', s3) +
      makeSection('📊 SEO Strength Score & Keywords', s4);
  } catch(e) {
    showError('ldResults', e.message);
  }

  hideLoading('ldLoading');
  enableBtn('ldBtn');
}

/* ═══════════════════════════════════════════════════════
   TOOL 6 — OPEN HOUSE PLAYBOOK
═══════════════════════════════════════════════════════ */
async function runOpenHouse() {
  var addr = document.getElementById('ohAddr').value.trim();
  if (!addr) { alert('Please enter the property address.'); return; }

  var highlights = document.getElementById('ohHighlights').value.trim() || 'great home in a desirable area';
  var budget     = document.getElementById('ohBudget').value.trim()     || '300';
  var visitor    = document.getElementById('ohVisitor').value;
  var dateTime   = document.getElementById('ohDate').value.trim()       || 'this weekend';

  disableBtn('ohBtn');
  showLoading('ohLoading');
  clearEl('ohResults');

  var system = 'You are an elite real estate agent with 40 years of experience specializing in open house strategy. You have hosted over 4,000 open houses and convert leads at 3x the national average. You know instantly how to read visitors, qualify serious buyers, and convert tire-kickers. Respond in plain text only. No markdown, no asterisks, no pound signs.';

  var prompt = 'Property: ' + addr + '\n' +
    'Key Highlights: ' + highlights + '\n' +
    'Budget: $' + budget + '\n' +
    'Expected visitor type: ' + visitor + '\n' +
    'Date and time: ' + dateTime + '\n\n' +
    'Generate exactly 4 sections with these EXACT labels on their own lines:\n\n' +
    '[BUDGET BREAKDOWN]\n' +
    'Show how to allocate the $' + budget + ' budget for maximum ROI. Itemize staging items, food and drinks, signage, digital ads, and any other line items. Include specific dollar amounts for each. Make it practical and ready to execute.\n\n' +
    '[AGENT SCRIPT]\n' +
    'Write a complete word-for-word open house script including: warm greeting at the door, 3 property tour talking points that build desire, how to handle price objections without going below list, and the exact closing line that gets every visitor to give their contact info.\n\n' +
    '[LEAD QUALIFICATION QUESTIONS]\n' +
    'Write 6 questions to ask every visitor that reveal whether they are a real buyer, their timeline, their budget, and their true motivation — without feeling like an interrogation. Number them 1 through 6. Include a brief note on what each question reveals.\n\n' +
    '[FOLLOW UP PLAN]\n' +
    'Write 3 complete follow-up email templates:\n' +
    'Template A: For a Serious Buyer — ready, pre-approved, high interest\n' +
    'Template B: For an Undecided Maybe — showed interest but not committed\n' +
    'Template C: For a Neighbor or Tire-Kicker — probably not buying but may refer someone\n' +
    'Each template should be 80-100 words, ready to copy-paste.';

  try {
    var raw = await callClaude(system, prompt, 2200);
    var s1 = extractSection(raw, 'BUDGET BREAKDOWN');
    var s2 = extractSection(raw, 'AGENT SCRIPT');
    var s3 = extractSection(raw, 'LEAD QUALIFICATION QUESTIONS');
    var s4 = extractSection(raw, 'FOLLOW UP PLAN');
    document.getElementById('ohResults').innerHTML =
      makeSection('💵 Budget Breakdown & ROI Allocation', s1 || raw) +
      makeSection('🎤 Complete Agent Script', s2) +
      makeSection('🔍 Lead Qualification Questions', s3) +
      makeSection('📬 Post-Event Follow-Up Templates (3 types)', s4);
  } catch(e) {
    showError('ohResults', e.message);
  }

  hideLoading('ohLoading');
  enableBtn('ohBtn');
}

/* ═══════════════════════════════════════════════════════
   TOOL 7 — TRANSACTION DEADLINE TRACKER
═══════════════════════════════════════════════════════ */
function runTimeline() {
  var contractVal = document.getElementById('tlContract').value;
  var closeVal    = document.getElementById('tlClose').value;
  var loanType    = document.getElementById('tlType').value;
  var state       = document.getElementById('tlState').value.trim();
  var hoa         = document.getElementById('tlHOA').checked;
  var septic      = document.getElementById('tlSeptic').checked;

  if (!contractVal) { alert('Please enter the contract acceptance date.'); return; }
  if (!closeVal)    { alert('Please enter the target closing date.'); return; }

  var contract  = new Date(contractVal + 'T12:00:00');
  var closing   = new Date(closeVal    + 'T12:00:00');
  var totalDays = Math.round((closing - contract) / 86400000);

  if (totalDays <= 0) { alert('Closing date must be after the contract date.'); return; }
  if (totalDays > 365) { alert('Timeline seems too long (over 1 year). Please check your dates.'); return; }

  function addDays(base, n) {
    var d = new Date(base.getTime());
    d.setDate(d.getDate() + Math.min(n, totalDays));
    return d;
  }
  function fmtDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
  function dotCls(d) {
    var diff = Math.round((d.getTime() - Date.now()) / 86400000);
    if (diff < 0)  return 'dr';
    if (diff <= 3) return 'dr';
    if (diff <= 7) return 'da';
    return 'dg';
  }
  function daysLbl(d) {
    var diff = Math.round((d.getTime() - Date.now()) / 86400000);
    if (diff < 0)   return Math.abs(diff) + 'd ago';
    if (diff === 0) return 'TODAY ⚠️';
    if (diff === 1) return '1 day left ⚠️';
    return diff + ' days left';
  }

  var isCash    = loanType === 'cash';
  var isVA      = loanType === 'va';
  var isFHA     = loanType === 'fha';
  var inspDays  = isCash ? 7  : 10;
  var apprOrd   = isCash ? 0  : (isVA ? 18 : 14);
  var apprDl    = isCash ? 0  : (isVA ? 25 : 21);
  var loanCommit= isCash ? 0  : Math.round(totalDays * 0.72);
  var titleDays = Math.round(totalDays * 0.42);

  var ms = [];
  ms.push({ label: '📋 Contract Acceptance',          date: contract,                     note: 'Day 0 — Start ALL clocks immediately.' });
  if (!isCash) {
    ms.push({ label: '📑 Loan Application Submitted', date: addDays(contract, 3),         note: 'Buyer must formally apply — do not let this drift past day 3.' });
  }
  ms.push({ label: '🔍 Inspection Period Deadline',   date: addDays(contract, inspDays),  note: inspDays + ' days — schedule inspection within 24 hrs of acceptance.' });
  if (hoa) {
    ms.push({ label: '🏘️ HOA Docs Requested',         date: addDays(contract, inspDays),  note: 'Request same day as inspection — boards are slow, budgets take time.' });
  }
  if (septic) {
    ms.push({ label: '💧 Septic Inspection',           date: addDays(contract, inspDays + 2), note: 'Book immediately — certified inspectors book up fast.' });
  }
  if (!isCash) {
    ms.push({ label: '📬 Appraisal Ordered',           date: addDays(contract, apprOrd),  note: 'Day ' + apprOrd + ' — order early, appraisers run 1-2 week backlogs.' });
    ms.push({ label: '🏡 Appraisal Deadline',          date: addDays(contract, apprDl),   note: 'Day ' + apprDl + ' — a low value can kill the deal without a renegotiation clause.' });
    ms.push({ label: '💳 Loan Commitment Deadline',   date: addDays(contract, loanCommit),note: 'Day ' + loanCommit + ' — lender must formally commit. Missing this can void the contract.' });
  }
  ms.push({ label: '📁 Title Search Cleared',          date: addDays(contract, titleDays), note: 'Day ' + titleDays + ' — any lien or cloud on title must be flagged and resolved now.' });
  ms.push({ label: '🔐 Final Walkthrough',             date: addDays(contract, totalDays - 1), note: '24–48 hrs before closing — verify all agreed repairs completed, condition unchanged.' });
  ms.push({ label: '💰 Wire Funds / Cashier\'s Check', date: addDays(contract, totalDays - 1), note: 'Always verify wire instructions by phone — wire fraud is rampant.' });
  ms.push({ label: '🎉 CLOSING DAY',                   date: closing,                     note: 'The finish line — stay on schedule and celebrate your client!' });

  // Sort by date
  ms.sort(function(a, b){ return a.date.getTime() - b.date.getTime(); });

  var html = ms.map(function(m){
    return '<div class="dl-item">' +
      '<div class="ddot ' + dotCls(m.date) + '"></div>' +
      '<div style="flex:1"><div class="dlabel">' + m.label + '</div><div class="dnote">' + m.note + '</div></div>' +
      '<div class="dright"><div class="ddate">' + fmtDate(m.date) + '</div><div class="ddays">' + daysLbl(m.date) + '</div></div>' +
      '</div>';
  }).join('');

  document.getElementById('deadlineList').innerHTML = html;
  showEl('tlOutput');

  // Fire AI tips
  getTimelineTips(loanType, state, totalDays, hoa, septic);
}

async function getTimelineTips(loanType, state, totalDays, hoa, septic) {
  showLoading('tlLoading');
  clearEl('tlAIResults');

  var system = 'You are a real estate transaction coordinator and licensed broker with 40 years of experience and thousands of closed deals across all 50 states. Respond in plain text only. No markdown, no asterisks, no pound signs.';

  var extras = [];
  if (hoa)    extras.push('HOA approval required');
  if (septic) extras.push('septic inspection needed');

  var prompt = 'Transaction details:\n' +
    'Loan type: ' + loanType + '\n' +
    'State: ' + (state || 'not specified') + '\n' +
    'Days from contract to close: ' + totalDays + '\n' +
    (extras.length ? 'Special conditions: ' + extras.join(', ') + '\n' : '') +
    '\nGenerate exactly 2 sections with these EXACT labels on their own lines:\n\n' +
    '[EXPERT TIPS]\n' +
    'Write 5 specific expert warnings and pro tips for this exact transaction type that most agents miss or overlook. Be brutally specific about what kills deals and what saves them. Number each tip 1 through 5.\n\n' +
    '[AGENT CHECKLIST]\n' +
    'Write a 10-item week-by-week action checklist for the agent from contract to close. Organize by timing (Week 1, Week 2, etc.). Number each item.';

  try {
    var raw = await callClaude(system, prompt, 1600);
    var s1 = extractSection(raw, 'EXPERT TIPS');
    var s2 = extractSection(raw, 'AGENT CHECKLIST');
    document.getElementById('tlAIResults').innerHTML =
      makeSection('🧠 Expert Tips for Your Transaction Type', s1 || raw) +
      makeSection('✅ Agent Week-by-Week Action Checklist', s2);
  } catch(e) {
    document.getElementById('tlAIResults').innerHTML =
      '<div class="err-box">Could not load AI tips: ' + escHTML(e.message) + '</div>';
  }

  hideLoading('tlLoading');
}
