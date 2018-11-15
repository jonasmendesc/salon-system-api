import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import { OAuthApplication } from "../../../interfaces/OAuthApplicationInterface";
import { GraphQLResolveInfo } from "graphql";
import * as nodemailer from 'nodemailer';
import { compose } from "../../composable/composableResolvers";
import { authAppResolvers } from "../../composable/authAppResolvers";
import { ACCOUNT_EMAIL, PASS_EMAIL } from "../../../utils/util";

export const EmailResolvers = {
    Mutation: {
        senderEmail: compose(...authAppResolvers)((parent, { emailSender }, { db, oauthApplication }: { db: DbConnection, oauthApplication: OAuthApplication }, info: GraphQLResolveInfo) => {

            let poolConfig = {
                pool: true,
                host: 'smtp.live.com',
                port: 587,
                secure: false,
                auth: {
                    user: ACCOUNT_EMAIL,
                    pass: PASS_EMAIL
                }
            };

            console.log("poolConfig verificar os dados no log", poolConfig);

            var emailSenders: string = emailSender.senders.reduce((accum, curr) => {
                if (accum)
                    return accum + ', ' + curr.email;
                return curr.email;
            }, "");

            var mailOptions = {
                from: "weregotenks2008@hotmail.com",
                to: emailSenders,
                subject: emailSender.subject,
                html: "<b> Bora dar uma fumadinha ✔</b>"
            }

            if (emailSender.attachments) {
                var attachments = emailSender.attachments.map((file) => {
                    return {

                        filename: file.fileName,
                        content: file.content,
                        encoding: 'base64'
                    }
                });
                mailOptions["attachments"] = attachments;
            }

            var smtpTransport = nodemailer.createTransport(poolConfig, null);

            if (emailSender.senderCcs) {
                var emailSenderCcs: string = emailSender.senderCcs.reduce((accum, curr) => {
                    if (accum)
                        return accum + ', ' + curr.email;
                    return curr.email;
                }, "");

                mailOptions["cc"] = emailSenderCcs;
            }

            if (emailSender.senderBccs) {

                var emailSenderBcs: string = emailSender.senderCcs.reduce((accum, curr) => {
                    if (accum)
                        return accum + ', ' + curr.email;
                    return curr.email;
                }, "");

                mailOptions["bcc"] = emailSenderBcs;
            }

            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } 
                
                smtpTransport.close();
            });

            return { message: "Socilitação de email enviada" };

        })
    }
}