const companyEmailTypes = `
	# Email da empresa
	type CompanyEmail {
		#Identificador do registro 
		id: ID!
		# Email
		email: String!
		# Se é email principal
		isMain: Boolean!
		# Verifica se está ativo
		isActive : Boolean!
		# Email foi validado
		isValidade: Boolean!
		# Data de criação do registo
		createdAt: String!

	}

# atualiza o email da empresa
input CompanyEmailUpdate {
	 # Identificador do registro
	 id: ID! 
	 # Email da empresa
	 email : String!
	 # Se email está ativo
	 isActive: Boolean!
	 # Verifica se email já foi validado
	 isValidade: Boolean!
}	

# Emails que serão inseridos
input InsertCompanyEmail{
	email: String!
}

`;

const companyEmailQueries = `
	# Retorna os emails da empresa
	getcompanyEmails(first: Int, offset: Int): [ CompanyEmail! ]!
`;

const companyEmailMutations = `
	# Inserir os emails 
	insertEmails(emails: [InsertCompanyEmail!]!): [ CompanyEmail! ]!
	# atualiza o email da empresa
	updateEmail(input: CompanyEmailUpdate!) : CompanyEmail! 
	# Deleta o email 
	deleteEmail(emailId: ID!) : Boolean
`;

export { companyEmailTypes, companyEmailQueries, companyEmailMutations  }