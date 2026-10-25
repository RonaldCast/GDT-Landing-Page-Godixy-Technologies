import type { CompanySize, ServiceId, ServiceInterest } from './config';

const sid = (id: ServiceId) => id;

export const en = {
  meta: {
    title: 'Godixy Technologies | Custom software, integration and continuous support',
    description:
      'Godixy Technologies builds, integrates and supports custom software, web and mobile apps for companies that need a reliable technology partner. Explicit scope, verifiable delivery, continuous support.',
  },
  nav: {
    skipToContent: 'Skip to content',
    primary: 'Primary navigation',
    links: {
      services: 'Services',
      process: 'How we work',
      audience: 'Who we serve',
      about: 'About',
      engagement: 'Engagement',
      faq: 'FAQ',
    },
    cta: 'Start a project',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    switchTo: 'Cambiar a español',
  },
  hero: {
    eyebrow: 'Software & technology partner',
    titleLead: 'Software that ships,',
    titleHighlight: 'runs in production',
    titleTail: 'and stays supported.',
    subtitle:
      'We design, build, integrate and maintain custom software, web and mobile applications for companies that need a technology partner they can verify, not just trust.',
    primaryCta: 'Start a project',
    secondaryCta: 'Explore services',
    highlights: ['Explicit written scope', 'Acceptance criteria per milestone', 'Support after go-live'],
    sceneLabel: 'Animated illustration of modular blocks inspired by the Godixy logo',
  },
  pillars: {
    label: 'Why Godixy',
    title: 'A delivery model built on commitments you can check',
    items: [
      {
        value: 'Precision',
        title: 'Explicit scope',
        text: 'Every proposal states what is included, what is not, and how each deliverable will be accepted. What is written is what gets demonstrated and delivered.',
      },
      {
        value: 'Continuity',
        title: 'Continuous support',
        text: 'Go-live is not the finish line. We keep systems running with defined support channels and owners, so every incident gets a response and a close.',
      },
      {
        value: 'Clarity',
        title: 'Verifiable delivery',
        text: 'Work is delivered in small, demonstrable increments, and every report separates facts, pending items and risks.',
      },
    ],
  },
  services: {
    label: 'Services',
    title: 'Everything your software needs, from idea to operation',
    intro:
      'Pick a service to see what it covers. Most engagements combine several of them under a single accountable team.',
    listLabel: 'Godixy services',
    outcomeLabel: 'What you get',
    cta: 'Talk about this service',
    items: [
      {
        id: sid('custom-software'),
        title: 'Custom software, web & mobile apps',
        summary:
          'Tailor-made digital solutions, corporate web platforms and mobile applications built around how your business actually works.',
        points: [
          'Web platforms and internal business applications',
          'Mobile apps for customers and field teams',
          'Corporate websites with CMS integration',
          'Strict TypeScript front ends and well-structured back ends',
        ],
        outcome: 'A production-ready product that fits your process, with code and documentation you own.',
      },
      {
        id: sid('integration'),
        title: 'Systems implementation & integration',
        summary:
          'We connect the platforms you already use so data flows reliably, and we put specific modules into production.',
        points: [
          'API, webhook and third-party service integrations',
          'Online payment gateway implementation',
          'Interoperability between legacy and modern systems',
          'Failure handling and traceability for every integration',
        ],
        outcome: 'Systems that talk to each other, with clear behaviour when an external service fails.',
      },
      {
        id: sid('support'),
        title: 'Continuous support & maintenance',
        summary:
          'Preventive and corrective support after go-live, with defined channels and owners so every incident gets an answer and a close.',
        points: [
          'Corrective fixes and preventive maintenance',
          'Dependency, security and platform updates',
          'Defined channels, owners and incident follow-up',
          'Evolutionary improvements through the same quality flow',
        ],
        outcome: 'Continuity: your system keeps operating and improving long after launch.',
      },
      {
        id: sid('consulting'),
        title: 'Technology consulting',
        summary:
          'Strategic technical advice to define explicit scope, assess feasibility and set clear acceptance criteria before you invest.',
        points: [
          'Discovery and requirements workshops',
          'Feasibility analysis and technical risk review',
          'Architecture proportional to real complexity',
          'Roadmaps with measurable objectives',
        ],
        outcome: 'Decisions grounded in facts, with a scope everyone understands and can approve.',
      },
      {
        id: sid('automation'),
        title: 'Process automation',
        summary:
          'We digitize and optimize operational workflows to remove manual work, reduce errors and improve efficiency.',
        points: [
          'Mapping of current processes and bottlenecks',
          'Workflow digitization and approvals',
          'Automated notifications, reports and data sync',
          'Automation tools only where they add real value',
        ],
        outcome: 'Less manual effort, fewer errors and processes you can measure.',
      },
      {
        id: sid('cloud'),
        title: 'Cloud infrastructure & IT services',
        summary:
          'Setup and administration of cloud hosting, SSL certificate management and technical training for your team.',
        points: [
          'Cloud hosting setup and administration',
          'Domains, DNS and SSL certificate management',
          'Deployment pipelines, backups and rollback plans',
          'Technical training for your staff',
        ],
        outcome: 'Infrastructure that is secure, documented and operable by your team.',
      },
    ],
  },
  process: {
    label: 'How we work',
    title: 'The Godixy Delivery Framework',
    intro:
      'Ten phases and nine approval gates take every project from the first conversation to stable operation. Select a phase to see what happens and what must be true to move on.',
    principlesTitle: 'Six principles behind every project',
    principles: [
      'Understand before developing',
      'Agree before committing',
      'Design before scaling',
      'Deliver incrementally',
      'Build quality in',
      'Operate what we build',
    ],
    phaseLabel: 'Phase',
    gateLabel: 'Gate',
    ongoingLabel: 'Ongoing',
    deliverablesLabel: 'Key deliverables',
    exitLabel: 'To move on',
    previous: 'Previous phase',
    next: 'Next phase',
    phases: [
      {
        title: 'Contact & qualification',
        text: 'We understand your company, the problem you want to solve and its impact, and confirm we are the right partner.',
        deliverables: ['Opportunity summary', 'Identified problem', 'Recommended next step'],
        exit: 'A clear problem and an opportunity worth investigating.',
      },
      {
        title: 'Discovery & requirements',
        text: 'We map your current process, users, rules, integrations and risks, and prioritize what the first version must include.',
        deliverables: ['Functional and non-functional requirements', 'Process maps', 'Prioritized feature list'],
        exit: 'You validate the problem, requirements and priorities.',
      },
      {
        title: 'Proposal & contracting',
        text: 'Scope, effort, timeline, payments, responsibilities and acceptance criteria become a clear written commitment.',
        deliverables: ['Proposal with explicit scope', 'Milestones and payment schedule', 'Change-control rules'],
        exit: 'Proposal and terms approved by you.',
      },
      {
        title: 'Planning & kickoff',
        text: 'We turn the agreed scope into a visible plan: backlog, milestones, owners, environments and communication cadence.',
        deliverables: ['Project charter', 'Prioritized backlog', 'Definition of Ready and Done'],
        exit: 'Team, access, priorities and tools are ready.',
      },
      {
        title: 'Design & architecture',
        text: 'User flows, interfaces and a technical architecture proportional to the real complexity, without over-engineering.',
        deliverables: ['Approved designs', 'Architecture and decision records', 'Security and test plans'],
        exit: 'A viable solution and validated designs.',
      },
      {
        title: 'Iterative development',
        text: 'Small, reviewable increments with code review, automated tests and a strict Definition of Done.',
        deliverables: ['Demonstrable increments', 'Reviewed and tested code', 'Regular demos'],
        exit: 'Each increment passes quality checks.',
      },
      {
        title: 'QA & client acceptance',
        text: 'We verify functional behaviour and technical risks, then you run the agreed acceptance scenarios in staging.',
        deliverables: ['Test evidence', 'Defect log', 'Acceptance sign-off'],
        exit: 'Acceptance criteria met, no blocking defects.',
      },
      {
        title: 'Production release',
        text: 'A controlled, verifiable release with a deployment checklist, rollback plan and post-release checks.',
        deliverables: ['Deployment runbook', 'Rollback plan', 'Post-release validation'],
        exit: 'The main business flow works in production.',
      },
      {
        title: 'Stabilization & handover',
        text: 'A hypercare period, user training and a formal handover of documentation, access and responsibilities.',
        deliverables: ['User and technical guides', 'Transferred access', 'Formal closure'],
        exit: 'Deliverables received and operating responsibility defined.',
      },
      {
        title: 'Support & evolution',
        text: 'Corrective, preventive and evolutionary support keeps your system stable and improving over time.',
        deliverables: ['Support plan', 'Maintenance reports', 'Improvement roadmap'],
        exit: 'Ongoing partnership.',
      },
    ],
    tiersTitle: 'The process scales with your project',
    tiersIntro:
      'Controls are proportional to complexity, data sensitivity, integrations and the impact of a failure, not just budget.',
    tiersLabel: 'Framework level',
    aspectLabel: 'Aspect',
    tiers: [
      {
        name: 'Lite',
        when: 'Small projects with clear requirements, few integrations and low risk.',
        examples: 'Landing pages, corporate sites, contact forms, simple dashboards.',
        rows: [
          'Essential requirements meeting',
          'Brief architecture',
          'Essential validations',
          'Release checklist',
          'Basic warranty and conditions',
        ],
      },
      {
        name: 'Standard',
        when: 'Medium projects with several modules, business rules, databases, users and APIs.',
        examples: 'Quotation systems, client portals, custom CRMs, budgeting systems.',
        rows: [
          'Formal functional document',
          'Functional and technical design',
          'Automated test suite and UAT',
          'CI/CD with documented rollback',
          'Agreed stabilization plan',
        ],
      },
      {
        name: 'Advanced',
        when: 'Complex projects with critical integrations, high availability, sensitive data or multiple companies.',
        examples: 'Multi-tenant SaaS platforms, integrated clinical systems, enterprise AI assistants.',
        rows: [
          'In-depth analysis and risk register',
          'Detailed architecture with ADRs',
          'Extended testing by risk',
          'Gradual release and reinforced recovery',
          'Contractual SLA and formal operation',
        ],
      },
    ],
    aspects: ['Discovery', 'Design', 'Testing', 'Deployment', 'Support'],
  },
  audience: {
    label: 'Who we serve',
    title: 'One partner for business leaders and technical teams',
    intro: 'We speak the language of the boardroom and the server room, and we serve companies of every size.',
    groups: [
      {
        title: 'Executives & decision makers',
        text: 'You need predictable outcomes, not technical noise.',
        points: [
          'Written scope, timeline and budget before work starts',
          'Weekly updates separating facts, pending items and risks',
          'Explicit change control that protects your investment',
        ],
      },
      {
        title: 'IT & engineering teams',
        text: 'You need a partner that respects your stack and your standards.',
        points: [
          'Proportional architecture and documented decisions',
          'Code review, automated tests and CI/CD by default',
          'Clean handover: docs, access and runbooks',
        ],
      },
    ],
    sizesTitle: 'Built for companies of every size',
    sizes: [
      { title: 'Small businesses', text: 'Digitize processes and launch your first platform with a lean, controlled scope.' },
      { title: 'Medium companies', text: 'Integrate systems, automate operations and scale what already works.' },
      { title: 'Large organizations', text: 'Extend your IT capacity with a team that follows formal gates and evidence.' },
    ],
  },
  about: {
    label: 'About Godixy',
    title: 'Professionalism proven in the craft',
    missionTitle: 'Mission',
    mission:
      'We develop, implement, support and maintain software solutions and web and mobile applications for companies that need a technology partner. We do it through consulting, systems integration and process automation, guaranteeing explicit scope, verifiable delivery and continuous support.',
    visionTitle: 'Vision',
    vision:
      'Within five to ten years, to be recognized by companies that need software development, integration or support as the benchmark for trust and professionalism: the chosen option because the promised scope is met, the system runs in production and support continues after launch.',
    valuesTitle: 'Our values',
    values: [
      {
        title: 'Precision',
        quote: 'Professionalism is proven in the craft.',
        text: 'The written scope matches exactly what is demonstrated and delivered, and every milestone has explicit acceptance criteria.',
      },
      {
        title: 'Continuity',
        quote: 'Trust is sustained beyond the sale.',
        text: 'After go-live we provide support and maintenance with defined channels and owners, so every incident gets a response and a close.',
      },
      {
        title: 'Clarity',
        quote: 'Trust rests on verifiable facts.',
        text: 'Proposals and reports clearly separate facts, pending items and risks. Every commitment has a date, an owner and a definition of done.',
      },
    ],
  },
  engagement: {
    label: 'Engagement',
    title: 'Engagement models that match your level of certainty',
    intro: 'We recommend the model that fits how defined your project is, and we put it in writing.',
    models: [
      { title: 'Fixed price', text: 'When requirements and scope are well defined.' },
      { title: 'Time & materials', text: 'When requirements evolve or technical uncertainty is significant.' },
      { title: 'Paid discovery', text: 'When you need analysis, design or a feasibility proof before committing to build.' },
      { title: 'Monthly service', text: 'For maintenance, support, improvements and continuous evolution.' },
    ],
    supportTitle: 'Support plans after go-live',
    supportIntro: 'Monthly plans with defined hours, response times, included tasks and exclusions.',
    plans: [
      {
        name: 'Essential',
        text: 'Preventive maintenance and a limited volume of support.',
        points: ['Dependency and security updates', 'Backups and operational checks', 'Corrective support'],
      },
      {
        name: 'Business',
        text: 'Maintenance, priority support and improvements within a bank of hours.',
        points: ['Everything in Essential', 'Priority response', 'Evolutionary improvements'],
      },
      {
        name: 'Managed',
        text: 'Broader operational management, monitoring and agreed service commitments.',
        points: ['Everything in Business', 'Monitoring and alerting', 'Agreed service commitments'],
      },
    ],
    plansNote: 'Pricing and service levels are defined per project based on infrastructure, criticality and workload.',
    cta: 'Ask for a proposal',
  },
  faq: {
    label: 'FAQ',
    title: 'Questions companies ask us',
    items: [
      {
        q: 'How do you estimate cost and timeline?',
        a: 'After discovery we estimate effort per module and activity, identify external dependencies and present a proposal with milestones, payment schedule and acceptance criteria. If uncertainty is high we recommend a paid discovery first.',
      },
      {
        q: 'Who owns the source code?',
        a: 'Ownership of code, licences and third-party services is stated explicitly in every proposal, together with confidentiality and data-protection obligations.',
      },
      {
        q: 'What happens when we need something that was not in scope?',
        a: 'We register the request, analyse its impact on effort and schedule and present a change proposal. Nothing changes without your explicit approval; sometimes it is simply a trade between features.',
      },
      {
        q: 'Do you work with our existing systems and IT team?',
        a: 'Yes. Integration and interoperability are core services. We review your APIs, databases and constraints during discovery and document every decision for your team.',
      },
      {
        q: 'What support do we get after launch?',
        a: 'Every project includes a stabilization period. After that, monthly support plans cover corrective, preventive and evolutionary work with defined channels and owners.',
      },
      {
        q: 'Do you work in English and Spanish?',
        a: 'Yes. We work with clients in both languages, and documentation can be delivered in either.',
      },
    ],
  },
  contact: {
    label: 'Start a project',
    title: "Tell us what you need to solve",
    intro:
      'Share a few details and we will reply with the recommended next step. No commitment, and no sales pressure.',
    emailLabel: 'Prefer email?',
    email: 'hello@godixy.com',
    nextTitle: 'What happens next',
    nextSteps: [
      'We review your request and reply by email.',
      'A short call to understand the problem, users and impact.',
      'A recommended path: discovery, proposal or a quick answer.',
    ],
    form: {
      name: 'Full name',
      email: 'Work email',
      company: 'Company',
      companySize: 'Company size',
      companySizePlaceholder: 'Select a size',
      companySizes: {
        small: 'Small (1-50 people)',
        medium: 'Medium (51-250 people)',
        large: 'Large (251-1000 people)',
        enterprise: 'Enterprise (1000+ people)',
      } satisfies Record<CompanySize, string>,
      service: 'Service of interest',
      servicePlaceholder: 'Select a service',
      services: {
        'custom-software': 'Custom software, web & mobile apps',
        integration: 'Systems implementation & integration',
        support: 'Continuous support & maintenance',
        consulting: 'Technology consulting',
        automation: 'Process automation',
        cloud: 'Cloud infrastructure & IT services',
        other: 'Something else',
      } satisfies Record<ServiceInterest, string>,
      message: 'What do you need to solve?',
      messageHint: 'The problem, how you handle it today and any deadline. 20 to 2000 characters.',
      consent: 'I agree that Godixy Technologies may use this information to reply to my request.',
      consentPrivacy: 'Read the privacy notice',
      honeypot: 'Leave this field empty',
      optional: 'optional',
      submit: 'Send request',
      sending: 'Sending...',
      successTitle: 'Thank you. Your request was sent.',
      successText: 'We will review it and reply to your email with the recommended next step.',
      sendAnother: 'Send another request',
      errorSummary: 'Please review the highlighted fields.',
      errors: {
        name: 'Please enter your name (2 to 100 characters).',
        email: 'Please enter a valid email address.',
        company: 'Company name must be 200 characters or fewer.',
        companySize: 'Please select your company size.',
        service: 'Please select a service.',
        message: 'Please describe your need in 20 to 2000 characters.',
        consent: 'Please accept so we can reply to you.',
      },
      failureTitle: 'We could not send your request.',
      failureGeneric: 'Something went wrong. Please try again in a moment.',
      failureRateLimit: 'Too many requests. Please wait a few minutes and try again.',
      failureUnavailable: 'Our form is temporarily unavailable.',
      mailtoFallback: 'Send it by email instead',
      mailtoSubject: 'New project request',
    },
  },
  footer: {
    tagline: 'Custom software, integration and continuous support for companies that need a technology partner.',
    navTitle: 'Explore',
    contactTitle: 'Contact',
    legalName: 'Godixy Technologies EIRL',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
    privacy: 'Privacy notice',
  },
  privacy: {
    title: 'Privacy notice',
    description: 'What information the Godixy Technologies website collects and how it is used.',
    intro: 'This notice explains what information this website collects and how Godixy Technologies EIRL uses it.',
    updatedLabel: 'Last updated',
    sections: [
      {
        title: 'Information you send us',
        text: 'When you use the contact form we receive your name, email address, company (optional), company size, the service you are interested in, your message and the language of the page. If you write to us directly, we receive the content of your email.',
      },
      {
        title: 'How we use it',
        text: 'We use this information only to reply to your request and, if you ask for one, to prepare a proposal. We do not sell it or use it for advertising.',
      },
      {
        title: 'Where it goes',
        text: 'The form delivers your request by email to our team inbox. This website does not keep a database of submissions. To protect the form against abuse, the server briefly keeps your network address in memory to limit repeated requests.',
      },
      {
        title: 'Cookies',
        text: 'This website uses a single cookie, named "lang", to remember the language you choose. It only contains the language code and expires after one year. We do not use analytics, advertising or third-party tracking cookies.',
      },
      {
        title: 'Your choices',
        text: 'You can ask us to access, correct or delete the information you sent us by writing to the address below.',
      },
    ],
    back: 'Back to the home page',
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or was moved.',
    cta: 'Go to the home page',
  },
};

export type Dictionary = typeof en;
