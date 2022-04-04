interface IUser {
  id: number;
  name: string;
  designation: string;
  companyNring: string;
  company_name: string;
  phone_number: string;
  pan_no: string;
  email: string;
  tin_no: string;
  service_tax_reg_no: string;
  user_type: number;
  agrmt_signed: boolean;
  pod_percent: number;
  pod_due_days: number;
  advance_percentage: number;
  delivery_due_days: number;
  delivery_percantage: number;
  billing_address: string;
  plan_id: number;
  balance_credits: number;
  other_amt: number;
  pending_tds_count: number;
  bank_detail: any;
  security: string;
  claimed_offers: any[];
  live_offer: boolean;
  rfq_remaining: number;
  plan_rfqs: number;
  trips_remaining: number;
  plan_trips: number;
  address1: string;
  address2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
}

export const CUSTOMER_TYPES: any = {
  1: 'Individual',
  2: 'HUF',
  3: 'Company',
  4: 'Firm',
};

export class User {
  constructor(user: IUser) {
    this.userId = user.id;
    this.name = user.name;
    this.designation = user.designation;
    this.companyName = user.company_name;
    this.phoneNumber = user.phone_number;
    this.panNo = user.pan_no;
    this.email = user.email;
    this.tinNo = user.tin_no;
    this.serviceTaxRegNo = user.service_tax_reg_no;
    this.userType = user.user_type;
    this.agrmt_signed = user.agrmt_signed;
    this.podPercentage = user.pod_percent;
    this.podDueDays = user.pod_due_days;
    this.advancePercentage = user.advance_percentage;
    this.deliveryDueDays = user.delivery_due_days;
    this.deliveryPercentage = user.delivery_percantage;
    this.billingAddress = user.billing_address;
    this.planId = user.plan_id;
    this.balanceCredits = user.balance_credits;
    this.other_amt = user.other_amt;
    this.pendingTdsCount = user.pending_tds_count;
    this.bankDetails = user.bank_detail;
    this.securityDeposit = Number(user.security);
    this.claimed_offers = user.claimed_offers;
    this.live_offer = user.live_offer;
    this.planRfqs = user.plan_rfqs;
    this.planTrips = user.plan_trips;
    this.tripsRemaining = user.trips_remaining;
    this.rfqsRemaining = user.rfq_remaining;
    this.address1 = user.address1;
    this.address2 = user.address2;
    this.landmark = user.landmark;
    this.pincode = user.pincode;
    this.city = user.city;
    this.state = user.state;
  }
  userId: number;
  name: string;
  designation: string;
  companyNring: string | undefined;
  companyName: string;
  phoneNumber: string;
  panNo: string;
  email: string;
  tinNo: string;
  serviceTaxRegNo: string;
  userType: number;
  agrmt_signed: boolean;
  podPercentage: number;
  podDueDays: number;
  advancePercentage: number;
  deliveryDueDays: number;
  deliveryPercentage: number;
  billingAddress: string;
  planId: number;
  balanceCredits: number;
  other_amt: number;
  pendingTdsCount: number;
  bankDetails: any;
  securityDeposit: number;
  claimed_offers: any[];
  live_offer: boolean;
  rfqsRemaining: number;
  tripsRemaining: number;
  planRfqs: number;
  planTrips: number;
  address1: string;
  address2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;

  get isHUF(): boolean {
    return true;
  }

  get ctype(): string {
    let userType = this.userType;
    return CUSTOMER_TYPES[userType];
  }

  // get hasNoSecurityDeposit(): boolean {
  //   return this.securityDeposit == 0;
  // }

  get hasCredits(): boolean {
    return this.balanceCredits > 0;
  }

  get taxInfo(): any {
    if (this.userType == 1 || this.userType == 2)
      return '*Extra Service Tax/GST will be charged for Individuals and HUF';
    else return '';
  }

  get hasNoCredits(): boolean {
    return this.balanceCredits < 1;
  }

  get isSubscribed(): boolean {
    return !!this.planId;
  }

  // get payableSecurity(): number {
  //   return 10000 - this.securityDeposit;
  // }

  // get hasMinBalance(): boolean {
  //   return this.securityDeposit == 10000;
  // }

  cannotPay(tripCharges: any, advanceTrip: boolean = false): boolean {
    if (advanceTrip) return this.balanceCredits + this.other_amt < 0;
    else return this.balanceCredits < tripCharges;
  }

  get quotesRemaining(): string {
    return `${this.rfqsRemaining || 0}/${this.planRfqs || 0}`;
  }

  get remainingTrips(): string {
    return `${this.tripsRemaining || 0}/${this.planTrips || 0}`;
  }

  get planName(): string {
    if (this.planId == 1) return 'LITE';
    if (this.planId == 2) return 'BASIC';
    if (this.planId == 3) return 'PREMIUM';
    else return '';
  }

  get planStyle(): any {
    if (this.planId == 1 || this.planId == 2 || this.planId == 3) {
      return {
        'font-weight': 'bold',
        color: 'forestgreen',
      };
    } else {
      return {
        'font-weight': 'bold',
        color: 'red',
      };
    }
  }
}
