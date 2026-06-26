CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Tourist',
  points INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  history TEXT,
  best_time TEXT,
  crowd_level TEXT,
  avg_time TEXT,
  photography_spots TEXT,
  accessibility TEXT DEFAULT 'Not Accessible',
  parking INTEGER DEFAULT 0,
  toilets INTEGER DEFAULT 0,
  atm_nearby TEXT,
  hospital_nearby TEXT,
  police_nearby TEXT,
  petrol_nearby TEXT,
  carry_items TEXT,
  avoid_items TEXT,
  fun_facts TEXT,
  travel_tips TEXT,
  coordinates_lat REAL,
  coordinates_lng REAL
);

CREATE TABLE IF NOT EXISTS hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER,
  name TEXT NOT NULL,
  price_per_night REAL NOT NULL,
  rating REAL DEFAULT 4.0,
  amenities TEXT,
  image_url TEXT,
  FOREIGN KEY(destination_id) REFERENCES destinations(id)
);

CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER,
  name TEXT NOT NULL,
  specialty TEXT,
  rating REAL DEFAULT 4.0,
  spicy_level INTEGER DEFAULT 1,
  is_veg INTEGER DEFAULT 1,
  image_url TEXT,
  FOREIGN KEY(destination_id) REFERENCES destinations(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  hotel_id INTEGER,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'Pending',
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(hotel_id) REFERENCES hotels(id)
);

CREATE TABLE IF NOT EXISTS wishlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  target_id INTEGER,
  target_type TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

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
);

CREATE TABLE IF NOT EXISTS system_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_level TEXT DEFAULT 'INFO',
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
