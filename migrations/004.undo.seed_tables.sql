BEGIN;

TRUNCATE
    "word",
    "language",
    "user"
RESTART IDENTITY CASCADE;

COMMIT;