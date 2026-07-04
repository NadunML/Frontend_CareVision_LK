import React, { useState } from 'react';
import {
  Cpu, Camera, Users, ShieldAlert, Flame, BellRing,
  FileText, Settings, ChevronDown, ChevronUp,
  CheckCircle, AlertTriangle, Zap, BookOpen,
  MonitorPlay, UserCheck, Activity, Lock,
  LayoutDashboard, Video, ShieldCheck, Info, User
} from 'lucide-react';
import './AboutTab.css';

/* ── FAQ Data ───────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: 'How does the system ensure patient data privacy under medical regulations?',
    a: 'CareVision LK is deployed as a fully on-premise edge appliance. All live video stream processing, face detection encoding, and hazard analysis are computed locally. No video footage, patient face photographs, or analytical data are transmitted outside the hospital\'s private local network. This aligns with standard data protection protocols for medical environments.'
  },
  {
    q: 'What is the average latency of the live AI monitoring modules?',
    a: 'The platform\'s processing loop averages between 150ms to 350ms per frame depending on server hardware load. By utilizing frame-skipping and local CPU scheduling, the system remains highly responsive without bottlenecking network bandwidth, refreshing telemetry to the frontend feed every 3 to 5 seconds.'
  },
  {
    q: 'Can we configure different AI monitoring zones for individual cameras?',
    a: 'Yes. AI modules can be toggled independently for each CCTV node in the \'Live CCTV Feeds\' interface. For example, you can enable Face Mask compliance only on entrance cameras, Patient Identification on ward cameras, and Fire & Smoke Detection globally.'
  },
  {
    q: 'How are alerts handled and documented in the platform database?',
    a: 'When a violation is detected (e.g. fire/smoke trigger or unauthorized ward wander), a persistent record is generated in the system database. The event flashes red across the dashboard in real-time. Admins must manually mark events as \'Resolved\' after verification, automatically updating the historical archive for PDF generation.'
  },
  {
    q: 'What are the network requirements for high-resolution cameras?',
    a: 'The system processes streams dynamically. To prevent network overhead, high-resolution cameras (1080p and higher) are downscaled to 320px width internally before inference, meaning standard IP/RTSP cameras require less than 4 Mbps bandwidth on the hospital intranet.'
  },
];

/* ── Module Data ───────────────────────────────── */
const AI_MODULES = [
  {
    icon: <Users size={28} color="#0D6EFD" />,
    color: 'blue',
    title: 'Patient Identification',
    tech: 'OpenCV + Deep Learning',
    desc: 'Detects registered patients in live feeds and flags unauthorized zone breaches for high-risk individuals.',
    cams: 'Cameras 1 – 5',
  },
  {
    icon: <ShieldAlert size={28} color="#10b981" />,
    color: 'green',
    title: 'Mask Detection',
    tech: 'MobileNetV2 Architecture',
    desc: 'Analyzes facial regions to enforce PPE compliance and restrict access for unmasked personnel.',
    cams: 'Cameras 1 – 5',
  },
  {
    icon: <Flame size={28} color="#ef4444" />,
    color: 'red',
    title: 'Fire & Smoke Detection',
    tech: 'YOLOv8 Nano Model',
    desc: 'Real-time bounding-box processing to detect fire or smoke hazards. On detection, other active AI modules (Patient ID & Mask Detection) are automatically turned off to prioritize hazard monitoring.',
    cams: 'Cameras 1 – 5',
  },
];

/* ── User Guide Steps ──────────────────────────── */
const GUIDE_STEPS = [
  {
    num: '01',
    icon: <MonitorPlay size={22} color="#0D6EFD" />,
    title: 'Connect Your Cameras',
    desc: 'Go to Settings → enter the IP stream URL for each camera node (up to 9 supported). Click Save to activate the feed.',
  },
  {
    num: '02',
    icon: <UserCheck size={22} color="#0D6EFD" />,
    title: 'Register Patients',
    desc: 'Navigate to Patient Management → click "+ Register New Patient" → fill in ID, name, ward and upload a clear face photo. The system encodes the facial embedding automatically.',
  },
  {
    num: '03',
    icon: <Cpu size={22} color="#0D6EFD" />,
    title: 'Enable AI Modules',
    desc: 'Open the Live CCTV Feeds tab. Use the toggle switches on each camera card to enable Patient ID, Mask Detection, or Fire Detection per camera.',
  },
  {
    num: '04',
    icon: <Activity size={22} color="#0D6EFD" />,
    title: 'Monitor the Dashboard',
    desc: 'The Dashboard Overview shows live stats — active alerts, mask violations, and patient counts. The Alert Feed updates every 5 seconds automatically.',
  },
  {
    num: '05',
    icon: <BellRing size={22} color="#0D6EFD" />,
    title: 'Respond to Alerts',
    desc: 'When an alert appears, review the type and priority. Use "✓ Resolve" to close it, or for fire alerts navigate to Fire Monitoring to notify emergency services.',
  },
  {
    num: '06',
    icon: <FileText size={22} color="#0D6EFD" />,
    title: 'Export Reports',
    desc: 'Head to Reports & Logs to filter events by date. Click "Download PDF" to generate a printable incident report for compliance or review.',
  },
];

/* ── Component ─────────────────────────────────── */
const AboutTab = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="about-wrapper">

      {/* ── Hero Banner ── */}
      <div className="about-hero">
        <div className="about-hero-badge">
          <ShieldCheck size={13} /> Local Deployment Instance
        </div>
        <h1 className="about-hero-title">CareVision LK</h1>
        <p className="about-hero-subtitle">
          Hospital Edge AI Security &amp; Monitoring Platform
        </p>
        <p className="about-hero-desc">
          Enterprise edge intelligence designed for continuous patient safety monitoring, real-time fire and hazard warnings, and PPE compliance enforcement across ward zones. Powered by lightweight deep learning architectures optimized for local hospital server infrastructure.
        </p>
        <div className="about-hero-pills">
          <span className="about-pill about-pill--blue"><Zap size={12} /> Edge Intel</span>
          <span className="about-pill about-pill--green"><CheckCircle size={12} /> Local Processing</span>
          <span className="about-pill about-pill--red"><AlertTriangle size={12} /> Hazard Monitoring</span>
          <span className="about-pill about-pill--grey"><Camera size={12} /> Intranet Streams</span>
        </div>
      </div>

      {/* ── Two-col quick stats ── */}
      <div className="about-quick-stats">
        {[
          { label: 'Camera Nodes', value: 'Up to 9', icon: <Camera size={20} color="#0D6EFD" /> },
          { label: 'AI Modules', value: '3 Active', icon: <Cpu size={20} color="#10b981" /> },
          { label: 'Alert Refresh', value: 'Every 5s', icon: <Activity size={20} color="#ef4444" /> },
          { label: 'Access Control', value: 'Admin ACL', icon: <Lock size={20} color="#f59e0b" /> },
        ].map((s) => (
          <div className="about-qs-card" key={s.label}>
            <div className="about-qs-icon">{s.icon}</div>
            <div>
              <div className="about-qs-value">{s.value}</div>
              <div className="about-qs-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Modules ── */}
      <div className="card-box about-section">
        <div className="about-section-heading">
          <Cpu size={20} color="#0D6EFD" />
          <h2>AI Security Modules</h2>
        </div>
        <p className="about-section-sub">
          Three independent deep-learning models run concurrently across all active camera nodes.
          Each can be toggled per-camera from the Live CCTV Feeds tab.
        </p>
        <div className="about-modules-grid">
          {AI_MODULES.map((m) => (
            <div className={`about-module-card about-module-card--${m.color}`} key={m.title}>
              <div className="about-module-icon">{m.icon}</div>
              <div className={`about-module-tech about-module-tech--${m.color}`}>{m.tech}</div>
              <h3 className={`about-module-title about-module-title--${m.color}`}>{m.title}</h3>
              <p className="about-module-desc">{m.desc}</p>
              <div className="about-module-cam"><Camera size={12} /> {m.cams}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── User Guide ── */}
      <div className="card-box about-section">
        <div className="about-section-heading">
          <BookOpen size={20} color="#0D6EFD" />
          <h2>How To Use — Quick Start Guide</h2>
        </div>
        <p className="about-section-sub">
          Follow these steps to get CareVision LK fully operational in your facility.
        </p>
        <div className="about-guide-grid">
          {GUIDE_STEPS.map((step) => (
            <div className="about-guide-card" key={step.num}>
              <div className="about-guide-num">{step.num}</div>
              <div className="about-guide-icon">{step.icon}</div>
              <h4 className="about-guide-title">{step.title}</h4>
              <p className="about-guide-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation Reference ── */}
      <div className="card-box about-section">
        <div className="about-section-heading">
          <Settings size={20} color="#0D6EFD" />
          <h2>Navigation Reference</h2>
        </div>
        <p className="about-section-sub">Quick overview of every tab in the sidebar.</p>
        <div className="about-nav-table-wrap">
          <table className="data-table about-nav-table">
            <thead>
              <tr>
                <th>Tab</th>
                <th>Purpose</th>
                <th>Key Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { icon: <LayoutDashboard size={14} color="#0D6EFD" />, tab: 'Dashboard',          purpose: 'Central command view — live stats & alert feed',      actions: 'Resolve alerts, view AI module status' },
                { icon: <Video         size={14} color="#0D6EFD" />, tab: 'Live CCTV Feeds',     purpose: 'View all connected camera streams',                  actions: 'Toggle AI modules per camera' },
                { icon: <Users         size={14} color="#0D6EFD" />, tab: 'Patient Management',  purpose: 'Register and manage patient records',                actions: 'Add / delete patients, upload face photos' },
                { icon: <ShieldCheck   size={14} color="#0D6EFD" />, tab: 'Mask Detection',       purpose: 'Real-time mask compliance logs',                     actions: 'Review access granted / denied events' },
                { icon: <Flame         size={14} color="#ef4444" />, tab: 'Fire Monitoring',      purpose: 'Fire & smoke detection events',                      actions: 'Resolve alerts, notify emergency services' },
                { icon: <FileText      size={14} color="#0D6EFD" />, tab: 'Reports & Logs',       purpose: 'Historical data and incident reports',               actions: 'Filter by date, download PDF reports' },
                { icon: <User          size={14} color="#0D6EFD" />, tab: 'User Management',      purpose: 'View authorized admin accounts',                     actions: 'Review system access list' },
                { icon: <Settings      size={14} color="#0D6EFD" />, tab: 'Settings',             purpose: 'Camera IP configuration',                            actions: 'Add / update / remove camera streams' },
                { icon: <Info          size={14} color="#0D6EFD" />, tab: 'About',                purpose: 'System documentation & usage guide',                 actions: 'Read this guide' },
              ].map((row) => (
                <tr key={row.tab}>
                  <td className="about-nav-tab-cell">
                    <span className="about-nav-tab-icon">{row.icon}</span>
                    {row.tab}
                  </td>
                  <td>{row.purpose}</td>
                  <td className="about-nav-action-cell">{row.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="card-box about-section">
        <div className="about-section-heading">
          <BellRing size={20} color="#0D6EFD" />
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="about-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div
              className={`about-faq-item ${openFaq === i ? 'about-faq-item--open' : ''}`}
              key={i}
            >
              <button
                className="about-faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === i && (
                <div className="about-faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer Credit ── */}
      <div className="about-footer">
        <div className="about-footer-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D6EFD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span>CareVision LK</span>
        </div>
        <p>Hospital Edge AI Security Platform &nbsp;·&nbsp; Version 1.0.0 &nbsp;·&nbsp; Built for Sri Lanka Healthcare</p>
      </div>

    </div>
  );
};

export default AboutTab;
