// src/components/Admin.jsx
import React, { useState, useEffect, useMemo } from 'react';

/**
 * Admin.jsx — исправленная версия
 * - Бургер-меню на мобильных (видно и работает)
 * - Мобильное меню с overlay и блокировкой скролла body
 * - Drawer аккуратно центрируется, нет "белых краёв" при прокрутке
 * - Остальной функционал: CRUD, поиск, фильтр по дате/статусу, localStorage
 *
 * Использование:
 * import Admin from './components/Admin';
 * <Admin />
 */

const STORAGE_KEY = 'kyrkym_admin_bookings_v1';
const uid = () => 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

export default function Admin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // load initial
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      else setItems([]);
    } catch (e) {
      console.error('Failed to load:', e);
      setItems([]);
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }, [items]);

  // ensure editing object
  useEffect(() => {
    if (!editing) {
      setEditing({
        id: null,
        name: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        notes: '',
        status: 'new',
        createdAt: new Date().toISOString(),
      });
    }
  }, [editing]);

  // lock body scroll while mobile menu open to avoid rubber-band white edges
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = origOverflow || '';
    }
    return () => { document.body.style.overflow = origOverflow || ''; };
  }, [mobileMenuOpen]);

  const resetForm = () => setEditing({
    id: null, name: '', phone: '', service: '', date: '', time: '', notes: '', status: 'new', createdAt: new Date().toISOString()
  });

  const handleSave = (e) => {
    e && e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      name: (editing.name || '').trim(),
      phone: (editing.phone || '').trim(),
      service: (editing.service || '').trim(),
      notes: (editing.notes || '').trim(),
      status: editing.status || 'new',
      createdAt: editing.createdAt || new Date().toISOString()
    };
    if (!payload.id) {
      payload.id = uid();
      setItems(prev => [payload, ...prev]);
    } else {
      setItems(prev => prev.map(it => it.id === payload.id ? payload : it));
    }
    resetForm();
    setShowForm(false);
    setMobileMenuOpen(false);
  };

  const handleEdit = (id) => {
    const it = items.find(x => x.id === id);
    if (!it) return;
    setEditing({ ...it });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Удалить запись?')) return;
    setItems(prev => prev.filter(x => x.id !== id));
  };

  const changeStatus = (id, status) => {
    setItems(prev => prev.map(x => x.id === id ? { ...x, status } : x));
  };

  const clearAll = () => {
    if (!window.confirm('Очистить все записи?')) return;
    setItems([]);
  };

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    return items
      .filter(it => {
        if (filterStatus !== 'all' && it.status !== filterStatus) return false;
        if (filterDate && it.date !== filterDate) return false;
        if (!q) return true;
        return (it.name || '').toLowerCase().includes(q)
          || (it.phone || '').toLowerCase().includes(q)
          || (it.service || '').toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (a.date && b.date) {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          if (a.time && b.time) return a.time.localeCompare(b.time);
          return 0;
        }
        if (a.date) return -1;
        if (b.date) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [items, query, filterDate, filterStatus]);

  const statusLabel = (s) => {
    switch (s) {
      case 'confirmed': return 'Подтверждён';
      case 'arrived': return 'Пришёл';
      case 'cancelled': return 'Отменён';
      default: return 'Новый';
    }
  };

  // render
  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0c', color: '#e9eef2', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
      <style>{`
        :root{
          --bg:#0b0b0c;
          --panel:#0e0f10;
          --muted:#9aa0a6;
          --text:#e9eef2;
          --border: rgba(255,255,255,0.04);
        }
        .adm-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--bg);z-index:120}
        .adm-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700}
        .adm-controls{display:flex;gap:10px;align-items:center}
        .btn{background:transparent;color:inherit;border:1px solid var(--border);padding:8px 10px;border-radius:8px;cursor:pointer}
        .btn.primary{background:#fff;color:#000;border:none;font-weight:600}
        .container{max-width:1100px;margin:18px auto;padding:0 14px}
        .form-card{background:var(--panel);border:1px solid var(--border);padding:14px;border-radius:10px;margin-bottom:14px}
        .fields{display:flex;gap:10px;flex-wrap:wrap}
        .field{flex:1 1 180px;min-width:140px;display:flex;flex-direction:column;gap:6px}
        .label{font-size:13px;color:var(--muted)}
        .input,.select,.textarea{background:#0b0c0d;border:1px solid rgba(255,255,255,0.03);padding:10px 12px;border-radius:8px;color:inherit;font-size:14px}
        .textarea{min-height:68px;resize:vertical}
        .form-actions{display:flex;gap:10px;margin-top:10px}
        .table-wrap{overflow-x:auto;border-radius:8px}
        table{width:100%;border-collapse:collapse;min-width:800px}
        th,td{padding:10px 12px;border-bottom:1px solid var(--border);text-align:left;font-size:14px;color:inherit}
        th{color:var(--muted);font-weight:600;font-size:13px}
        .action-btn{background:transparent;border:1px solid rgba(255,255,255,0.03);color:inherit;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:13px}
        .status-pill{display:inline-block;padding:6px 10px;border-radius:8px;font-size:13px;color:#fff}
        .s-new{background:#2f3943;color:#cbd6df}
        .s-confirmed{background:#1e4d99;color:#cfe6ff}
        .s-arrived{background:#0f6f45;color:#e6fff4}
        .s-cancelled{background:#6b2222;color:#ffd7d7}

        /* mobile */
        .mobile-burger{display:none}
        @media (max-width:780px){
          .fields{flex-direction:column}
          .mobile-burger{display:inline-flex}
          .adm-controls .desktop-only{display:none}
        }

        /* overlay + drawer */
        .mobile-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:110}
        .mobile-drawer{position:fixed;right:12px;top:72px;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:12px;z-index:111;width:calc(100% - 28px);max-width:420px;box-shadow:0 12px 40px rgba(0,0,0,0.6)}
        @media(min-width:781px){ .mobile-drawer{display:none} }
      `}</style>

      <header className="adm-header">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="adm-title">KYRKYM — админ</div>
          <div style={{ color: '#9aa0a6', fontSize: 13 }}>управление записями</div>
        </div>

        <div className="adm-controls">
          <div className="desktop-only" style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Поиск: имя, телефон, услуга"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: '#0b0c0d', color: 'inherit' }}
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: '#0b0c0d', color: 'inherit' }}>
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="confirmed">Подтверждённые</option>
              <option value="arrived">Пришли</option>
              <option value="cancelled">Отменённые</option>
            </select>
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: '#0b0c0d', color: 'inherit' }} />
            <button className="btn" onClick={() => { setShowForm(s => !s); }}>{showForm ? 'Скрыть форму' : 'Показать форму'}</button>
          </div>

          <button className="btn mobile-burger" onClick={() => setMobileMenuOpen(s => !s)} aria-label="Открыть меню">☰</button>
        </div>
      </header>

      <main className="container">
        {/* mobile drawer + overlay */}
        {mobileMenuOpen && (
          <>
            <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
            <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Мобильное меню">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Меню</div>
                <button className="btn" onClick={() => setMobileMenuOpen(false)}>Закрыть</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn primary" onClick={() => { setShowForm(s => !s); setMobileMenuOpen(false); }}>{showForm ? 'Скрыть форму' : 'Открыть форму'}</button>
                <button className="btn" onClick={() => { setQuery(''); setFilterDate(''); setFilterStatus('all'); setMobileMenuOpen(false); }}>Сбросить фильтры</button>
                <button className="btn" onClick={() => { resetForm(); setMobileMenuOpen(false); }}>Новая запись</button>
                <button className="btn" onClick={() => { clearAll(); setMobileMenuOpen(false); }}>Очистить все</button>

                <div style={{ marginTop: 6 }}>
                  <div style={{ color: '#9aa0a6', marginBottom: 6 }}>Поиск</div>
                  <input placeholder="По имени/телефону" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: '#0b0c0d', color: 'inherit' }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* form */}
        {showForm && (
          <div className="form-card" aria-label="Форма записи">
            <form onSubmit={handleSave}>
              <div className="fields">
                <div className="field">
                  <div className="label">Имя</div>
                  <input className="input" value={editing?.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Имя клиента" />
                </div>

                <div className="field">
                  <div className="label">Телефон</div>
                  <input className="input" value={editing?.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} placeholder="+996 5xx xxx xxx" />
                </div>

                <div className="field">
                  <div className="label">Услуга</div>
                  <input className="input" value={editing?.service || ''} onChange={(e) => setEditing({ ...editing, service: e.target.value })} placeholder="Например: Мужская стрижка" />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="field" style={{ flex: '0 0 140px' }}>
                    <div className="label">Дата</div>
                    <input className="input" type="date" value={editing?.date || ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
                  </div>

                  <div className="field" style={{ flex: '0 0 120px' }}>
                    <div className="label">Время</div>
                    <input className="input" type="time" value={editing?.time || ''} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div className="label">Заметки</div>
                <textarea className="textarea" value={editing?.notes || ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} placeholder="Особые пожелания или заметки" />
              </div>

              <div className="form-actions">
                <button className="btn primary" type="submit">{editing?.id ? 'Сохранить' : 'Добавить'}</button>
                <button type="button" className="btn" onClick={() => resetForm()}>Новая</button>
                <button type="button" className="btn" onClick={() => clearAll()}>Очистить всё</button>
                <div style={{ marginLeft: 'auto', color: '#9aa0a6', fontSize: 13, alignSelf: 'center' }}>Данные хранятся локально</div>
              </div>
            </form>
          </div>
        )}

        {/* controls */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ color: '#9aa0a6' }}>Найдено: {filtered.length}</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => { setQuery(''); setFilterDate(''); setFilterStatus('all'); }}>Сбросить</button>
            <button className="btn" onClick={() => setShowForm(s => !s)}>{showForm ? 'Скрыть форму' : 'Показать форму'}</button>
          </div>
        </div>

        {/* table */}
        <div className="table-wrap" role="region" aria-label="Список записей">
          <table>
            <thead>
              <tr>
                <th style={{ width: 220 }}>Имя / Телефон</th>
                <th>Услуга</th>
                <th style={{ width: 120 }}>Дата</th>
                <th style={{ width: 95 }}>Время</th>
                <th style={{ width: 140 }}>Статус</th>
                <th style={{ width: 340 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: 20, color: '#9aa0a6', textAlign: 'center' }}>Записей нет</td>
                </tr>
              )}

              {filtered.map(it => (
                <tr key={it.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{it.name || '—'}</div>
                    <div style={{ color: '#9aa0a6', marginTop: 6 }}>{it.phone || '—'}</div>
                  </td>
                  <td>{it.service || <span style={{ color: '#9aa0a6' }}>не указана</span>}</td>
                  <td style={{ color: it.date ? 'inherit' : '#9aa0a6' }}>{it.date || '—'}</td>
                  <td style={{ color: it.time ? 'inherit' : '#9aa0a6' }}>{it.time || '—'}</td>
                  <td>
                    <span className={`status-pill ${it.status === 'confirmed' ? 's-confirmed' : it.status === 'arrived' ? 's-arrived' : it.status === 'cancelled' ? 's-cancelled' : 's-new'}`}>
                      {statusLabel(it.status)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button className="action-btn" onClick={() => handleEdit(it.id)}>Редактировать</button>
                      <button className="action-btn" onClick={() => handleDelete(it.id)}>Удалить</button>

                      <div style={{ width: 8 }} />

                      <button className="action-btn" onClick={() => changeStatus(it.id, 'confirmed')}>Подтвердить</button>
                      <button className="action-btn" onClick={() => changeStatus(it.id, 'arrived')}>Отметить пришедшим</button>
                      <button className="action-btn" onClick={() => changeStatus(it.id, 'cancelled')}>Отменил</button>
                    </div>

                    {it.notes ? <div style={{ marginTop: 8, color: '#9aa0a6', fontSize: 13 }}>{it.notes}</div> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, color: '#9aa0a6', fontSize: 13 }}>
          Ключ localStorage: <code style={{ background: '#0b0c0d', padding: '2px 6px', borderRadius: 6 }}>{STORAGE_KEY}</code>
        </div>
      </main>
    </div>
  );
}