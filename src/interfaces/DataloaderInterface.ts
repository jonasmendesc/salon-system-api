import * as DataLoader from 'dataloader';
import { DataloaderParameter } from './DataloaderParamInterface';
import { CompanyPhoneInstance } from '../models/companyPhoneModel';
import { CompanyAddressInstance } from '../models/companyAddressModel';
import { SaleMobileInstance } from '../models/saleMobileModel';

export interface Dataloaders {
	companyPhoneLoader: DataLoader<DataloaderParameter<number>, CompanyPhoneInstance>;
	companyAddressLoader: DataLoader<DataloaderParameter<number>, CompanyAddressInstance>;
	saleMobileLoader: DataLoader<DataloaderParameter<number>, SaleMobileInstance>;
}
