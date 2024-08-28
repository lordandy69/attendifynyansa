//@ts-nocheck
'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function useQRCodeGenerator() {
  const [inputString, setInputString] = useState('');
  const [qrCodeValue, setQRCodeValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputString(event.target.value);
  };

  const generateQRCode = () => {
    setQRCodeValue(inputString);
  };

  return {
    inputString,
    handleInputChange,
    generateQRCode,
    QRCodeComponentWithInput: () => (
      <QRCodeSVG
        value={qrCodeValue}
        size={256}
        level={'H'}
        includeMargin={true}
      />
    ),
    QRCodeComponent: ({
      qrcodevalue,
      size,
    }: {
      qrcodevalue: string;
      size?: number;
    }) => (
      <QRCodeSVG
        value={qrcodevalue}
        size={!size ? 256 : size}
        level={'H'}
        includeMargin={true}
      />
    ),
  };
}
