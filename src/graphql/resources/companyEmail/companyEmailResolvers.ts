import { Transaction } from "sequelize";
import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CompanyEmailInstance, CompanyEmailAttributes } from "../../../models/companyEmailModel";
import { compose } from "../../composable/composableResolvers";
import { authResolvers } from "../../composable/authResolvers";
import { AuthCompany } from "../../../interfaces/AuthCompanyInterface";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { RequestedFields } from "../../ast/requestedFields";

export const companyEmailResolvers = {
  Query: {
    getcompanyEmails: compose(...authResolvers)(
      (
        parent,
        { first = 10, offset = 0 },
        { db, authCompany, requestedFields }: { db: DbConnection; authCompany: AuthCompany, requestedFields: RequestedFields },
        info: GraphQLResolveInfo
      ) => {
        if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
        return db.CompanyEmail.findAll({
          where: {
            companyId: authCompany.id
          },
          attributes: requestedFields.getFields(info),
          limit: first,
          offset: offset
        }).catch((err: any) => {
          throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
        });
      }
    )
  }, // fim das queries,

  Mutation: {
    insertEmails: compose(...authResolvers)(
      (
        parent,
        { emails },
        { db, authCompany }: { db: DbConnection; authCompany: AuthCompany },
        info: GraphQLResolveInfo
      ) => {
        if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
        let emailFinds = emails.map(email => email.email);
        return db.CompanyEmail.findAll({ where: { email: { $in: emailFinds }, companyId: authCompany.id } })
          .then((companyEmailInstances: CompanyEmailInstance[]) => {
            if (companyEmailInstances && companyEmailInstances.length > 0) {
              var emailSenders: string = companyEmailInstances.reduce((accum, curr) => {
                if (accum)
                  return accum + ', ' + curr.email;
                return curr.email;
              }, "");
              throw new GraphqlRequestRestError({ code: 500, messageError: ` Email(s) já existem ${emailSenders}` });
            } else {
              let companyEmails: CompanyEmailAttributes[] = emails.map(email => {
                let companyEmail: CompanyEmailAttributes = {
                  companyId: authCompany.id,
                  email: email.email,
                  isMain: false,
                  isActive: true
                };
                return companyEmail;
              });
              return db.sequelize.transaction((t: Transaction) => {
                return db.CompanyEmail.bulkCreate(companyEmails, { transaction: t })
                  .then((companyEmails: CompanyEmailInstance[]) => {
                    return companyEmails;
                  }).catch((err: any) => {
                    throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                  });
              });
            }
          }).catch((err: any) => {
            throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
          });;
      }
    ),

    updateEmail: compose(...authResolvers)(
      (
        parent,
        { input },
        { db, authCompany }: { db: DbConnection; authCompany: AuthCompany },
        info: GraphQLResolveInfo
      ) => {
        return db.sequelize
          .transaction((t: Transaction) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.CompanyEmail.findOne({ where: { id: input.id } })
              .then((companyEmail: CompanyEmailInstance) => {
                if (!companyEmail) throw new GraphqlRequestRestError({ code: 500, messageError: ` Email : ${input.id} não foi encontrado` });
                if (companyEmail.isMain) throw new GraphqlRequestRestError({ code: 500, messageError: `Email principal não pode ser alterado` });
                return companyEmail.update({ email: input.email, isActive: input.isActive, isValidade: input.isValidade }, {
                  transaction: t,
                  where: { id: input.id }
                }).then((companyEmailInstace: CompanyEmailInstance) => {
                  return companyEmailInstace;
                }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
              }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
          }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
      }
    ),

    deleteEmail: compose(...authResolvers)(
      (
        parent,
        { emailId },
        { db, authCompany }: { db: DbConnection; authCompany: AuthCompany },
        info: GraphQLResolveInfo
      ) => {
        return db.sequelize
          .transaction((t: Transaction) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.CompanyEmail.findOne({ where: { id: emailId } })
              .then((companyEmail: CompanyEmailInstance) => {
                if (!companyEmail) throw new GraphqlRequestRestError({ code: 500, messageError: `Email : ${emailId} não foi encontrado` });
                if (companyEmail.isMain) throw new GraphqlRequestRestError({ code: 500, messageError: `Email principal não pode ser removido` });
                return companyEmail.destroy({ transaction: t })
                  .then(email => !!email)
                  .catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
              }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
          }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
      }
    )
  } // fim do mutation
};
