import { CompanyAddressModel, CompanyAddressInstance } from "../../models/companyAddressModel";
import { DataloaderParameter } from "../../interfaces/DataloaderParamInterface";
import { RequestedFields } from "../ast/requestedFields";

export class CompanyAddressLoader {

    static batchCompanyAddressLoader(companyaddress: CompanyAddressModel, params: DataloaderParameter<number>[], requestFields: RequestedFields): Promise<CompanyAddressInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(companyaddress.findAll({ 
            where: { companyId: { $in: ids } }, 
            attributes: requestFields.getFields(params[0].info, { keep: ['id', 'companyId'], exclude: ['phones', 'addresses'] }) }));

    }

}