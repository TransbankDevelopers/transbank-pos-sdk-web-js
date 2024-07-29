export type RefundResponse = {
    functionCode: number;
    responseCode: number;
    commerceCode: number;
    terminalId: string;
    authorizationCode: string | null;
    operationId: string;
    responseMessage: string | null;
    successful: number;
}
