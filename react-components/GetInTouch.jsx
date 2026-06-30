"use client";

/*
 * GetInTouch.jsx — "Get in Touch" contact section
 * Timeline-over-map for Dr. Asna Zehra Naqvi.
 *
 * Self-contained: pure React + CSS (no animation library).
 * Icons via lucide-react. No consultation fees anywhere.
 *
 * Brand is LOCKED to the live site:
 *   teal #0F6B6E · deep #084D50 · bright #2A8A8D · gold #C6A75E
 *   headings: Playfair Display   ·   body: Montserrat
 * (Make sure those two Google fonts are loaded in your app, e.g.
 *  https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Montserrat:wght@300;400;500;600;700 )
 *
 * Edit the CONTACT_ITEMS and SOCIALS arrays below to update details.
 */

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CalendarDays,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
} from "lucide-react";

/* ----------------------------- EDITABLE DATA ----------------------------- */

const CLINIC_ADDRESS =
  "Apollomedics Super Speciality Hospitals, Sector B, LDA Colony, Kanpur Road, Lucknow, Uttar Pradesh 226012";

// Keyless Google Maps embed (no API key required)
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  CLINIC_ADDRESS
)}&z=16&output=embed`;

// Directions deep-link (opens in a new tab)
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  CLINIC_ADDRESS
)}`;

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/dr.asna_z_naqvi/" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/dr.asnaznaqvi" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@Dr.AsnaZehraNaqvi" },
];

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: CLINIC_ADDRESS,
  },
  {
    icon: Phone,
    label: "Call Directly",
    value: "+91 84290 21972",
    href: "tel:+918429021972",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: "https://wa.me/918429021972",
  },
  {
    icon: Clock,
    label: "Clinic Hours",
    value: "Mon–Wed & Fri–Sat · 9 AM – 5 PM (Thu & Sun closed)",
  },
  {
    icon: CalendarDays,
    label: "Book Online",
    value: "Book via Apollo 24|7 · apollohospitals.com",
    href: "https://www.apollohospitals.com",
  },
  {
    icon: Instagram,
    label: "Follow",
    value: "@dr.asna_z_naqvi",
    href: "https://www.instagram.com/dr.asna_z_naqvi/",
    socials: SOCIALS,
  },
];

/* ------------------------------- COMPONENT ------------------------------- */

export default function GetInTouch() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Respect reduced-motion: show everything immediately, skip the observer.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target); // trigger once
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`gi-section${inView ? " gi-in" : ""}`}
      aria-label="Get in touch"
    >
      <style>{CSS}</style>

      {/* Map background */}
      <iframe
        className="gi-map"
        title="Clinic location map"
        src={MAP_EMBED_URL}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="gi-tint" aria-hidden="true" />

      {/* Content */}
      <div className="gi-inner">
        <div className="gi-panel">
          <p className="gi-eyebrow">Contact</p>
          <h2 className="gi-heading">Get in Touch</h2>
          <p className="gi-intro">
            For appointments, queries or follow-ups, reach out using any of the
            details below. For medical emergencies, please call directly.
          </p>

          <ol className="gi-timeline">
            <span className="gi-line" aria-hidden="true" />

            {CONTACT_ITEMS.map((item, i) => {
              const Icon = item.icon;
              const isExternal = item.href && item.href.startsWith("http");
              return (
                <li className="gi-item" key={item.label} style={{ "--i": i }}>
                  <span className="gi-node">
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  </span>

                  <div className="gi-itemtext">
                    <p className="gi-label">{item.label}</p>

                    {item.href ? (
                      <a
                        className="gi-value gi-value-link"
                        href={item.href}
                        {...(isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="gi-value">{item.value}</p>
                    )}

                    {item.socials && (
                      <div className="gi-socials">
                        {item.socials.map((s) => {
                          const SIcon = s.icon;
                          return (
                            <a
                              key={s.label}
                              className="gi-social"
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={s.label}
                            >
                              <SIcon size={18} strokeWidth={2} aria-hidden="true" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <a
            className="gi-cta"
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--i": CONTACT_ITEMS.length }}
          >
            <span>Get Directions</span>
            <ArrowRight size={18} strokeWidth={2.2} className="gi-cta-arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- STYLES -------------------------------- */

const CSS = `
.gi-section {
  /* ---- Brand tokens (locked to the site) ---- */
  --gi-teal: #0F6B6E;
  --gi-teal-deep: #084D50;
  --gi-teal-bright: #2A8A8D;
  --gi-gold: #C6A75E;
  --gi-ink: #0C4E4B;
  --gi-text: #36413f;
  --gi-muted: #5d6b69;
  --gi-font-head: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --gi-font-body: 'Montserrat', system-ui, -apple-system, sans-serif;

  /* ---- Motion ---- */
  --gi-ease: cubic-bezier(.2, .8, .2, 1);
  --gi-spring: cubic-bezier(.34, 1.4, .5, 1);
  --gi-reveal-base: .45s;
  --gi-reveal-step: .13s;

  position: relative;
  overflow: hidden;
  min-height: 660px;
  display: flex;
  align-items: center;
  font-family: var(--gi-font-body);
  color: var(--gi-text);
  isolation: isolate;
}

/* ---- Map background ---- */
.gi-map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  z-index: 0;
  pointer-events: none;            /* purely decorative bg; use the CTA to open maps */
  filter: saturate(.96) contrast(1.02);
}

/* ---- Teal tint overlay: stronger on the left, fading right ---- */
.gi-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(8, 77, 80, .94) 0%,
      rgba(12, 78, 75, .80) 34%,
      rgba(15, 107, 110, .42) 64%,
      rgba(15, 107, 110, .14) 100%
    );
}

/* ---- Layout ---- */
.gi-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 64px 24px;
}

/* ---- Frosted glass panel ---- */
.gi-panel {
  max-width: 560px;
  padding: 40px 40px 38px;
  border-radius: 22px;
  background: rgba(255, 255, 255, .82);
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
  backdrop-filter: blur(16px) saturate(1.1);
  border: 1px solid rgba(255, 255, 255, .55);
  box-shadow: 0 30px 70px rgba(8, 60, 62, .34);

  /* reveal: fade + scale in first */
  opacity: 0;
  transform: scale(.94) translateY(14px);
  transition: opacity .8s var(--gi-ease), transform .8s var(--gi-ease);
}
.gi-in .gi-panel { opacity: 1; transform: none; }

/* ---- Heading + intro ---- */
.gi-eyebrow {
  margin: 0 0 8px;
  font-family: var(--gi-font-body);
  font-weight: 600;
  font-size: .74rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--gi-gold);
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .6s var(--gi-ease) .18s, transform .6s var(--gi-ease) .18s;
}
.gi-heading {
  margin: 0 0 12px;
  font-family: var(--gi-font-head);
  font-weight: 600;
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  line-height: 1.12;
  letter-spacing: -.01em;
  color: var(--gi-ink);
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .65s var(--gi-ease) .24s, transform .65s var(--gi-ease) .24s;
}
.gi-intro {
  margin: 0 0 30px;
  max-width: 46ch;
  font-size: .98rem;
  line-height: 1.65;
  color: var(--gi-muted);
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .65s var(--gi-ease) .32s, transform .65s var(--gi-ease) .32s;
}
.gi-in .gi-eyebrow,
.gi-in .gi-heading,
.gi-in .gi-intro { opacity: 1; transform: none; }

/* ---- Timeline ---- */
.gi-timeline {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* the gold -> teal connecting line, drawn downward */
.gi-line {
  position: absolute;
  top: 22px;
  bottom: 30px;
  left: 21px;               /* aligns with node centre (44px node / 2 - 1px) */
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--gi-gold) 0%, var(--gi-teal-bright) 55%, var(--gi-teal) 100%);
  transform: scaleY(0);
  transform-origin: top center;
  transition: transform 1.1s var(--gi-ease) .35s;
}
.gi-in .gi-line { transform: scaleY(1); }

.gi-item {
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 18px;
  align-items: start;
  padding-bottom: 26px;
}
.gi-item:last-child { padding-bottom: 0; }

/* icon node sitting on the line */
.gi-node {
  position: relative;
  z-index: 1;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: var(--gi-teal);
  box-shadow: 0 0 0 5px rgba(255, 255, 255, .82), 0 6px 16px rgba(8, 60, 62, .28);

  /* pop-in with overshoot */
  opacity: 0;
  transform: scale(.3);
  transition:
    transform .6s var(--gi-spring) calc(var(--gi-reveal-base) + var(--i) * var(--gi-reveal-step)),
    opacity   .4s var(--gi-ease)   calc(var(--gi-reveal-base) + var(--i) * var(--gi-reveal-step)),
    background-color .3s var(--gi-ease),
    box-shadow .3s var(--gi-ease);
}
.gi-in .gi-node { opacity: 1; transform: scale(1); }

/* node text slides in just after its node */
.gi-itemtext {
  padding-top: 1px;
  opacity: 0;
  transform: translateX(-12px);
  transition:
    opacity   .5s var(--gi-ease) calc(var(--gi-reveal-base) + var(--i) * var(--gi-reveal-step) + .09s),
    transform .5s var(--gi-ease) calc(var(--gi-reveal-base) + var(--i) * var(--gi-reveal-step) + .09s);
}
.gi-in .gi-itemtext { opacity: 1; transform: none; }

.gi-label {
  margin: 0 0 3px;
  font-weight: 600;
  font-size: .72rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--gi-teal);
}
.gi-value {
  margin: 0;
  font-size: .96rem;
  line-height: 1.5;
  color: var(--gi-ink);
}
a.gi-value-link {
  text-decoration: none;
  transition: color .22s var(--gi-ease);
}
a.gi-value-link:hover { color: var(--gi-gold); }

/* hover: node fills teal -> gold + scales up */
.gi-item:hover .gi-node {
  background: var(--gi-gold);
  transform: scale(1.1);
  box-shadow: 0 0 0 5px rgba(255, 255, 255, .9), 0 10px 22px rgba(150, 110, 40, .4);
}

/* social icon buttons */
.gi-socials {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.gi-social {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--gi-teal);
  background: rgba(15, 107, 110, .10);
  border: 1px solid rgba(15, 107, 110, .22);
  transition: transform .35s var(--gi-spring), background-color .25s var(--gi-ease),
              color .25s var(--gi-ease), border-color .25s var(--gi-ease), box-shadow .25s var(--gi-ease);
}
.gi-social:hover {
  color: #fff;
  background: var(--gi-gold);
  border-color: var(--gi-gold);
  transform: translateY(-4px) scale(1.06);
  box-shadow: 0 10px 20px rgba(150, 110, 40, .34);
}

/* ---- CTA ---- */
.gi-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  padding: 14px 28px;
  border-radius: 999px;
  background: var(--gi-teal);
  color: #fff;
  font-weight: 600;
  font-size: .96rem;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(15, 107, 110, .32);

  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity .6s var(--gi-ease) calc(var(--gi-reveal-base) + var(--i) * var(--gi-reveal-step) + .15s),
    transform .35s var(--gi-spring),
    background-color .25s var(--gi-ease),
    box-shadow .3s var(--gi-ease);
}
.gi-in .gi-cta { opacity: 1; transform: translateY(0); }
.gi-cta:hover {
  background: var(--gi-teal-deep);
  transform: translateY(-3px);
  box-shadow: 0 16px 34px rgba(8, 77, 80, .42);
}
.gi-cta-arrow { transition: transform .3s var(--gi-ease); }
.gi-cta:hover .gi-cta-arrow { transform: translateX(5px); }

/* ---- Responsive: panel full-width, tint becomes top->bottom darken ---- */
@media (max-width: 768px) {
  .gi-section { min-height: 0; }
  .gi-inner { padding: 40px 16px; }
  .gi-panel {
    max-width: none;
    width: 100%;
    padding: 30px 22px 30px;
    border-radius: 18px;
  }
  .gi-tint {
    background:
      linear-gradient(
        180deg,
        rgba(8, 77, 80, .55) 0%,
        rgba(8, 77, 80, .82) 55%,
        rgba(8, 77, 80, .94) 100%
      );
  }
}

/* ---- Reduced motion: show everything static ---- */
@media (prefers-reduced-motion: reduce) {
  .gi-panel,
  .gi-eyebrow,
  .gi-heading,
  .gi-intro,
  .gi-node,
  .gi-itemtext,
  .gi-cta {
    opacity: 1 !important;
    transform: none !important;
    transition: background-color .25s ease, color .25s ease,
                border-color .25s ease, box-shadow .25s ease !important;
  }
  .gi-line {
    transform: scaleY(1) !important;
    transition: none !important;
  }
}
`;
