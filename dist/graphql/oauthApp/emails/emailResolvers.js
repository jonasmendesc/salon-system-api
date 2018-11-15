"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const composableResolvers_1 = require("../../composable/composableResolvers");
const authAppResolvers_1 = require("../../composable/authAppResolvers");
const util_1 = require("../../../utils/util");
exports.EmailResolvers = {
    Mutation: {
        senderEmail: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { emailSender }, { db, oauthApplication }, info) => {
            let poolConfig = {
                pool: true,
                host: 'smtp.live.com',
                port: 587,
                secure: false,
                auth: {
                    user: util_1.ACCOUNT_EMAIL,
                    pass: util_1.PASS_EMAIL
                }
            };
            console.log("poolConfig verificar os dados no log", poolConfig);
            var emailSenders = emailSender.senders.reduce((accum, curr) => {
                if (accum)
                    return accum + ', ' + curr.email;
                return curr.email;
            }, "");
            var mailOptions = {
                from: "weregotenks2008@hotmail.com",
                to: emailSenders,
                subject: emailSender.subject,
                html: "<b> Bora dar uma fumadinha ✔</b>"
            };
            if (emailSender.attachments) {
                var attachments = emailSender.attachments.map((file) => {
                    return {
                        filename: file.fileName,
                        content: file.content,
                        encoding: 'base64'
                    };
                });
                mailOptions["attachments"] = attachments;
            }
            var smtpTransport = nodemailer.createTransport(poolConfig, null);
            if (emailSender.senderCcs) {
                var emailSenderCcs = emailSender.senderCcs.reduce((accum, curr) => {
                    if (accum)
                        return accum + ', ' + curr.email;
                    return curr.email;
                }, "");
                mailOptions["cc"] = emailSenderCcs;
            }
            if (emailSender.senderBccs) {
                var emailSenderBcs = emailSender.senderCcs.reduce((accum, curr) => {
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
};
