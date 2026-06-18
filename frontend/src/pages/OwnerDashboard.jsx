import { useState, useEffect } from 'react';
import { getStoreRatings, getStoreAverage } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    if (user.store_id) {
      getStoreRatings(user.store_id).then(r => setRatings(r.data));
      getStoreAverage(user.store_id).then(r => setAverage(r.data));
    }
  }, []);

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const getStars = (rating) =>
    [1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= rating ? '#fbbf24' : '#374151', fontSize: '14px' }}>★</span>
    ));

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avgVal = average?.average ? Number(average.average) : null;
  const totalRatings = average?.total || 0;

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🏪</div>
          <div>
            <div style={styles.brandTitle}>Store Owner Dashboard</div>
            <div style={styles.brandSub}>Manage your store ratings</div>
          </div>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>↩ Logout</button>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Average Rating</div>
          <div style={styles.statNum}>
            {avgVal ? avgVal.toFixed(1) : '—'}
          </div>
          <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '6px' }}>
            {getStars(Math.round(avgVal || 0))}
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Ratings</div>
          <div style={styles.statNum}>{totalRatings}</div>
          <div style={styles.statSub}>from users</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Store</div>
          <div style={{ ...styles.statNum, fontSize: '22px' }}>{user.name || '—'}</div>
          <div style={styles.statSub}>{user.email || ''}</div>
        </div>
      </div>

      {/* Table section */}
      <div style={styles.tableSection}>
        <div style={styles.sectionLabel}>Users Who Rated</div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan={3} style={styles.emptyCell}>No ratings yet</td>
                </tr>
              ) : (
                ratings.map(r => (
                  <tr key={r.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>{getInitials(r.user?.name)}</div>
                        <span style={styles.userName}>{r.user?.name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.emailText}>{r.user?.email}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.ratingCell}>
                        <div style={{ display: 'flex', gap: '2px' }}>{getStars(r.rating)}</div>
                        <span style={styles.ratingNum}>{r.rating}/5</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    background: '#0d0f14',
    minHeight: '100vh',
    color: '#e2e8f0',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  brandIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px',
  },
  brandTitle: { fontSize: '18px', fontWeight: '600', color: '#f1f5f9' },
  brandSub: { fontSize: '12px', color: '#6b7280', marginTop: '2px' },
  logoutBtn: {
    background: '#3b1f1f',
    border: '0.5px solid #7f1d1d',
    color: '#f87171',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: '#141720',
    border: '0.5px solid #1e2433',
    borderRadius: '16px',
    padding: '1.5rem',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: '10px',
    fontWeight: '500',
  },
  statNum: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#fbbf24',
    lineHeight: 1,
  },
  statSub: { fontSize: '12px', color: '#4b5563', marginTop: '6px' },
  tableSection: {
    background: '#141720',
    border: '0.5px solid #1e2433',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  sectionLabel: {
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: '#6366f1',
    textTransform: 'uppercase',
    fontWeight: '500',
    padding: '1.25rem 1.5rem 0',
    marginBottom: '1rem',
  },
  tableWrap: { overflowX: 'auto' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px 1.5rem',
    fontSize: '11px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#4b5563',
    fontWeight: '500',
    borderBottom: '0.5px solid #1e2433',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '0.5px solid #1a1f2e',
    transition: 'background 0.15s',
  },
  td: {
    padding: '12px 1.5rem',
    fontSize: '13px',
    color: '#94a3b8',
  },
  emptyCell: {
    padding: '2rem',
    textAlign: 'center',
    color: '#4b5563',
    fontSize: '13px',
    fontStyle: 'italic',
  },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '32px', height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: '600', color: '#fff',
    flexShrink: 0,
  },
  userName: { color: '#e2e8f0', fontWeight: '500', fontSize: '13px' },
  emailText: { color: '#6b7280', fontSize: '13px' },
  ratingCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  ratingNum: {
    background: '#1a1500',
    border: '0.5px solid #713f12',
    color: '#fbbf24',
    fontSize: '11px',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '20px',
  },
};