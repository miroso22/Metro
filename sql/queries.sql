SELECT id FROM administrator WHERE metro_id = 0
SELECT * FROM metro_system WHERE city = "Kiev"
SELECT id FROM metro_station WHERE train_id > -1
SELECT * FROM metro_station WHERE train_id = 2
SELECT * FROM passenger WHERE station_id = 10
SELECT content FROM complaint WHERE was_answered = 0
SELECT id FROM advertising_contract WHERE expire_date < 20.07.2021
SELECT COUNT(*) FROM metro_station WHERE line_id = 4
SELECT * FROM metro_station WHERE route_id = 1
SELECT id FROM complaint
SELECT salary FROM worker WHERE station_id = 9 ORDER BY salary
SELECT SUM(month_income) FROM station

DELETE FROM complaint WHERE was_answered = 1
DELETE FROM advertising_contract WHERE expire_date < 01.12.2020
DELETE FROM worker WHERE id = 18 OR id = 19 OR id = 34
DELETE FROM passenger WHERE station_id = 3
DELETE FROM metro_station WHERE id = 14

UPDATE train SET curr_station_id = 10 WHERE id = 70
UPDATE worker SET salary = 10000 WHERE id = 10 OR id = 11
UPDATE administrator SET metro_id = 0 WHERE id = 3
UPDATE metro_station SET has_train = 1 WHERE train_id > -1
UPDATE advertising_contract SET expire_date = 20.09.2021, price = 10000 WHERE id = 4