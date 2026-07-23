'use client';

import { useState } from 'react';
import {
  AlertCircle,
  MessageCircle,
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  X,
  Send,
  AlertTriangle,
  ArrowUp,
  Eye,
  FileText,
} from 'lucide-react';

interface Complaint {
  id: number;
  customer: string;
  order: string;
  issue: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  assignedTo: string | null;
  response: string | null;
  resolution: string | null;
}

const initialComplaints: Complaint[] = [
  {
    id: 1,
    customer: 'Maria Silva',
    order: 'PED-1001',
    issue: 'Pedido chegou frio e com itens faltando. Faltou o refrigerante e a sobremesa.',
    status: 'open',
    priority: 'high',
    createdAt: '10 min atrás',
    assignedTo: null,
    response: null,
    resolution: null,
  },
  {
    id: 2,
    customer: 'João Santos',
    order: 'PED-1002',
    issue: 'Entregador foi rude durante a entrega e não respeitou as instruções de entrega.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '25 min atrás',
    assignedTo: 'Ana Costa',
    response: 'Estamos analisando o caso e entrando em contato com o entregador.',
    resolution: null,
  },
  {
    id: 3,
    customer: 'Ana Oliveira',
    order: 'PED-1003',
    issue: 'Cobrança duplicada no cartão de crédito para o mesmo pedido.',
    status: 'escalated',
    priority: 'high',
    createdAt: '1 hora atrás',
    assignedTo: 'Carlos Lima',
    response: 'Caso encaminhado para o setor financeiro.',
    resolution: null,
  },
  {
    id: 4,
    customer: 'Pedro Almeida',
    order: 'PED-1004',
    issue: 'Alergia alimentar não respeitada. Pedido continha amendoim mesmo com aviso.',
    status: 'open',
    priority: 'high',
    createdAt: '15 min atrás',
    assignedTo: null,
    response: null,
    resolution: null,
  },
  {
    id: 5,
    customer: 'Carla Mendes',
    order: 'PED-1005',
    issue: 'Tempo de entrega muito acima do estimado. Esperou mais de 2 horas.',
    status: 'resolved',
    priority: 'medium',
    createdAt: '3 horas atrás',
    assignedTo: 'Ana Costa',
    response: 'Pedimos desculpas pelo atraso. Cupom de desconto enviado.',
    resolution: 'Cupom de R$20 enviado ao cliente.',
  },
  {
    id: 6,
    customer: 'Roberto Ferreira',
    order: 'PED-1006',
    issue: 'Pedido veio com item errado. Solicitei frango e veio carne.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '45 min atrás',
    assignedTo: 'Marcos Souza',
    response: null,
    resolution: null,
  },
  {
    id: 7,
    customer: 'Lucia Barbosa',
    order: 'PED-1007',
    issue: 'Embalagem veio aberta e comida derramada dentro da sacola.',
    status: 'open',
    priority: 'low',
    createdAt: '2 horas atrás',
    assignedTo: null,
    response: null,
    resolution: null,
  },
  {
    id: 8,
    customer: 'Fernando Costa',
    order: 'PED-1008',
    issue: 'Não consigo aplicar o cupom de desconto na finalização do pedido.',
    status: 'resolved',
    priority: 'low',
    createdAt: '5 horas atrás',
    assignedTo: 'Marcos Souza',
    response: 'Problema identificado no sistema de cupons. Já foi corrigido.',
    resolution: 'Bug corrigido e cupom aplicado manualmente.',
  },
  {
    id: 9,
    customer: 'Tatiana Rocha',
    order: 'PED-1009',
    issue: 'Restaurante cancelou meu pedido sem aviso prévio depois de 40 minutos de espera.',
    status: 'escalated',
    priority: 'high',
    createdAt: '30 min atrás',
    assignedTo: 'Carlos Lima',
    response: 'Entraremos em contato com o restaurante para esclarecimentos.',
    resolution: null,
  },
  {
    id: 10,
    customer: 'Diego Martins',
    order: 'PED-1010',
    issue: 'Aplicativo travou durante o pagamento e não sei se o pedido foi confirmado.',
    status: 'open',
    priority: 'medium',
    createdAt: '5 min atrás',
    assignedTo: null,
    response: null,
    resolution: null,
  },
];

const teamMembers = ['Ana Costa', 'Carlos Lima', 'Marcos Souza', 'Juliana Reis'];

const resolutionTypes = ['Reembolso', 'Substituição', 'Pedido de desculpas', 'Cupom', 'Outro'];

export default function ReclamacoesPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [resolutionType, setResolutionType] = useState('Reembolso');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [detailId, setDetailId] = useState<number | null>(null);

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !c.customer.toLowerCase().includes(term) &&
        !c.order.toLowerCase().includes(term)
      )
        return false;
    }
    return true;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'open').length,
    inProgress: complaints.filter((c) => c.status === 'in_progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
    avgResolutionTime: '2.5h',
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
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const handleSendResponse = (id: number) => {
    if (!responseText.trim()) return;
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, response: responseText, status: c.status === 'open' ? 'in_progress' : c.status }
          : c
      )
    );
    setResponseText('');
    setRespondingTo(null);
  };

  const handleResolve = (id: number) => {
    if (!resolutionNotes.trim()) return;
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'resolved', resolution: `${resolutionType}: ${resolutionNotes}` }
          : c
      )
    );
    setResolutionNotes('');
    setResolutionType('Reembolso');
    setResolvingId(null);
  };

  const handleEscalate = (id: number) => {
    if (confirm('Tem certeza que deseja escalar esta reclamação?')) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'escalated' } : c))
      );
    }
  };

  const handleAssign = (id: number, member: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, assignedTo: member, status: c.status === 'open' ? 'in_progress' : c.status }
          : c
      )
    );
  };

  const detailComplaint = complaints.find((c) => c.id === detailId);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reclamações</h1>
          <p className="text-gray-500 text-sm mt-1">Gerenciamento de reclamações e suporte ao cliente</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4 text-center">
          <FileText className="w-5 h-5 mx-auto text-gray-500 mb-1" />
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
        <div className="card p-4 text-center col-span-2 md:col-span-1">
          <Clock className="w-5 h-5 mx-auto text-purple-500 mb-1" />
          <p className="text-2xl font-bold text-purple-600">{stats.avgResolutionTime}</p>
          <p className="text-xs text-gray-500">Tempo Médio</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente ou número do pedido..."
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
              <option value="medium">Média</option>
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
            <p>Nenhuma reclamação encontrada com os filtros selecionados.</p>
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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                    {getStatusLabel(complaint.status)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(complaint.priority)}`}>
                    {getPriorityLabel(complaint.priority)}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {complaint.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{complaint.customer}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{complaint.order}</span>
                </div>

                <p className="text-sm text-gray-700 mt-1">{complaint.issue}</p>

                {complaint.assignedTo && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Atribuído a: <span className="font-medium">{complaint.assignedTo}</span>
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
                <button
                  onClick={() => setDetailId(complaint.id)}
                  className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Detalhes
                </button>

                {complaint.status !== 'resolved' && (
                  <>
                    <button
                      onClick={() => {
                        setRespondingTo(respondingTo === complaint.id ? null : complaint.id);
                        setResponseText(complaint.response || '');
                      }}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Responder
                    </button>
                    <button
                      onClick={() => setResolvingId(complaint.id)}
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
                        <ArrowUp className="w-3 h-3" />
                        Escalar
                      </button>
                    )}
                  </>
                )}

                {complaint.status !== 'resolved' && (
                  <select
                    value={complaint.assignedTo || ''}
                    onChange={(e) => handleAssign(complaint.id, e.target.value)}
                    className="input-field text-xs py-1.5"
                  >
                    <option value="">Atribuir a...</option>
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
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
                Resolver Reclamação
              </h2>
              <button onClick={() => setResolvingId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Tipo de Resolução</label>
                <select
                  value={resolutionType}
                  onChange={(e) => setResolutionType(e.target.value)}
                  className="input-field w-full"
                >
                  {resolutionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Notas da Resolução</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Descreva a resolução aplicada..."
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
                  Confirmar Resolução
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Detalhes da Reclamação #{detailComplaint.id}
              </h2>
              <button onClick={() => setDetailId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(detailComplaint.status)}`}>
                  {getStatusLabel(detailComplaint.status)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(detailComplaint.priority)}`}>
                  Prioridade: {getPriorityLabel(detailComplaint.priority)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Dados do Cliente
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Nome:</span> {detailComplaint.customer}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Pedido:</span> {detailComplaint.order}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Registrado:</span> {detailComplaint.createdAt}
                </p>
                {detailComplaint.assignedTo && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Atribuído a:</span> {detailComplaint.assignedTo}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Descrição do Problema
                </h3>
                <p className="text-sm text-gray-700 bg-red-50 p-3 rounded">{detailComplaint.issue}</p>
              </div>

              {detailComplaint.response && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Histórico de Respostas
                  </h3>
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                    {detailComplaint.response}
                  </div>
                </div>
              )}

              {detailComplaint.resolution && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Resolução
                  </h3>
                  <div className="bg-green-50 p-3 rounded text-sm text-green-800">
                    {detailComplaint.resolution}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setDetailId(null)}
                  className="btn-primary px-4 py-2"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
