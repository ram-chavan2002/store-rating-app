import { useState, useEffect } from 'react';
import { getStores, getStoreAverage, submitRating } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [averages, setAverages] = useState({});
  const [ratingInput, setRatingInput] = useState({});
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => { fetchStores(); }, []);

  const fetchStores = async (params = {}) => {
    const res = await getStores(params);
    const list = res.data.entities || res.data;
    setStores(list);
    list.forEach(async (s) => {
      const avg = await getStoreAverage(s.id);
      setAverages(prev => ({ ...prev, [s.id]: avg.data }));
    });
  };

  const handleSearch = () => fetchStores(search);

  const handleRating = async (storeId) => {
    const rating = ratingInput[storeId];
    if (!rating || rating < 1 || rating > 5) { setMessage('Rating must be 1-5'); return; }
    await submitRating({ store_id: storeId, rating: Number(rating) });
    setMessage('Rating submitted!');
    fetchStores(search);
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const getStarDisplay = (avg) => {
    const val = avg ? Math.round(Number(avg)) : 0;
    return [1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= val ? '#fbbf24' : '#374151', fontSize: '15px' }}>★</span>
    ));
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatarGradients = [
    'linear-gradient(135deg,#4f46e5,#7c3aed)',
    'linear-gradient(135deg,#0f6e56,#1d9e75)',
    'linear-gradient(135deg,#185fa5,#378add)',
    'linear-gradient(135deg,#993c1d,#d85a30)',
    'linear-gradient(135deg,#3b1f6e,#7c3aed)',
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🏪</div>
          <span style={styles.brandTitle}>StoreRate</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.welcomeBadge}>👤 Welcome, {user.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>↩ Logout</button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={styles.msgBar}>
          ✅ {message}
        </div>
      )}

      {/* Search */}
      <div style={styles.searchBar}>
        <input
          style={styles.searchInput}
          placeholder="Search by store name..."
          value={search.name}
          onChange={e => setSearch({ ...search, name: e.target.value })}
        />
        <input
          style={styles.searchInput}
          placeholder="Search by address..."
          value={search.address}
          onChange={e => setSearch({ ...search, address: e.target.value })}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>🔍 Search</button>
      </div>

      {/* Section label */}
      <div style={styles.sectionLabel}>All Stores — {stores.length} results</div>

      {/* Grid */}
      <div style={styles.grid}>
        {stores.map((store, idx) => {
          const avg = averages[store.id];
          const hasRating = avg?.average;
          return (
            <div key={store.id} style={styles.card}>
              {/* Card header */}
              <div style={styles.cardHeader}>
                <div style={{
                  ...styles.storeAvatar,
                  background: avatarGradients[idx % avatarGradients.length]
                }}>
                  {getInitials(store.name)}
                </div>
                {hasRating ? (
                  <div style={styles.ratingBadge}>
                    ★ {Number(avg.average).toFixed(1)}
                  </div>
                ) : (
                  <div style={styles.noRating}>No ratings yet</div>
                )}
              </div>

              {/* Store info */}
              <div style={styles.storeName}>{store.name}</div>
              <div style={styles.infoRow}>📍 {store.address}</div>
              <div style={styles.infoRow}>✉️ {store.email}</div>

              <div style={styles.divider} />

              {/* Rating section */}
              <div style={styles.ratingSection}>
                <div style={styles.ratingLabel}>
                  {hasRating ? 'Overall rating' : 'Be the first to rate'}
                </div>
                <div style={{ display: 'flex', gap: '3px', margin: '4px 0' }}>
                  {getStarDisplay(avg?.average)}
                </div>
                <div style={styles.ratingRow}>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="1–5"
                    style={styles.starInput}
                    value={ratingInput[store.id] || ''}
                    onChange={e => setRatingInput({ ...ratingInput, [store.id]: e.target.value })}
                  />
                  <button onClick={() => handleRating(store.id)} style={styles.rateBtn}>
                    ➤ Submit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandIcon: {
    width: '38px', height: '38px',
    background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px',
  },
  brandTitle: { fontSize: '20px', fontWeight: '600', color: '#f1f5f9' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  welcomeBadge: {
    background: '#1e2433',
    border: '0.5px solid #2d3748',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#94a3b8',
  },
  logoutBtn: {
    background: '#3b1f1f',
    border: '0.5px solid #7f1d1d',
    color: '#f87171',
    padding: '7px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  msgBar: {
    background: '#0f2818',
    border: '0.5px solid #166534',
    color: '#4ade80',
    padding: '10px 16px',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    fontSize: '13px',
  },
  searchBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '180px',
    background: '#141720',
    border: '0.5px solid #2d3748',
    color: '#e2e8f0',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
  },
  searchBtn: {
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: '1rem',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: '#141720',
    border: '0.5px solid #1e2433',
    borderRadius: '16px',
    padding: '1.5rem',
    transition: 'border-color 0.2s, transform 0.15s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  storeAvatar: {
    width: '42px', height: '42px',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: '600', color: '#fff',
    flexShrink: 0,
  },
  ratingBadge: {
    background: '#1a1500',
    border: '0.5px solid #713f12',
    color: '#fbbf24',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  noRating: {
    fontSize: '11px',
    color: '#4b5563',
    fontStyle: 'italic',
  },
  storeName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '6px',
  },
  infoRow: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0',
  },
  divider: {
    height: '0.5px',
    background: '#1e2433',
    margin: '1rem 0',
  },
  ratingSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  ratingLabel: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  ratingRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginTop: '4px',
  },
  starInput: {
    background: '#1e2433',
    border: '0.5px solid #374151',
    color: '#f1f5f9',
    padding: '8px',
    borderRadius: '8px',
    width: '72px',
    textAlign: 'center',
    fontSize: '14px',
    outline: 'none',
  },
  rateBtn: {
    flex: 1,
    background: '#0d2d1a',
    border: '0.5px solid #166534',
    color: '#4ade80',
    padding: '9px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
};