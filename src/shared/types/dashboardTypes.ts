export type dashboardtypes = {
  subtitle: string;
  total: number;
};


export type GlobalQRCodeType = {
  message: string;
  token: string;
  url: string;
  qrCodeDataUrl: string;
}

export type StaticQRCodeType = {
  message: string;
  qrCodeDataUrl: string;
  url: string;
}

export type MockTestRegistrationQRCodeType = {
  message: string;
  qrCodeDataUrl: string;
  url: string;
}