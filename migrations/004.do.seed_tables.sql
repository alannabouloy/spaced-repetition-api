BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Spanish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'hola', 'hello', 2),
  (2, 1, 'cómo', 'how', 3),
  (3, 1, 'estás', 'you are', 4),
  (4, 1, 'niño', 'boy', 5),
  (5, 1, 'mujer', 'woman', 6),
  (6, 1, 'señora', 'ma''am', 7),
  (7, 1, 'hombre', 'man', 8),
  (8, 1, 'niña', 'girl', 9),
  (9, 1, 'señor', 'sir', 10),
  (10, 1, 'bien', 'well', 11),
  (11, 1, 'gracias', 'thank you', 12),
  (12, 1, 'estoy', 'I am', 13),
  (13, 1, 'muy', 'very', 14),
  (14, 1, 'hablo', 'I speak', 15),
  (15, 1, 'español', 'Spanish', 16),
  (16, 1, 'ingles', 'English', 17),
  (17, 1, 'hablas', 'you speak', 18),
  (18, 1, 'practicar', 'to practice', 19),
  (19, 1, 'estar', 'to be', 20),
  (20, 1, 'hablar', 'to speak', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
