PRAGMA FOREIGN_KEYS = ON;

CREATE TABLE IF NOT EXISTS metro_system (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lines_num INTEGER,
  admins_num INTEGER,
  city_name VARCHAR,
  monthly_budget INTEGER
);

CREATE TABLE IF NOT EXISTS administrator (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaints_num INTEGER,
  adv_contracts_num INTEGER,
  spend_budget INTEGER,
  metro_id INTEGER DEFAULT 1,
  FOREIGN KEY (metro_id) REFERENCES metro_system(id)
);

CREATE TABLE IF NOT EXISTS metro_route (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stations_num INTEGER,
  expected_time INTEGER
);

CREATE TABLE IF NOT EXISTS complaint (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  send_date TIME,
  char_num INTEGER,
  was_answered INTEGER,
  send_by_id INTEGER,
  FOREIGN KEY (send_by_id) REFERENCES passanger(id)
);

CREATE TABLE IF NOT EXISTS metro_line (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stations_num INTEGER,
  trains_num INTEGER, 
  workers_num INTEGER,
  metro_id INTEGER DEFAULT 1,
  FOREIGN KEY (metro_id) REFERENCES metro_system(id)
);

CREATE TABLE IF NOT EXISTS metro_station (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workers_num INTEGER,
  passangers_num INTEGER,
  advertisement_num INTEGER,
  month_income INTEGER,
  line_id INTEGER,
  FOREIGN KEY (line_id) REFERENCES metro_line(id)
);

CREATE TABLE IF NOT EXISTS worker (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  salary INTEGER,
  station_id INTEGER,
  train_id INREGER,
  FOREIGN KEY (station_id) REFERENCES metro_station(id),
  FOREIGN KEY (train_id) REFERENCES train(id)
);

CREATE TABLE IF NOT EXISTS train (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  passangers_num INTEGER,
  carriage_num INTEGER,
  line_id INTEGER,
  curr_station_id,
  FOREIGN KEY(line_id) REFERENCES metro_line(id),
  FOREIGN KEY(curr_station_id) REFERENCES metro_station(id)
);

CREATE TABLE IF NOT EXISTS advertisement (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  views INTEGER,
  advertiser_id INTEGER,
  station_id INTEGER,
  FOREIGN KEY (station_id) REFERENCES metro_station(id),
  FOREIGN KEY (advertiser_id) REFERENCES advertiser(id)
);

CREATE TABLE IF NOT EXISTS advertiser (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advertisement_posted INTEGER,
  contracts_num INTEGER
);

CREATE TABLE IF NOT EXISTS advertising_contract (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  price INTEGER,
  publish_date VARCHAR,
  was_accepted INTEGER,
  advertiser_id INTEGER,
  FOREIGN KEY (advertiser_id) REFERENCES advertiser(id)
);

CREATE TABLE IF NOT EXISTS passanger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  money INTEGER,
  route_id INTEGER,
  station_id INTEGER,
  train_id INTEGER,
  FOREIGN KEY(train_id) REFERENCES train(id),
  FOREIGN KEY(station_id) REFERENCES metro_station(id),
  FOREIGN KEY(route_id) REFERENCES metro_route(id)
)