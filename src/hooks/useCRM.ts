import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Lead, Customer, Contact, LeadStatus, EventType, LeadSource, CRMStats, EquipmentRental } from '../types/crm';
import { LEAD_STATUS_INFO } from '../types/crm';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function useCRM() {
  const [leads, setLeads] = useLocalStorage<Lead[]>('dj-leads', []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('dj-customers', []);
  const [contacts, setContacts] = useLocalStorage<Contact[]>('dj-contacts', []);
  const [rentals, setRentals] = useLocalStorage<EquipmentRental[]>('dj-rentals', []);

  // ===== LEADS =====
  const addLead = useCallback((data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'followUpCount' | 'tags'>): Lead => {
    const now = new Date().toISOString();
    const lead: Lead = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      followUpCount: 0,
      tags: [],
    };
    setLeads(prev => [lead, ...prev]);
    return lead;
  }, [setLeads]);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    ));
  }, [setLeads]);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    const now = new Date().toISOString();
    setLeads(prev => prev.map(l =>
      l.id === id ? { ...l, status, updatedAt: now, lastContactAt: now } : l
    ));

    // Auto-create customer when signed
    if (status === 'signed') {
      const lead = leads.find(l => l.id === id);
      if (lead) {
        const customer: Customer = {
          id: generateId(),
          leadId: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          eventType: lead.eventType || 'wedding',
          eventDate: lead.eventDate || '',
          address: lead.venue,
          amount: lead.amount || 0,
          invoiceSent: false,
          notes: lead.notes,
          createdAt: now,
          status: 'active',
        };
        setCustomers(prev => [customer, ...prev]);
      }
    }
  }, [setLeads, setCustomers, leads]);

  const deleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  }, [setLeads]);

  // ===== CUSTOMERS =====
  const addCustomer = useCallback((data: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const customer: Customer = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [customer, ...prev]);
    return customer;
  }, [setCustomers]);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [setCustomers]);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, [setCustomers]);

  // ===== CONTACTS =====
  const addContact = useCallback((data: Omit<Contact, 'id' | 'createdAt'>): Contact => {
    const contact: Contact = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setContacts(prev => [contact, ...prev]);
    return contact;
  }, [setContacts]);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [setContacts]);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, [setContacts]);

  // ===== EQUIPMENT RENTALS =====
  const addRental = useCallback((data: Omit<EquipmentRental, 'id' | 'createdAt'>): EquipmentRental => {
    const rental: EquipmentRental = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setRentals(prev => [rental, ...prev]);
    return rental;
  }, [setRentals]);

  const updateRental = useCallback((id: string, updates: Partial<EquipmentRental>) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, [setRentals]);

  // ===== STATS =====
  const stats = useMemo((): CRMStats => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const newLeadsThisMonth = leads.filter(l => l.createdAt >= monthStart).length;
    const signedLeads = leads.filter(l => l.status === 'signed').length;
    const conversionRate = leads.length > 0 ? (signedLeads / leads.length) * 100 : 0;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.amount || 0), 0);
    const expectedRevenue = leads
      .filter(l => l.status !== 'cancelled' && l.status !== 'signed')
      .reduce((sum, l) => sum + (l.amount || 0), 0);
    const upcomingEvents = customers.filter(c =>
      c.status === 'active' && c.eventDate && new Date(c.eventDate) > now
    ).length;

    const leadsByStatus = {} as Record<LeadStatus, number>;
    const leadsByEventType = {} as Record<EventType, number>;
    const leadsBySource = {} as Record<LeadSource, number>;

    for (const lead of leads) {
      leadsByStatus[lead.status] = (leadsByStatus[lead.status] || 0) + 1;
      if (lead.eventType) {
        leadsByEventType[lead.eventType] = (leadsByEventType[lead.eventType] || 0) + 1;
      }
      leadsBySource[lead.source] = (leadsBySource[lead.source] || 0) + 1;
    }

    // Monthly leads for chart (last 6 months)
    const monthlyLeads: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toISOString().slice(0, 7); // YYYY-MM
      const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString();
      const count = leads.filter(l => l.createdAt >= d.toISOString() && l.createdAt < nextMonth).length;
      const label = d.toLocaleDateString('he-IL', { month: 'short', year: '2-digit' });
      monthlyLeads.push({ month: label, count });
    }

    return {
      totalLeads: leads.length,
      newLeadsThisMonth,
      conversionRate,
      totalRevenue,
      expectedRevenue,
      upcomingEvents,
      leadsByStatus,
      leadsByEventType,
      leadsBySource,
      monthlyLeads,
    };
  }, [leads, customers]);

  // ===== SEARCH =====
  const searchLeads = useCallback((query: string): Lead[] => {
    if (!query.trim()) return leads;
    const q = query.toLowerCase();
    return leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.notes && l.notes.toLowerCase().includes(q))
    );
  }, [leads]);

  const searchContacts = useCallback((query: string): Contact[] => {
    if (!query.trim()) return contacts;
    const q = query.toLowerCase();
    return contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }, [contacts]);

  // ===== LEADS BY STATUS (for Kanban) =====
  const leadsByPipelineStatus = useMemo(() => {
    const pipeline: Record<LeadStatus, Lead[]> = {
      new: [],
      no_answer: [],
      call_scheduled: [],
      quote_sent: [],
      contract_sent: [],
      signed: [],
      cancelled: [],
    };
    for (const lead of leads) {
      pipeline[lead.status].push(lead);
    }
    // Sort each column by updatedAt desc
    for (const status of Object.keys(pipeline) as LeadStatus[]) {
      pipeline[status].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return pipeline;
  }, [leads]);

  return {
    // Data
    leads,
    customers,
    contacts,
    rentals,
    stats,
    leadsByPipelineStatus,
    // Lead operations
    addLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    searchLeads,
    // Customer operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    // Contact operations
    addContact,
    updateContact,
    deleteContact,
    searchContacts,
    // Rental operations
    addRental,
    updateRental,
  };
}
