import { CompanyPhoneModel, CompanyPhoneInstance } from "../../models/companyPhoneModel";
import { DataloaderParameter } from "../../interfaces/DataloaderParamInterface";
import { RequestedFields } from "../ast/requestedFields";

export class CompanyPhoneLoader {

    static bathCompanyPhone(companyPhone: CompanyPhoneModel, params: DataloaderParameter<number>[], requestFields: RequestedFields): Promise<CompanyPhoneInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(companyPhone.findAll({ 
            where: { companyId: { $in: ids } }, 
            attributes: requestFields.getFields(params[0].info, { keep: ['id', 'companyId'], exclude: ['phones', 'addresses'] }) }));
    }

}