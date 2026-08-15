import React from 'react'

const SOURCE_LABELS = { web: 'Web sahypa', bot: 'Çat bot', instagram: 'Instagram', tiktok: 'TikTok' }

export default function StatsPanel({ stats }) {
  if (!stats) return <p className="empty">Statistika ýüklenýär...</p>

  const maxDay = Math.max(...stats.last7.map((d) => d.count), 1)
  const maxService = Math.max(...stats.byService.map((s) => s.count), 1)
  const maxSource = Math.max(...stats.bySource.map((s) => s.count), 1)
  const totalService = stats.byService.reduce((a, s) => a + s.count, 0)

  return (
    <div className="stats-panel">
      <div className="stats-kpi">
        <div className="kpi-box">
          <span className="kpi-label">Soňky 7 gün</span>
          <strong>{stats.newOrders7d}</strong>
          <span className="kpi-sub">täze sargyt</span>
        </div>
        <div className="kpi-box">
          <span className="kpi-label">Soňky 7 gün</span>
          <strong>{stats.newCustomers7d}</strong>
          <span className="kpi-sub">täze müşderi</span>
        </div>
        <div className="kpi-box">
          <span className="kpi-label">Kanallar</span>
          <strong>{Object.keys(stats.bySource).length}</strong>
          <span className="kpi-sub">sargyt çeşmesi</span>
        </div>
        <div className="kpi-box">
          <span className="kpi-label">Hyzmatlar</span>
          <strong>{stats.byService.length}</strong>
          <span className="kpi-sub">sargyt edilen</span>
        </div>
      </div>

      <div className="chart-card">
        <h3>Sargytlar (soňky 7 gün)</h3>
        <div className="bar-chart">
          {stats.last7.map((d, i) => (
            <div className="bar-col" key={i}>
              <div className="bar-value">{d.count || ''}</div>
              <div
                className="bar"
                style={{ height: `${Math.max((d.count / maxDay) * 100, 3)}%` }}
              ></div>
              <div className="bar-label">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Hyzmatlar boýunça</h3>
          {stats.byService.length === 0 && <p className="empty">Maglumat ýok</p>}
          {stats.byService.map((s) => (
            <div className="h-bar-row" key={s.name}>
              <span className="h-bar-name" title={s.name}>
                {s.name}
              </span>
              <div className="h-bar-track">
                <div
                  className="h-bar"
                  style={{ width: `${Math.max((s.count / maxService) * 100, 4)}%` }}
                ></div>
              </div>
              <span className="h-bar-count">
                {s.count} ({Math.round((s.count / totalService) * 100)}%)
              </span>
            </div>
          ))}
        </div>

        <div className="chart-card">
          <h3>Sargyt çeşmeleri</h3>
          {stats.bySource.length === 0 && <p className="empty">Maglumat ýok</p>}
          {stats.bySource.map((s) => (
            <div className="h-bar-row" key={s.name}>
              <span className="h-bar-name">
                {SOURCE_LABELS[s.name] || s.name}
              </span>
              <div className="h-bar-track">
                <div
                  className="h-bar alt"
                  style={{ width: `${Math.max((s.count / maxSource) * 100, 4)}%` }}
                ></div>
              </div>
              <span className="h-bar-count">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Sargyt ýagdaýy</h3>
          <div className="status-bars">
            {[
              { k: 'new', label: 'Täze', color: 'var(--warn)' },
              { k: 'contacted', label: 'Habarlaşyldy', color: 'var(--info)' },
              { k: 'in_progress', label: 'Işde', color: 'var(--primary)' },
              { k: 'done', label: 'Tamamlandy', color: 'var(--ok)' },
            ].map((st) => (
              <div className="status-row" key={st.k}>
                <span className="status-dot" style={{ background: st.color }}></span>
                <span>{st.label}</span>
                <strong>{stats.byStatus[st.k] || 0}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Çat kanallary</h3>
          {Object.keys(stats.byChannel).length === 0 && <p className="empty">Maglumat ýok</p>}
          <div className="status-bars">
            {Object.entries(stats.byChannel).map(([ch, count]) => (
              <div className="status-row" key={ch}>
                <span className="status-dot" style={{ background: 'var(--primary)' }}></span>
                <span>{SOURCE_LABELS[ch] || ch}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
