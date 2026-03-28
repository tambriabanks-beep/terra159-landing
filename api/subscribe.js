export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const greeting = name ? `Hey ${name}` : 'Hey';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Tambria · Terra 159 <hello@terra159.org>',
      to: [email],
      subject: "You're in. Welcome to Terra 159.",
      html: `
        <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:2rem;color:#2C1A0E;background:#FAF5EC;">
          <p style="font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:#C1622F;margin-bottom:1.5rem;">Terra 159 · tambria.banks</p>
          <h1 style="font-size:1.8rem;line-height:1.2;margin-bottom:1rem;">${greeting} — you made it.</h1>
          <p style="font-size:1rem;line-height:1.7;color:#4A2E1A;margin-bottom:1rem;">
            I'm Tambria. First-generation beginning farmer, mom of two, builder of Terra 159 —
            a food access simulator for all 159 counties in Georgia.
          </p>
          <p style="font-size:1rem;line-height:1.7;color:#4A2E1A;margin-bottom:1rem;">
            I'm documenting all of it in real time: the Journeyman Farmer program,
            the red clay, the Extension classes, the wins and the things that went sideways.
          </p>
          <p style="font-size:1rem;line-height:1.7;color:#4A2E1A;margin-bottom:2rem;">
            You'll hear from me when something worth sharing happens. No noise. Just the real stuff.
          </p>
          <div style="background:#2C1A0E;padding:1.25rem 1.5rem;border-radius:8px;margin-bottom:2rem;">
            <p style="color:#E8C98A;font-size:0.9rem;margin:0 0 0.5rem;font-weight:bold;">While you're here →</p>
            <p style="color:#c8bfb2;font-size:0.875rem;margin:0;line-height:1.6;">
              Explore the Terra 159 map at <a href="https://terra159.org" style="color:#D4845A;">terra159.org</a>
              and find what's in your county.
            </p>
          </div>
          <p style="font-size:0.875rem;color:#7a6e60;">Follow along:
            <a href="https://threads.net/@tambria.banks" style="color:#C1622F;">Threads</a> ·
            <a href="https://facebook.com/tambria.banks" style="color:#C1622F;">Facebook</a>
          </p>
          <p style="font-size:0.75rem;color:#b0a898;margin-top:2rem;padding-top:1rem;border-top:1px solid #EDE8DC;">
            Terra 159 · TAMB Consulting · WOSB + EDWOSB Certified<br>
            You're getting this because you subscribed at terra159.org
          </p>
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
