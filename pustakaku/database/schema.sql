PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  author TEXT NOT NULL CHECK (length(trim(author)) > 0),
  category_id INTEGER NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1450),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS books_title_idx ON books(title COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS books_author_idx ON books(author COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS books_category_id_idx ON books(category_id);
