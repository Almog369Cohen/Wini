import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, Calendar, DollarSign, Target, ChevronLeft, Plus } from 'lucide-react';
import type { CRMStats, Lead } from '../../../types/crm';
import { LEAD_STATUS_INFO, EVENT_TYPE_INFO, LEAD_SOURCE_INFO } from '../../../types/crm';
import type { Customer } from '../../../types/crm';

interface DashboardProps {
  stats: CRMStats;
  recentLeads: Lead[];
  upcomingEvents: Customer[];
  onNavigate: (page: string) => void;
  onAddLead: () => void;
}

export default function CRMDashboard({ stats, recentLeads, upcomingEvents, onNavigate, onAddLead }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 pb-24 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">דשבורד עסקי</h1>
          <p className="text-xs text-text-light">DJ אלמוג כהן</p>
        </div>
        <button
          onClick={onAddLead}
          className="flex items-center gap-1.5 bg-[#059cc0] text-white px-3 py-2 rounded-xl text-sm font-medium"
        >
          <Plus size={16} />
          ליד חדש
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <KPICard
          icon={<Users size={18} />}
          label="סה״כ לידים"
          value={stats.totalLeads}
          color="#059cc0"
        />
        <KPICard
          icon={<TrendingUp size={18} />}
          label="לידים החודש"
          value={stats.newLeadsThisMonth}
          color="#03b28c"
        />
        <KPICard
          icon={<Target size={18} />}
          label="אחוז המרה"
          value={`${stats.conversionRate.toFixed(0)}%`}
          color="#8b5cf6"
        />
        <KPICard
          icon={<DollarSign size={18} />}
          label="הכנסות"
          value={`₪${stats.totalRevenue.toLocaleString()}`}
          color="#f59e0b"
        />
      </div>

      {/* Expected Revenue */}
      {stats.expectedRevenue > 0 && (
        <div className="bg-card rounded-2xl p-4 border border-[#059cc0]/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-light">הכנסות צפויות</span>
            <span className="text-lg font-bold text-[#03b28c]">₪{stats.expectedRevenue.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Pipeline Overview */}
      <div className="bg-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text">Pipeline</h2>
          <button
            onClick={() => onNavigate('crm')}
            className="text-xs text-[#059cc0] flex items-center gap-0.5"
          >
            צפייה מלאה
            <ChevronLeft size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {(Object.keys(LEAD_STATUS_INFO) as Array<keyof typeof LEAD_STATUS_INFO>)
            .filter(status => status !== 'cancelled')
            .sort((a, b) => LEAD_STATUS_INFO[a].order - LEAD_STATUS_INFO[b].order)
            .map(status => {
              const count = stats.leadsByStatus[status] || 0;
              const maxCount = Math.max(...Object.values(stats.leadsByStatus || {}), 1);
              const width = (count / maxCount) * 100;
              return (
                <div key={status} className="flex items-center gap-2">
                  <span className="text-xs w-28 text-text-light truncate">{LEAD_STATUS_INFO[status].label}</span>
                  <div className="flex-1 h-5 bg-cream rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: LEAD_STATUS_INFO[status].color }}
                    />
                  </div>
                  <span className="text-xs font-bold text-text w-6 text-center">{count}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Monthly Leads Chart */}
      {stats.monthlyLeads.length > 0 && (
        <div className="bg-card rounded-2xl p-4">
          <h2 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#059cc0]" />
            לידים לפי חודש
          </h2>
          <div className="flex items-end gap-2 h-24">
            {stats.monthlyLeads.map((m, i) => {
              const maxCount = Math.max(...stats.monthlyLeads.map(x => x.count), 1);
              const height = (m.count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-text">{m.count}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%` }}
                    className="w-full rounded-t-lg bg-[#059cc0]/80"
                  />
                  <span className="text-[9px] text-text-light">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leads by Source */}
      {Object.keys(stats.leadsBySource || {}).length > 0 && (
        <div className="bg-card rounded-2xl p-4">
          <h2 className="text-sm font-bold text-text mb-3">לידים לפי מקור</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.leadsBySource)
              .sort(([, a], [, b]) => b - a)
              .map(([source, count]) => {
                const info = LEAD_SOURCE_INFO[source as keyof typeof LEAD_SOURCE_INFO];
                return (
                  <div key={source} className="flex items-center gap-1.5 bg-cream rounded-lg px-2.5 py-1.5">
                    <span className="text-sm">{info?.emoji || '📌'}</span>
                    <span className="text-xs text-text-light">{info?.label || source}</span>
                    <span className="text-xs font-bold text-text">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Recent Leads */}
      <div className="bg-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text">לידים אחרונים</h2>
          <button
            onClick={() => onNavigate('crm')}
            className="text-xs text-[#059cc0] flex items-center gap-0.5"
          >
            הכל
            <ChevronLeft size={14} />
          </button>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-xs text-text-light text-center py-4">אין לידים עדיין. לחץ "ליד חדש" להתחיל!</p>
        ) : (
          <div className="space-y-2">
            {recentLeads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream/50 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: LEAD_STATUS_INFO[lead.status].color + '20', color: LEAD_STATUS_INFO[lead.status].color }}>
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{lead.name}</p>
                  <p className="text-[10px] text-text-light">
                    {lead.eventType ? EVENT_TYPE_INFO[lead.eventType]?.label : ''} • {new Date(lead.createdAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: LEAD_STATUS_INFO[lead.status].color + '15',
                    color: LEAD_STATUS_INFO[lead.status].color,
                  }}
                >
                  {LEAD_STATUS_INFO[lead.status].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="bg-card rounded-2xl p-4">
          <h2 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-[#03b28c]" />
            אירועים קרובים
          </h2>
          <div className="space-y-2">
            {upcomingEvents.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-xl bg-cream/50">
                <span className="text-lg">{EVENT_TYPE_INFO[event.eventType]?.emoji || '📅'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">{event.name}</p>
                  <p className="text-[10px] text-text-light">
                    {EVENT_TYPE_INFO[event.eventType]?.label} • {event.address || ''}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#03b28c]">
                    {event.eventDate ? new Date(event.eventDate).toLocaleDateString('he-IL') : ''}
                  </p>
                  {event.amount > 0 && (
                    <p className="text-[10px] text-text-light">₪{event.amount.toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'ניהול לידים', emoji: '📋', page: 'crm', color: '#059cc0' },
          { label: 'וואטסאפ', emoji: '💬', page: 'whatsapp', color: '#25D366' },
          { label: 'אוטומציות', emoji: '⚡', page: 'automations', color: '#8b5cf6' },
          { label: 'טפסים', emoji: '📝', page: 'forms', color: '#f59e0b' },
          { label: 'שיווק ותוכן', emoji: '📸', page: 'marketing', color: '#e05c4d' },
          { label: 'אינסטגרם', emoji: '📱', page: 'instagram-flows', color: '#E1306C' },
        ].map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="bg-card rounded-2xl p-4 text-right hover:shadow-md transition-shadow border border-transparent hover:border-[#059cc0]/10"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="text-sm font-medium text-text mt-2">{item.label}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// KPI Card component
function KPICard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: color + '15', color }}>
          {icon}
        </div>
      </div>
      <p className="text-xl font-bold text-text">{value}</p>
      <p className="text-[11px] text-text-light">{label}</p>
    </div>
  );
}
