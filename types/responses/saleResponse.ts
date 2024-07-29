export type SaleResponse = {
    functionCode: number;
    responseCode: number;
    commerceCode: number;
    terminalId: string;
    responseMessage: string | null;
    successful: number;
    ticket: string;
    authorizationCode: string | null;
    amount: number;
    sharesNumber: number | string;
    sharesAmount: number | string;
    last4Digits: number | null;
    operationNumber: number | string;
    cardType: string;
    accountingDate: string;
    accountNumber: string;
    cardBrand: string;
    realDate: string;
    realTime: string;
    employeeId: number | string;
    tip: number | null;
}
