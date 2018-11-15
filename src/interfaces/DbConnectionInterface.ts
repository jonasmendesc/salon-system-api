import * as sequelize from 'sequelize';
import { ModelsInterface } from './ModelsInterface'

export interface DbConnection extends ModelsInterface{
  sequelize: sequelize.Sequelize
}
