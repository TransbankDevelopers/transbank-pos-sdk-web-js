import { EventEmitter } from 'events';
import type { Socket } from 'socket.io-client';
import { SaleResponse, LoadKeysResponse, TotalsResponse, RefundResponse, DetailsResponse, CloseResponse, PortStatusResponse, IntermediateMessageResponse } from './responses';

export class TransbankPOSWebSocket extends EventEmitter {
    isConnected: boolean;
    debugEnabled: boolean;
    timeout: number;

    constructor();

    debug(...args: any[]): void;

    socket(): Socket | null;

    connect(socketIoUrl?: string, options?: object): Promise<boolean>;

    disconnect(): Promise<boolean>;

    send(method: string, params?: object): Promise<boolean | any[]>;

    autoconnect(baudrate?: number): Promise<string | boolean>;

    poll(): Promise<boolean>;

    getPorts(): Promise<object[]>;

    openPort(portName: string, baudrate?: number): Promise<boolean>;

    closePort(): Promise<boolean>;

    loadKeys(): Promise<LoadKeysResponse>;

    getKeys(): Promise<LoadKeysResponse>;

    getLastSale(): Promise<SaleResponse>;

    getTotals(): Promise<TotalsResponse>;

    refund(operationId: string): Promise<RefundResponse>;

    getDetails(printOnPos?: boolean): Promise<DetailsResponse>;

    closeDay(): Promise<CloseResponse>;

    setNormalMode(): Promise<boolean>;

    getPortStatus(): Promise<PortStatusResponse>;

    doSale(amount: number, ticket: string, callback?: (status: IntermediateMessageResponse) => void): Promise<SaleResponse>;

    doMulticodeSale(amount: number, ticket: string, commerceCode?: string, callback?: (status: IntermediateMessageResponse) => void): Promise<SaleResponse>;
}

export const POS: TransbankPOSWebSocket;

export default POS;
