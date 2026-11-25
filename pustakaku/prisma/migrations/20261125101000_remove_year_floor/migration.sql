CREATE TABLE "new_books" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL CHECK (length(trim("title")) > 0),
  "author" TEXT NOT NULL CHECK (length(trim("author")) > 0),
  "category_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0 CHECK ("stock" >= 0),
  "description" TEXT NOT NULL DEFAULT '',
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("category_id") REFERENCES "categories"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

INSERT INTO "new_books" (
  "id",
  "title",
  "author",
  "category_id",
  "year",
  "stock",
  "description",
  "created_at",
  "updated_at"
)
SELECT
  "id",
  "title",
  "author",
  "category_id",
  "year",
  "stock",
  "description",
  "created_at",
  "updated_at"
FROM "books";

DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";

CREATE INDEX "books_title_idx" ON "books"("title" COLLATE NOCASE);
CREATE INDEX "books_author_idx" ON "books"("author" COLLATE NOCASE);
CREATE INDEX "books_category_id_idx" ON "books"("category_id");
