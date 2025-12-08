export interface PaymentData {
  // session_id: string;
  // payment_url: string;
  // serviceId: string;
  // amount: number;
  // currency: string;
  // customer_email: string;
  return_url: string;
  signature: string;
  service_command: string;
  merchant_reference: string;
  merchant_identifier: string;
  language: string;
  access_code: string;
}

export interface VerifiedOrder {
  email: string;
  amount: string;
  currency: string;
}
