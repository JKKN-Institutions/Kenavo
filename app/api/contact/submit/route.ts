import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    // Validation
    if (!full_name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get IP address and user agent
    const ip_address = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Upload files to Supabase Storage
    const uploadedFiles: Array<{ name: string; size: number; type: string; url: string }> = [];

    for (const file of files) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contact-attachments')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
          });

        if (uploadError) {
          console.error('File upload error:', uploadError);
          continue; // Skip this file but continue with submission
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('contact-attachments')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl
        });
      }
    }

    // Save to database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert([{
        full_name,
        email,
        message,
        files: uploadedFiles,
        ip_address,
        user_agent,
        status: 'unread'
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    // Send email to admin using Resend
    try {
      const adminEmailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@kenavo2k.com',
        replyTo: email,
        to: process.env.EMAIL_TO || 'kenavo2k@gmail.com',
        subject: `[Kenavo Alumni] New Contact Inquiry from ${full_name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
              .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .info-row { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6; }
              .info-row:last-child { border-bottom: none; margin-bottom: 0; }
              .label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
              .value { font-size: 15px; color: #111827; }
              .message-box { background: #f9fafb; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .attachments { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin: 20px 0; }
              .attachments h3 { margin-top: 0; color: #92400e; font-size: 14px; }
              .attachments ul { margin: 10px 0 0 0; padding-left: 20px; }
              .attachments li { margin: 5px 0; }
              .attachments a { color: #b45309; text-decoration: none; }
              .attachments a:hover { text-decoration: underline; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
              .button:hover { background: #5568d3; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 13px; background: #f9fafb; border-radius: 0 0 10px 10px; }
              .timestamp { color: #9ca3af; font-size: 13px; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📬 New Contact Inquiry</h1>
              <p>Kenavo Alumni Directory - Montfort Class of 2000</p>
            </div>
            <div class="content">
              <div class="info-row">
                <div class="label">From</div>
                <div class="value">${full_name}</div>
              </div>
              <div class="info-row">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
              </div>
              <div class="info-row">
                <div class="label">Submitted</div>
                <div class="value timestamp">${new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
              <div class="message-box">
                <div class="label" style="margin-bottom: 10px;">Message</div>
                <div class="value">${message.replace(/\n/g, '<br />')}</div>
              </div>
              ${uploadedFiles.length > 0 ? `
                <div class="attachments">
                  <h3>📎 ${uploadedFiles.length} Attachment${uploadedFiles.length > 1 ? 's' : ''}</h3>
                  <ul>
                    ${uploadedFiles.map(f => `
                      <li>
                        <a href="${f.url}" target="_blank">${f.name}</a>
                        <span style="color: #92400e;">(${(f.size / 1024).toFixed(2)} KB)</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
              <center>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin-panel" class="button">
                  View in Admin Panel →
                </a>
              </center>
            </div>
            <div class="footer">
              <p>This email was sent from the Kenavo Alumni Directory contact form.</p>
              <p>Reply directly to this email to respond to ${full_name}.</p>
            </div>
          </body>
          </html>
        `,
      });
      console.log('Admin email sent successfully:', adminEmailResult);
    } catch (emailError: any) {
      console.error('Failed to send admin email:', emailError);
      console.error('Email error details:', {
        message: emailError?.message,
        response: emailError?.response?.data,
        status: emailError?.response?.status
      });
      // Don't fail the submission if email fails
    }

    // Send confirmation email to user using Resend
    try {
      const confirmationEmailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@kenavo2k.com',
        to: email,
        subject: 'Thank you for reaching out - Kenavo Alumni Directory',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
              .container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 600; }
              .header p { margin: 0; font-size: 15px; opacity: 0.9; }
              .content { padding: 40px 30px; }
              .greeting { font-size: 18px; color: #111827; margin-bottom: 20px; font-weight: 500; }
              .message-text { color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
              .divider { border: none; border-top: 2px solid #e5e7eb; margin: 30px 0; }
              .your-message { background: #f9fafb; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; margin: 25px 0; }
              .your-message h3 { margin: 0 0 15px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
              .your-message-content { color: #374151; font-size: 14px; line-height: 1.8; }
              .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0; }
              .info-box p { margin: 0; color: #1e40af; font-size: 14px; }
              .signature { margin-top: 30px; color: #4b5563; }
              .signature p { margin: 5px 0; }
              .signature .team-name { font-weight: 600; color: #111827; }
              .footer { background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
              .footer p { margin: 5px 0; color: #6b7280; font-size: 13px; }
              .footer a { color: #667eea; text-decoration: none; }
              .footer a:hover { text-decoration: underline; }
              .checkmark { display: inline-block; width: 60px; height: 60px; background: #10b981; border-radius: 50%; text-align: center; line-height: 60px; font-size: 30px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="checkmark">✓</div>
                <h1>Message Received!</h1>
                <p>Kenavo Alumni Directory - Montfort Class of 2000</p>
              </div>
              <div class="content">
                <div class="greeting">Hi ${full_name},</div>
                <div class="message-text">
                  Thank you for reaching out to the <strong>Kenavo Alumni Directory</strong>! We greatly appreciate you taking the time to connect with us.
                </div>
                <div class="info-box">
                  <p>✉️ Your message has been successfully delivered to our team. We'll review it and get back to you as soon as possible, typically within 24-48 hours.</p>
                </div>
                <div class="divider"></div>
                <div class="your-message">
                  <h3>📝 Your Message</h3>
                  <div class="your-message-content">${message.replace(/\n/g, '<br />')}</div>
                </div>
                ${uploadedFiles.length > 0 ? `
                  <div class="your-message">
                    <h3>📎 Attached Files (${uploadedFiles.length})</h3>
                    <div class="your-message-content">
                      ${uploadedFiles.map(f => `• ${f.name}`).join('<br />')}
                    </div>
                  </div>
                ` : ''}
                <div class="divider"></div>
                <div class="signature">
                  <p>Best regards,</p>
                  <p class="team-name">The Kenavo Team</p>
                  <p style="color: #6b7280; font-size: 14px;">Montfort School Class of 2000</p>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated confirmation email from the Kenavo Alumni Directory.</p>
                <p>If you have any urgent concerns, please reply to this email directly.</p>
                <p style="margin-top: 15px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}">Visit Alumni Directory</a> •
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact">Contact Us</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      console.log('Confirmation email sent successfully:', confirmationEmailResult);
    } catch (emailError: any) {
      console.error('Failed to send confirmation email:', emailError);
      console.error('Email error details:', {
        message: emailError?.message,
        response: emailError?.response?.data,
        status: emailError?.response?.status
      });
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      submissionId: submission.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
