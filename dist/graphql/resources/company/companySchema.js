"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companyTypes = `
  # Empresa
  type Company {
    # Identificador da empresa
    id: ID!
    # Nome da empresa
    name: String!
    # Verifica se o email foi validado
    validateEmailCode: Boolean!
    # Codigo da licensa
    licenseCode: String!
    # Se empresa está ativa
    isActive: Boolean!
    # Data de criação do registros
    createdAt: String!
    # Telefones da empresa
    companyPhones: [CompanyPhone] 
    # Endereços da empresa
    companyAddresses: [CompanyAddress!]! 
    # Emails da empresa
    companyEmails: [CompanyEmail!]!
  }  

  # Dados para atualizar uma empresa
  input CompanyUpdateInput{
    # Novo nome da empresa
    name: String!
    # Verifica se o email foi validado
    validateEmailCode: Boolean!
    # Se empresa está ativa
    isActive: Boolean!
}

# Dados para atualização da senha da empresa
input CompanyUpdatePasswordInput{
  # Novo password da empresa
  newPassword: String!
  # Password antigo
  oldPassword: String!
}
`;
exports.companyTypes = companyTypes;
const companiesQueries = `
    # Retorna a empresa pelo seu id
    company: Company
`;
exports.companiesQueries = companiesQueries;
const companiesMutations = `
    # Atualiza os dados da empresa e retorna a empresa criada exceto Password
    updateCompany(input: CompanyUpdateInput!): Company!
    # Atualiza o password da empresa e retorna true para sucesso ou false para falha
    updateCompanyPassword(input: CompanyUpdatePasswordInput!): Boolean
`;
exports.companiesMutations = companiesMutations;
