import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";
import { generateIdUnique } from "../utils/util";

export interface AuthorizationAttributes {
  id?: string;
  clientId?: string;
  clientSecret?: string;
  name?: string;
  isActive?: boolean;
  authorizationType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorizationInstance
  extends Sequelize.Instance<AuthorizationAttributes>,
    AuthorizationAttributes {}

export interface AuthorizationModel
  extends BaseModelInterface,
    Sequelize.Model<AuthorizationInstance, AuthorizationAttributes> {}

export default (
  sequelize: Sequelize.Sequelize,
  dataTypes: Sequelize.DataTypes
): AuthorizationModel => {
  const authorization: AuthorizationModel = sequelize.define(
    "Authorization",
    {
      id: {
        type: dataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        validate: {
          notEmpty: true
        }
      },
      clientId: {
        type: dataTypes.STRING(50),
        allowNull: false,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        validate: {
          notEmpty: true
        },
        unique : 'uq_client_id'
      },
      clientSecret: {
        type: dataTypes.STRING(50),
        allowNull: false,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        validate: {
          notEmpty: true
        },
        unique : 'uq_client_secret'
      },
      name: {
        type: dataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      isActive: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
          notEmpty: false
        }
      },
      authorizationType: {
        type : dataTypes.ENUM('application', 'company'),
        allowNull : false,
        defaultValue : 'application'
      }
    },
    { tableName: "authorizations" }
  );

  authorization.associate = (models: ModelsInterface): void => {
    authorization.hasOne(models.Company, {
      foreignKey: {
        allowNull: false,
        field: "authorizationId",
        name: "authorizationId"
      },
      foreignKeyConstraint : true
    });
  };

  return authorization;
};
