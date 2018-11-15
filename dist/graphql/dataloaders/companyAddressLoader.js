"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyAddressLoader {
    static batchCompanyAddressLoader(companyaddress, params, requestFields) {
        let ids = params.map(param => param.key);
        return Promise.resolve(companyaddress.findAll({
            where: { companyId: { $in: ids } },
            attributes: requestFields.getFields(params[0].info, { keep: ['id', 'companyId'], exclude: ['phones', 'addresses'] })
        }));
    }
}
exports.CompanyAddressLoader = CompanyAddressLoader;
