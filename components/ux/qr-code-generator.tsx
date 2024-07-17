"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function useQRCodeGenerator() {
  const [inputString, setInputString] = useState("");
  const [qrCodeValue, setQRCodeValue] = useState("");

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
    QRCodeComponent: () => (
      <QRCodeSVG
        value={qrCodeValue}
        size={256}
        level={"H"}
        includeMargin={true}
      />
    ),
  };
}
