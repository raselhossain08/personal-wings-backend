import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private client: paypal.core.PayPalHttpClient;

  constructor(private configService: ConfigService) {
    const environment = new paypal.core.SandboxEnvironment(
      configService.get('PAYPAL_CLIENT_ID'),
      configService.get('PAYPAL_CLIENT_SECRET'),
    );
    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(amount: number, currency: string, items: any[] = []) {
    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toString(),
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: amount.toString(),
                },
              },
            },
            items: items.map(item => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: currency,
                value: item.price.toString(),
              },
            })),
          },
        ],
        application_context: {
          brand_name: 'Personal Wings',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${this.configService.get('APP_URL')}/payment/success`,
          cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
        },
      });

      const response = await this.client.execute(request);
      return {
        orderId: response.result.id,
        status: response.result.status,
        links: response.result.links,
      };
    } catch (error) {
      throw new BadRequestException(`PayPal order creation failed: ${error.message}`);
    }
  }

  async captureOrder(orderId: string) {
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.prefer('return=representation');

      const response = await this.client.execute(request);
      return {
        orderId: response.result.id,
        status: response.result.status,
        captureId: response.result.purchase_units[0].payments.captures[0].id,
        amount: response.result.purchase_units[0].payments.captures[0].amount.value,
      };
    } catch (error) {
      throw new BadRequestException(`PayPal order capture failed: ${error.message}`);
    }
  }

  async getOrder(orderId: string) {
    try {
      const request = new paypal.orders.OrdersGetRequest(orderId);
      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      throw new BadRequestException(`PayPal order retrieval failed: ${error.message}`);
    }
  }

  async createPayout(amount: number, email: string, note: string) {
    try {
      const request = new paypal.payouts.PayoutsPostRequest();
      request.requestBody({
        sender_batch_header: {
          recipient_type: 'EMAIL',
          email_message: note,
          note,
          sender_batch_id: `batch_${Date.now()}`,
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: amount.toString(),
              currency: 'USD',
            },
            receiver: email,
            note,
          },
        ],
      });

      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      throw new BadRequestException(`PayPal payout failed: ${error.message}`);
    }
  }
}