'use client';

import { AlertCircle, CheckCircle, Clock, MessageCircle } from 'lucide-react';

const complaints = [
  { id: 'C-001', customer: 'Maria S.', order: 'ORD-2335', issue: 'Pedido chegou frio', status: 'open', time: '2h' },
  { id: 'C-002', customer: 'Joao P.', order: 'ORD-2330', issue: 'Item em falta no pedido', status: 'open', time: '4h' },
  { id: 'C-003', customer: 'Ana L.', order: 'ORD-2325', issue: 'Demora na entrega (50 min)', status: 'in_progress', time: '6h' },
  { id: 'C-004', customer: 'Carlos F.', order: 'ORD-2318', issue: 'Embalagem danificada', status: 'resolved', time: '1d' },
  { id: 'C-005', customer: 'Sara M.', order: 'ORD-2310', issue: 'Pedido errado entregue', status: 'resolved', time: '2d' },
];

export default function AdminComplaintsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Reclamacoes</h2>
          <p className="text-sm text-gray-500">{complaints.filter(c => c.status !== 'resolved').length} pendentes</p>
        </div>
      </div>

      <div className="space-y-3">
        {complaints.map((c) => (
          <div key={c.id} className={`card p-4 ${c.status === 'open' ? 'border-l-4 border-l-red-400' : c.status === 'in_progress' ? 'border-l-4 border-l-yellow-400' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{c.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === 'open' ? 'bg-red-100 text-red-700' :
                    c.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-secondary-100 text-secondary-700'
                  }`}>
                    {c.status === 'open' ? 'Aberta' : c.status === 'in_progress' ? 'Em analise' : 'Resolvida'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{c.customer} - {c.order}</p>
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />{c.time}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{c.issue}</p>
            {c.status !== 'resolved' && (
              <div className="flex gap-2">
                <button className="flex-1 bg-secondary-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-secondary-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Resolver
                </button>
                <button className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gray-200">
                  <MessageCircle className="w-3.5 h-3.5" /> Responder
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
