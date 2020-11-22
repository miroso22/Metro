PRAGMA FOREIGN_KEYS = ON;

DROP TABLE IF EXISTS advertising_contract;
DROP TABLE IF EXISTS worker;
DROP TABLE IF EXISTS train;
DROP TABLE IF EXISTS advertisement;
DROP TABLE IF EXISTS advertiser;
DROP TABLE IF EXISTS metro_system;
DROP TABLE IF EXISTS administrator;
DROP TABLE IF EXISTS metro_route;
DROP TABLE IF EXISTS complaint;
DROP TABLE IF EXISTS metro_line;
DROP TABLE IF EXISTS metro_station;
DROP TABLE IF EXISTS passanger;

CREATE TABLE metro_system (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lines_num INTEGER,
  admins_num INTEGER,
  city_name VARCHAR,
  monthly_budget INTEGER
);

CREATE TABLE administrator (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaints_num INTEGER,
  adv_contracts_num INTEGER,
  spend_budget INTEGER,
  metro_id INTEGER DEFAULT 1,
  FOREIGN KEY (metro_id) REFERENCES metro_system(id)
);

CREATE TABLE metro_route (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stations_num INTEGER,
  expected_time INTEGER
);

CREATE TABLE complaint (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  send_date TIME,
  char_num INTEGER,
  was_answered BOOLEAN
);

CREATE TABLE metro_line (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stations_num INTEGER,
  trains_num INTEGER, 
  workers_num INTEGER,
  metro_id INTEGER DEFAULT 1,
  FOREIGN KEY (metro_id) REFERENCES metro_system(id)
);

CREATE TABLE metro_station (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workers_num INTEGER,
  passangers_num INTEGER,
  advertisement_num INTEGER,
  month_income INTEGER,
  line_id INTEGER,
  FOREIGN KEY (line_id) REFERENCES metro_line(id)
);

CREATE TABLE worker (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  salary INTEGER,
  station_id INTEGER,
  train_id INREGER,
  FOREIGN KEY (station_id) REFERENCES metro_station(id),
  FOREIGN KEY (train_id) REFERENCES train(id)
);

CREATE TABLE train (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  passangers_num INTEGER,
  carriage_num INTEGER,
  line_id INTEGER,
  curr_station_id,
  FOREIGN KEY(line_id) REFERENCES metro_line(id),
  FOREIGN KEY(curr_station_id) REFERENCES metro_station(id)
);

CREATE TABLE advertisement (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  views INTEGER,
  advertiser_id INTEGER,
  station_id INTEGER,
  FOREIGN KEY (station_id) REFERENCES metro_station(id),
  FOREIGN KEY (advertiser_id) REFERENCES advertiser(id)
);

CREATE TABLE advertiser (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advertisement_posted INTEGER,
  contracts_num INTEGER
);

CREATE TABLE advertising_contract (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  price INTEGER,
  publish_date VARCHAR,
  was_accepted BOOLEAN,
  advertiser_id INTEGER,
  FOREIGN KEY (advertiser_id) REFERENCES advertiser(id)
);

CREATE TABLE passanger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  money INTEGER,
  route_id INTEGER,
  station_id INTEGER,
  train_id INTEGER,
  FOREIGN KEY(train_id) REFERENCES train(id),
  FOREIGN KEY(station_id) REFERENCES metro_station(id),
  FOREIGN KEY(route_id) REFERENCES metro_route(id)
)