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
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        replyTo: email,
        to: process.env.EMAIL_TO || 'kenavo2k@gmail.com',
        subject: `New Contact Form Submission from ${full_name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br />')}</p>
          <hr />
          ${uploadedFiles.length > 0 ? `
            <h3>Attachments (${uploadedFiles.length}):</h3>
            <ul>
              ${uploadedFiles.map(f => `<li><a href="${f.url}" target="_blank">${f.name}</a> (${(f.size / 1024).toFixed(2)} KB)</li>`).join('')}
            </ul>
          ` : ''}
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin-panel">View in Admin Panel</a></p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError);
      // Don't fail the submission if email fails
    }

    // Send confirmation email to user using Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'We received your message!',
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Hi ${full_name},</p>
          <p>Thank you for reaching out to the Kenavo Class of 2000!</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <hr />
          <h3>Your message:</h3>
          <p>${message.replace(/\n/g, '<br />')}</p>
          <hr />
          <p>Best regards,<br />
          The Kenavo Team<br />
          Montfort Class of 2000</p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
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
