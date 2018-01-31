--
-- PostgreSQL Database Schema
--
CREATE TABLE IF NOT EXISTS "public"."candies" (
    "id" serial,
    "description" text NOT NULL,
    "cost" double precision NOT NULL,
    "price" double precision NOT NULL,
    "stock" integer NOT NULL,
    PRIMARY KEY ("id"),
    CHECK (cost >= 0),
    CHECK (price >= 0),
    CHECK (stock >= 0)
);