'use client';

import { useState, useEffect } from 'react';
import {
  AlertCircle,
  MessageCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  Send,
  X,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface Complaint {
  id: string;
  customer_id: string;
  restaurant_id: string;
  issue: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  assigned_to: string | null;
  response: string | null;
  resolution: string | null;
  resolved_at: string | null;
  profiles: { full_name: string } | null;
  restaurants: { name: string } | null;
}

export default function ReclamacoesPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('complaints')
      .select('*, profiles!complaints_customer_id_fkey(full_name), restaurants(name)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComplaints(data as Complaint[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const customerName = c.profiles?.full_name?.toLowerCase() || '';
      const issueText = c.issue?.toLowerCase() || '';
      if (!customerName.includes(term) && !issueText.includes(term)) return false;
    }
    return true;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'open').length,
    inProgress: complaints.filter((c) => c.status === 'in_progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-gray-400';
      default:
        return 'border-l-gray-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-orange-100 text-orange-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'escalated':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'in_progress':
        return 'Em Andamento';
      case 'resolved':
        return 'Resolvido';
      case 'escalated':
        return 'Escalado';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const handleSendResponse = async (id: string) => {
    if (!responseText.trim()) return;
    const supabase = getSupabase();
    const { error } = await supabase
      .from('complaints')
      .update({ response: responseText, status: 'in_progress' })
      .eq('id', id);

    if (!error) {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, response: responseText, status: 'in_progress' as const } : c
        )
      );
      setResponseText('');
      setRespondingTo(null);
    }
  };

  const handleResolve = async (id: string) => {
    if (!resolutionText.trim()) return;
    const supabase = getSupabase();
    const { error } = await supabase
      .from('complaints')
      .update({ resolution: resolutionText, status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, resolution: resolutionText, status: 'resolved' as const, resolved_at: new Date().toISOString() }
            : c
        )
      );
      setResolutionText('');
      setResolvingId(null);
    }
  };

  const handleEscalate = async (id: string) => {
    if (!confirm('Tem certeza que deseja escalar esta reclamacao?')) return;
    const supabase = getSupabase();
    const { error } = await supabase
      .from('complaints')
      .update({ status: 'escalated' })
      .eq('id', id);

    if (!error) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'escalated' as const } : c))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reclamacoes</h1>
          <p className="text-gray-500 text-sm mt-1">Gerenciamento de reclamacoes e suporte ao cliente</p>
        </div>
        <button
          onClick={fetchComplaints}
          className="btn-primary flex items-center gap-2 px-4 py-2 self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <AlertCircle className="w-5 h-5 mx-auto text-gray-500 mb-1" />
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="card p-4 text-center">
          <AlertCircle className="w-5 h-5 mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
          <p className="text-xs text-gray-500">Abertos</p>
        </div>
        <div className="card p-4 text-center">
          <Clock className="w-5 h-5 mx-auto text-orange-500 mb-1" />
          <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
          <p className="text-xs text-gray-500">Em Andamento</p>
        </div>
        <div className="card p-4 text-center">
          <CheckCircle className="w-5 h-5 mx-auto text-green-500 mb-1" />
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-xs text-gray-500">Resolvidos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente ou descricao..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">Todos Status</option>
                <option value="open">Aberto</option>
                <option value="in_progress">Em Andamento</option>
                <option value="resolved">Resolvido</option>
                <option value="escalated">Escalado</option>
              </select>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">Todas Prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 && (
          <div className="card p-8 text-center text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma reclamacao encontrada</p>
          </div>
        )}

        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className={`card p-4 border-l-4 ${getPriorityBorderColor(complaint.priority)}`}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400 font-mono">#{complaint.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                    {getStatusLabel(complaint.status)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(complaint.priority)}`}>
                    {getPriorityLabel(complaint.priority)}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(complaint.created_at).toLocaleString('pt-MZ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {complaint.profiles?.full_name || 'Cliente desconhecido'}
                  </span>
                  {complaint.restaurants?.name && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{complaint.restaurants.name}</span>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-700 mt-1">{complaint.issue}</p>

                {complaint.assigned_to && (
                  <p className="text-xs text-gray-500 mt-2">
                    Atribuido a: <span className="font-medium">{complaint.assigned_to}</span>
                  </p>
                )}

                {complaint.response && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                    <MessageCircle className="w-3 h-3 inline mr-1" />
                    {complaint.response}
                  </div>
                )}

                {complaint.resolution && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    {complaint.resolution}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                {complaint.status !== 'resolved' && (
                  <>
                    <button
                      onClick={() => {
                        setRespondingTo(respondingTo === complaint.id ? null : complaint.id);
                        setResponseText('');
                      }}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Responder
                    </button>
                    <button
                      onClick={() => {
                        setResolvingId(complaint.id);
                        setResolutionText('');
                      }}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Resolver
                    </button>
                    {complaint.status !== 'escalated' && (
                      <button
                        onClick={() => handleEscalate(complaint.id)}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 bg-red-600 hover:bg-red-700"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Escalar
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Response textarea */}
            {respondingTo === complaint.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Responder ao cliente:</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Digite sua resposta..."
                  rows={3}
                  className="input-field w-full resize-none"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => setRespondingTo(null)}
                    className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSendResponse(complaint.id)}
                    className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Enviar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resolution Modal */}
      {resolvingId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Resolver Reclamacao
              </h2>
              <button onClick={() => setResolvingId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Descricao da Resolucao</label>
                <textarea
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Descreva a resolucao aplicada..."
                  rows={4}
                  className="input-field w-full resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setResolvingId(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleResolve(resolvingId)}
                  className="btn-primary px-4 py-2 flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmar Resolucao
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
