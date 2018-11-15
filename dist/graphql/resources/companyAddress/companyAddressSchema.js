"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companyAddressTypes = `
# Endereco da empresa
 type CompanyAddress {
     # Identificador do endereco
     id: ID!
     # Endereço
     address: String!
     # Tipo do endereço
     addressType: String!
     # Numero do endereço
     addressNumber: String!
     # Proposito do endereço
     addressPurpose: String!
     # Codigo da caixa postal
     cep: String
     # Bairro
     neighbordhood: String!
     # Cidade
     city: String!
     # Estado
     state: String!
     # País
     country: String!
     # Esta ativo
     isActive: Boolean!
     # Data de criacao do registro
     createdAt: String!
 }

 # Endereço para ser cadastrado
 input CompanyAddressCreate {
    # Endereço
    address: String!
    # Numero do endereço
    addressNumber: String!
    # Codigo da caixa postal
    cep: String
    # Tipo do endereço
    addressType: String!
    # Proposito do endereco
    addressPurpose: AddressPurpose!
    # Bairro
    neighbordhood: String!
    # Cidade
    city: String!
 }

 # Endereço para ser cadastrado
 input CompanyAddressUpdate {
    # Identificador do endereco
    id: ID!
    # Endereço
    address: String!
    # Numero do endereço
    addressNumber: String!
    # Codigo da caixa postal
    cep: String
    # Tipo do endereço
    addressType: String!
    # Proposito do endereco
    addressPurpose: AddressPurpose!
    # Bairro
    neighbordhood: String!
    # Cidade
    city: String!
    # Ativo
    isActive: Boolean!
 }

 enum AddressPurpose{
    Comercial
    Entrega
    Cobranca
 }

`;
exports.companyAddressTypes = companyAddressTypes;
const companyAddressQueries = `
    # retorna os endereços da empresa
    findCompanyAddress(isActive: Boolean) : [ CompanyAddress! ]!
`;
exports.companyAddressQueries = companyAddressQueries;
const companAddressMutations = `
    # inserir novos endereços
    insertAddressCompany(addresses: [ CompanyAddressCreate !]!): [ CompanyAddress! ]!
    # Atualizar um endereço
    updateAddressCompany(address: CompanyAddressUpdate): CompanyAddress!
    # deletar o registro de endereço
    deleteAddressCompany(id: ID!) : Boolean
`;
exports.companAddressMutations = companAddressMutations;
