import { pool } from './pool.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  console.log('Seeding database...');

  // Profile
  await pool.query(`
    INSERT INTO profile (name, headline, summary, location, email, website, github_url, linkedin_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      headline = EXCLUDED.headline,
      summary = EXCLUDED.summary,
      updated_at = NOW()
  `, [
    'Ezequiel Lopez',
    'Software Engineer → Systems Thinker',
    'Engineer by day, philosopher by night. 13+ years shipping software. Now designing systems that build it. Coffee powers the ideas. AI ships the code.',
    'McAllen, TX',
    'lzdzel@gmail.com',
    'https://ezequiell.com',
    'https://github.com/eimf',
    'https://www.linkedin.com/in/ezzykeeel/',
  ]);

  // Experience
  const experiences = [
    {
      company: 'Freelance / DHR',
      role: 'Software Engineer',
      period: 'May 2023 – Present',
      current: true,
      highlights: [
        'Gathered requirements and proposed tailored software solutions for local businesses',
        'Built full-stack apps: tournament management, booking systems, fleet management, salon management',
        'Orchestrating AI-powered development workflows with Cursor, Kiro, and AI agents',
        'Organized development teams and collaborated using Agile methodologies',
      ],
      sort_order: 1,
    },
    {
      company: 'Tata Consultancy Services',
      role: 'Senior Software Engineer',
      period: 'Jun 2014 – May 2023',
      current: false,
      highlights: [
        'Designed scalable, responsive front-end architectures for enterprise clients',
        'Collaborated with multidisciplinary teams on data-driven microservices applications',
        'Migrated NoSQL → PostgreSQL with monolith → microservices transition',
        'Modernized large-scale fleet management web application',
        'Built role-based interactive dashboards with login-based access',
      ],
      sort_order: 2,
    },
    {
      company: 'VanillaSys',
      role: 'Senior Mobile Engineer',
      period: 'Jul 2013 – Jun 2014',
      current: false,
      highlights: [
        'Developed cross-platform mobile applications for iOS, Android, and Windows Phone',
      ],
      sort_order: 3,
    },
  ];

  for (const exp of experiences) {
    await pool.query(`
      INSERT INTO experience (company, role, period, current, highlights, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [exp.company, exp.role, exp.period, exp.current, exp.highlights, exp.sort_order]);
  }

  // Education
  await pool.query(`
    INSERT INTO education (institution, degree, field, start_year, end_year, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, ['Universidad Autónoma de Guadalajara', 'B.Eng. / M.Sc.', 'Biomedical Engineering / Computer Science', 2007, 2013, 1]);

  // Skills
  const skills = [
    { category: 'Languages', names: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'C#', 'Swift'], color: '#58A6FF' },
    { category: 'Frontend', names: ['React', 'Next.js', 'Redux/RTK', 'Tailwind', 'HTML/CSS', 'Anime.js'], color: '#79C0FF' },
    { category: 'Backend', names: ['Node.js', 'Express', 'PostgreSQL', 'SQLite', 'REST APIs', 'Microservices'], color: '#3FB950' },
    { category: 'Cloud & DevOps', names: ['AWS', 'Docker', 'Kubernetes', 'Vercel', 'Railway', 'CI/CD'], color: '#D2A8FF' },
    { category: 'AI & Tooling', names: ['Cursor', 'Kiro', 'Prompt Engineering', 'Context Engineering', 'AI Agents'], color: '#FFA657' },
    { category: 'Mobile', names: ['iOS (Swift)', 'React Native', 'Xcode'], color: '#FF7B72' },
  ];

  for (const category of skills) {
    for (const name of category.names) {
      await pool.query(`
        INSERT INTO skills (category, name, color) VALUES ($1, $2, $3)
      `, [category.category, name, category.color]);
    }
  }

  // Admin password (hashed)
  const adminHash = await bcrypt.hash('changeme', 10);
  await pool.query(`
    INSERT INTO settings (key, value) VALUES ('admin_password_hash', $1)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `, [adminHash]);

  await pool.query(`
    INSERT INTO settings (key, value) VALUES ('last_github_sync', NULL)
    ON CONFLICT (key) DO NOTHING
  `);

  console.log('✅ Seed complete');
  await pool.end();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
