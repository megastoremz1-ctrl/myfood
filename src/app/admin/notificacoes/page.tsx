'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, Users, Store, Bike, Search, X, Check, Loader2, RefreshCw, Clock } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

type TargetMode = 'all' | 'clients' | 'business' | 'drivers' | 'specific';
type NotificationType = 'order' | 'promo' | 'system';
type Tab = 'compose' | 'history';

interface Profile {
  id: string;
  full_name: string;
  role: string;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  profiles: { full_name: string } | null;
}

export default function AdminNotificationsPage() {
  const [tab, setTab] = useState<Tab>('compose');

  // Compose state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('system');
  const [targetMode, setTargetMode] = useState<TargetMode>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileSearch, setProfileSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // History state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const supabase = getSupabase();

  // Fetch profiles when specific mode is selected
  useEffect(() => {
    if (targetMode === 'specific') {
      fetchProfiles();
    }
  }, [targetMode]);

  // Fetch history when history tab is selected
  useEffect(() => {
    if (tab === 'history') {
      fetchHistory();
    }
  }, [tab]);

  async function fetchProfiles() {
    setLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role');
      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoadingProfiles(false);
    }
  }

  async function fetchHistory() {
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function getRecipientIds(): Promise<string[]> {
    if (targetMode === 'specific') {
      return selectedUserIds;
    }

    let query = supabase.from('profiles').select('id');

    if (targetMode === 'clients') {
      query = query.eq('role', 'client');
    } else if (targetMode === 'business') {
      query = query.eq('role', 'business');
    } else if (targetMode === 'drivers') {
      query = query.eq('role', 'driver');
    }
    // 'all' fetches all users without filter

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((p) => p.id);
  }

  async function handleSend() {
    if (!title.trim() || !message.trim()) return;
    if (targetMode === 'specific' && selectedUserIds.length === 0) return;

    setSending(true);
    try {
      const recipientIds = await getRecipientIds();

      if (recipientIds.length === 0) {
        alert('Nenhum destinatario encontrado.');
        setSending(false);
        return;
      }

      const { error } = await supabase.from('notifications').insert(
        recipientIds.map((userId) => ({
          user_id: userId,
          title: title.trim(),
          message: message.trim(),
          type,
          read: false,
        }))
      );

      if (error) throw error;

      setSent(true);
      setTitle('');
      setMessage('');
      setSelectedUserIds([]);
      setType('system');
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error('Error sending notifications:', err);
      alert('Erro ao enviar notificacoes. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  const filteredProfiles = profiles.filter(
    (p) =>
      !selectedUserIds.includes(p.id) &&
      (p.full_name?.toLowerCase().includes(profileSearch.toLowerCase()) ||
        p.role?.toLowerCase().includes(profileSearch.toLowerCase()))
  );

  const getSelectedProfile = (id: string) => profiles.find((p) => p.id === id);

  const canSend = title.trim() && message.trim() && (targetMode !== 'specific' || selectedUserIds.length > 0);

  const getTypeBadge = (t: string) => {
    switch (t) {
      case 'order':
        return <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Pedido</span>;
      case 'promo':
        return <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Promocao</span>;
      case 'system':
        return <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">Sistema</span>;
      default:
        return <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{t}</span>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Notificacoes</h2>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setTab('compose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === 'compose' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Compor
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Historico
          </button>
        </div>
      </div>

      {tab === 'compose' ? (
        <div className="card p-5 space-y-5">
          {/* Target Mode Selection */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Enviar para</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {([
                { mode: 'all' as TargetMode, label: 'Todos', icon: Bell },
                { mode: 'clients' as TargetMode, label: 'Clientes', icon: Users },
                { mode: 'business' as TargetMode, label: 'Restaurantes', icon: Store },
                { mode: 'drivers' as TargetMode, label: 'Entregadores', icon: Bike },
                { mode: 'specific' as TargetMode, label: 'Especifico', icon: Search },
              ]).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => {
                    setTargetMode(mode);
                    setSelectedUserIds([]);
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    targetMode === mode
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-100 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Specific User Selection */}
          {targetMode === 'specific' && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {loadingProfiles ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                  <span className="ml-2 text-sm text-gray-500">Carregando utilizadores...</span>
                </div>
              ) : (
                <>
                  {/* Selected users */}
                  {selectedUserIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUserIds.map((id) => {
                        const profile = getSelectedProfile(id);
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full"
                          >
                            {profile?.full_name || id}
                            <button onClick={() => setSelectedUserIds((prev) => prev.filter((uid) => uid !== id))} className="hover:text-purple-900 ml-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profileSearch}
                      onChange={(e) => {
                        setProfileSearch(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Pesquisar utilizadores por nome ou role..."
                      className="input-field pl-10 text-sm w-full"
                    />
                  </div>

                  {/* Dropdown */}
                  {showDropdown && filteredProfiles.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl max-h-40 overflow-y-auto shadow-sm">
                      {filteredProfiles.slice(0, 20).map((profile) => (
                        <button
                          key={profile.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedUserIds((prev) => [...prev, profile.id]);
                            setProfileSearch('');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                        >
                          <span>{profile.full_name || 'Sem nome'}</span>
                          <span className="text-[10px] text-gray-400 capitalize">{profile.role}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedUserIds(profiles.map((p) => p.id))}
                      className="text-xs text-purple-600 font-medium hover:underline"
                    >
                      Selecionar todos ({profiles.length})
                    </button>
                    {selectedUserIds.length > 0 && (
                      <button onClick={() => setSelectedUserIds([])} className="text-xs text-red-500 font-medium hover:underline">
                        Limpar selecao
                      </button>
                    )}
                    <span className="text-[10px] text-gray-400 ml-auto">
                      {selectedUserIds.length} selecionado(s)
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Titulo *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Promocao especial!"
              className="input-field text-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Mensagem *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva a mensagem..."
              className="input-field h-28 resize-none text-sm"
              maxLength={500}
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{message.length}/500</p>
          </div>

          {/* Notification Type */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Tipo de notificacao</label>
            <div className="flex gap-2">
              {([
                { value: 'order' as NotificationType, label: 'Pedido' },
                { value: 'promo' as NotificationType, label: 'Promocao' },
                { value: 'system' as NotificationType, label: 'Sistema' },
              ]).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    type === value ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-3">
            <Bell className="w-5 h-5 text-purple-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-purple-700">Resumo do envio</p>
              <p className="text-xs text-purple-600">
                {targetMode === 'all' && 'Todos os utilizadores'}
                {targetMode === 'clients' && 'Apenas clientes'}
                {targetMode === 'business' && 'Apenas restaurantes'}
                {targetMode === 'drivers' && 'Apenas entregadores'}
                {targetMode === 'specific' && `${selectedUserIds.length} utilizador(es) selecionado(s)`}
                {' • Tipo: '}
                {type === 'order' ? 'Pedido' : type === 'promo' ? 'Promocao' : 'Sistema'}
              </p>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canSend || sending}
            className={`w-full btn-primary text-sm flex items-center justify-center gap-2 ${
              !canSend || sending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : sent ? (
              <Check className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sending ? 'Enviando...' : sent ? 'Enviado com sucesso!' : 'Enviar notificacao'}
          </button>
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-3">
          {/* Refresh button */}
          <div className="flex justify-end">
            <button
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="flex items-center gap-1.5 text-xs text-purple-600 font-medium hover:underline disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          {loadingHistory ? (
            <div className="card p-12 text-center">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Carregando historico...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="card p-12 text-center">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma notificacao enviada</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{n.title}</h4>
                      {getTypeBadge(n.type)}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${
                      n.read ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {n.read ? 'Lido' : 'Nao lido'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.created_at).toLocaleString('pt-MZ', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {n.profiles?.full_name || 'Utilizador desconhecido'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
