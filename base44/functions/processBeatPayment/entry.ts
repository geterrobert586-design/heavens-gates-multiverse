import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.0.0';
import { jsPDF } from 'npm:jspdf@4.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized - User not authenticated' }, { status: 401 });
    }

    const { session_id } = await req.json();

    if (!session_id) {
      return Response.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const metadata = session.metadata;
    const beatId = metadata.beat_id;
    const beatTitle = metadata.beat_title;
    const licenseType = metadata.license_type;
    const pricePaid = parseFloat(metadata.price || session.amount_total / 100);
    const ownerEmail = metadata.owner_email;
    const ownerName = metadata.owner_name;

    // Verify user email matches the license owner email
    if (user.email !== ownerEmail) {
      return Response.json({ error: 'Unauthorized - Email mismatch' }, { status: 403 });
    }

    // Calculate expiration date based on license type
    const purchaseDate = new Date();
    let expirationDate = new Date();
    let licenseTerm = '';

    if (licenseType === 'mp3') {
      expirationDate.setFullYear(expirationDate.getFullYear() + 3);
      licenseTerm = '3 years';
    } else if (licenseType === 'wav_premium') {
      expirationDate.setFullYear(expirationDate.getFullYear() + 5);
      licenseTerm = '5 years';
    } else if (licenseType === 'unlimited_exclusive') {
      // Lifetime - set far future date
      expirationDate.setFullYear(expirationDate.getFullYear() + 99);
      licenseTerm = 'Lifetime';
    }

    // Generate License Certificate PDF
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("LICENSE CERTIFICATE", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Urban Guerilla Beats & Productions", 105, 35, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("A Division of Robert Leon Geter II, LLC", 105, 42, { align: "center" });
    
    // Divider
    doc.setLineWidth(0.5);
    doc.line(20, 48, 190, 48);
    
    // License Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("LICENSE DETAILS", 20, 60);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const details = [
      `License Number: UG-${Date.now()}`,
      `Beat Title: ${beatTitle}`,
      `License Type: ${licenseType.replace('_', ' ').toUpperCase()}`,
      `License Term: ${licenseTerm}`,
      `Purchase Date: ${purchaseDate.toLocaleDateString()}`,
      `Expiration Date: ${expirationDate.toLocaleDateString()}`,
      `Amount Paid: $${pricePaid.toFixed(2)}`,
    ];
    
    let yPos = 70;
    details.forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });
    
    // Licensee Information
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("LICENSEE INFORMATION", 20, yPos);
    
    doc.setFont("helvetica", "normal");
    yPos += 6;
    doc.text(`Name: ${ownerName || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Email: ${ownerEmail}`, 20, yPos);
    
    // Terms Summary
    yPos += 15;
    doc.setFont("helvetica", "bold");
    doc.text("LICENSE TERMS SUMMARY", 20, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    yPos += 6;
    
    const terms = licenseType === 'mp3' ? [
      "• Up to 10,000 streams/downloads",
      "• Non-profit use only",
      "• No radio or TV broadcast",
      "• Must credit: 'Prod. by Urban Guerilla Beats & Productions'",
      "• Artist responsible for tracking expiration",
    ] : licenseType === 'wav_premium' ? [
      "• Up to 100,000 streams/downloads",
      "• Commercial use allowed (Spotify, Apple Music, etc.)",
      "• Radio play permitted (non-major stations)",
      "• Music video rights included",
      "• Buyout option available at term end",
      "• Artist responsible for tracking expiration",
    ] : [
      "• Unlimited streams and distribution",
      "• Full commercial rights",
      "• Radio, TV, and sync licensing",
      "• Track ownership transfer",
      "• Lifetime validity",
      "• Buyout option available at term end",
      "• Artist responsible for tracking expiration",
    ];
    
    terms.forEach((term) => {
      doc.text(term, 20, yPos);
      yPos += 5;
    });
    
    // Footer
    yPos += 15;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("This license is governed by the terms of Urban Guerilla Beats & Productions.", 105, yPos, { align: "center" });
    yPos += 4;
    doc.text("© " + new Date().getFullYear() + " Robert Leon Geter II, LLC. All Rights Reserved.", 105, yPos, { align: "center" });
    
    // Convert PDF to base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    
    // Upload PDF to storage
    const pdfBlob = base64ToBlob(pdfBase64, 'application/pdf');
    const uploadResponse = await base44.integrations.Core.UploadFile({ file: pdfBlob });
    const certificateUrl = uploadResponse.file_url;

    // Create BeatLicense record
    const licenseRecord = await base44.entities.BeatLicense.create({
      beat_id: beatId,
      beat_title: beatTitle,
      license_type: licenseType,
      price_paid: pricePaid,
      purchase_date: purchaseDate.toISOString(),
      expiration_date: expirationDate.toISOString(),
      license_certificate_url: certificateUrl,
      stripe_payment_intent_id: session.payment_intent,
      owner_name: ownerName,
      owner_email: ownerEmail,
      status: 'active',
    });

    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: ownerEmail,
      subject: `License Certificate - ${beatTitle}`,
      body: `Thank you for your purchase from Urban Guerilla Beats & Productions!\n\nLicense Details:\n- Beat: ${beatTitle}\n- License Type: ${licenseType.replace('_', ' ').toUpperCase()}\n- Amount Paid: $${pricePaid.toFixed(2)}\n- Valid Until: ${expirationDate.toLocaleDateString()}\n\nDownload your license certificate: ${certificateUrl}\n\nIMPORTANT: You are responsible for tracking your license expiration date. Buyout options are available at term end for WAV Premium and Unlimited licenses.\n\n© Robert Leon Geter II, LLC`,
    });

    return Response.json({ 
      success: true, 
      licenseId: licenseRecord.id,
      certificateUrl,
      expirationDate: expirationDate.toISOString()
    });
  } catch (error) {
    console.error('Process payment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}