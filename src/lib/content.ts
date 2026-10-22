// All copy sourced from sdinnovations.co (home, /services, /case-studies, /contact).

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export const contact = {
  email: "hello@sdinnovations.co",
  address: [
    "Workafella Highstreet, 431, Anna Salai",
    "Teynampet, Chennai, Tamil Nadu",
    "India – 600018",
  ],
  hours: "Monday – Friday, 11am – 7pm",
  linkedin: "https://www.linkedin.com/company/sdinnovations/",
  services: ["Design", "Development", "ServiceNow", "Marketing", "Other"],
};

export const hero = {
  eyebrow: "Innovative solutions for modern challenges",
  title: "Transforming Ideas into Impactful Solutions",
  body: "We combine innovative thinking with cutting-edge technology to help businesses solve complex problems.",
  cta: "Get started",
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  body: string;
};

export const services: Service[] = [
  {
    slug: "software-development",
    title: "Tailored Software Engineering",
    short: "Custom platforms, products and integrations engineered around how your business works.",
    tagline: "Custom software solutions designed and built to address your unique business challenges.",
    body: "Tailored applications for specific business problems — from web apps to complex enterprise systems — built for efficiency and growth.",
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    short: "Pipelines, warehouses and governance that turn scattered data into reliable decisions.",
    tagline: "Build robust data pipelines and infrastructure to unlock insights from your data.",
    body: "Scalable pipelines, warehouses and lakes that deliver timely, accurate insights for decision-making.",
  },
  {
    slug: "cybersecurity",
    title: "Strategic Cybersecurity Advisory",
    short: "Risk assessment, architecture reviews and security roadmaps that protect what you build.",
    tagline: "Protect your digital assets with comprehensive security assessments and solutions.",
    body: "Vulnerability assessments, penetration testing, security architecture design and incident response planning.",
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    short: "Modernising legacy systems and processes so teams can move faster with less friction.",
    tagline: "Navigate your organisation's digital journey with strategic planning and execution.",
    body: "Reimagining business models, optimising processes and implementing technologies that improve customer experience and operational efficiency.",
  },
  {
    slug: "team-augmentation",
    title: "Team Augmentation",
    short: "Senior engineers and specialists who plug into your team and ship from week one.",
    tagline: "Scale your team with experienced professionals to accelerate project delivery.",
    body: "Engineers, architects and project managers who integrate with your team to speed delivery and fill skill gaps.",
  },
  {
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    short: "Practical AI — from models to production — applied where it creates measurable value.",
    tagline: "Implement cutting-edge AI solutions to automate processes and drive decision making.",
    body: "Custom machine learning models, natural language processing solutions and intelligent automation systems.",
  },
  {
    slug: "servicenow",
    title: "ServiceNow Solutions",
    short: "Finance and supply chain modernisation on the ServiceNow Platform.",
    tagline: "Streamline ERP-centric processes like source-to-pay, unify operations and modernise workflows.",
    body: "We use the ServiceNow Platform's workflow, automation and AI capabilities to modernise finance and supply chain operations.",
  },
];

export const techStack = [
  "React",
  "Node.js",
  "Python",
  "AWS",
  ".NET",
  "Java",
  "Angular",
  "Vue.js",
  "Go",
  "Docker",
  "Kubernetes",
  "MongoDB",
];

export const about = {
  label: "About",
  title: "Humanising technology!",
  paragraphs: [
    "SD Innovations is a team of tech pioneers. Founded in 2014 as Studio Diseno, we started out crafting digital experiences — and never stopped putting people at the centre of the technology we build.",
    "Today we are an innovation firm delivering enterprise technology ecosystems, partnering with ambitious startups and Fortune 500 enterprises alike.",
  ],
};

export const why = {
  label: "Why SD Innovations",
  title: "Technical excellence, industry expertise, and a commitment to your success.",
  items: [
    { icon: "team" as const, title: "Expert Team", body: "Specialists with deep expertise across technologies and domains." },
    { icon: "agile" as const, title: "Agile Methodology", body: "Iterative, collaborative delivery that creates value early and often." },
    { icon: "quality" as const, title: "Quality Focus", body: "Rigorous testing and code reviews on everything we ship." },
    { icon: "partnership" as const, title: "Long-term Partnership", body: "Lasting relationships focused on your ongoing success." },
  ],
};

export const cta = {
  title: "Let's Build What's Next.",
  body: "Reach out to explore how we can collaborate and bring your ideas to life.",
  button: "Schedule a Consultation",
};

export type Metric = { value: number; prefix?: string; suffix?: string; label: string };

export type CaseStudy = {
  slug: string;
  title: string;
  tag: string;
  client: string;
  industry: string;
  duration: string;
  team?: string;
  summary: string;
  headline: string;
  challenge: string;
  solution: string;
  approach: { title: string; body: string }[];
  tech: string[];
  metrics: Metric[];
  results: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "enterprise-digital-transformation",
    title: "Enterprise Digital Transformation",
    tag: "Digital Strategy",
    client: "Fortune 500 manufacturing company",
    industry: "Manufacturing",
    duration: "8 months · 2023",
    team: "12 specialists",
    summary:
      "Comprehensive digital transformation for a Fortune 500 company, resulting in a 35% increase in operational efficiency.",
    headline: "35% more operational efficiency",
    challenge:
      "Outdated legacy systems slowed productivity and innovation. Digital infrastructure was split across departments, which made sharing data and collaborating difficult — while more agile competitors on newer technology were taking market share.",
    solution:
      "A phased strategy covering infrastructure modernisation, business process optimisation and employee enablement. We deployed a cloud-based ERP, integrated it with custom applications for specific departments, and built a data lake to unify information across the organisation.",
    approach: [
      { title: "Audit", body: "Audited existing systems and processes." },
      { title: "Roadmap", body: "Developed a three-year transformation roadmap with clear milestones." },
      { title: "Modernise", body: "Implemented cloud infrastructure and modernised core applications." },
      { title: "Insight", body: "Built custom analytics dashboards for real-time insights." },
      { title: "Enable", body: "Trained more than 500 employees on the new tools and workflows." },
    ],
    tech: ["Azure Cloud", "Microsoft Dynamics 365", "Power BI", "API Integration Layer", "Custom Web Applications"],
    metrics: [
      { value: 35, suffix: "%", label: "Increase in operational efficiency" },
      { value: 28, suffix: "%", label: "Reduction in IT maintenance costs" },
      { value: 62, suffix: "%", label: "Better cross-department collaboration" },
      { value: 18, prefix: "+", label: "Points of customer satisfaction" },
    ],
    results: ["Data processing time cut from days to minutes."],
  },
  {
    slug: "smart-facility-innovation-program",
    title: "Smart Facility Innovation Program",
    tag: "Technology Transformation",
    client: "Technology-driven facility management company, US",
    industry: "Facility management",
    duration: "Ongoing since 2016",
    team: "10 people",
    summary:
      "Strategic modernisation of facility operations through web and mobile platforms, enabling a 2x increase in development velocity.",
    headline: "2x development velocity",
    challenge:
      "The client needed to modernise its platform to streamline procurement, vendor coordination, work orders and maintenance scheduling. The previous system had a weak user experience and couldn't scale, creating friction for property managers and service vendors.",
    solution:
      "We designed and built web and mobile apps for property and facility managers — then kept supporting the platform by embedding developers, designers and QA in the client's internal team.",
    approach: [
      { title: "Discovery", body: "Workshops and user-journey mapping to set UX goals, an audit of the legacy stack, and a scalable architecture proposal." },
      { title: "Design & build", body: "Wireframes, prototypes and usability testing, then responsive web and mobile apps with a consistent UI and third-party device integrations." },
      { title: "Test & launch", body: "Accessibility, security and functional testing, CI/CD deployment on AWS, handover documentation and live rollout support." },
    ],
    tech: ["React.js", "Node.js", "MongoDB", "AWS", "OAuth 2.0 / JWT", "Twilio"],
    metrics: [
      { value: 2, suffix: "x", label: "Development velocity" },
      { value: 8, suffix: "+ yrs", label: "Continuous partnership" },
    ],
    results: [
      "Modernised platform with faster procurement workflows.",
      "Ready for future analytics and AI modules.",
    ],
  },
  {
    slug: "deep-learning-for-medical-document-intelligence",
    title: "Intelligent Medical Data Extraction",
    tag: "AI Data Abstraction",
    client: "U.S. healthcare technology company",
    industry: "Healthcare technology",
    duration: "24 months · 2017",
    team: "15 people",
    summary:
      "An AI-driven platform for a U.S. healthcare firm that automated medical document analysis, cutting processing time from hours to minutes.",
    headline: "Hours to minutes",
    challenge:
      "Large volumes of unstructured medical documents — text and images. Manual processing was slow and inconsistent, so automation became a strategic priority.",
    solution:
      "A turnkey AI platform using deep learning and neural networks to pull relevant information from medical documents, with a custom ML pipeline and a robust backend.",
    approach: [
      { title: "Plan", body: "Chose neural networks for text and image processing, prepared structured datasets and agreed specifications and milestones." },
      { title: "Execute", body: "A proxy product owner kept work aligned while the team iteratively trained models, built gRPC middleware and ran integration testing." },
      { title: "Hand over", body: "Six months of post-launch support, with five experts placed in the client's AI and development team." },
    ],
    tech: ["Python deep learning", "Golang + gRPC", "Google Cloud Platform", "Custom healthcare UI/UX"],
    metrics: [
      { value: 24, label: "Months of delivery" },
      { value: 5, label: "Experts embedded after launch" },
    ],
    results: [
      "Document processing time cut from hours to minutes.",
      "Model precision improved over time through feedback-driven training.",
      "Clinicians focus on insights instead of data entry.",
    ],
  },
  {
    slug: "mobile-first-transformation",
    title: "Mobile First Approach",
    tag: "Unified Insurance Operations",
    client: "Large health insurance provider, India",
    industry: "Health insurance",
    duration: "36 months · since 2020",
    team: "15 people",
    summary:
      "A hybrid mobile app that streamlines insurance operations, unifies workflows and lifts digital adoption across teams.",
    headline: "One app for every role",
    challenge:
      "Operations were decentralised and inefficient across roles, from agents to senior decision-makers. The client needed its core operations in one mobile experience.",
    solution:
      "A “Virtual Office” mobile app that digitises insurance workflows, bringing every operational role and task into one platform with a hybrid app and robust backend services.",
    approach: [
      { title: "Discovery", body: "A proof of concept on hybrid frameworks, middleware selection and signed-off functional specifications." },
      { title: "Development", body: "Agile delivery with an embedded proxy product owner, iterative design and full-cycle testing." },
      { title: "Post-launch", body: "Twelve months of support, with three experts strengthening the client's internal team." },
    ],
    tech: ["React Native", "Spring Framework", "AWS", "OCR document capture"],
    metrics: [
      { value: 36, label: "Months of partnership" },
      { value: 12, label: "Months of post-launch support" },
    ],
    results: [
      "Insurance processes centralised in a single app.",
      "Fewer manual tasks through OCR-based inputs.",
      "Better operational visibility for decision-makers.",
    ],
  },
  {
    slug: "end-to-end-platform-development-for-an-intelligent-hr-procurement-ecosystem",
    title: "End-to-end Platform Development",
    tag: "Marketplace Transformation",
    client: "HR tech startup, Singapore",
    industry: "HR marketplace",
    duration: "18 months · 2018",
    summary:
      "A scalable, feature-rich HR marketplace enabling global transactions, live video and future-ready expansion across markets.",
    headline: "A global HR marketplace",
    challenge:
      "The client wanted a global marketplace for procuring, provisioning and transacting HR products and services — needing a scalable multi-component architecture, complex user journeys and live video.",
    solution:
      "As end-to-end technology partner we designed the system architecture, created a user-focused interface and built a responsive, scalable web platform with real-time features and intelligent workflows.",
    approach: [
      { title: "Plan", body: "Defined the architecture, chose frameworks and agreed specifications with stakeholders." },
      { title: "Execute", body: "A proxy product owner worked closely with the client through an agile, user-centred build." },
      { title: "Support", body: "24 months of post-launch support, with five experts scaling the product." },
    ],
    tech: ["React.js", "Spring Framework", "Google Cloud", "Video conferencing"],
    metrics: [
      { value: 18, label: "Months to market" },
      { value: 24, label: "Months of post-launch support" },
    ],
    results: [
      "Global transactions of HR products and services.",
      "Live video meetings for real-time HR interactions.",
    ],
  },
];
