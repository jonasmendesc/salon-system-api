import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import { AuthorizationInstance, AuthorizationAttributes } from "./../../../models/authorizationModel";
import { CompanyAttributes, CompanyInstance } from "../../../models/companyModel";
import { GraphQLResolveInfo } from "graphql";
import { OAuthApplication } from "../../../interfaces/OAuthApplicationInterface";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { CompanyEmailInstance, CompanyEmailAttributes } from "../../../models/companyEmailModel";
import { Transaction } from "sequelize";
import { compose } from "../../composable/composableResolvers";
import { authAppResolvers } from "../../composable/authAppResolvers";
import { RequestedFields } from "../../ast/requestedFields";
import { CompanyAddressAtrribute, CompanyAddressInstance } from "../../../models/companyAddressModel";
import { CompanyPhoneAttributes, CompanyPhoneInstance } from "../../../models/companyPhoneModel";

export const companyResolvers = {

    CompanyCreated: {
        companyEmails: (company, args, { db, requestedFields }: { db: DbConnection, requestedFields: RequestedFields }, info) => {
            return db.CompanyEmail.findAll(
                { where : { companyId: company.get('id') },
            attributes: requestedFields.getFields(info, { exclude: ['companyEmails'] }) })
            .catch((err: any) => {
                throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            })
        }
    },
    Mutation: {
        createCompany: compose(...authAppResolvers)((parent, { input, emails }, { db, oauthApplication }: { db: DbConnection, oauthApplication: OAuthApplication }, info: GraphQLResolveInfo) => {
            let emailsMain = emails.filter(x => x.isMain);
            if (emailsMain.length <= 0) throw new GraphqlRequestRestError({ code: 422, messageError: "Email principal não foi encontrado" });
            if (emailsMain.length > 1) throw new GraphqlRequestRestError({ code: 422, messageError: "Deve ser informado somente um email principal" })
            let emailMain = emailsMain[0];

            return db.CompanyEmail.find({ where: { email: emailMain.email }, attributes: ['id'] })
                .then((companyEmail: CompanyEmailInstance) => {
                    if (companyEmail) throw new GraphqlRequestRestError({ code: 422, messageError: "Já existe esse email cadastrado!" })
                    let authorization: AuthorizationAttributes = { name: input.name, authorizationType: "company" }
                    return db.sequelize.transaction((t: Transaction) => {
                        return db.Authorization.create(authorization, { transaction: t })
                            .then((authorizationInstance: AuthorizationInstance) => {
                                let companyAttribute: CompanyAttributes = {
                                    authorizationId: authorizationInstance.id,
                                    name: input.name,
                                    password: input.password,
                                }
                                return db.Company.create(companyAttribute, { transaction: t })
                                    .then((companyInstance: CompanyInstance) => {

                                        let companyEmails: CompanyEmailAttributes[] = emails.map(email => {
                                            let companyEmail: CompanyEmailAttributes = {
                                                companyId: companyInstance.id,
                                                email: email.email,
                                                isMain: email.isMain,
                                                isActive: true
                                            };
                                            return companyEmail;
                                        });

                                        return db.CompanyEmail.bulkCreate(companyEmails, { transaction: t })
                                            .then((companyEmails: CompanyEmailInstance[]) => {
                                                return companyInstance;
                                            }).catch((err: any) => {
                                                throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                                            })
                                    }).catch((err: any) => {
                                        throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                                    })
                            }).catch((err: any) => {
                                throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                            })
                    })
                }).catch((err: any) => {
                    throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                })
        })

    },

    Query: {
        dummy: compose(...authAppResolvers)((parent, { email }, { db, oauthApplication, requestedFields }: { db: DbConnection, oauthApplication: OAuthApplication, requestedFields: RequestedFields; }, info: GraphQLResolveInfo) => {
            return true;
        })
    }

}
