export const BANK_INFO = {
  bankName: process.env.BANK_NAME ?? "請於 .env 設定 BANK_NAME",
  bankCode: process.env.BANK_CODE ?? "000",
  accountNumber: process.env.BANK_ACCOUNT ?? "請於 .env 設定 BANK_ACCOUNT",
  accountName: process.env.BANK_ACCOUNT_NAME ?? "請於 .env 設定 BANK_ACCOUNT_NAME",
};
