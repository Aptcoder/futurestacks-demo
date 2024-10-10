import axios, { AxiosInstance } from 'axios';
import * as config from 'config';

export class PaystackService {
  api_key: string;
  http_client: AxiosInstance;

  constructor() {
    this.api_key = config.get<string>('paystack_key');
    this.http_client = axios.create({
      baseURL: 'https://api.paystack.co', // Paystack API base URL
      headers: {
        Authorization: `Bearer ${this.api_key}`, // Set the Paystack secret key from environment variables
        'Content-Type': 'application/json',
      },
      timeout: 5000, // Set timeout for requests
    });
  }

  async getBanks() {
    try {
      const response = await this.http_client.get('/bank?country=nigeria');
      if (response.status === 200) {
        return {
          success: true,
          banks: response.data.data,
        };
      }
    } catch (err) {
      console.log('error getting paystack banks', err);
      return {
        success: false,
        message: 'Error',
      };
    }
  }

  async resolveBankAccount({
    accountNumber,
    bankCode,
  }: {
    accountNumber: string;
    bankCode: string;
  }) {
    try {
      const response = await this.http_client.get(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      );
      if (response.status === 200) {
        return {
          success: true,
          accountNumber: response.data.data.account_number,
          accountName: response.data.data.account_name,
        };
      }
    } catch (err) {
      console.log('error getting paystack banks', err);
      return {
        success: false,
        message: 'Error',
      };
    }
  }

  async verifyTransactions({ reference }: { reference: string }) {
    try {
      const response = await this.http_client.get(
        `/transaction/verify/${reference}`,
      );

      if (response.status === 200) {
        if (response.data.data.status === 'success') {
          return {
            success: true,
            message: 'Verified',
          };
        } else {
          return {
            success: false,
            message: 'Not yet completed',
          };
        }
      }
    } catch (err) {
      console.log('error verifying paystack transaction', err);
      return {
        success: false,
        message: 'Error',
      };
    }
  }

  async transfer({
    recipient_code,
    amount,
    reference,
  }: {
    recipient_code: string;
    amount: number;
    reference: string;
  }) {
    try {
      const response = await this.http_client.post('/transfer', {
        amount,
        recipient: recipient_code,
        reference,
        source: 'Balance',
        reason: 'Withdrawal',
      });

      if (response.status === 200) {
        return {
          success: true,
          status: response.data.data.status,
        };
      }
    } catch (err) {
      console.log('error creating paystack transaction', err);
      return {
        success: false,
        message: 'Error',
      };
    }
  }

  async createTransaction({
    email,
    amount,
    reference,
    metaData,
    transactionCharge,
    subaccount,
  }: {
    email: string;
    amount: number;
    reference?: string;
    metaData?: string;
    transactionCharge?: string;
    subaccount?: string;
  }) {
    try {
      const response = await this.http_client.post('/transaction/initialize', {
        email,
        amount,
        callback_url: 'http://localhost:3001/transactions',
        reference,
        metadata: metaData,
        transaction_charge: transactionCharge,
        subaccount,
      });

      if (response.status === 200) {
        return {
          success: true,
          authUrl: response.data.data.authorization_url,
          reference: response.data.data.reference,
        };
      }
    } catch (err) {
      console.log('error creating paystack transaction', err);
      return {
        success: false,
        message: 'Error',
      };
    }
  }

  async createSubaccount({
    bankCode,
    businessName,
    accountNumber,
  }: {
    businessName: string;
    bankCode: string;
    accountNumber: string;
  }) {
    try {
      const response = await this.http_client.post('/subaccount', {
        bank_code: bankCode,
        business_name: businessName,
        account_number: accountNumber,
        percentage_charge: 10,
      });

      if (response.status === 201) {
        return {
          success: true,
          subaccountCode: response.data.data.subaccount_code,
        };
      }
    } catch (err) {
      console.log('error creating paystack subaccount', err);
      return {
        success: false,
        message: 'Error',
      };
    }
  }

  async createRecipient({
    bankCode,
    name,
    accountNumber,
  }: {
    name: string;
    bankCode: string;
    accountNumber: string;
  }) {
    try {
      const response = await this.http_client.post('/transferrecipient', {
        bank_code: bankCode,
        name,
        account_number: accountNumber,
        type: 'nuban',
      });

      if (response.status === 201) {
        return {
          success: true,
          recipientCode: response.data.data.recipient_code,
          bankName: response.data.data.details.bank_name,
          accountName: response.data.data.details.account_name,
          accountNumber: response.data.data.details.account_number,
        };
      }
    } catch (err) {
      console.log('error creating paystack subaccount', err);
      return {
        success: false,
        message: 'Error',
      };
    }
  }
}
