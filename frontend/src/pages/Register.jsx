import { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (form.name.length < 20 || form.name.length > 60) return 'Name must be 20–60 characters';
    if (form.address.length > 400) return 'Address max 400 characters';
    if (form.password.length < 8 || form.password.length > 16) return 'Password must be 8–16 characters';
    if (!/[A-Z]/.test(form.password)) return 'Password must have at least 1 uppercase letter';
    if (!/[!@#$%^&*]/.test(form.password)) return 'Password must have at least 1 special character (!@#$%^&*)';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nameLen = form.name.length;
  const passChecks = {
    length: form.password.length >= 8 && form.password.length <= 16,
    upper: /[A-Z]/.test(form.password),
    special: /[!@#$%^&*]/.test(form.password),
  };

  return (
    <div style={S.page}>
      {/* LEFT */}
      <div style={S.left}>
        <div style={S.brand}>
          <div style={S.brandIcon}>🏪</div>
          <h1 style={S.brandTitle}>StoreRate</h1>
          <p style={S.brandSub}>Join thousands of users rating stores near you</p>
        </div>
        <div style={S.steps}>
          {[
            { step: '01', title: 'Create account', desc: 'Fill in your details below' },
            { step: '02', title: 'Browse stores', desc: 'Explore stores in your area' },
            { step: '03', title: 'Submit ratings', desc: 'Rate stores from 1 to 5 stars' },
          ].map((s, i) => (
            <div key={i} style={S.stepItem}>
              <div style={S.stepNum}>{s.step}</div>
              <div>
                <div style={S.stepTitle}>{s.title}</div>
                <div style={S.stepDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={S.right}>
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.avatarRing}>✨</div>
            <h2 style={S.cardTitle}>Create account</h2>
            <p style={S.cardSub}>Fill in the form to get started</p>
          </div>

          {error && (
            <div style={S.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div style={S.successBox}>
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={S.form}>
            {/* Name */}
            <div style={S.field}>
              <div style={S.labelRow}>
                <label style={S.label}>Full Name</label>
                <span style={{ ...S.charCount, color: nameLen >= 20 && nameLen <= 60 ? '#27ae60' : nameLen > 0 ? '#e74c3c' : '#aaa' }}>
                  {nameLen}/60
                </span>
              </div>
              <div style={S.inputWrap}>
                <span style={S.inputIcon}>👤</span>
                <input
                  style={S.input}
                  placeholder="Enter your full name (20–60 chars)"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div style={S.field}>
              <label style={S.label}>Email address</label>
              <div style={S.inputWrap}>
                <span style={S.inputIcon}>✉️</span>
                <input
                  style={S.input}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div style={S.field}>
              <label style={S.label}>Address <span style={S.optional}>(optional)</span></label>
              <div style={S.inputWrap}>
                <span style={S.inputIcon}>📍</span>
                <input
                  style={S.input}
                  placeholder="Your address (max 400 chars)"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <div style={S.inputWrap}>
                <span style={S.inputIcon}>🔒</span>
                <input
                  style={{ ...S.input, paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="8–16 chars, 1 uppercase, 1 special"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" style={S.eyeBtn} onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Password strength hints */}
              {form.password.length > 0 && (
                <div style={S.hints}>
                  {[
                    { ok: passChecks.length, text: '8–16 characters' },
                    { ok: passChecks.upper, text: 'One uppercase letter' },
                    { ok: passChecks.special, text: 'One special character (!@#$%^&*)' },
                  ].map((h, i) => (
                    <div key={i} style={S.hintItem}>
                      <span style={{ color: h.ok ? '#27ae60' : '#e74c3c', fontSize: '0.75rem' }}>
                        {h.ok ? '✓' : '✗'}
                      </span>
                      <span style={{ ...S.hintText, color: h.ok ? '#27ae60' : '#e74c3c' }}>{h.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{ ...S.submitBtn, opacity: loading ? 0.75 : 1 }}
              disabled={loading}
            >
              {loading ? '⏳ Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p style={S.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={S.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: '#f5f6fa',
  },

  /* LEFT */
  left: {
    flex: '0 0 40%',
    background: 'linear-gradient(145deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4rem 3rem',
    color: '#fff',
  },
  brand: { marginBottom: '3rem' },
  brandIcon: { fontSize: '3rem', marginBottom: '0.75rem' },
  brandTitle: { fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.4rem', color: '#fff', letterSpacing: '-0.5px' },
  brandSub: { color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: 0 },

  steps: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  stepItem: {
    display: 'flex', alignItems: 'flex-start', gap: '1rem',
    padding: '1rem', background: 'rgba(255,255,255,0.06)',
    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
  },
  stepNum: {
    flexShrink: 0, width: '36px', height: '36px',
    borderRadius: '50%', background: 'rgba(102,126,234,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc',
    border: '1px solid rgba(102,126,234,0.4)',
  },
  stepTitle: { fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '2px' },
  stepDesc: { color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' },

  /* RIGHT */
  right: {
    flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '2rem',
    overflowY: 'auto',
  },
  card: {
    background: '#fff', borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
    padding: '2.5rem', width: '100%', maxWidth: '440px',
  },

  cardHeader: { textAlign: 'center', marginBottom: '1.75rem' },
  avatarRing: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '60px', height: '60px', borderRadius: '50%',
    background: '#fff8e6', fontSize: '1.8rem', marginBottom: '1rem',
    border: '3px solid #fde68a',
  },
  cardTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 0.3rem' },
  cardSub: { color: '#888', fontSize: '0.88rem', margin: 0 },

  errorBox: {
    background: '#fff5f5', border: '1px solid #fcc', borderRadius: '10px',
    padding: '0.75rem 1rem', color: '#c0392b', fontSize: '0.875rem',
    marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  successBox: {
    background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '10px',
    padding: '0.75rem 1rem', color: '#276749', fontSize: '0.875rem',
    marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
  },

  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#444', letterSpacing: '0.3px' },
  optional: { fontWeight: 400, color: '#aaa' },
  charCount: { fontSize: '0.75rem', fontWeight: 600 },

  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', fontSize: '1rem', pointerEvents: 'none', zIndex: 1 },
  input: {
    width: '100%', padding: '11px 12px 11px 38px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.9rem', color: '#1a1a2e', background: '#fafbff',
    outline: 'none', boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute', right: '10px', background: 'none',
    border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '4px', lineHeight: 1,
  },

  hints: { display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' },
  hintItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  hintText: { fontSize: '0.75rem' },

  submitBtn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    marginTop: '0.5rem', letterSpacing: '0.3px',
  },

  footerText: { textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.875rem' },
  link: { color: '#667eea', fontWeight: 600, textDecoration: 'none' },
};