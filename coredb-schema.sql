CREATE TABLE IF NOT EXISTS prospects (
  id serial PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL UNIQUE,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  phone text UNIQUE,
  date_created date DEFAULT CURRENT_DATE
); 

CREATE TABLE IF NOT EXISTS clients (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  address text UNIQUE,
  city text,
  state text,
  postal_code text,
  phone text UNIQUE,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  date_created date DEFAULT CURRENT_DATE

);

CREATE TABLE IF NOT EXISTS targets (
  id serial PRIMARY KEY, 
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  phone text,
  sic_code text,
  username text NOT NULL REFERENCES clients (username) ON DELETE CASCADE
); 

