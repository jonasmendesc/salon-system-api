import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { generateIdUnique } from "../utils/util";

export interface CompanyAttributes {
  id?: string;
  name?: string;
  validateEmailCode?: boolean;
  licenseCode?: string;
  authorizationId?: string;
  isActive?: boolean
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyInstance
  extends Sequelize.Instance<CompanyAttributes>,
  CompanyAttributes {
  IsPassword(encodedPassword: string, password: string): boolean;
}

export interface CompanyModel
  extends BaseModelInterface,
  Sequelize.Model<CompanyInstance, CompanyAttributes> { }

export default (
  sequelize: Sequelize.Sequelize,
  datatypes: Sequelize.DataTypes
): CompanyModel => {
  const company: CompanyModel = sequelize.define(
    "Company",
    {
      id: {
        type: datatypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        comment: "Identificador do registro da empresa"
      },
      name: {
        type: datatypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: true
        },
        comment: "Nome da empresa"
      },
      validateEmailCode: {
        type: datatypes.BOOLEAN,
        allowNull: false,
        comment: "Codigo para a validação do email",
        defaultValue: (): boolean => {
          return false;
        }
      },
      licenseCode: {
        type: datatypes.STRING(125),
        allowNull: false,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        comment: "Código da licenca do cliente"
      },
      isActive : {
        type: datatypes.BOOLEAN,
        allowNull: false,
        validate : {
          notEmpty: true
        },
        defaultValue: true
      },
      password: {
        type: datatypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        },
        comment: "Senha criptografada da empresa"
      }
    },
    {
      tableName: "companies",
      hooks: {
        beforeCreate: (
          company: CompanyInstance,
          options: Sequelize.CreateOptions
        ): void => {
          const salt = genSaltSync();
          company.password = hashSync(company.password, salt);
        },
        beforeUpdate: (
          company: CompanyInstance,
          options: Sequelize.CreateOptions
        ): void => {
          if (company.changed("password")) {
            const salt = genSaltSync();
            company.password = hashSync(company.password, salt);
          }
        }
      }
    }
  );

  company.prototype.IsPassword = (
    encodedPassword: string,
    password: string
  ): boolean => {
    return compareSync(password, encodedPassword);
  };

  company.associate = (models: ModelsInterface): void => {
    company.hasMany(models.CompanyEmail, {
      foreignKey: {
        allowNull: false,
        field: "companyId",
        name: "companyId"
      }
    }),
      company.hasMany(models.CompanyAddress, {
        foreignKey: {
          allowNull: false,
          field: "companyId",
          name: "companyId"
        }
      }),
      company.hasMany(models.CompanyPhone, {
        foreignKey: {
          allowNull: false,
          field: "companyId",
          name: "companyId"
        }
      }),
      company.hasMany(models.Sale, {
        foreignKey: {
          allowNull: false,
          field: "companyId",
          name: "companyId"
        }
      }),
      company.hasMany(models.SaleMobile, {
        foreignKey: {
          allowNull: false,
          field: "companyId",
          name: "companyId"
        }
      })
  };

  return company;
};
