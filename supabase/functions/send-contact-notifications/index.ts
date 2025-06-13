
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
const adminEmail = Deno.env.get("ADMIN_EMAIL");
const adminPhone = Deno.env.get("ADMIN_PHONE");

interface ContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

const sendSMS = async (to: string, message: string) => {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
  
  const formData = new URLSearchParams();
  formData.append('From', twilioPhoneNumber!);
  formData.append('To', to);
  formData.append('Body', message);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  return response.json();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactData }: { contactData: ContactMessage } = await req.json();
    
    console.log("Processing contact form submission:", contactData);

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Store in database
    const { data: savedMessage, error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || null,
        company: contactData.company || null,
        message: contactData.message,
        status: 'new'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save message to database");
    }

    console.log("Message saved to database:", savedMessage);

    // Send email notification
    const emailSubject = `New Contact Form Submission from ${contactData.firstName} ${contactData.lastName}`;
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
      ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${contactData.message}</p>
      <hr>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: [adminEmail!],
      subject: emailSubject,
      html: emailBody,
    });

    console.log("Email sent:", emailResponse);

    // Send SMS notification
    const smsMessage = `New contact form submission from ${contactData.firstName} ${contactData.lastName} (${contactData.email}). Message: ${contactData.message.substring(0, 100)}${contactData.message.length > 100 ? '...' : ''}`;
    
    const smsResponse = await sendSMS(adminPhone!, smsMessage);
    console.log("SMS sent:", smsResponse);

    // Update status to processed
    await supabase
      .from("contact_messages")
      .update({ 
        status: 'processed', 
        processed_at: new Date().toISOString() 
      })
      .eq('id', savedMessage.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: savedMessage.id,
        emailSent: !!emailResponse,
        smsSent: !!smsResponse
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-notifications function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
