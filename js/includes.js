/* ==========================================================================
   Shared chrome injector — header, footer, floating buttons, emergency strip.
   Pages set <body data-page="..." data-prefix="..."> ; data-prefix is "" for
   root pages and "../" for pages inside /services/.
   ========================================================================== */
(function () {
  const body = document.body;
  const page = body.getAttribute("data-page") || "";
  const p = body.getAttribute("data-prefix") || "";

  /* Favicon (injected so every page gets it without editing each <head>) */
  if (!document.querySelector('link[rel="icon"][type="image/png"]')) {
    const fav = document.createElement("link");
    fav.rel = "icon";
    fav.type = "image/png";
    fav.href = p + "assets/favicon.png?v=2";
    document.head.appendChild(fav);
    const apple = document.createElement("link");
    apple.rel = "apple-touch-icon";
    apple.href = p + "assets/favicon.png?v=2";
    document.head.appendChild(apple);
  }

  /* SEO: canonical + geo meta + global @graph structured data (on every page) */
  if (!document.querySelector('link[rel="canonical"]')) {
    const can = document.createElement("link");
    can.rel = "canonical";
    const path = location.pathname.replace(/index\.html$/, "");
    can.href = "https://asnanaqvi.com" + (path || "/");
    document.head.appendChild(can);
  }
  [["geo.position", "26.798121;80.901521"], ["ICBM", "26.798121, 80.901521"], ["geo.region", "IN-UP"], ["geo.placename", "Lucknow"]].forEach(function (g) {
    if (!document.querySelector('meta[name="' + g[0] + '"]')) {
      const m = document.createElement("meta");
      m.name = g[0]; m.content = g[1];
      document.head.appendChild(m);
    }
  });
  /* robots + Open Graph + Twitter — added only if the page lacks them
     (the homepage hardcodes its own; inner pages inherit the full set here) */
  (function () {
    var url = "https://asnanaqvi.com" + (location.pathname.replace(/index\.html$/, "") || "/");
    var dEl = document.querySelector('meta[name="description"]');
    var desc = dEl ? dEl.getAttribute("content") : "";
    var ttl = document.title;
    var img = "https://asnanaqvi.com/assets/about-doctor.png";
    function add(attr, key, val) {
      if (!val || document.querySelector("meta[" + attr + '="' + key + '"]')) return;
      var m = document.createElement("meta");
      m.setAttribute(attr, key); m.setAttribute("content", val);
      document.head.appendChild(m);
    }
    add("name", "robots", "index, follow, max-image-preview:large");
    add("property", "og:type", "website");
    add("property", "og:locale", "en_IN");
    add("property", "og:site_name", "Dr. Asna Zehra Naqvi");
    add("property", "og:title", ttl);
    add("property", "og:description", desc);
    add("property", "og:url", url);
    add("property", "og:image", img);
    add("name", "twitter:card", "summary_large_image");
    add("name", "twitter:title", ttl);
    add("name", "twitter:description", desc);
    add("name", "twitter:image", img);
  })();
  if (!document.getElementById("ld-global")) {
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "ld-global";
    ld.textContent = `{"@context":"https://schema.org","@graph":[
{"@type":"Physician","@id":"https://asnanaqvi.com/#physician","name":"Dr. Asna Zehra Naqvi","image":"https://asnanaqvi.com/assets/about-doctor.png","url":"https://asnanaqvi.com","telephone":"+91-8429021972","priceRange":"₹800–₹1000","medicalSpecialty":["Gynecologic","Obstetric"],"knowsLanguage":["English","Hindi"],"alumniOf":[{"@type":"CollegeOrUniversity","name":"Institute of Medical Sciences, Banaras Hindu University (IMS-BHU), Varanasi"},{"@type":"EducationalOrganization","name":"Royal College of Obstetricians & Gynaecologists, London (MRCOG)"}],"hasCredential":["MBBS","MS (Obstetrics & Gynaecology)","MRCOG (London)","Diploma in IVF & Reproductive Medicine"],"memberOf":{"@type":"Organization","name":"Royal College of Obstetricians & Gynaecologists, London, UK"},"worksFor":{"@id":"https://asnanaqvi.com/#clinic"},"sameAs":["https://www.instagram.com/dr.asna_z_naqvi/","https://www.facebook.com/dr.asnaznaqvi","https://www.youtube.com/@Dr.AsnaZehraNaqvi","https://www.apollo247.com/doctors/dr-asna-zehra-naqvi-5a77eea8-2715-47b3-a2c4-f0ff93fd33ca"]},
{"@type":["MedicalClinic","MedicalBusiness"],"@id":"https://asnanaqvi.com/#clinic","name":"Dr. Asna Zehra Naqvi — Gynaecologist & Obstetrician, Apollomedics Lucknow","telephone":"+91-8429021972","priceRange":"₹800–₹1000","address":{"@type":"PostalAddress","streetAddress":"Apollomedics Super Speciality Hospitals, Kanpur Road, Sector B, Bargawan, LDA Colony","addressLocality":"Lucknow","addressRegion":"UP","postalCode":"226012","addressCountry":"IN"},"geo":{"@type":"GeoCoordinates","latitude":26.798121,"longitude":80.901521},"hasMap":"https://www.google.com/maps?q=26.798121,80.901521","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday"],"opens":"09:00","closes":"17:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Friday","Saturday"],"opens":"09:00","closes":"17:00"}]},
{"@type":"WebSite","@id":"https://asnanaqvi.com/#website","url":"https://asnanaqvi.com","name":"Dr. Asna Zehra Naqvi","inLanguage":"en-IN","publisher":{"@id":"https://asnanaqvi.com/#physician"}}]}`;
    document.head.appendChild(ld);
  }

  /* Per-page schema (MedicalWebPage + Breadcrumb + FAQ) built from the page's own content */
  if (!document.getElementById("ld-page")) {
    const pageUrl = "https://asnanaqvi.com" + location.pathname.replace(/index\.html$/, "");
    const graph = [{
      "@type": "MedicalWebPage", "url": pageUrl, "name": document.title,
      "about": { "@id": "https://asnanaqvi.com/#physician" },
      "reviewedBy": { "@id": "https://asnanaqvi.com/#physician" },
      "lastReviewed": "2026-06-18", "inLanguage": "en-IN"
    }];
    const bc = document.querySelector(".breadcrumb");
    if (bc) {
      const links = Array.from(bc.querySelectorAll("a"));
      const parts = bc.textContent.split("/").map(function (s) { return s.trim(); }).filter(Boolean);
      const items = links.map(function (a, i) {
        return { "@type": "ListItem", "position": i + 1, "name": a.textContent.trim(), "item": a.href };
      });
      items.push({ "@type": "ListItem", "position": items.length + 1, "name": parts[parts.length - 1] || document.title, "item": pageUrl });
      graph.push({ "@type": "BreadcrumbList", "itemListElement": items });
    }
    const faqs = Array.from(document.querySelectorAll(".svc-faq")).map(function (d) {
      const q = d.querySelector("summary"), a = d.querySelector("p");
      return q && a ? { "@type": "Question", "name": q.textContent.trim(), "acceptedAnswer": { "@type": "Answer", "text": a.textContent.trim() } } : null;
    }).filter(Boolean);
    if (faqs.length) graph.push({ "@type": "FAQPage", "mainEntity": faqs });
    const lp = document.createElement("script");
    lp.type = "application/ld+json";
    lp.id = "ld-page";
    lp.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(lp);
  }

  const navItems = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About Doctor", key: "about" },
    { href: "services.html", label: "Services", key: "services" },
    { href: "gallery.html", label: "Gallery", key: "gallery" },
    { href: "contact.html", label: "Contact", key: "contact" },
  ];

  const services = [
    ["services/high-risk-pregnancy.html", "High-Risk Pregnancy"],
    ["services/normal-delivery.html", "Painless Normal Delivery"],
    ["services/cesarean.html", "Cesarean (C-Section)"],
    ["services/laparoscopic-surgery.html", "Laparoscopic Surgery"],
    ["services/infertility-ivf.html", "Infertility / IVF"],
    ["services/pcos-irregular-periods.html", "PCOS & Irregular Periods"],
    ["services/ovarian-cyst.html", "Ovarian Cyst Treatment"],
    ["services/menopausal-health.html", "Menopausal Health"],
    ["services/adolescent-health.html", "Adolescent Health"],
  ];

  const navLinks = navItems
    .map((it) => {
      const active = it.key === page ? " active" : "";
      if (it.key === "services") {
        const dd = services
          .map((s) => `<li><a href="${p}${s[0]}">${s[1]}</a></li>`)
          .join("");
        return `<li class="has-dropdown"><a href="${p}services.html" class="${active}">Services</a><ul class="dropdown">${dd}</ul></li>`;
      }
      return `<li><a href="${p}${it.href}" class="${active}">${it.label}</a></li>`;
    })
    .join("");

  const header = `
  <div class="emergency-strip">
    <i class="fa-solid fa-truck-medical"></i> 24/7 Emergency &amp; Maternity Care &mdash;
    <a href="tel:+918429021972">Call +91 84290 21972</a>
  </div>
  <header class="site-header">
    <div class="container">
      <a class="logo" href="${p}index.html" aria-label="Dr. Asna Zehra Naqvi home">
        <img src="${p}assets/logo.png?v=2" alt="Dr. Asna Zehra Naqvi — Obstetrics &amp; Gynaecology" class="site-logo"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <span class="logo-text" style="display:none;">
          <span class="logo-name">Dr. Asna Zehra Naqvi</span>
          <span class="logo-tag">Senior Consultant, Obstetrics &amp; Gynaecology</span>
        </span>
      </a>
      <nav class="main-nav" aria-label="Primary"><ul>${navLinks}</ul></nav>
      <div class="header-cta">
        <a href="https://www.apollo247.com/doctors/dr-asna-zehra-naqvi-5a77eea8-2715-47b3-a2c4-f0ff93fd33ca" target="_blank" rel="noopener" class="btn btn--primary">Book Appointment</a>
        <button class="hamburger" aria-label="Open menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <img src="${p}assets/logo.png?v=2" alt="Dr. Asna Zehra Naqvi" class="footer-logo">
          <h4>Dr. Asna Zehra Naqvi</h4>
          <p style="color:#b8a9b3;">Senior Consultant, Obstetrics &amp; Gynaecology. Compassionate, internationally trained women's health care in Lucknow.</p>
          <div class="socials">
            <a href="https://www.instagram.com/dr.asna_z_naqvi/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.facebook.com/dr.asnaznaqvi" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.youtube.com/@Dr.AsnaZehraNaqvi" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="https://wa.me/918429021972" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="tel:+918429021972" aria-label="Call"><i class="fa-solid fa-phone"></i></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="${p}index.html">Home</a></li>
            <li><a href="${p}about.html">About Doctor</a></li>
            <li><a href="${p}services.html">Services</a></li>
            <li><a href="${p}gallery.html">Gallery</a></li>
            <li><a href="${p}contact.html">Contact</a></li>
            <li><a href="https://www.apollo247.com/doctors/dr-asna-zehra-naqvi-5a77eea8-2715-47b3-a2c4-f0ff93fd33ca" target="_blank" rel="noopener">Book Appointment</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="foot-contact">
            <li><i class="fa-solid fa-location-dot"></i> Apollo Medics Hospitals, Sector B, LDA Colony, Kanpur&nbsp;&ndash;&nbsp;Lucknow Road, Lucknow, Uttar Pradesh 226012</li>
            <li><i class="fa-solid fa-phone"></i> <a href="tel:+918429021972">+91 84290 21972</a></li>
            <li><i class="fa-solid fa-clock"></i> Mon&ndash;Wed &amp; Fri&ndash;Sat, 9 AM&ndash;5 PM (Thu &amp; Sun closed)</li>
            <li><i class="fa-brands fa-instagram"></i> <a href="https://www.instagram.com/dr.asna_z_naqvi/" target="_blank" rel="noopener">@dr.asna_z_naqvi</a></li>
            <li><i class="fa-solid fa-globe"></i> <a href="https://www.apollohospitals.com" target="_blank" rel="noopener">apollohospitals.com</a></li>
          </ul>
          <div class="foot-map">
            <iframe
              title="Dr. Asna Zehra Naqvi location map"
              src="https://www.google.com/maps?q=26.798121,80.901521&z=16&output=embed"
              width="100%" height="170" style="border:0;display:block;border-radius:12px;" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
      <div class="footer-bottom">&copy; <span id="year">2026</span> Dr. Asna Zehra Naqvi. All rights reserved.</div>
    </div>
  </footer>`;

  const floating = `
  <div class="floating">
    <a class="call" href="tel:+918429021972" aria-label="Call now"><i class="fa-solid fa-phone"></i></a>
    <a class="whatsapp" href="https://wa.me/918429021972" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
  </div>`;

  const headerMount = document.getElementById("site-header-mount");
  const footerMount = document.getElementById("site-footer-mount");
  if (headerMount) headerMount.innerHTML = header;
  if (footerMount) footerMount.innerHTML = footer + floating;
})();
