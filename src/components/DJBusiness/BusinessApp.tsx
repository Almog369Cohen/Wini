import { useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Page } from '../../types';
import { useCRM } from '../../hooks/useCRM';
import CRMDashboard from './CRM/Dashboard';
import LeadPipeline from './CRM/LeadPipeline';

// Lazy load business modules
const WhatsAppHub = lazy(() => import('./WhatsApp/WhatsAppHub'));
const AutomationsPage = lazy(() => import('./Automations/AutomationsPage'));
const FormsPage = lazy(() => import('./Forms/FormsPage'));
const MarketingPage = lazy(() => import('./Marketing/MarketingPage'));
const InstagramPage = lazy(() => import('./Instagram/InstagramPage'));

interface BusinessAppProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  showToast: (msg: string) => void;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-[#059cc0] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function BusinessApp({ currentPage, onNavigate, showToast }: BusinessAppProps) {
  const crm = useCRM();

  const recentLeads = useMemo(() =>
    [...crm.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [crm.leads]
  );

  const upcomingEvents = useMemo(() =>
    crm.customers
      .filter(c => c.status === 'active' && c.eventDate && new Date(c.eventDate) > new Date())
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
      .slice(0, 5),
    [crm.customers]
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'business-dashboard':
        return (
          <CRMDashboard
            stats={crm.stats}
            recentLeads={recentLeads}
            upcomingEvents={upcomingEvents}
            onNavigate={onNavigate}
            onAddLead={() => onNavigate('crm')}
          />
        );

      case 'crm':
        return (
          <LeadPipeline
            leads={crm.leads}
            leadsByPipelineStatus={crm.leadsByPipelineStatus}
            onAddLead={crm.addLead}
            onUpdateStatus={crm.updateLeadStatus}
            onUpdateLead={crm.updateLead}
            onDeleteLead={crm.deleteLead}
            showToast={showToast}
          />
        );

      case 'whatsapp':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <WhatsAppHub leads={crm.leads} contacts={crm.contacts} showToast={showToast} />
          </Suspense>
        );

      case 'automations':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AutomationsPage showToast={showToast} />
          </Suspense>
        );

      case 'forms':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <FormsPage showToast={showToast} />
          </Suspense>
        );

      case 'marketing':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MarketingPage showToast={showToast} />
          </Suspense>
        );

      case 'instagram-flows':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <InstagramPage showToast={showToast} />
          </Suspense>
        );

      default:
        return null;
    }
  };

  return <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>;
}
