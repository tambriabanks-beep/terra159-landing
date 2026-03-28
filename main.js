// ── SUBSCRIBE FORM ──
async function handleSubscribe(source) {
  const isHero = source === 'hero';
  const emailInput = document.getElementById(isHero ? 'hero-email' : 'cta-email');
  const nameInput  = isHero ? document.getElementById('hero-name') : null;
  const btn        = document.getElementById(isHero ? 'hero-btn' : 'cta-btn');
  const successEl  = document.getElementById(isHero ? 'hero-success' : 'cta-success');
  const errorEl    = isHero ? document.getElementById('hero-error') : null;

  const email = emailInput.value.trim();
  const name  = nameInput ? nameInput.value.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (errorEl) { errorEl.textContent = 'Please enter a valid email.'; errorEl.style.display = 'block'; }
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending\u2026';
  if (errorEl) errorEl.style.display = 'none';

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });

    if (res.ok) {
      emailInput.value = '';
      if (nameInput) nameInput.value = '';
      if (isHero) {
        document.querySelector('.input-row').style.display = 'none';
        successEl.style.display = 'flex';
      } else {
        document.querySelector('.cta-form-wrap').style.display = 'none';
        successEl.style.display = 'block';
      }
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Something went wrong.');
    }
  } catch (e) {
    btn.disabled = false;
    btn.textContent = isHero ? 'Follow along' : "I'm in";
    if (errorEl) {
      errorEl.textContent = 'Something went wrong. Try again in a sec.';
      errorEl.style.display = 'block';
    }
    console.error(e);
  }
}

// ── ENTER KEY ON EMAIL INPUTS ──
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('hero-email').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSubscribe('hero');
  });
  document.getElementById('cta-email').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSubscribe('cta');
  });

  // ── CHECKBOX VISUAL TOGGLE ──
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      cb.closest('.check-item').classList.toggle('checked', cb.checked);
    });
  });

  // ── RADIO PILL VISUAL TOGGLE ──
  document.querySelectorAll('.radio-pill input[type="radio"]').forEach(function(r) {
    r.addEventListener('change', function() {
      var name = r.name;
      document.querySelectorAll('input[name="' + name + '"]').forEach(function(other) {
        other.closest('.radio-pill').classList.remove('selected');
      });
      r.closest('.radio-pill').classList.add('selected');
    });
  });
});

// ── FARMER FORM ──
var currentPanel = 1;
var TOTAL_PANELS = 5;

function updateProgress(panel) {
  for (var i = 1; i <= TOTAL_PANELS; i++) {
    var bar = document.getElementById('step-bar-' + i);
    if (i < panel)        bar.className = 'progress-step done';
    else if (i === panel) bar.className = 'progress-step active';
    else                  bar.className = 'progress-step';
  }
}

function showPanel(n) {
  document.querySelectorAll('.form-panel').forEach(function(p) {
    p.classList.remove('active');
  });
  document.getElementById('panel-' + n).classList.add('active');
  currentPanel = n;
  updateProgress(n);
  document.getElementById('farmer-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getChecked(gridId) {
  return Array.from(document.querySelectorAll('#' + gridId + ' input:checked')).map(function(c) { return c.value; });
}

function getRadio(name) {
  var el = document.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : '';
}

function showErr(id, show) {
  var el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
}

function nextPanel(from) {
  if (from === 1) {
    var email        = document.getElementById('f-email').value.trim();
    var farmName     = document.getElementById('f-farm-name').value.trim();
    var county       = document.getElementById('f-county').value;
    var city         = document.getElementById('f-city').value.trim();
    var zip          = document.getElementById('f-zip').value.trim();
    var contactEmail = document.getElementById('f-contact-email').value.trim();
    var valid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('err-email', true); valid = false; } else showErr('err-email', false);
    if (!farmName)     { showErr('err-farm-name', true); valid = false; } else showErr('err-farm-name', false);
    if (!county)       { showErr('err-county', true);    valid = false; } else showErr('err-county', false);
    if (!city)         { showErr('err-city', true);      valid = false; } else showErr('err-city', false);
    if (!zip)          { showErr('err-zip', true);       valid = false; } else showErr('err-zip', false);
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) { showErr('err-contact-email', true); valid = false; } else showErr('err-contact-email', false);
    if (!valid) return;
  }

  if (from === 2) {
    var produce   = getChecked('produce-grid');
    var buy       = getChecked('buy-grid');
    var customers = getRadio('customers');
    var valid2 = true;
    if (!produce.length)   { showErr('err-produce', true);    valid2 = false; } else showErr('err-produce', false);
    if (!buy.length)       { showErr('err-buy', true);        valid2 = false; } else showErr('err-buy', false);
    if (!customers)        { showErr('err-customers', true);  valid2 = false; } else showErr('err-customers', false);
    if (!valid2) return;
  }

  showPanel(from + 1);
}

function prevPanel(from) { showPanel(from - 1); }

async function submitFarmerForm() {
  var c1 = document.getElementById('consent-1').checked;
  var c2 = document.getElementById('consent-2').checked;
  var valid = true;
  if (!c1) { showErr('err-consent-1', true); valid = false; } else showErr('err-consent-1', false);
  if (!c2) { showErr('err-consent-2', true); valid = false; } else showErr('err-consent-2', false);
  if (!valid) return;

  var btn = document.getElementById('submit-farmer-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting\u2026';

  var data = {
    email:          document.getElementById('f-email').value.trim(),
    farmName:       document.getElementById('f-farm-name').value.trim(),
    county:         document.getElementById('f-county').value,
    city:           document.getElementById('f-city').value.trim(),
    zip:            document.getElementById('f-zip').value.trim(),
    social:         document.getElementById('f-social').value.trim(),
    contactEmail:   document.getElementById('f-contact-email').value.trim(),
    phone:          document.getElementById('f-phone').value.trim(),
    produce:        getChecked('produce-grid').join(', '),
    buyMethods:     getChecked('buy-grid').join(', '),
    customers:      getRadio('customers'),
    certifications: Array.from(document.querySelectorAll('#panel-3 .check-grid input:checked')).map(function(c){return c.value;}).join(', '),
    minority:       getRadio('minority'),
    minorityId:     Array.from(document.querySelectorAll('#minority-identity-group input:checked')).map(function(c){return c.value;}).join(', '),
    selfDescribe:   document.getElementById('f-self-describe').value.trim(),
    story:          document.getElementById('f-story').value.trim(),
    farmingLength:  getRadio('farming-length'),
    feature:        getRadio('feature'),
    referral:       getRadio('referral'),
  };

  try {
    await fetch('/api/farmer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch(e) { console.error('Submission failed', e); }

  // show success regardless
  document.querySelector('.progress-bar').style.display = 'none';
  document.querySelectorAll('.form-panel').forEach(function(p) { p.style.display = 'none'; });
  document.getElementById('farmer-success').style.display = 'block';
}
