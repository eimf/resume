import { pool } from './pool.js';

const migrate = async () => {
  console.log('Running migrations...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      headline VARCHAR(500),
      summary TEXT,
      location VARCHAR(255),
      email VARCHAR(255),
      website VARCHAR(255),
      github_url VARCHAR(255),
      linkedin_url VARCHAR(255),
      avatar_url VARCHAR(500),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      period VARCHAR(100),
      start_date DATE,
      end_date DATE,
      current BOOLEAN DEFAULT FALSE,
      highlights TEXT[] DEFAULT '{}',
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS education (
      id SERIAL PRIMARY KEY,
      institution VARCHAR(255) NOT NULL,
      degree VARCHAR(255),
      field VARCHAR(255),
      start_year INT,
      end_year INT,
      sort_order INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      name VARCHAR(100) NOT NULL,
      color VARCHAR(20) DEFAULT '#58A6FF',
      sort_order INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      github_id BIGINT UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      language VARCHAR(50),
      stars INT DEFAULT 0,
      url VARCHAR(500),
      is_private BOOLEAN DEFAULT FALSE,
      is_featured BOOLEAN DEFAULT FALSE,
      custom_description TEXT,
      last_updated TIMESTAMP,
      synced_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('✅ Migrations complete');
  await pool.end();
};

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
