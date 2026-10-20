import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllBookingsFromSupabase,
  updateBookingInSupabase,
  deleteBookingFromSupabase,
  saveBookingToSupabase,
  BookingRecord,
  SUPABASE_URL
} from '../lib/supabase';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Download,
  ChevronDown,
  ArrowLeft,
  Check,
  X,
  ExternalLink,
  Copy,
  Database,
  Building,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  onBackToWebsite: () => void;
}

export default function AdminPanel({ onBackToWebsite }: AdminPanelProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'move_in'>('newest');

  // Modal states
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [showSqlGuide, setShowSqlGuide] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Form state for adding a new walk-in / phone booking
  const [newBooking, setNewBooking] = useState({
    full_name: '',
    phone: '',
    section: 'Boys Section',
    sharing_type: 'Double Sharing',
    move_in_date: '',
    message: '',
    status: 'pending',
    assigned_room: '',
    notes: ''
  });

  // Load all bookings
  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg(null);
    const result = await getAllBookingsFromSupabase();
    if (result.success) {
      setBookings(result.data);
    } else {
      setErrorMsg(
        result.error?.message ||
        'Could not load bookings from Supabase. Ensure table "bookings" exists and has select permissions enabled.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // Quick Status Update
  const handleStatusChange = async (id: string | number, newStatus: string) => {
    setIsActionLoading(true);
    const result = await updateBookingInSupabase(id, { status: newStatus });
    if (result.success) {
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
      );
      triggerSuccess(`Appointment status changed to "${newStatus.toUpperCase()}"!`);
    } else {
      alert(`Error updating status: ${result.error?.message || 'Check database permissions'}`);
    }
    setIsActionLoading(false);
  };

  // Save changes from Edit Modal
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setIsActionLoading(true);
    const result = await updateBookingInSupabase(editingBooking.id, {
      full_name: editingBooking.full_name,
      phone: editingBooking.phone,
      section: editingBooking.section,
      sharing_type: editingBooking.sharing_type,
      move_in_date: editingBooking.move_in_date,
      status: editingBooking.status,
      assigned_room: editingBooking.assigned_room,
      notes: editingBooking.notes,
      message: editingBooking.message
    });

    if (result.success) {
      setBookings(prev =>
        prev.map(b => (b.id === editingBooking.id ? editingBooking : b))
      );
      setEditingBooking(null);
      triggerSuccess('Booking details saved successfully!');
    } else {
      alert(`Error saving booking: ${result.error?.message || 'Please check permissions.'}`);
    }
    setIsActionLoading(false);
  };

  // Add Manual Walk-in Booking
  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.full_name || !newBooking.phone) {
      alert('Name and phone number are required.');
      return;
    }

    setIsActionLoading(true);
    const result = await saveBookingToSupabase({
      full_name: newBooking.full_name,
      phone: newBooking.phone,
      section: newBooking.section,
      sharing_type: newBooking.sharing_type,
      move_in_date: newBooking.move_in_date || null,
      message: newBooking.message || 'Added via Admin Panel',
      status: newBooking.status
    });

    if (result.success) {
      setIsAddModalOpen(false);
      setNewBooking({
        full_name: '',
        phone: '',
        section: 'Boys Section',
        sharing_type: 'Double Sharing',
        move_in_date: '',
        message: '',
        status: 'pending',
        assigned_room: '',
        notes: ''
      });
      triggerSuccess('New resident booking recorded into Supabase database!');
      fetchBookings();
    } else {
      alert(`Error creating booking: ${result.error?.message || 'Could not save.'}`);
    }
    setIsActionLoading(false);
  };

  // Confirm and Delete
  const confirmDeleteBooking = async () => {
    if (!deletingId) return;
    setIsActionLoading(true);
    const result = await deleteBookingFromSupabase(deletingId);
    if (result.success) {
      setBookings(prev => prev.filter(b => b.id !== deletingId));
      triggerSuccess('Appointment record permanently deleted.');
      setDeletingId(null);
    } else {
      alert(`Failed to delete: ${result.error?.message || 'Check database DELETE policy in Supabase.'}`);
    }
    setIsActionLoading(false);
  };

  // Export Bookings to CSV
  const exportToCSV = () => {
    if (bookings.length === 0) {
      alert('No booking records to export.');
      return;
    }

    const headers = [
      'ID',
      'Created At',
      'Full Name',
      'Phone',
      'Section',
      'Sharing Type',
      'Move-In Date',
      'Status',
      'Assigned Room',
      'Notes',
      'Message'
    ];

    const rows = filteredBookings.map(b => [
      b.id,
      b.created_at ? new Date(b.created_at).toLocaleString() : '',
      `"${(b.full_name || '').replace(/"/g, '""')}"`,
      `"${b.phone || ''}"`,
      `"${b.section || ''}"`,
      `"${b.sharing_type || ''}"`,
      `"${b.move_in_date || ''}"`,
      `"${b.status || ''}"`,
      `"${(b.assigned_room || '').replace(/"/g, '""')}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${(b.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `royal-pg-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (b.full_name || '').toLowerCase().includes(q);
          const matchPhone = (b.phone || '').toLowerCase().includes(q);
          const matchNotes = (b.notes || '').toLowerCase().includes(q);
          const matchRoom = (b.assigned_room || '').toLowerCase().includes(q);
          if (!matchName && !matchPhone && !matchNotes && !matchRoom) return false;
        }

        // Status Filter
        if (statusFilter !== 'all') {
          if ((b.status || 'pending').toLowerCase() !== statusFilter.toLowerCase()) return false;
        }

        // Section Filter
        if (sectionFilter !== 'all') {
          if (!b.section?.toLowerCase().includes(sectionFilter.toLowerCase())) return false;
        }

        // Sharing Filter
        if (roomFilter !== 'all') {
          if (!b.sharing_type?.toLowerCase().includes(roomFilter.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'move_in') {
          const dateA = a.move_in_date ? new Date(a.move_in_date).getTime() : 0;
          const dateB = b.move_in_date ? new Date(b.move_in_date).getTime() : 0;
          return dateB - dateA;
        }
        return 0;
      });
  }, [bookings, searchQuery, statusFilter, sectionFilter, roomFilter, sortBy]);

  // Statistics KPI
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => (b.status || 'pending').toLowerCase() === 'pending').length;
    const confirmed = bookings.filter(b => (b.status || '').toLowerCase() === 'confirmed').length;
    const visited = bookings.filter(b => (b.status || '').toLowerCase() === 'visited').length;
    const admitted = bookings.filter(b => (b.status || '').toLowerCase() === 'admitted').length;
    const cancelled = bookings.filter(b => (b.status || '').toLowerCase() === 'cancelled').length;
    const boys = bookings.filter(b => b.section?.toLowerCase().includes('boy')).length;
    const girls = bookings.filter(b => b.section?.toLowerCase().includes('girl')).length;

    return { total, pending, confirmed, visited, admitted, cancelled, boys, girls };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#0A1222]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Public Website</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-cinzel font-black text-slate-950 text-base shadow-md shadow-amber-500/20">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-cinzel font-bold text-base sm:text-lg text-white">
                    ROYAL <span className="text-amber-400">PG</span>
                  </h1>
                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Live Supabase DB: <span className="font-mono text-slate-300">kiwpzxjdbcwkfafngdgj</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={exportToCSV}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Walk-In</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Success Alert */}
        {successBanner && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button onClick={() => setSuccessBanner(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Database Error Alert with SQL Fix Helper */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Supabase Connection Notice</span>
            </div>
            <p className="text-slate-300">{errorMsg}</p>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => setShowSqlGuide(true)}
                className="underline text-amber-300 font-semibold cursor-pointer"
              >
                View 1-Click SQL Setup Script (bookings table & RLS policies)
              </button>
              <button
                onClick={fetchBookings}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Retry Fetch
              </button>
            </div>
          </div>
        )}

        {/* KPI Metrics Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <span className="text-[10px] text-slate-500">All-time bookings</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1528] border border-amber-500/30 space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">Pending Visits</span>
            <div className="text-2xl font-black text-amber-400">{stats.pending}</div>
            <span className="text-[10px] text-amber-300/70">Requires follow-up</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1528] border border-blue-500/30 space-y-1">
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">Confirmed</span>
            <div className="text-2xl font-black text-blue-400">{stats.confirmed}</div>
            <span className="text-[10px] text-blue-300/70">Scheduled visits</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1528] border border-emerald-500/30 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">Admitted / Visited</span>
            <div className="text-2xl font-black text-emerald-400">{stats.visited + stats.admitted}</div>
            <span className="text-[10px] text-emerald-300/70">Completed appointments</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">Cancelled</span>
            <div className="text-2xl font-black text-slate-400">{stats.cancelled}</div>
            <span className="text-[10px] text-slate-500">Not joining</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">Wing Demand</span>
            <div className="text-sm font-bold text-white flex items-center justify-between pt-1">
              <span>👦 Boys: {stats.boys}</span>
              <span>👧 Girls: {stats.girls}</span>
            </div>
            <span className="text-[10px] text-slate-500">Gender distribution</span>
          </div>

        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by resident name, phone, room or remarks..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#080E1A] border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="visited">Visited</option>
              <option value="admitted">Admitted</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Section Filter */}
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Sections</option>
              <option value="boy">Boys Wing</option>
              <option value="girl">Girls Wing</option>
            </select>

            {/* Room Filter */}
            <select
              value={roomFilter}
              onChange={e => setRoomFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Room Types</option>
              <option value="single">Single Room</option>
              <option value="double">Double Sharing</option>
              <option value="triple">Triple Sharing</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="move_in">Sort: Move-in Date</option>
            </select>

            {(searchQuery || statusFilter !== 'all' || sectionFilter !== 'all' || roomFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSectionFilter('all');
                  setRoomFilter('all');
                }}
                className="px-2.5 py-2 text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}

          </div>

        </div>

        {/* Bookings List Table & Cards */}
        {loading ? (
          <div className="p-16 rounded-2xl bg-[#0B1528] border border-slate-800 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Retrieving appointments from Supabase...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#0B1528] border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Appointments Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                {bookings.length === 0
                  ? "Your Supabase database table currently has no bookings. Submit an inquiry through the public website or click 'Add Walk-In' above to test."
                  : "No bookings matched your active search and filter filters."}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Add Walk-in Resident
              </button>
              <button
                onClick={onBackToWebsite}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs"
              >
                Visit Booking Form
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080E1A] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
                  <tr>
                    <th className="py-3 px-4">Resident / Candidate</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Wing &amp; Room</th>
                    <th className="py-3 px-4">Move-in / Visit</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Room / Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80">
                  {filteredBookings.map((b) => {
                    const currentStatus = (b.status || 'pending').toLowerCase();
                    const isBoys = b.section?.toLowerCase().includes('boy');
                    const cleanPhone = (b.phone || '').replace(/\D/g, '');
                    const whatsappPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;

                    return (
                      <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                        
                        {/* Resident Name & Date */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">
                            {b.full_name || 'Anonymous Resident'}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>
                              {b.created_at ? new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                            </span>
                          </div>
                        </td>

                        {/* Contact & Fast Actions */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-xs font-semibold text-slate-200">
                            {b.phone}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`tel:${b.phone}`}
                              className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:underline"
                              title="Direct call"
                            >
                              <Phone className="w-3 h-3 text-amber-400" />
                              <span>Call</span>
                            </a>
                            <span className="text-slate-600">•</span>
                            <a
                              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                                `Hi ${b.full_name || 'there'}, greeting from Royal Boys & Girls PG! We received your inquiry for ${b.sharing_type || 'a room'}. When would you like to visit?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-400" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>

                        {/* Wing & Room Type */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isBoys ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
                            <span className="font-medium text-slate-200">{b.section || 'General'}</span>
                          </div>
                          <div className="text-[11px] text-amber-300/80 mt-0.5 font-medium">
                            {b.sharing_type || 'Sharing'}
                          </div>
                        </td>

                        {/* Expected Move-in Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {b.move_in_date ? (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{new Date(b.move_in_date).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Immediate / Flexible</span>
                          )}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={currentStatus}
                            onChange={e => handleStatusChange(b.id, e.target.value)}
                            disabled={isActionLoading}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider cursor-pointer outline-none ${
                              currentStatus === 'confirmed'
                                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                                : currentStatus === 'visited' || currentStatus === 'admitted'
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                : currentStatus === 'cancelled'
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                                : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            <option value="pending" className="bg-[#080E1A] text-amber-300">Pending</option>
                            <option value="confirmed" className="bg-[#080E1A] text-blue-300">Confirmed</option>
                            <option value="visited" className="bg-[#080E1A] text-emerald-300">Visited</option>
                            <option value="admitted" className="bg-[#080E1A] text-emerald-400">Admitted / Booked</option>
                            <option value="cancelled" className="bg-[#080E1A] text-rose-300">Cancelled</option>
                          </select>
                        </td>

                        {/* Assigned Room & Notes */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          {b.assigned_room && (
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-bold mb-1 border border-slate-700">
                              Room: {b.assigned_room}
                            </span>
                          )}
                          {b.notes ? (
                            <p className="text-[11px] text-slate-300 truncate" title={b.notes}>
                              {b.notes}
                            </p>
                          ) : b.message ? (
                            <p className="text-[11px] text-slate-500 italic truncate" title={b.message}>
                              "{b.message}"
                            </p>
                          ) : (
                            <span className="text-slate-600 text-[11px]">No notes</span>
                          )}
                        </td>

                        {/* Actions (Edit, WhatsApp, Cancel/Delete) */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            <button
                              onClick={() => setEditingBooking({ ...b })}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit Details & Notes"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {currentStatus !== 'cancelled' ? (
                              <button
                                onClick={() => handleStatusChange(b.id, 'cancelled')}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(b.id, 'pending')}
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                                title="Reopen Appointment"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => setDeletingId(b.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                              title="Delete from database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Count */}
            <div className="p-4 bg-[#080E1A] border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>
                Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> total records in database
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSqlGuide(true)}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  View Supabase SQL Guide
                </button>
                <span>•</span>
                <span className="text-slate-500">Auto-saved to Supabase</span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* EDIT BOOKING MODAL */}
      {editingBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEditingBooking(null)}
        >
          <div
            className="relative max-w-xl w-full bg-[#0B1528] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#080E1A]">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Edit Booking #{editingBooking.id}</h3>
              </div>
              <button onClick={() => setEditingBooking(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Resident Full Name</label>
                  <input
                    type="text"
                    value={editingBooking.full_name || ''}
                    onChange={e => setEditingBooking({ ...editingBooking, full_name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={editingBooking.phone || ''}
                    onChange={e => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Section</label>
                  <select
                    value={editingBooking.section || 'Boys Section'}
                    onChange={e => setEditingBooking({ ...editingBooking, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="Boys Section">Boys Section</option>
                    <option value="Girls Section">Girls Section</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Sharing Room</label>
                  <select
                    value={editingBooking.sharing_type || 'Double Sharing'}
                    onChange={e => setEditingBooking({ ...editingBooking, sharing_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="Single Occupancy">Single Occupancy</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Status</label>
                  <select
                    value={editingBooking.status || 'pending'}
                    onChange={e => setEditingBooking({ ...editingBooking, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="visited">Visited</option>
                    <option value="admitted">Admitted</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Move-In / Visit Date</label>
                  <input
                    type="date"
                    value={editingBooking.move_in_date || ''}
                    onChange={e => setEditingBooking({ ...editingBooking, move_in_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Assign Room Number (Optional)</label>
                  <input
                    type="text"
                    value={editingBooking.assigned_room || ''}
                    onChange={e => setEditingBooking({ ...editingBooking, assigned_room: e.target.value })}
                    placeholder="e.g. Room 204 (2nd Floor)"
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold uppercase">Internal Staff Notes / Follow-up remarks</label>
                <textarea
                  rows={2}
                  value={editingBooking.notes || ''}
                  onChange={e => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  placeholder="e.g. Called parents. Agreed to visit Sunday afternoon with ₹2,000 token."
                  className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Original Resident Message</label>
                <textarea
                  rows={2}
                  value={editingBooking.message || ''}
                  onChange={e => setEditingBooking({ ...editingBooking, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-slate-300 text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isActionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ADD WALK-IN / NEW BOOKING MODAL */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative max-w-xl w-full bg-[#0B1528] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#080E1A]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Record Walk-In / Phone Booking</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBooking} className="p-6 space-y-4 text-xs">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Resident Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newBooking.full_name}
                    onChange={e => setNewBooking({ ...newBooking, full_name: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newBooking.phone}
                    onChange={e => setNewBooking({ ...newBooking, phone: e.target.value })}
                    placeholder="e.g. 0987654321"
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Section</label>
                  <select
                    value={newBooking.section}
                    onChange={e => setNewBooking({ ...newBooking, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="Boys Section">Boys Section</option>
                    <option value="Girls Section">Girls Section</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Sharing Room</label>
                  <select
                    value={newBooking.sharing_type}
                    onChange={e => setNewBooking({ ...newBooking, sharing_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Single Occupancy">Single Occupancy</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Status</label>
                  <select
                    value={newBooking.status}
                    onChange={e => setNewBooking({ ...newBooking, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="visited">Visited</option>
                    <option value="admitted">Admitted</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Expected Move-in / Visit Date</label>
                  <input
                    type="date"
                    value={newBooking.move_in_date}
                    onChange={e => setNewBooking({ ...newBooking, move_in_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase">Notes / Special Requirements</label>
                  <input
                    type="text"
                    value={newBooking.message}
                    onChange={e => setNewBooking({ ...newBooking, message: e.target.value })}
                    placeholder="e.g. Student at Acharya Pharmacy college"
                    className="w-full px-3 py-2 rounded-lg bg-[#080E1A] border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isActionLoading ? 'Saving...' : 'Save Walk-In Booking'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#0B1528] border border-rose-500/40 rounded-2xl p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-base">Permanently Delete Appointment?</h3>
              <p className="text-xs text-slate-400">
                This action will delete booking record <strong>#{deletingId}</strong> from your Supabase database. If you just want to mark it cancelled, use the Cancel status instead.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Keep Record
              </button>
              <button
                onClick={confirmDeleteBooking}
                disabled={isActionLoading}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                {isActionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL SCRIPT GUIDE MODAL */}
      {showSqlGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowSqlGuide(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0A1222] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B1528]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Supabase SQL Schema &amp; Policies</h3>
              </div>
              <button onClick={() => setShowSqlGuide(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              <p>
                Run this complete script in your{' '}
                <a
                  href="https://supabase.com/dashboard/project/kiwpzxjdbcwkfafngdgj/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline"
                >
                  Supabase Dashboard &gt; SQL Editor
                </a>{' '}
                to ensure full read, write, update, and delete capabilities for the admin panel:
              </p>

              <div className="relative">
                <button
                  onClick={() => {
                    const sql = `-- Complete bookings table with update/delete RLS policies
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  section TEXT NOT NULL,
  sharing_type TEXT NOT NULL,
  move_in_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  assigned_room TEXT,
  notes TEXT
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on bookings" ON bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select on bookings" ON bookings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public update on bookings" ON bookings
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on bookings" ON bookings
  FOR DELETE TO anon, authenticated USING (true);`;
                    navigator.clipboard.writeText(sql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-[11px] font-bold cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                </button>

                <pre className="p-4 bg-black/70 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
{`-- 1. Create table with extra admin columns
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  section TEXT NOT NULL,
  sharing_type TEXT NOT NULL,
  move_in_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  assigned_room TEXT,
  notes TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. Policies for CRUD
CREATE POLICY "Allow public insert on bookings" ON bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select on bookings" ON bookings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public update on bookings" ON bookings
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on bookings" ON bookings
  FOR DELETE TO anon, authenticated USING (true);`}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080E1A] flex justify-end">
              <button
                onClick={() => setShowSqlGuide(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
