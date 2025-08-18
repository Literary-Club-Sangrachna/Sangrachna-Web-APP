import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookApprovalEmailRequest {
  userEmail: string;
  userName: string;
  bookTitle: string;
  bookAuthor: string;
  dueDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, bookTitle, bookAuthor, dueDate }: BookApprovalEmailRequest = await req.json();

    console.log("Sending book approval email to:", userEmail);

    const dueDateText = dueDate 
      ? `Please return the book by ${new Date(dueDate).toLocaleDateString()}.`
      : "Please return the book within the specified time period.";

    const emailResponse = await resend.emails.send({
      from: "Sangrachna Library <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Book Request Approved - ${bookTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Book Request Approved!</h1>
          
          <p>Dear ${userName},</p>
          
          <p>Great news! Your request for the book <strong>"${bookTitle}"</strong> by ${bookAuthor} has been approved.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Collection Details:</h3>
            <p><strong>Location:</strong> NIET PLOT 19, B BLOCK, FIRST FLOOR, KITABGARH CABIN, A.</p>
            <p><strong>Book:</strong> ${bookTitle} by ${bookAuthor}</p>
            <p><strong>Important:</strong> ${dueDateText}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0;"><strong>Important Reminder:</strong> Please return the book on time to avoid any fines. Late returns may affect your future borrowing privileges.</p>
          </div>
          
          <p>Thank you for being part of the Sangrachna Kitabghar community!</p>
          
          <p>Best regards,<br>
          <strong>Sangrachna Library Team</strong><br>
          NIET, Greater Noida</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-book-approval-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);