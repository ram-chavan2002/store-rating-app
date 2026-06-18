import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'store_owner') navigate('/owner');
      else navigate('/stores');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.brand}>
          <div style={S.brandIcon}>🏪</div>
          <h1 style={S.brandTitle}>StoreRate</h1>
          <p style={S.brandSub}>Discover & rate the best stores near you</p>
        </div>
        <div style={S.features}>
          {[
            { icon: '⭐', text: 'Rate stores 1–5 stars' },
            { icon: '🔍', text: 'Search by name or address' },
            { icon: '📊', text: 'Owners track their ratings' },
            { icon: '🛡️', text: 'Admin controls everything' },
          ].map((f, i) => (
            <div key={i} style={S.featureItem}>
              <span style={S.featureIcon}>{f.icon}</span>
              <span style={S.featureText}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.right}>
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.avatarRing}>🏪</div>
            <h2 style={S.cardTitle}>Welcome back</h2>
            <p style={S.cardSub}>Sign in to your account</p>
          </div>

          {error && (
            <div style={S.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={S.form}>
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

            <div style={S.field}>
              <label style={S.label}>Password</label>
              <div style={S.inputWrap}>
                <span style={S.inputIcon}>🔒</span>
                <input
                  style={{ ...S.input, paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  style={S.eyeBtn}
                  onClick={() => setShowPass(p => !p)}
                  aria-label="Toggle password"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{ ...S.submitBtn, opacity: loading ? 0.75 : 1 }}
              disabled={loading}
            >
              {loading ? (
                <span style={S.spinner}>⏳ Signing in…</span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p style={S.footerText}>
            New here?{' '}
            <Link to="/register" style={S.link}>Create an account</Link>
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

  /* ── LEFT PANEL ── */
  left: {
    flex: '0 0 42%',
    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4rem 3rem',
    color: '#fff',
  },
  brand: { marginBottom: '3rem' },
  brandIcon: { fontSize: '3rem', marginBottom: '0.75rem' },
  brandTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    margin: '0 0 0.4rem',
    letterSpacing: '-0.5px',
    color: '#fff',
  },
  brandSub: { color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: 0 },

  features: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  featureIcon: { fontSize: '1.3rem', flexShrink: 0 },
  featureText: { color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' },

  /* ── RIGHT PANEL ── */
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
  },

  cardHeader: { textAlign: 'center', marginBottom: '1.75rem' },
  avatarRing: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#f0f2ff',
    fontSize: '1.8rem',
    marginBottom: '1rem',
    border: '3px solid #e0e3ff',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 0.3rem',
  },
  cardSub: { color: '#888', fontSize: '0.9rem', margin: 0 },

  errorBox: {
    background: '#fff5f5',
    border: '1px solid #fcc',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#c0392b',
    fontSize: '0.875rem',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#444', letterSpacing: '0.3px' },

  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '1rem',
    pointerEvents: 'none',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    background: '#fafbff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px',
    lineHeight: 1,
  },

  submitBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  spinner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },

  footerText: { textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.875rem' },
  link: { color: '#667eea', fontWeight: 600, textDecoration: 'none' },
};