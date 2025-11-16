export interface PaymentData {
  session_id: string;
  payment_url: string;
  return_url: string;
  serviceId: string;
  amount: number;
  currency: string;
  customer_email: string;
  signature: string;
}

export interface VerifiedOrder {
  email: string;
  amount: string | number;
  currency: string;
}
