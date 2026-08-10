import { Injectable, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

export interface DerivMetrics {
  balance: number;
  currency: string;
  openExposure: number;
}

@Injectable()
export class DerivService {
  private readonly logger = new Logger(DerivService.name);
  private readonly APP_ID = '1089';
  private readonly WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${this.APP_ID}`;

  async getMetrics(token: string): Promise<DerivMetrics> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.WS_URL);
      let balance = 0;
      let currency = 'USD';
      let openExposure = 0;

      // Handle connection timeout
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Deriv API connection timeout'));
      }, 10000);

      ws.on('open', () => {
        // Authenticate first
        ws.send(JSON.stringify({ authorize: token }));
      });

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const response = JSON.parse(data.toString());

          if (response.error) {
            clearTimeout(timeout);
            ws.close();
            return reject(new Error(response.error.message));
          }

          if (response.msg_type === 'authorize') {
            // Once authorized, request balance and portfolio
            balance = response.authorize.balance || 0;
            currency = response.authorize.currency || 'USD';
            ws.send(JSON.stringify({ portfolio: 1 }));
          }

          if (response.msg_type === 'portfolio') {
            const contracts = response.portfolio.contracts || [];
            // Calculate total open exposure (buy price of open contracts)
            openExposure = contracts.reduce((sum: number, contract: any) => sum + (contract.buy_price || 0), 0);
            
            clearTimeout(timeout);
            ws.close();
            resolve({ balance, currency, openExposure });
          }
        } catch (error) {
          this.logger.error('Error parsing Deriv message', error);
        }
      });

      ws.on('error', (error) => {
        clearTimeout(timeout);
        this.logger.error('Deriv WebSocket Error', error);
        reject(error);
      });
    });
  }
}
