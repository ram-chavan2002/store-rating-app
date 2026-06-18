import { useState, useEffect } from 'react';
import { getUsers, getStores, createStore, getStoreAverage } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeRatings, setStoreRatings] = useState({});
  const [tab, setTab] = useState('dashboard');
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [filter, setFilter] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const u = await getUsers();
    const s = await getStores();
    const storeList = s.data.entities || s.data;
    setUsers(u.data);
    setStores(storeList);
    storeList.forEach(async (store) => {
      const avg = await getStoreAverage(store.id);
      setStoreRatings(prev => ({ ...prev, [store.id]: avg.data }));
    });
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    const data = { name: newStore.name, email: newStore.email, address: newStore.address };
    if (newStore.owner_id && newStore.owner_id !== '') data.owner_id = Number(newStore.owner_id);
    await createStore(data);
    setMessage('Store created!');
    fetchData();
    setNewStore({ name: '', email: '', address: '', owner_id: '' });
  };

  const handleFilter = async () => {
    const u = await getUsers(filter);
    setUsers(u.data);
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const totalNormalUsers = users.filter(u => u.role === 'normal_user').length;

  const tabs = [
    { key: 'dashboard', label: 'Dashboard',  icon: '📊' },
    { key: 'users',     label: 'Users',       icon: '👥' },
    { key: 'stores',    label: 'Stores',      icon: '🏪' },
    { key: 'add-store', label: 'Add Store',   icon: '➕' },
  ];

  return (
    <div style={s.root}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.sidebarBrand}>
          <span style={s.brandIcon}>🏪</span>
          <span style={s.brandName}>StoreRate</span>
        </div>

        <nav style={s.nav}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{ ...s.navBtn, ...(tab === t.key ? s.navBtnActive : {}) }}
            >
              <span style={s.navIcon}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <button onClick={logout} style={s.logoutBtn}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>
              {tabs.find(t => t.key === tab)?.icon}{' '}
              {tabs.find(t => t.key === tab)?.label}
            </h1>
            <p style={s.pageSubtitle}>Admin Control Panel</p>
          </div>
          <div style={s.adminBadge}>👑 Admin</div>
        </div>

        {/* ── Dashboard Tab ── */}
        {tab === 'dashboard' && (
          <div>
            <div style={s.statsGrid}>
              <div style={{ ...s.statCard, borderTop: '4px solid #6c63ff' }}>
                <div style={s.statIcon}>👥</div>
                <div style={s.statInfo}>
                  <p style={s.statLabel}>Total Users</p>
                  <p style={s.statNum}>{users.length}</p>
                </div>
              </div>
              <div style={{ ...s.statCard, borderTop: '4px solid #00c6ff' }}>
                <div style={s.statIcon}>🏪</div>
                <div style={s.statInfo}>
                  <p style={s.statLabel}>Total Stores</p>
                  <p style={s.statNum}>{stores.length}</p>
                </div>
              </div>
              <div style={{ ...s.statCard, borderTop: '4px solid #43e97b' }}>
                <div style={s.statIcon}>🙋</div>
                <div style={s.statInfo}>
                  <p style={s.statLabel}>Normal Users</p>
                  <p style={s.statNum}>{totalNormalUsers}</p>
                </div>
              </div>
            </div>

            {/* Quick info */}
            <div style={s.infoBox}>
              <p style={{ margin: 0, color: '#8b949e', fontSize: '14px' }}>
                💡 Use the sidebar to manage <strong style={{ color: '#c9d1d9' }}>Users</strong>, <strong style={{ color: '#c9d1d9' }}>Stores</strong>, or <strong style={{ color: '#c9d1d9' }}>Add a new Store</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <div>
            <div style={s.filterRow}>
              <input style={s.input} placeholder="🔍 Filter by name"
                onChange={e => setFilter({ ...filter, name: e.target.value })} />
              <input style={s.input} placeholder="✉️ Filter by email"
                onChange={e => setFilter({ ...filter, email: e.target.value })} />
              <select style={s.input} onChange={e => setFilter({ ...filter, role: e.target.value })}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="normal_user">Normal User</option>
                <option value="store_owner">Store Owner</option>
              </select>
              <button onClick={handleFilter} style={s.filterBtn}>Filter</button>
            </div>

            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Address</th>
                    <th style={s.th}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ ...s.tr, background: i % 2 === 0 ? '#161b22' : '#0d1117' }}>
                      <td style={s.td}>
                        <div style={s.userAvatar}>{u.name?.[0]?.toUpperCase() || '?'}</div>
                        {u.name}
                      </td>
                      <td style={s.td}>{u.email}</td>
                      <td style={s.td}>{u.address || '—'}</td>
                      <td style={s.td}>
                        <span style={{
                          ...s.badge,
                          background: u.role === 'admin' ? 'rgba(244,67,54,0.15)' :
                                      u.role === 'store_owner' ? 'rgba(255,152,0,0.15)' : 'rgba(76,175,80,0.15)',
                          color: u.role === 'admin' ? '#f44336' :
                                 u.role === 'store_owner' ? '#FF9800' : '#4CAF50',
                          border: `1px solid ${u.role === 'admin' ? '#f44336' : u.role === 'store_owner' ? '#FF9800' : '#4CAF50'}`,
                        }}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" style={{ ...s.td, textAlign: 'center', color: '#8b949e', padding: '2rem' }}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Stores Tab ── */}
        {tab === 'stores' && (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Store Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Address</th>
                  <th style={s.th}>⭐ Avg Rating</th>
                  <th style={s.th}>📊 Total Ratings</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((st, i) => (
                  <tr key={st.id} style={{ ...s.tr, background: i % 2 === 0 ? '#161b22' : '#0d1117' }}>
                    <td style={s.td}>
                      <div style={s.storeIcon}>🏪</div>
                      {st.name}
                    </td>
                    <td style={s.td}>{st.email}</td>
                    <td style={s.td}>{st.address || '—'}</td>
                    <td style={s.td}>
                      <span style={s.ratingBadge}>
                        ⭐ {storeRatings[st.id]?.average
                          ? Number(storeRatings[st.id].average).toFixed(1)
                          : 'No ratings'}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.totalBadge}>
                        {storeRatings[st.id]?.total || 0} ratings
                      </span>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && (
                  <tr><td colSpan="5" style={{ ...s.td, textAlign: 'center', color: '#8b949e', padding: '2rem' }}>No stores found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Add Store Tab ── */}
        {tab === 'add-store' && (
          <div style={s.formOuter}>
            <div style={s.formCard}>
              <div style={s.formHeader}>
                <span style={s.formHeaderIcon}>🏪</span>
                <div>
                  <h3 style={{ margin: 0, color: '#c9d1d9', fontSize: '18px' }}>Add New Store</h3>
                  <p style={{ margin: 0, color: '#8b949e', fontSize: '13px', marginTop: '4px' }}>Fill in the details below</p>
                </div>
              </div>

              {message && (
                <div style={s.successMsg}>
                  ✅ {message}
                </div>
              )}

              <form onSubmit={handleCreateStore}>
                <div style={s.formGroup}>
                  <label style={s.label}>Store Name <span style={{ color: '#6c63ff' }}>*</span></label>
                  <input style={s.formInput} placeholder="20–60 characters"
                    value={newStore.name}
                    onChange={e => setNewStore({ ...newStore, name: e.target.value })} required />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Store Email <span style={{ color: '#6c63ff' }}>*</span></label>
                  <input style={s.formInput} placeholder="store@example.com" type="email"
                    value={newStore.email}
                    onChange={e => setNewStore({ ...newStore, email: e.target.value })} required />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Store Address</label>
                  <input style={s.formInput} placeholder="Full address"
                    value={newStore.address}
                    onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Owner ID <span style={{ color: '#8b949e', fontSize: '12px' }}>(optional)</span></label>
                  <input style={s.formInput} placeholder="Leave blank if none"
                    value={newStore.owner_id}
                    onChange={e => setNewStore({ ...newStore, owner_id: e.target.value })} />
                </div>
                <button type="submit" style={s.submitBtn}>
                  ➕ Create Store
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

/* ── Styles ── */
const s = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0d1117',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#c9d1d9',
  },

  /* Sidebar */
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: '#161b22',
    borderRight: '1px solid #21262d',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  sidebarBrand: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '24px 20px 20px',
    borderBottom: '1px solid #21262d',
    marginBottom: '12px',
  },
  brandIcon: { fontSize: '24px' },
  brandName: { fontSize: '20px', fontWeight: '800', color: '#c9d1d9', letterSpacing: '-0.5px' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' },
  navBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '11px 14px', borderRadius: '8px', border: 'none',
    background: 'transparent', color: '#8b949e', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500', textAlign: 'left', transition: 'all .15s',
  },
  navBtnActive: {
    background: 'rgba(108,99,255,0.15)',
    color: '#a78bfa',
    fontWeight: '700',
  },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
    margin: '12px', padding: '11px', borderRadius: '8px',
    background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)',
    color: '#f44336', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },

  /* Main */
  main: { flex: 1, padding: '28px 32px', overflowX: 'hidden' },
  topbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #21262d',
  },
  pageTitle: { margin: 0, fontSize: '24px', fontWeight: '800', color: '#e6edf3' },
  pageSubtitle: { margin: '4px 0 0', fontSize: '13px', color: '#8b949e' },
  adminBadge: {
    background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
    color: '#fff', padding: '8px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '700',
  },

  /* Stats */
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px', marginBottom: '20px' },
  statCard: {
    background: '#161b22', border: '1px solid #21262d', borderRadius: '12px',
    padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  statIcon: { fontSize: '32px' },
  statInfo: {},
  statLabel: { margin: 0, fontSize: '12px', color: '#8b949e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statNum: { margin: '4px 0 0', fontSize: '36px', fontWeight: '800', color: '#e6edf3', lineHeight: 1 },
  infoBox: {
    background: '#161b22', border: '1px solid #21262d', borderRadius: '10px',
    padding: '14px 18px',
  },

  /* Filter */
  filterRow: { display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' },
  input: {
    padding: '10px 14px', background: '#161b22', border: '1px solid #30363d',
    borderRadius: '8px', color: '#c9d1d9', fontSize: '13px', outline: 'none',
    flex: '1', minWidth: '160px',
  },
  filterBtn: {
    padding: '10px 20px', background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
    color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap',
  },

  /* Table */
  tableWrap: { overflowX: 'auto', borderRadius: '12px', border: '1px solid #21262d' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  thead: { background: '#161b22' },
  th: {
    padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700',
    color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px',
    borderBottom: '1px solid #21262d',
  },
  tr: { transition: 'background .15s' },
  td: {
    padding: '13px 16px', fontSize: '13px', color: '#c9d1d9',
    borderBottom: '1px solid #21262d', display: 'revert',
    verticalAlign: 'middle',
  },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  ratingBadge: {
    background: 'rgba(255,152,0,0.12)', color: '#FFB300',
    border: '1px solid rgba(255,152,0,0.3)',
    padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
  },
  totalBadge: {
    background: 'rgba(33,150,243,0.12)', color: '#42a5f5',
    border: '1px solid rgba(33,150,243,0.3)',
    padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
  },
  userAvatar: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '28px', height: '28px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
    color: '#fff', fontSize: '12px', fontWeight: '700', marginRight: '10px',
  },
  storeIcon: { display: 'inline', marginRight: '8px', fontSize: '16px' },

  /* Add Store Form */
  formOuter: { display: 'flex', justifyContent: 'center' },
  formCard: {
    background: '#161b22', border: '1px solid #21262d', borderRadius: '16px',
    padding: '32px', width: '100%', maxWidth: '480px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  formHeader: {
    display: 'flex', alignItems: 'center', gap: '14px',
    marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #21262d',
  },
  formHeaderIcon: {
    fontSize: '36px', width: '56px', height: '56px', borderRadius: '12px',
    background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center',
    justifyContent: 'center',
  },
  successMsg: {
    background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.3)',
    color: '#4CAF50', borderRadius: '8px', padding: '12px 16px',
    fontSize: '14px', marginBottom: '20px',
  },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#8b949e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  formInput: {
    width: '100%', padding: '11px 14px', background: '#0d1117',
    border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .2s',
  },
  submitBtn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
    color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer',
    fontSize: '15px', fontWeight: '700', marginTop: '8px',
    transition: 'opacity .2s, transform .15s',
  },
};