CREATE DATABASE ewokagram;

\c ewokagram

DROP TABLE tasks;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
	username VARCHAR (15),
  email VARCHAR(100),
  password VARCHAR(60)
);

CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
	user_id INTEGER,
  image_url VARCHAR(255),
  caption VARCHAR(255),
  latitude NUMERIC,
  longitude NUMERIC
);
