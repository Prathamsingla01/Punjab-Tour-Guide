import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database/punjab_tour.db');
const dbDir = path.dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    
    // Configure PRAGMA and dynamically verify tables
    db.serialize(() => {
      db.run('PRAGMA foreign_keys = ON');

      // Create reviews table dynamically if missing
      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          destination_id INTEGER,
          comment TEXT NOT NULL,
          rating INTEGER DEFAULT 5,
          status TEXT DEFAULT 'Pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id),
          FOREIGN KEY(destination_id) REFERENCES destinations(id)
        )
      `);

      // Create system_logs table dynamically if missing
      db.run(`
        CREATE TABLE IF NOT EXISTS system_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          log_level TEXT DEFAULT 'INFO',
          message TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Seed sample reviews if empty
      db.get('SELECT COUNT(*) as count FROM reviews', [], (err, row) => {
        if (!err && row && row.count === 0) {
          db.run(`
            INSERT INTO reviews (user_id, destination_id, comment, rating, status) VALUES 
            (2, 1, 'Golden Temple was an incredibly peaceful experience. The wheelchair access ramp was fully operational.', 5, 'Approved'),
            (2, 2, 'Rock garden is beautiful but walking trails can be tiring for senior citizens.', 4, 'Pending')
          `);
        }
      });

      // Log server startup event
      db.run('INSERT INTO system_logs (log_level, message) VALUES (?, ?)', ['INFO', 'Database connection initialized. Tables verified.']);
    });

    if (!dbExists) {
      initializeDatabase();
    }
  }
});

function initializeDatabase() {
  console.log('Database file not found. Initializing database schema...');
  const migrationsPath = path.resolve(__dirname, '../database/migrations.sql');
  const seedsPath = path.resolve(__dirname, '../database/seeds.sql');

  try {
    const migrationsSql = fs.readFileSync(migrationsPath, 'utf8');
    db.exec(migrationsSql, (err) => {
      if (err) {
        console.error('Error running database migrations:', err.message);
        return;
      }
      console.log('Database migrations completed successfully.');

      // Load seeds
      const seedsSql = fs.readFileSync(seedsPath, 'utf8');
      db.exec(seedsSql, (err) => {
        if (err) {
          console.error('Error seeding database:', err.message);
          return;
        }
        console.log('Database seeded successfully.');
      });
    });
  } catch (error) {
    console.error('Failed to read migration/seed files:', error.message);
  }
}

// Backup database tables into JSON structure
db.exportBackup = (callback) => {
  const tables = ['users', 'destinations', 'hotels', 'restaurants', 'bookings', 'wishlist', 'reviews', 'system_logs'];
  const backup = {};
  let completed = 0;
  let hasError = false;

  tables.forEach((table) => {
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return callback(err);
      }
      backup[table] = rows;
      completed++;
      if (completed === tables.length) {
        callback(null, backup);
      }
    });
  });
};

// Restore database tables from JSON structure
db.importRestore = (backup, callback) => {
  const tables = ['users', 'destinations', 'hotels', 'restaurants', 'bookings', 'wishlist', 'reviews', 'system_logs'];
  
  db.serialize(() => {
    // Temporarily disable foreign keys for clean overwrite
    db.run('PRAGMA foreign_keys = OFF');

    // Clear all existing data
    tables.forEach((table) => {
      db.run(`DELETE FROM ${table}`);
    });

    let hasError = false;

    // Restore table records
    Object.keys(backup).forEach((table) => {
      const rows = backup[table];
      if (!rows || rows.length === 0) return;

      const keys = Object.keys(rows[0]);
      const columns = keys.join(', ');
      const placeholders = keys.map(() => '?').join(', ');
      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

      rows.forEach((row) => {
        if (hasError) return;
        const values = keys.map(k => row[k]);
        db.run(query, values, (err) => {
          if (err) {
            hasError = true;
            console.error(`Error restoring table ${table}:`, err.message);
          }
        });
      });
    });

    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (hasError) {
        callback(err || new Error('Restore failed during insertion'));
      } else {
        db.run('INSERT INTO system_logs (log_level, message) VALUES (?, ?)', [
          'INFO',
          'Database restored successfully from backup.'
        ]);
        callback(null);
      }
    });
  });
};

export default db;
