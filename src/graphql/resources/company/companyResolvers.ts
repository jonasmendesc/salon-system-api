import {
  AuthorizationAttributes,
  AuthorizationInstance
} from "./../../../models/authorizationModel";
import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CompanyInstance } from "../../../models/companyModel";
import { Transaction } from "sequelize";
import { handlerError, thowError } from "../../../utils/util";

import { compose } from "../../composable/composableResolvers";
import { authResolvers } from "../../composable/authResolvers";
import { AuthCompany } from "../../../interfaces/AuthCompanyInterface";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { RequestedFields } from "../../ast/requestedFields";

export const companyResolvers = {
  Company: {
    companyPhones: (company, args, { db, requestedFields }: { db: DbConnection, requestedFields: RequestedFields }, info) => {
      return db.CompanyPhone.findAll(
        {
          where: { companyId: company.get('id') },
          attributes: requestedFields.getFields(info, { exclude: ['companyPhones', 'companyAddresses', 'companyEmails'] })
        })
        .catch((err: any) => {
          throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
        })
    },
    companyAddresses: (company, args, { db, requestedFields }: { db: DbConnection, requestedFields: RequestedFields }, info) => {
      return db.CompanyAddress.findAll(
        {
          where: { companyId: company.get('id') },
          attributes: requestedFields.getFields(info, { exclude: ['companyPhones', 'companyAddresses', 'companyEmails'] })
        })
        .catch((err: any) => {
          throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
        })
    },
    companyEmails: (company, args, { db, requestedFields }: { db: DbConnection, requestedFields: RequestedFields }, info) => {
      return db.CompanyEmail.findAll(
        {
          where: { companyId: company.get('id') },
          attributes: requestedFields.getFields(info, { exclude: ['companyPhones', 'companyAddresses', 'companyEmails'] })
        })
        .catch((err: any) => {
          throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
        })
    }
  },

  Query: {
    company: compose(...authResolvers)(
      (
        parent,
        context,
        { db, authCompany }: { db: DbConnection; authCompany: AuthCompany },
        info: GraphQLResolveInfo
      ) => {
        return db.Company.findById(authCompany.id).then(
          (company: CompanyInstance) => {
            thowError(!company, "Empresa não foi encontrada");
            return company;
          }
        );
      }
    )
  },

  Mutation: {
    updateCompany: compose(...authResolvers)(
      (
        parent,
        { input },
        { db, authCompany }: { db: DbConnection; authCompany: AuthCompany },
        info: GraphQLResolveInfo
      ) => {
        return db.sequelize
          .transaction((t: Transaction) => {
            return db.Company.findById(authCompany.id).then(
              (company: CompanyInstance) => {
                thowError(!company, "Empresa não foi encontrada");
                return company.update(input, { transaction: t })
                  .then((companyChanged: CompanyInstance) => {
                    return companyChanged
                  })
                  .catch((err: any) => {
                    throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                  });
              }
            );
          })
          .catch(handlerError);
      }
    ),

    updateCompanyPassword: compose(...authResolvers)(
      (
        parent,
        { input },
        { db, authCompany }: { db: DbConnection; authCompany: AuthCompany },
        info: GraphQLResolveInfo
      ) => {
        return db.sequelize
          .transaction((t: Transaction) => {
            return db.Company.findById(authCompany.id).then(
              (company: CompanyInstance) => {
                thowError(!company, "Empresa não foi encontrada");
                let errorMessage: string = "Senhas estão incorretas verifica se a senha antiga foi digitada corretamente"
                if (!company || !company.IsPassword(company.get("password"), input.oldPassword))
                  throw new GraphqlRequestRestError({ code: 403, messageError: errorMessage });
                return company
                  .update({ password: input.newPassword }, { transaction: t })
                  .then((company: CompanyInstance) => !!company)
                  .catch((err: any) => {
                    throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                  });
              }
            );
          })
          .catch(handlerError);
      }
    )
  }
};
