export type DetailsResponse = {
    functionCode: number;
    responseCode: number;
    commerceCode: number;
    terminalId: string;
    responseMessage: string | null;
    successful: number;
    ticket: string;
    authorizationCode: string | null;
    amount: string;
    last4Digits: number;
    operationNumber: string;
    cardType: string;
    accountingDate: string;
    accountNumber: string;
    cardBrand: string;
    realDate: string;
    realTime: string;
    employeeId: string;
    tip: number;
    feeAmount: string;
    feeNumber: string;
}
