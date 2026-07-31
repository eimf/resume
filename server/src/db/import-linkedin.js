import { pool } from './pool.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LINKEDIN_DIR = join(__dirname, '../../../_linkedin/LinkedInDataExport_07-31-2026');

function parseCSV(filename) {
  const content = readFileSync(join(LINKEDIN_DIR, filename), 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  // Simple CSV parser that handles quoted fields
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = {};
    let current = '';
    let inQuotes = false;
    let fieldIndex = 0;

    for (let j = 0; j <= lines[i].length; j++) {
      const char = lines[i][j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === ',' && !inQuotes) || j === lines[i].length) {
        if (fieldIndex < headers.length) {
          row[headers[fieldIndex]] = current.trim();
        }
        current = '';
        fieldIndex++;
      } else if (char === '\n' && inQuotes) {
        // Multi-line field — grab next line
        current += '\n';
        i++;
        j = -1; // reset to start of next line
      } else {
        current += char || '';
      }
    }

    if (Object.keys(row).length > 0) rows.push(row);
  }
  return rows;
}

// Better CSV parser for multi-line descriptions
function parsePositionsCSV() {
  const content = readFileSync(join(LINKEDIN_DIR, 'Positions.csv'), 'utf-8');
  const positions = [];
  let current = null;

  // Split by lines but respect quoted fields
  const lines = content.split('\n');
  let buffer = '';
  let inQuotes = false;

  for (const line of lines.slice(1)) { // skip header
    buffer += (buffer ? '\n' : '') + line;

    // Count quotes to determine if we're in a multi-line field
    const quoteCount = (buffer.match(/"/g) || []).length;
    inQuotes = quoteCount % 2 !== 0;

    if (!inQuotes) {
      // Parse the complete row
      const fields = [];
      let field = '';
      let inQ = false;

      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === '"') {
          inQ = !inQ;
        } else if (buffer[i] === ',' && !inQ) {
          fields.push(field.trim());
          field = '';
        } else {
          field += buffer[i];
        }
      }
      fields.push(field.trim());

      if (fields[0]) { // has company name
        positions.push({
          company: fields[0],
          title: fields[1] || '',
          description: fields[2] || '',
          location: fields[3] || '',
          startedOn: fields[4] || '',
          finishedOn: fields[5] || '',
        });
      }
      buffer = '';
    }
  }

  return positions;
}

async function importPositions() {
  console.log('Importing positions...');
  const positions = parsePositionsCSV();
  console.log(`  Found ${positions.length} positions`);

  // Clear existing experience
  await pool.query('DELETE FROM experience');

  // Group and consolidate TCS roles
  const consolidated = [];
  let sortOrder = 1;

  // DHR Health (newest)
  const dhr = positions.find(p => p.company === 'DHR Health');
  if (dhr) {
    consolidated.push({
      company: 'DHR Health',
      role: dhr.title.trim(),
      period: `${dhr.startedOn} – Present`,
      current: true,
      highlights: [
        'Implementing health informatics solutions for hospital systems',
        'Working with healthcare data and clinical workflows',
      ],
      sort_order: sortOrder++,
    });
  }

  // CNC Machines
  const cnc = positions.find(p => p.company === 'CNC Machines');
  if (cnc) {
    consolidated.push({
      company: 'CNC Machines',
      role: cnc.title.trim(),
      period: `${cnc.startedOn} – Present`,
      current: !cnc.finishedOn,
      highlights: [
        'Built responsive, high-performance UIs with React.js and Redux',
        'Translated UI/UX wireframes into clean, scalable front-end code',
        'Optimized user flows and proactively resolved performance issues',
      ],
      sort_order: sortOrder++,
    });
  }

  // Freelance
  const freelance = positions.find(p => p.company.includes('Freelance'));
  if (freelance) {
    consolidated.push({
      company: 'Freelance',
      role: 'Software Engineer',
      period: `${freelance.startedOn} – Present`,
      current: !freelance.finishedOn,
      highlights: [
        'Designed and implemented scalable solutions tailored to client requirements',
        'Built full-stack apps: tournament management, booking systems, fleet management, salon management',
        'Orchestrating AI-powered development workflows with Cursor, Kiro, and AI agents',
      ],
      sort_order: sortOrder++,
    });
  }

  // TCS — consolidate 6 roles into one entry with sub-highlights
  const tcsRoles = positions.filter(p => p.company === 'Tata Consultancy Services');
  if (tcsRoles.length) {
    const earliest = tcsRoles[tcsRoles.length - 1].startedOn;
    const latest = tcsRoles[0].finishedOn;
    consolidated.push({
      company: 'Tata Consultancy Services',
      role: 'Senior Software Engineer (6 roles)',
      period: `${earliest} – ${latest}`,
      current: false,
      highlights: [
        'Frontend Architect — Designed scalable architecture for vehicle ordering platform (React, Spring, Autodata)',
        'Data Visualization — Built real-time dashboard widgets with Backbone.js and Chart.js',
        'Digital Banking — Developed credit proposal app with React and Spring',
        'Systems Analyst — Modernized mainframe fleet management with PostgreSQL and Java',
        'Full-stack — Migrated Cassandra → SQL Server, integrating Spring and Backbone',
        'Customer Service Rep — Drove first-call resolutions and client satisfaction',
      ],
      sort_order: sortOrder++,
    });
  }

  // Universidad Autónoma de Guadalajara (Lecturer)
  const lecturer = positions.find(p => p.company === 'Universidad Autónoma de Guadalajara');
  if (lecturer) {
    consolidated.push({
      company: 'Universidad Autónoma de Guadalajara',
      role: 'Lecturer in Engineering',
      period: `${lecturer.startedOn} – ${lecturer.finishedOn}`,
      current: false,
      highlights: [
        'Taught C Basics and Advanced C programming to undergraduate engineering students',
      ],
      sort_order: sortOrder++,
    });
  }

  // Gerinnov
  const gerinnov = positions.find(p => p.company.includes('Gerinnov'));
  if (gerinnov) {
    consolidated.push({
      company: 'Gerinnov Corporation',
      role: 'Director of Development',
      period: `${gerinnov.startedOn} – ${gerinnov.finishedOn}`,
      current: false,
      highlights: [
        'Led development teams based on requirements gathering',
        'Managed project acceptance criteria and stakeholder communication',
      ],
      sort_order: sortOrder++,
    });
  }

  // VanillaSys
  const vanilla = positions.find(p => p.company === 'VanillaSys');
  if (vanilla) {
    consolidated.push({
      company: 'VanillaSys',
      role: 'Senior Mobile Engineer',
      period: `${vanilla.startedOn} – ${vanilla.finishedOn}`,
      current: false,
      highlights: [
        'Built DejaBus (Windows Phone), Duster (Android inventory), Gasolinazo (iOS/Android gas tracker)',
        'Cross-platform development: iOS, Android, Windows Phone using C#, Java, Objective-C',
      ],
      sort_order: sortOrder++,
    });
  }

  // Soluciones Tecnológicas
  const soluciones = positions.find(p => p.company.includes('Soluciones'));
  if (soluciones) {
    consolidated.push({
      company: 'Soluciones Tecnológicas',
      role: 'Embedded Software Engineer',
      period: `${soluciones.startedOn} – ${soluciones.finishedOn}`,
      current: false,
      highlights: [
        'Optimized embedded systems for ADO busCAN using CAN, RS232, SPI protocols',
        'Developed WiFi log transfer system with touch screen interface',
        'Built C# log collector for parsing and database storage',
      ],
      sort_order: sortOrder++,
    });
  }

  // HYDRA Technologies
  const hydra = positions.filter(p => p.company.includes('HYDRA'));
  if (hydra.length) {
    consolidated.push({
      company: 'HYDRA Technologies (UAVs)',
      role: 'Firmware Engineer / 3D Modeler',
      period: 'Jan 2010 – Dec 2010',
      current: false,
      highlights: [
        'Designed firmware for servo motor control on unmanned aircraft tail sections (PWM, SPI)',
        'Created assembly manuals for drone manufacturing using SolidWorks',
      ],
      sort_order: sortOrder++,
    });
  }

  // Insert all
  for (const exp of consolidated) {
    await pool.query(`
      INSERT INTO experience (company, role, period, current, highlights, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [exp.company, exp.role, exp.period, exp.current, exp.highlights, exp.sort_order]);
  }

  console.log(`  ✅ Imported ${consolidated.length} consolidated positions`);
}

async function importEducation() {
  console.log('Importing education...');
  const content = readFileSync(join(LINKEDIN_DIR, 'Education.csv'), 'utf-8');
  const lines = content.split('\n').slice(1).filter(l => l.trim());

  await pool.query('DELETE FROM education');

  let sortOrder = 1;
  for (const line of lines) {
    const fields = line.split(',');
    const school = fields[0];
    const startDate = fields[1];
    const endDate = fields[2];
    const degree = fields[4] || '';

    if (!school) continue;

    const startYear = startDate ? parseInt(startDate.split(' ').pop()) : null;
    const endYear = endDate ? parseInt(endDate.split(' ').pop()) : null;

    await pool.query(`
      INSERT INTO education (institution, degree, field, start_year, end_year, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [school, degree, '', startYear, endYear, sortOrder++]);
  }

  console.log(`  ✅ Imported ${lines.length} education entries`);
}

async function importSkills() {
  console.log('Importing skills...');
  const content = readFileSync(join(LINKEDIN_DIR, 'Skills.csv'), 'utf-8');
  const allSkills = content.split('\n').slice(1).map(l => l.trim()).filter(Boolean);

  console.log(`  Found ${allSkills.length} skills total`);

  // Clear existing and re-categorize
  await pool.query('DELETE FROM skills');

  // Smart categorization
  const categories = {
    'Languages': {
      color: '#58A6FF',
      match: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C', 'Swift', 'CoffeeScript', 'Visual C#'],
    },
    'Frontend': {
      color: '#79C0FF',
      match: ['React.js', 'Next.js', 'Redux.js', 'AngularJS', 'Backbone.js', 'jQuery', 'HTML', 'CSS', 'Cascading Style Sheets', 'LESS', 'SASS', 'Babel.js', 'Webpack', 'Material-UI', 'Anime.js', 'JavaScript eXtension', 'Requirejs', 'Bower', 'Front-End Development', 'Thymeleaf'],
    },
    'Backend': {
      color: '#3FB950',
      match: ['Node.js', 'Spring Framework', 'Spring Boot', 'Spring MVC', 'SQL', 'MySQL', 'Microsoft SQL Server', 'Cassandra', 'Firebase', 'Back-End Web Development', 'JSON', 'AJAX', 'XML', 'State Management'],
    },
    'Cloud & DevOps': {
      color: '#D2A8FF',
      match: ['Cloud Computing', 'Git', 'Tortoise SVN', 'Software Infrastructure', 'WordPress', 'Markdown'],
    },
    'AI & Tooling': {
      color: '#FFA657',
      match: ['Data Modeling', 'Data Preparation', 'DataTables', 'Graphs', 'Program Analysis', 'Attention to Detail'],
    },
    'Mobile': {
      color: '#FF7B72',
      match: ['iOS development', 'Android Development', 'Windows Phone', 'Swift'],
    },
    'Embedded & IoT': {
      color: '#F0883E',
      match: ['Embedded Systems', 'Embedded Software', 'Microcontrollers', 'Microchip', 'CAN bus', 'Serial Protocols', 'Electronic Engineering'],
    },
    'Engineering': {
      color: '#A5D6FF',
      match: ['Software Engineering', 'Web Engineering', 'Web Development', 'Software Development', 'Software Design', 'Object-Oriented Programming', 'Engineering', 'Network Security', 'SOLIDWORKS', 'Modeler', 'Graphics'],
    },
  };

  // Assign skills to categories
  const assigned = new Set();
  for (const [catName, cat] of Object.entries(categories)) {
    const matched = allSkills.filter(s => cat.match.some(m => s.includes(m) || m.includes(s)));
    for (const skill of matched) {
      if (assigned.has(skill)) continue;
      assigned.add(skill);

      // Clean up the display name
      let displayName = skill
        .replace(' (Programming Language)', '')
        .replace(' (Stylesheet Language)', '')
        .replace('Cascading Style Sheets (CSS)', 'CSS')
        .replace('JavaScript eXtension (JSX)', 'JSX')
        .replace('Object-Oriented Programming (OOP)', 'OOP');

      await pool.query(`
        INSERT INTO skills (category, name, color) VALUES ($1, $2, $3)
      `, [catName, displayName, cat.color]);
    }
  }

  console.log(`  ✅ Imported ${assigned.size} skills into ${Object.keys(categories).length} categories`);
}

async function importCertifications() {
  console.log('Importing certifications...');
  const content = readFileSync(join(LINKEDIN_DIR, 'Certifications.csv'), 'utf-8');
  const lines = content.split('\n').slice(1).filter(l => l.trim());

  // Add certifications table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS certifications (
      id SERIAL PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      authority VARCHAR(255),
      url VARCHAR(500),
      date VARCHAR(50),
      sort_order INT DEFAULT 0
    )
  `);

  await pool.query('DELETE FROM certifications');

  let sortOrder = 1;
  for (const line of lines) {
    const fields = [];
    let field = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') inQ = !inQ;
      else if (line[i] === ',' && !inQ) { fields.push(field.trim()); field = ''; }
      else field += line[i];
    }
    fields.push(field.trim());

    const [name, url, authority, startedOn] = fields;
    if (!name) continue;

    await pool.query(`
      INSERT INTO certifications (name, authority, url, date, sort_order)
      VALUES ($1, $2, $3, $4, $5)
    `, [name, authority, url, startedOn, sortOrder++]);
  }

  console.log(`  ✅ Imported ${lines.length} certifications`);
}

async function run() {
  console.log('=== LinkedIn Data Import ===\n');

  await importPositions();
  await importEducation();
  await importSkills();
  await importCertifications();

  // Update profile with languages
  await pool.query(`
    UPDATE profile SET
      summary = 'Engineer by day, philosopher by night. 13+ years shipping software across embedded systems, mobile, web, and cloud. Now designing systems that build it. Coffee powers the ideas. AI ships the code.',
      updated_at = NOW()
    WHERE id = 1
  `);

  console.log('\n✅ All imports complete');
  await pool.end();
}

run().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
