'use strict';

const fs = require('fs');

const METRO_LINES = 3;
const ADMINS_NUM = 50;
const FILE_NAME = 'insert.sql';
const STATIONS_LIMITS = [7, 12];
const INCOME_LIMITS = [50000, 150000];
const STATION_WORKERS_LIMITS = [70, 100];
const TRAIN_LIMITS = [8, 15];
const SALARY_LIMITS = [5000, 15000];
const PASSANGER_LIMITS = [0, 150];
const MONEY_LIMITS = [0, 500];
const CARIAGE_LIMITS = [100, 10000];
const EXPECTED_TIME = [5, 35];
const ADVERTISERS_LIMITS = [50, 100];
const CONTRACTS_LIMITS = [1, 3];
const ADVERTISEMENT_LIMITS = [5, 10];
const PRICE_LIMITS = [10000, 50000];
const VIEWS_LIMITS = [1000, 20000];
const CHAR_NUM_LIMITS = [1, 3000];
const BUDGET_LIMITS = [50000, 300000];
const COMPLAINTS_LIMITS = [4, 10];


const partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const makeInsert = (tableName, valuesNameArr, valuesArr) => {
  let valuesNameString = valuesNameArr.toString();
  let insert = `INSERT INTO ${tableName}(${valuesNameString}) VALUES (`;
  for (const valueI in valuesArr) {
    if (typeof valuesArr[valueI] === 'string') {
      insert += `'${valuesArr[valueI]}'`;
    } else insert += valuesArr[valueI];
    if (valuesArr.length !== +valueI + 1) insert += ', ';
  }
  insert += ');';
  return insert;
};

const randomDate = () => {
  let day = randomInteger(1, 30);
  let month = randomInteger(1, 11);
  if (day.toString().length === 1) day = `0${day}`;
  if (month.toString().length === 1) month = `0${month}`;
  const year = 2020;
  return `${day}.${month}.${year}`;
}

const appendInsert = (tableName, valuesNameArr, valuesArr) => {
  const insert = makeInsert(tableName, valuesNameArr, valuesArr);
  fs.appendFileSync(FILE_NAME ,`${insert}\n`);
};

const adminInsert = partial(appendInsert, 'administrator', ['complaints_num', 'adv_contracts_num', 'spend_budget']);
const lineInsert = partial(appendInsert, 'metro_line', ['stations_num', 'trains_num', 'workers_num']);
const stationInsert = partial(appendInsert, 'metro_station', ['workers_num', 'passangers_num', 'advertisement_num', 'month_income', 'line_id']);
const trainInsert = partial(appendInsert, 'train', ['passangers_num', 'carriage_num', 'line_id', 'curr_station_id']);
const advertiserInsert = partial(appendInsert, 'advertiser', ['advertisement_posted', 'contracts_num']);
const advertisementInsert = partial(appendInsert, 'advertisement', ['views', 'advertiser_id', 'station_id']);
const workerInsert = partial(appendInsert, 'worker', ['salary', 'station_id', 'train_id']);
const routeInsert = partial(appendInsert, 'metro_route', ['stations_num', 'expected_time']);
const passangerInsert = partial(appendInsert, 'passanger', ['money', 'route_id', 'station_id', 'train_id']);
const contractInsert = partial(appendInsert, 'advertising_contract', ['price', 'publish_date', 'was_accepted', 'advertiser_id']);
const complaintInsert = partial(appendInsert, 'complaint', ['send_date', 'char_num', 'was_answered', 'send_by_id']);

fs.writeFileSync(FILE_NAME, '');

appendInsert('metro_system', ['lines_num', 'admins_num', 'city_name', 'monthly_budget'], [METRO_LINES, ADMINS_NUM, 'Kyiv', 5]);

let totalStations = 0;
let totalPassangers = 0;

for (let i = 1; i <= METRO_LINES; i++) {
  const stations_num = randomInteger(...STATIONS_LIMITS);
  totalStations += stations_num;
  let totalWorkers = 0;
  let totalTrains = 0;
  lineInsert([stations_num, totalTrains, totalWorkers]);
  for (let j = 1; j <= stations_num; j++) {
    const workers = randomInteger(...STATION_WORKERS_LIMITS);
    const trains = randomInteger(...TRAIN_LIMITS);
    const passangers = randomInteger(...PASSANGER_LIMITS);
    const income = randomInteger(...INCOME_LIMITS);
    totalWorkers += workers;
    totalTrains += trains;
    stationInsert([workers, passangers, 0, income, i]); // потом исправить 0 на генератор (когда появится реклама)
    for (let k = 1; k <= trains; k++) {
      const carriage_num = randomInteger(...CARIAGE_LIMITS);
      trainInsert([randomInteger(...PASSANGER_LIMITS), carriage_num, i, j]);
    }
    for (let k = 1; k <= workers; k++) {
      const salary = randomInteger(...SALARY_LIMITS);
      workerInsert([salary, j, randomInteger(1, trains)]);
    }
    let route_id = 0;
    for (let k = 1; k <= passangers; k++) {
      const money = randomInteger(...MONEY_LIMITS);
      routeInsert([randomInteger(1, stations_num), randomInteger(...EXPECTED_TIME)]);
      route_id++;
      passangerInsert([money, route_id, j, randomInteger(1, trains)]);
      totalPassangers++;
    }
  }
}

const advertisers = randomInteger(...ADVERTISERS_LIMITS);

for (let i = 1; i <= advertisers; i++) {
  const contracts = randomInteger(...CONTRACTS_LIMITS);
  const advertisements = randomInteger(...ADVERTISEMENT_LIMITS);
  advertiserInsert([advertisements, contracts]);

  for (let j = 1; j <= contracts; j++) {
    const price = randomInteger(...PRICE_LIMITS);
    const date = randomDate();
    contractInsert([price, date, randomInteger(0, 1), i]);
  }

  for (let j = 1; j <= advertisements; j++) {
    const views = randomInteger(...VIEWS_LIMITS);
    const station_id = randomInteger(1, totalStations);
    advertisementInsert([views, i, station_id]);
  }
}

for (let i = 1; i <= ADMINS_NUM; i++) {
  const complaints_num = randomInteger(...COMPLAINTS_LIMITS);
  const contracts = randomInteger(...CONTRACTS_LIMITS);
  const budget = randomInteger(...BUDGET_LIMITS);
  adminInsert([complaints_num, contracts, budget]);
  for (let j = 1; j <= complaints_num; j++) {
    const date = randomDate();
    const char_num = randomInteger(...CHAR_NUM_LIMITS);
    const was_answered = randomInteger(0, 1);
    const send_by_id = randomInteger(1, totalPassangers);
    complaintInsert([date, char_num, was_answered, send_by_id]);
  }
}
