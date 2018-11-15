/**
 * Interface para o processo de Authenticação de Aplicação
 */
export interface OAuthApplication {
    id: string;
    clientId: string;
    clientSecret: string;
}