const emailTypes = `
    # Dados do email que foi enviado
    type emailSendingResponse {
        # Endereço do email para o qual foi enviado
        message : String!
    }

    # Dados do email
    input emailSender {
        # Endereço de email
        email: String!
    }

    # Dados de envio de email 
    input attachment {
        # Nome do arquivo
        fileName: String!
        # Conteudo do arquivo na base 64
        content: String!
    }

    # Dados para o envio do email
    input emailSending {
        # Nome titulo do email
        subject: String!
        # Coleção de email que serão enviados
        senders: [ emailSender! ]!
        # Coleção de emails com copia 
        senderCcs: [ emailSender! ]
        # Coleção de emails com copia oculta
        senderBccs: [ emailSender! ]
        # Arquivos que devem ser enviados como anexo
        attachments: [ attachment! ]
    }

`;

const emailMutations = `
    # Envia o email
    senderEmail(emailSender : emailSending!): emailSendingResponse!
`;

export { emailTypes, emailMutations };

