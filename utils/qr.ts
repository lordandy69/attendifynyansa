// utils/qr.ts
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";
import { supabase } from "./supabaseClient";

// Generate a QR code for a session
export async function generateQrCode(sessionId: string, expiryMinutes: number = 15) {
  try {
    const qrData = {
      sessionId,
      timestamp: new Date().toISOString(),
    };

    // Convert data to string for QR
    const qrString = JSON.stringify(qrData);

    // Generate QR Code as Data URL
    const qrCodeUrl = await QRCode.toDataURL(qrString);

    // Calculate expiry timestamp
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + expiryMinutes);

    // Save QR code + expiry in sessions table
    const { data, error } = await supabase
      .from("sessions")
      .update({
        qr_code: qrCodeUrl,
        qr_expiry: expiry.toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("QR generation failed:", err);
    throw err;
  }
}

// Validate if a QR code is still valid
export async function validateQrCode(sessionId: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("qr_expiry")
    .eq("id", sessionId)
    .single();

  if (error) throw error;
  if (!data?.qr_expiry) throw new Error("No QR code found for this session");

  const now = new Date();
  const expiry = new Date(data.qr_expiry);

  return now <= expiry; // ✅ true if still valid
}
