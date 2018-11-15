import { DbConnection } from './DbConnectionInterface';
import { AuthCompany } from './AuthCompanyInterface';
import { RequestedFields } from '../graphql/ast/requestedFields';
import { OAuthApplication  } from './OAuthApplicationInterface';

export interface ResolverContext {
    db?: DbConnection;
    authorization?: string;
    authCompany?: AuthCompany;
    oauthApplication?: OAuthApplication;
    requestedFields?: RequestedFields
}
