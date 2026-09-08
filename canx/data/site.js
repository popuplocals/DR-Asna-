'use strict';

/**
 * All homepage content for Can X Global lives here so copy can be edited
 * without touching templates. Paths are relative to the WordPress site
 * (WP_BASE_URL) unless they are absolute URLs.
 */

module.exports = {
  meta: {
    title: 'Recruitment and Immigration Experts in Canada | Can X Global',
    description:
      'Can X Global offers expert recruitment and immigration services in Canada, helping businesses and individuals with work permits, LMIA, PR and more.',
    siteName: 'Can X Global',
    tagline: 'Simplifying immigration',
  },

  contact: {
    phone: '+1 778 564 3555',
    phoneHref: 'tel:+17785643555',
    fax: '+1 888 752 2023',
    email: 'help@canxglobal.com',
    address: '504 - 13761 96 Ave',
    city: 'Surrey BC V3V 0E8, Canada',
    hours: 'Mon – Fri: 09:00 AM – 05:00 PM PST',
    hoursClosed: 'Saturday & Sunday: Closed',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=13761+96+Ave+Unit+504+Surrey+BC+V3V+0E8',
  },

  social: [
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/canxglobal/' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/canxglobal/' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://ca.linkedin.com/company/canxglobal' },
    { name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/@canxglobal' },
    { name: 'X', icon: 'x', url: 'https://x.com/canxglobal' },
  ],

  /** Primary navigation. Mirrors the WordPress menu structure. */
  nav: [
    {
      label: 'Employers',
      href: 'employers/',
      children: [
        { label: 'Hire Local', href: 'hire-local/', desc: 'Local professionals who know your market' },
        { label: 'Hire Global', href: 'hire-global/', desc: 'International talent, end to end' },
        { label: 'Hire Remote', href: 'hire-remote/', desc: 'Flexible remote staffing' },
        { label: 'Hire TFW', href: 'lmia/', desc: 'LMIA-based temporary foreign workers' },
        { label: 'Due Diligence', href: 'diligence/', desc: 'Screening and compliance services' },
      ],
    },
    { label: 'Job Seekers', href: 'job-seekers/' },
    {
      label: 'Immigration',
      href: 'category/immigration/',
      mega: true,
      columns: [
        {
          title: 'Permanent Residency',
          href: 'permanent-residency/',
          links: [
            { label: 'Express Entry', href: 'permanent-residency/express-entry/' },
            { label: 'Provincial Nominee Program', href: 'permanent-residency/provincial-nominee-program/' },
            { label: 'Family Sponsorship', href: 'permanent-residency/family-sponsorship/' },
            { label: 'Start-Up Visa', href: 'permanent-residency/start-up-visa/' },
            { label: 'Humanitarian & Compassionate', href: 'permanent-residency/humanitarian-and-compassionate/' },
          ],
        },
        {
          title: 'Work Permit',
          href: 'work-permit/',
          links: [
            { label: 'LMIA Based Work Permit', href: 'work-permit/lmia-based-work-permit/' },
            { label: 'International Free Trade Agreements', href: 'work-permit/international-free-trade-agreements/' },
            { label: 'Intra-Company Transfer', href: 'work-permit/intra-company-transfer/' },
            { label: 'International Mobility Program', href: 'work-permit/international-mobility-program/' },
            { label: 'Post Graduation Work Permit', href: 'work-permit/post-graduation-work-permit/' },
            { label: 'Bridging Open Work Permit', href: 'work-permit/bridging-open-work-permit/' },
            { label: 'International Experience Canada', href: 'work-permit/international-experience-canada/' },
          ],
        },
        {
          title: 'More Pathways',
          href: 'global-mobility/',
          links: [
            { label: 'Study in Canada', href: 'study/' },
            { label: 'Visit Canada & Super Visa', href: 'visit/' },
            { label: 'Canadian Citizenship', href: 'citizenship/' },
            { label: 'Global Mobility', href: 'global-mobility/' },
            { label: 'LMIA', href: 'lmia/' },
          ],
        },
      ],
    },
    { label: 'Why Can X', href: 'why-can-x/' },
    { label: 'Our Story', href: 'our-story/' },
    { label: 'Team', href: 'team/' },
    { label: 'Blog', href: 'blog/' },
    { label: 'Contact Us', href: 'contact-us/' },
  ],

  cta: { label: 'Get Started', href: 'get-started/' },

  hero: {
    eyebrow: 'Recruitment & Immigration Experts in Canada',
    title: 'We Help Companies Thrive and People Succeed',
    highlight: 'Real People, Real Solutions.',
    text: 'Expert Recruitment & Immigration Solutions Powered by People and Technology. With licensed RCICs and tailored support, we make the path to your Canadian dream simple, secure and within reach.',
    primary: { label: 'I want to hire', href: 'employers/' },
    secondary: { label: 'I want to immigrate', href: 'get-started/' },
    badges: ['Licensed RCICs', 'BBB Accredited', 'Trusted in 30+ Countries'],
  },

  stats: [
    { value: '10+', label: 'Years of Experience' },
    { value: '30+', label: 'Countries Served' },
    { value: '10,000+', label: 'Clients Supported' },
    { value: '2016', label: 'Helping People Since' },
  ],

  paths: {
    title: 'Two Ways We Can Help',
    subtitle: 'Whether you are building a team or building a life in Canada, Can X has a dedicated path for you.',
    items: [
      {
        icon: 'briefcase',
        title: 'For Employers',
        text: 'Find, hire and retain local, global, remote and TFW talent with expert sourcing, screening and LMIA support.',
        link: { label: 'Explore Recruitment', href: 'employers/' },
      },
      {
        icon: 'user',
        title: 'For Job Seekers',
        text: 'Discover top opportunities across Canada tailored to your skills, experience and long-term goals.',
        link: { label: 'Find Jobs', href: 'job-seekers/' },
      },
      {
        icon: 'globe',
        title: 'For Immigration',
        text: 'Work permits, Express Entry, PNP, study and visitor visas, family sponsorship and citizenship — handled by licensed RCICs.',
        link: { label: 'Explore Immigration', href: 'category/immigration/' },
      },
    ],
  },

  recruitment: {
    eyebrow: 'Recruitment',
    title: 'Canada Recruitment Agency',
    subtitle:
      'Our recruitment services deliver the right local or global candidates when you need them. From startups to global enterprises, we connect you with talent across construction, healthcare, tech and beyond.',
    services: [
      {
        icon: 'map-pin',
        title: 'Hire Local',
        text: 'Local employees bring an intimate understanding of your market, customer preferences and stakeholder expectations, and foster trust and credibility.',
        href: 'hire-local/',
      },
      {
        icon: 'globe',
        title: 'Hire Global',
        text: 'Tap into top talent worldwide with expert recruitment and staffing solutions under the TFWP, IMP and more.',
        href: 'hire-global/',
      },
      {
        icon: 'laptop',
        title: 'Hire Remote',
        text: 'Flexible and efficient remote staffing so you can scale your team without borders or overhead.',
        href: 'hire-remote/',
      },
      {
        icon: 'file-check',
        title: 'Hire TFW (LMIA)',
        text: 'We make high and low wage LMIA hiring of Temporary Foreign Workers hassle-free, from job advertising to approval.',
        href: 'lmia/',
      },
    ],
    link: { label: 'View all employer services', href: 'employers/' },
  },

  immigration: {
    eyebrow: 'Immigration',
    title: 'Immigration Solutions Made Easy',
    subtitle:
      'Our team of RCIC certified experts provides professional guidance, legal immigration support and personalized visa services tailored to your goals.',
    services: [
      {
        icon: 'file-check',
        title: 'Work Permit',
        text: 'LMIA-based, ICT, IMP, PGWP, BOWP and IEC work permits for workers and the employers who need them.',
        href: 'work-permit/',
      },
      {
        icon: 'home',
        title: 'Permanent Residency',
        text: 'Express Entry, Provincial Nominee Programs, Start-Up Visa and Humanitarian & Compassionate applications.',
        href: 'permanent-residency/',
      },
      {
        icon: 'graduation',
        title: 'Study in Canada',
        text: 'Study permits and pathways that turn a Canadian education into a Canadian career.',
        href: 'study/',
      },
      {
        icon: 'plane',
        title: 'Visit Canada',
        text: 'Temporary Resident Visas, Business Visitor Visas and the Super Visa for parents and grandparents.',
        href: 'visit/',
      },
      {
        icon: 'users',
        title: 'Family Sponsorship',
        text: 'Sponsor your spouse, children, parents and grandparents and reunite your family in Canada.',
        href: 'permanent-residency/family-sponsorship/',
      },
      {
        icon: 'flag',
        title: 'Citizenship',
        text: 'Become a Canadian Citizen — unlock opportunities, freedom and a future without limits.',
        href: 'citizenship/',
      },
    ],
    link: { label: 'View all immigration services', href: 'category/immigration/' },
  },

  why: {
    eyebrow: 'Why Choose Can X',
    title: 'More Than a Recruitment Firm — A Trusted Partner',
    text: 'Backed by over a decade of experience, we blend a human-first approach with innovative technology to understand every candidate and every client, and align their goals with the businesses that value them.',
    points: [
      { icon: 'shield', title: 'Licensed RCIC Experts', text: 'Every case is handled legally, transparently and with your best interests in mind by CICC-licensed consultants.' },
      { icon: 'heart', title: 'Human-First Support', text: 'No bots — just genuine people who understand your goals and guide you at every step.' },
      { icon: 'zap', title: 'People + Technology', text: 'Smart tools and streamlined processes make recruitment and immigration faster and stress-free.' },
      { icon: 'check', title: 'Integrity & Compliance', text: 'Guided by integrity, legal compliance and innovation so every connection is seamless and impactful.' },
    ],
    link: { label: 'Learn why clients choose Can X', href: 'why-can-x/' },
  },

  story: {
    eyebrow: 'Our Story',
    title: 'Turning Canadian Dreams into Reality for Over 10 Years',
    text: 'Since 2016, Can X Global has been helping companies and people from Surrey, British Columbia. Our founder Anuj Sengar navigated Canada\'s immigration system entirely on his own — no consultant, no guide, no margin for error — and built Can X with a simple but powerful vision: We help Companies Thrive, People Succeed!',
    founder: {
      name: 'Anuj Sengar',
      role: 'Founder & Licensed RCIC (R515178)',
      href: 'team/anuj-sengar/',
    },
    link: { label: 'Read our journey', href: 'our-story/' },
  },

  process: {
    eyebrow: 'How It Works',
    title: 'Get Started in Four Simple Steps',
    steps: [
      { title: 'Tell us your goal', text: 'Fill out the Get Started form or schedule a call with our team.' },
      { title: 'Consultation', text: 'Expert guidance from day one with consultations starting at just $49.' },
      { title: 'Tailored plan', text: 'We assess eligibility, prepare documents and map the best pathway for you.' },
      { title: 'Application & success', text: 'Full representation or one-time support until you reach your goal.' },
    ],
  },

  testimonials: {
    eyebrow: 'Testimonials',
    title: 'What Our Clients Say',
    items: [
      {
        quote:
          'I wholeheartedly recommend Can X to anyone seeking immigration services. Their professionalism, expertise and commitment to client satisfaction are truly recommendable.',
        name: 'Immigration Client',
        meta: 'Permanent Residency',
      },
      {
        quote:
          'They helped us with our spousal visa from start to finish. They all are really professional and helpful, and always kept us updated.',
        name: 'Spousal Sponsorship Client',
        meta: 'Family Sponsorship',
      },
      {
        quote:
          'Can X made our LMIA and work permit process hassle-free. We had the right workers on site faster than we expected.',
        name: 'Employer',
        meta: 'Hire TFW · Construction',
      },
    ],
  },

  blog: {
    eyebrow: 'Blog',
    title: 'Latest Immigration & Recruitment Insights',
    posts: [
      {
        title: 'Easy Canada LMIA Work Permit: 2026 Guide',
        excerpt: 'A step-by-step guide to applying for a Canada work permit with LMIA approval.',
        href: 'step-by-step-guide-to-applying-for-a-canada-work-permit-with-lmia-approval/',
        tag: 'Work Permit',
      },
      {
        title: 'Can You Change Jobs on an LMIA Work Permit in Canada?',
        excerpt: 'The complete 2026 rules for workers and employers.',
        href: 'changing-jobs-lmia-work-permit-canada-2026-2/',
        tag: 'LMIA',
      },
      {
        title: 'AI in Canadian Immigration: Trends & Insights 2026',
        excerpt: 'How technology is changing the way applications are prepared and processed.',
        href: 'immigration-blogs/immigration-ai/',
        tag: 'Immigration',
      },
      {
        title: 'Difference Between CICC-Licensed RCICs and Unregulated Agents',
        excerpt: 'Why working with a licensed consultant protects your future in Canada.',
        href: 'difference-between-cicc-licensed-rcics-and-unregulated-immigration-agents/',
        tag: 'Immigration',
      },
    ],
    link: { label: 'Read all articles', href: 'blog/' },
  },

  getStarted: {
    eyebrow: 'Get Started',
    title: 'Ready to Hire or Immigrate?',
    text: 'Fill out the form for a free initial assessment and personalized solutions, or schedule a call with our team.',
    interests: [
      'Hire Local / Global / Remote talent',
      'Hire Temporary Foreign Workers (LMIA)',
      'Work Permit',
      'Permanent Residency / Express Entry / PNP',
      'Study Permit',
      'Visitor Visa / Super Visa',
      'Family Sponsorship',
      'Citizenship',
      'Other',
    ],
    scheduleLink: { label: 'Schedule a Call', href: 'get-started/' },
  },

  footer: {
    about:
      'Can X Global Solutions specializes in making your Canadian recruitment and immigration journey smooth and stress-free. Trusted by companies and clients from 30+ countries.',
    columns: [
      {
        title: 'Employers',
        links: [
          { label: 'Hire Local', href: 'hire-local/' },
          { label: 'Hire Global', href: 'hire-global/' },
          { label: 'Hire Remote', href: 'hire-remote/' },
          { label: 'Hire TFW', href: 'lmia/' },
          { label: 'Due Diligence', href: 'diligence/' },
        ],
      },
      {
        title: 'Immigration',
        links: [
          { label: 'Work Permit', href: 'work-permit/' },
          { label: 'Permanent Residency', href: 'permanent-residency/' },
          { label: 'Study', href: 'study/' },
          { label: 'Visit', href: 'visit/' },
          { label: 'Citizenship', href: 'citizenship/' },
          { label: 'Global Mobility', href: 'global-mobility/' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Why Can X', href: 'why-can-x/' },
          { label: 'Our Story', href: 'our-story/' },
          { label: 'Team', href: 'team/' },
          { label: 'Job Seekers', href: 'job-seekers/' },
          { label: 'Blog', href: 'blog/' },
          { label: 'Contact Us', href: 'contact-us/' },
        ],
      },
    ],
    legal: [
      { label: 'Privacy Policy', href: 'privacy-policy/' },
      { label: 'Terms & Conditions', href: 'terms-and-conditions/' },
    ],
    copyright: 'Can X Global Solutions Inc. All rights reserved.',
  },
};
