export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Terra 159 Directory <hello@terra159.org>',
      to: ['hello@terra159.org'],
      reply_to: data.contactEmail,
      subject: `New Farm Submission: ${data.farmName} — ${data.county} County`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:2rem;color:#2C1A0E;background:#FAF5EC;">
          <p style="color:#C1622F;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;">Terra 159 — New Farm Directory Submission</p>
          <h2 style="margin:0.5rem 0 1.5rem;">${data.farmName}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
            ${Object.entries({
              'County': data.county, 'City': data.city, 'Zip': data.zip,
              'Submission Email': data.email, 'Contact Email': data.contactEmail,
              'Phone': data.phone || '—', 'Social': data.social || '—',
              'Produces': data.produce, 'Sells via': data.buyMethods,
              'Accepting customers': data.customers,
              'Certifications': data.certifications || '—',
              'Minority-owned': data.minority || '—',
              'Years farming': data.farmingLength || '—',
              'Feature interest': data.feature || '—',
              'Referral': data.referral || '—',
            }).map(([k,v]) => `<tr style="border-bottom:1px solid #EDE8DC;">
              <td style="padding:0.6rem 0.5rem;color:#7a6e60;width:40%;">${k}</td>
              <td style="padding:0.6rem 0.5rem;font-weight:500;">${v}</td>
            </tr>`).join('')}
          </table>
          ${data.story ? `<div style="margin-top:1.5rem;padding:1rem;background:#EDE8DC;border-radius:6px;">
            <strong>Farm Story:</strong>
            <p style="margin-top:0.5rem;line-height:1.7;">${data.story}</p>
          </div>` : ''}
        </div>
      `
    })
  });

  if (!response.ok) {
    const err = await response.json();
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ success: true });
}
