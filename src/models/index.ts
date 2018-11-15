import * as path from 'path';
import * as Sequelize from 'sequelize';
import { DbConnection } from '../interfaces/DbConnectionInterface'

const basename: string = path.basename(module.filename);
const env: string = process.env.NODE_ENV || 'development';
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if (!db) {

  db = {};

  const operatorsAliases = { $in: Sequelize.Op.in, $join: Sequelize.Op.join, $gte: Sequelize.Op.gte, $lte: Sequelize.Op.lte};

  //const operatorsAliases = false
  config = Object.assign({ operatorsAliases }, config)

  const sequelize: Sequelize.Sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config);

  var files = [
    'pricingModel.js',
    'promotionModel.js',
    'saleModel.js',
    'saleMobileModel.js',
    'companyAddressModel.js',
    'companyPhoneModel.js',
    'companyEmailModel.js',
    'companyModel.js',
    'authorizationModel.js'];

  files.forEach((file: string) => {
    if (process.env.NODE_ENV != "test") {
      const model = sequelize.import(path.join(__dirname, file));
      db[model['name']] = model;
    } else {
      const model = sequelize.import(path.join("/home/jonas/projects/salonSystemApi/dist/models/", file));
      db[model['name']] = model;
    }
  })
  Object.keys(db).forEach((modelName: string) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  });

  db['sequelize'] = sequelize
}

export default <DbConnection>db;
