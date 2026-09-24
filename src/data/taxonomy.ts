/** Shared taxonomies — used by Onboarding, Discovery filters, and Profile. */

export const SKILL_GROUPS: { category: string; skills: string[] }[] = [
  {
    category: "Creative & Design",
    skills: [
      "Graphic Design", "Illustration", "Photography", "Videography",
      "Video Editing", "UI/UX Design", "Animation", "Music & Audio",
      "Content Creation", "Fashion & Styling",
    ],
  },
  {
    category: "Communication & Media",
    skills: [
      "Writing & Copywriting", "Public Speaking", "Social Media", "Journalism",
      "Hosting & Emceeing", "Storytelling", "Translation", "Debate",
    ],
  },
  {
    category: "Business & Management",
    skills: [
      "Project Management", "Marketing", "Sales", "Finance & Accounting",
      "Entrepreneurship", "Operations", "HR & Recruitment", "Event Planning",
      "Budgeting", "Customer Service",
    ],
  },
  {
    category: "Tech & Data",
    skills: [
      "Web Development", "Mobile Development", "Data Analysis", "Databases & SQL",
      "AI & Machine Learning", "Cybersecurity", "IT Support", "Game Development",
      "Robotics", "No-Code Tools",
    ],
  },
  {
    category: "Research & Academics",
    skills: [
      "Academic Research", "Scientific Writing", "Statistics", "Survey Design",
      "Literature Review", "Laboratory Work", "Data Gathering", "Tutoring",
    ],
  },
  {
    category: "Engineering & Hands-on",
    skills: [
      "CAD & Drafting", "Electronics", "Prototyping", "Fabrication",
      "Construction Basics", "Agriculture", "Environmental Science", "Logistics",
    ],
  },
  {
    category: "People & Community",
    skills: [
      "Teaching", "Community Organizing", "Counseling & Guidance",
      "Healthcare Basics", "Volunteering & Outreach", "Mentoring",
      "Facilitation", "Fundraising",
    ],
  },
];

export const PROJECT_TYPES = [
  "Academic Projects",
  "Research Projects",
  "Competitions",
  "Startups",
  "Businesses",
  "Spinoffs",
];

/** Which category a skill belongs to (for grouping on profiles). */
export const CATEGORY_OF: Record<string, string> = Object.fromEntries(
  SKILL_GROUPS.flatMap((g) => g.skills.map((sk) => [sk, g.category])),
);

/* ------------------------------------------------------------------ */
/*  Location — Philippines asks for region, then a city in that region */
/* ------------------------------------------------------------------ */

export const COUNTRIES = [
  "Philippines",
  "Australia",
  "Canada",
  "China",
  "Hong Kong",
  "India",
  "Indonesia",
  "Japan",
  "Malaysia",
  "Singapore",
  "South Korea",
  "Taiwan",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Other",
];

/** Philippine regions and their cities (component + highly urbanized). */
export const PH_REGIONS: { name: string; short: string; cities: string[] }[] = [
  {
    name: "National Capital Region",
    short: "NCR",
    cities: ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela"],
  },
  { name: "Cordillera Administrative Region", short: "CAR", cities: ["Baguio", "Tabuk"] },
  {
    name: "Ilocos Region",
    short: "Region I",
    cities: ["Alaminos", "Batac", "Candon", "Dagupan", "Laoag", "San Carlos (Pangasinan)", "San Fernando (La Union)", "Urdaneta", "Vigan"],
  },
  { name: "Cagayan Valley", short: "Region II", cities: ["Cauayan", "Ilagan", "Santiago", "Tuguegarao"] },
  {
    name: "Central Luzon",
    short: "Region III",
    cities: ["Angeles", "Balanga", "Baliwag", "Cabanatuan", "Gapan", "Mabalacat", "Malolos", "Meycauayan", "Muñoz", "Olongapo", "Palayan", "San Fernando (Pampanga)", "San Jose (Nueva Ecija)", "San Jose del Monte", "Tarlac City"],
  },
  {
    name: "CALABARZON",
    short: "Region IV-A",
    cities: ["Antipolo", "Bacoor", "Batangas City", "Biñan", "Cabuyao", "Calaca", "Calamba", "Carmona", "Cavite City", "Dasmariñas", "General Trias", "Imus", "Lipa", "Lucena", "San Pablo", "San Pedro", "Santa Rosa", "Santo Tomas", "Tagaytay", "Tanauan", "Tayabas", "Trece Martires"],
  },
  { name: "MIMAROPA", short: "Region IV-B", cities: ["Calapan", "Puerto Princesa"] },
  { name: "Bicol Region", short: "Region V", cities: ["Iriga", "Legazpi", "Ligao", "Masbate City", "Naga (Camarines Sur)", "Sorsogon City", "Tabaco"] },
  { name: "Western Visayas", short: "Region VI", cities: ["Iloilo City", "Passi", "Roxas"] },
  {
    name: "Negros Island Region",
    short: "NIR",
    cities: ["Bacolod", "Bago", "Bais", "Bayawan", "Cadiz", "Canlaon", "Dumaguete", "Escalante", "Guihulngan", "Himamaylan", "Kabankalan", "La Carlota", "Sagay", "San Carlos (Negros Occidental)", "Silay", "Sipalay", "Talisay (Negros Occidental)", "Tanjay", "Victorias"],
  },
  {
    name: "Central Visayas",
    short: "Region VII",
    cities: ["Bogo", "Carcar", "Cebu City", "Danao", "Lapu-Lapu", "Mandaue", "Naga (Cebu)", "Tagbilaran", "Talisay (Cebu)", "Toledo"],
  },
  { name: "Eastern Visayas", short: "Region VIII", cities: ["Baybay", "Borongan", "Calbayog", "Catbalogan", "Maasin", "Ormoc", "Tacloban"] },
  { name: "Zamboanga Peninsula", short: "Region IX", cities: ["Dapitan", "Dipolog", "Isabela City", "Pagadian", "Zamboanga City"] },
  {
    name: "Northern Mindanao",
    short: "Region X",
    cities: ["Cagayan de Oro", "El Salvador", "Gingoog", "Iligan", "Malaybalay", "Oroquieta", "Ozamiz", "Tangub", "Valencia"],
  },
  { name: "Davao Region", short: "Region XI", cities: ["Davao City", "Digos", "Mati", "Panabo", "Samal", "Tagum"] },
  { name: "SOCCSKSARGEN", short: "Region XII", cities: ["General Santos", "Kidapawan", "Koronadal", "Tacurong"] },
  { name: "Caraga", short: "Region XIII", cities: ["Bayugan", "Bislig", "Butuan", "Cabadbaran", "Surigao City", "Tandag"] },
  { name: "Bangsamoro (BARMM)", short: "BARMM", cities: ["Cotabato City", "Lamitan", "Marawi"] },
];
