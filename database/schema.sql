CREATE DATABASE ewokagram;

\c ewokagram

DROP TABLE users;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
	username VARCHAR (255),
  password VARCHAR(255)
);

CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
	user_id INTEGER,
  image_url VARCHAR(255),
  caption VARCHAR(255),
  latitude NUMERIC,
  longitude NUMERIC
);
