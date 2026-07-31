import { pool } from './pool.js';

async function refineSkills() {
  console.log('Refining skills...');

  // Wipe and rebuild with proper curation
  await pool.query('DELETE FROM skills');

  const categories = [
    {
      name: 'Languages',
      color: '#58A6FF',
      skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C', 'Swift', 'Go', 'SQL'],
    },
    {
      name: 'Frontend',
      color: '#79C0FF',
      skills: ['React', 'Next.js', 'Redux/RTK', 'Tailwind CSS', 'HTML/CSS', 'Anime.js', 'SASS/LESS', 'Backbone.js', 'AngularJS', 'Material-UI'],
    },
    {
      name: 'Backend',
      color: '#3FB950',
      skills: ['Node.js', 'Express', 'Spring Boot', 'PostgreSQL', 'MySQL', 'SQL Server', 'Firebase', 'Cassandra', 'REST APIs', 'Microservices'],
    },
    {
      name: 'Cloud & DevOps',
      color: '#D2A8FF',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Vercel', 'Railway', 'CI/CD', 'Git', 'Linux'],
    },
    {
      name: 'AI & Tooling',
      color: '#FFA657',
      skills: ['Cursor', 'Kiro', 'AI Agents', 'Prompt Engineering', 'Context Engineering', 'Copilot'],
    },
    {
      name: 'Mobile',
      color: '#FF7B72',
      skills: ['iOS (Swift)', 'Android (Java)', 'React Native', 'Windows Phone (C#)'],
    },
    {
      name: 'Embedded & IoT',
      color: '#F0883E',
      skills: ['Firmware (C)', 'Microcontrollers', 'CAN Bus', 'SPI/I2C', 'PWM', 'RTOS'],
    },
    {
      name: 'Architecture',
      color: '#A5D6FF',
      skills: ['System Design', 'OOP', 'Data Modeling', 'Agile', 'Monolith → Microservices', 'API Design'],
    },
  ];

  for (const cat of categories) {
    let sortOrder = 1;
    for (const skill of cat.skills) {
      await pool.query(
        'INSERT INTO skills (category, name, color, sort_order) VALUES ($1, $2, $3, $4)',
        [cat.name, skill, cat.color, sortOrder++]
      );
    }
  }

  const total = categories.reduce((sum, c) => sum + c.skills.length, 0);
  console.log(`  ✅ ${total} skills across ${categories.length} categories`);
}

async function refineExperience() {
  console.log('Refining experience...');

  await pool.query('DELETE FROM experience');

  const entries = [
    {
      company: 'DHR Health',
      role: 'Health Informatics Engineer',
      period: 'Mar 2026 – Present',
      current: true,
      highlights: [
        'Implementing health informatics solutions for hospital systems',
        'Working with healthcare data pipelines and clinical workflows',
      ],
      sort_order: 1,
    },
    {
      company: 'CNC Machines',
      role: 'Frontend Developer',
      period: 'Jul 2025 – Present',
      current: true,
      highlights: [
        'Built responsive, high-performance UIs with React.js and Redux',
        'Translated UI/UX wireframes into clean, scalable front-end code',
        'Optimized user flows and resolved performance bottlenecks',
      ],
      sort_order: 2,
    },
    {
      company: 'Freelance',
      role: 'Software Engineer',
      period: 'May 2023 – Present',
      current: true,
      highlights: [
        'Designed and shipped full-stack solutions for local businesses',
        'Built tournament management, booking systems, fleet management, and salon apps',
        'Orchestrating AI-powered development with Cursor, Kiro, and AI agents',
        'Managing development teams using Agile methodologies',
      ],
      sort_order: 3,
    },
    {
      company: 'Tata Consultancy Services',
      role: 'Senior Software Engineer',
      period: 'Jul 2014 – May 2023',
      current: false,
      highlights: [
        'Frontend Architect — Designed scalable vehicle ordering platform (React, Spring, Autodata)',
        'Data Visualization — Real-time dashboard widgets with Backbone.js and Chart.js',
        'Digital Banking — Credit proposal app with React and Spring',
        'Systems Analyst — Modernized mainframe fleet management (PostgreSQL, Java, Spring)',
        'Full-stack — Migrated Cassandra → SQL Server with Spring + Backbone integration',
      ],
      sort_order: 4,
    },
    {
      company: 'Universidad Autónoma de Guadalajara',
      role: 'Lecturer in Engineering',
      period: 'Jan 2014 – Jul 2014',
      current: false,
      highlights: [
        'Taught C Basics and Advanced C programming to undergraduate engineering students',
      ],
      sort_order: 5,
    },
    {
      company: 'Gerinnov Corporation',
      role: 'Director of Development',
      period: 'Aug 2013 – Jul 2014',
      current: false,
      highlights: [
        'Led development teams through requirements gathering to delivery',
        'Managed project acceptance criteria and stakeholder communication',
      ],
      sort_order: 6,
    },
    {
      company: 'VanillaSys',
      role: 'Senior Mobile Engineer',
      period: 'Jul 2013 – Jul 2014',
      current: false,
      highlights: [
        'Built DejaBus (transit app), Duster (inventory mgmt), Gasolinazo (gas price tracker)',
        'Cross-platform: iOS (Objective-C), Android (Java), Windows Phone (C#)',
      ],
      sort_order: 7,
    },
    {
      company: 'Soluciones Tecnológicas',
      role: 'Embedded Software Engineer',
      period: 'May 2011 – Jul 2013',
      current: false,
      highlights: [
        'Optimized embedded systems for ADO busCAN (CAN, RS232, SPI protocols)',
        'Built WiFi log transfer system with touch screen interface',
        'Developed C# log collector for data parsing and storage',
      ],
      sort_order: 8,
    },
    {
      company: 'HYDRA Technologies (UAVs)',
      role: 'Firmware Engineer',
      period: 'Jan 2010 – Dec 2010',
      current: false,
      highlights: [
        'Designed firmware for servo motor control on unmanned aircraft (PWM, SPI)',
        'Created SolidWorks assembly manuals for drone manufacturing',
      ],
      sort_order: 9,
    },
  ];

  for (const exp of entries) {
    await pool.query(
      'INSERT INTO experience (company, role, period, current, highlights, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
      [exp.company, exp.role, exp.period, exp.current, exp.highlights, exp.sort_order]
    );
  }

  console.log(`  ✅ ${entries.length} experience entries (refined)`);
}

async function refineEducation() {
  console.log('Refining education...');

  await pool.query('DELETE FROM education');

  const entries = [
    { institution: 'Universidad Autónoma de Guadalajara', degree: 'M.Sc.', field: 'Computer Science', start: 2011, end: 2013 },
    { institution: 'Universidad Autónoma de Guadalajara', degree: 'B.A.Sc.', field: 'Biomedical Engineering', start: 2007, end: 2011 },
    { institution: 'UPAEP', degree: 'B.Eng.', field: 'Engineering (transferred)', start: 2005, end: 2006 },
  ];

  let sortOrder = 1;
  for (const edu of entries) {
    await pool.query(
      'INSERT INTO education (institution, degree, field, start_year, end_year, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
      [edu.institution, edu.degree, edu.field, edu.start, edu.end, sortOrder++]
    );
  }

  console.log(`  ✅ ${entries.length} education entries`);
}

async function refineProfile() {
  console.log('Refining profile...');

  await pool.query(`
    UPDATE profile SET
      headline = 'Software Engineer → Systems Thinker',
      summary = '15+ years shipping software — from drone firmware to health informatics. Started in embedded C, evolved through mobile, web, and cloud, now orchestrating AI-powered development. I don''t just write code anymore — I design systems that build it.',
      updated_at = NOW()
    WHERE id = 1
  `);

  console.log('  ✅ Profile updated');
}

async function run() {
  console.log('=== Refining Data ===\n');
  await refineSkills();
  await refineExperience();
  await refineEducation();
  await refineProfile();
  console.log('\n✅ All refinements complete');
  await pool.end();
}

run().catch((err) => {
  console.error('❌ Refinement failed:', err);
  process.exit(1);
});
