CREATE TABLE visitor_counter (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total INTEGER NOT NULL DEFAULT 0
);

INSERT INTO visitor_counter (id, total) VALUES (1, 0);

CREATE TABLE counted_visitors (
  visitor_hash TEXT PRIMARY KEY,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER increment_visitor_counter
AFTER INSERT ON counted_visitors
BEGIN
  UPDATE visitor_counter
  SET total = total + 1
  WHERE id = 1;
END;
