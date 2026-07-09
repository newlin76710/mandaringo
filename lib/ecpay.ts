import { createHash, randomBytes } from "crypto";

/**
 * 綠界(ECPay) 全方位金流 AioCheckOut 串接工具。
 * 商店代號 / HashKey / HashIV 由 ECPay 商店後台取得，金流與電子發票服務共用同一組值。
 */
function getConfig() {
  const merchantId = process.env.ECPAY_MERCHANT_ID;
  const hashKey = process.env.ECPAY_HASH_KEY;
  const hashIv = process.env.ECPAY_HASH_IV;
  if (!merchantId || !hashKey || !hashIv) {
    throw new Error("ECPAY_MERCHANT_ID / ECPAY_HASH_KEY / ECPAY_HASH_IV 尚未於 .env 設定");
  }
  const isStage = process.env.ECPAY_ENV === "stage";
  return {
    merchantId,
    hashKey,
    hashIv,
    aioCheckoutUrl: isStage
      ? "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
      : "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5",
  };
}

/**
 * ECPay 的 CheckMacValue 使用 .NET UrlEncode 風格的百分比編碼（非標準 encodeURIComponent），
 * 這裡照官方文件規則把 encodeURIComponent 的輸出轉換成 .NET 相容格式。
 */
function dotNetUrlEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/%20/g, "+")
    .replace(/%2D/gi, "-")
    .replace(/%5F/gi, "_")
    .replace(/%2E/gi, ".")
    .replace(/%21/gi, "!")
    .replace(/%2A/gi, "*")
    .replace(/%28/gi, "(")
    .replace(/%29/gi, ")");
}

export function generateCheckMacValue(params: Record<string, string | number>, hashKey: string, hashIv: string): string {
  const sortedKeys = Object.keys(params).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const raw = [`HashKey=${hashKey}`, ...sortedKeys.map((k) => `${k}=${params[k]}`), `HashIV=${hashIv}`].join("&");
  const encoded = dotNetUrlEncode(raw).toLowerCase();
  return createHash("sha256").update(encoded).digest("hex").toUpperCase();
}

export function verifyCheckMacValue(params: Record<string, string>, hashKey: string, hashIv: string): boolean {
  const { CheckMacValue, ...rest } = params;
  if (!CheckMacValue) return false;
  return generateCheckMacValue(rest, hashKey, hashIv) === CheckMacValue;
}

/** MerchantTradeNo：ECPay 要求英數字、長度 <= 20。 */
export function generateMerchantTradeNo(): string {
  return `MG${Date.now().toString(36)}${randomBytes(3).toString("hex")}`.toUpperCase().slice(0, 20);
}

function formatTradeDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export type EcpayCheckoutInput = {
  merchantTradeNo: string;
  totalAmount: number;
  itemName: string;
  tradeDesc: string;
  returnURL: string;
  clientBackURL: string;
  paymentInfoURL: string;
};

/** 組出送往 ECPay AioCheckOut/V5 的完整表單欄位（含 CheckMacValue）。 */
export function buildAioCheckoutParams(input: EcpayCheckoutInput) {
  const { merchantId, hashKey, hashIv, aioCheckoutUrl } = getConfig();

  const params: Record<string, string | number> = {
    MerchantID: merchantId,
    MerchantTradeNo: input.merchantTradeNo,
    MerchantTradeDate: formatTradeDate(new Date()),
    PaymentType: "aio",
    TotalAmount: Math.round(input.totalAmount),
    TradeDesc: input.tradeDesc,
    ItemName: input.itemName,
    ReturnURL: input.returnURL,
    // TODO: 排除 10100050 參數錯誤後改回 "ALL"
    ChoosePayment: "Credit",
    ClientBackURL: input.clientBackURL,
    NeedExtraPaymentInfo: "Y",
    PaymentInfoURL: input.paymentInfoURL,
    ExpireDate: 3,
    EncryptType: 1,
  };

  const checkMacValue = generateCheckMacValue(params, hashKey, hashIv);

  return { actionUrl: aioCheckoutUrl, params: { ...params, CheckMacValue: checkMacValue } };
}

export function getEcpayCredentials() {
  const { hashKey, hashIv } = getConfig();
  return { hashKey, hashIv };
}
