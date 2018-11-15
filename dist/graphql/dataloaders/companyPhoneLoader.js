"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyPhoneLoader {
    static bathCompanyPhone(companyPhone, params, requestFields) {
        let ids = params.map(param => param.key);
        return Promise.resolve(companyPhone.findAll({
            where: { companyId: { $in: ids } },
            attributes: requestFields.getFields(params[0].info, { keep: ['id', 'companyId'], exclude: ['phones', 'addresses'] })
        }));
    }
}
exports.CompanyPhoneLoader = CompanyPhoneLoader;
