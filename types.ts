
export type Role = 'Administrator' | 'Manager' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
}

export interface IndianEntry {
  id: string;
  date: string;
  invoiceNo: string;
  shipperName: string;
  buyerName: string;
  depotName: string;
  doc: number;
  ctn: number;
  ton: number;
  truckUnload: number;
  con: number;
  others: number;
  totalTaka: number;
  employeeName?: string;
}

export interface BillInfo {
  id: string;
  date: string;
  invoiceNo: string;
  shipperName:string;
  totalDoc: number;
  totalIndian: number;
  totalBill: number;
  paidBill: number;
  dueBill: number;
  miscApprovedBill: number;
}

export interface AccountEntry {
  id: string;
  date: string;
  purpose: string;
  amount: number;
  remarks: string;
}

export interface TruckInfo {
  id: string;
  date: string;
  truckNumber: string;
  driverMobile: string;
  depot: string;
  inTime: string;
  outTime: string;
}

export interface Settings {
  adminName: string;
  roleTitle: string;
  profileImageUrl: string;
  theme: string;
  brightness: number;
  zoom: number;
  fontFamily: string;
  bgColor: string;
  textColor: string;
  language: string;
}

export interface BusinessEntity {
  id: string;
  type: 'SHIPPER' | 'BUYER' | 'DEPOT';
  name: string;
}

export interface DepotCode {
  id: string;
  code: string;
  alias?: string;
}

export interface PriceRate {
  id: string;
  buyerName: string;
  condition: 'DOC' | 'CTN' | 'TON' | 'TRUCK UNLOAD';
  rate: number;
}
