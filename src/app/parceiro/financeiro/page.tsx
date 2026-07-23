'use client';

import { DollarSign, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const transactions = [
  { id: 't1', type: 'credit', desc: 'Pedido #P-001 - Antonio M.', amount: 610, date: '23 Jul, 14:32' },
  { id: 't2', type: 'credit', desc: 'Pedido #P-002 - Maria S.', amount: 960, date: '23 Jul, 14:28' },
  { id: 't3', type: 'debit', desc: 'Comissao MyFood (15%)', amount: -235, date: '23 Jul, 14:00' },
  { id: 't4', type: 'credit', desc: 'Pedido #P-003 - Joao P.', amount: 650, date: '23 Jul, 13:45' },
  { id: 't5', type: 'debit', desc: 'Levantamento M-Pesa', amount: -5000, date: '22 Jul, 18:00' },
  { id: 't6', type: 'credit', desc: 'Pedido #P-004 - Ana L.', amount: 440, date: '22 Jul, 16:30' },
];

export default function PartnerFinancePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Financeiro</h2>
        <button className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200">
          <Download className="w-4 h-4" /> Exportar
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="card p-5 text-center">
          <DollarSign className="w-6 h-6 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">45.800 MT</p>
          <p className="text-xs text-gray-500 mt-1">Saldo disponivel</p>
          <button className="mt-3 w-full bg-secondary-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-secondary-600">
            Levantar
          </button>
        </div>
        <div className="card p-5 text-center">
          <TrendingUp className="w-6 h-6 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">103.000 MT</p>
          <p className="text-xs text-gray-500 mt-1">Receita este mes</p>
        </div>
        <div className="card p-5 text-center">
          <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">15.450 MT</p>
          <p className="text-xs text-gray-500 mt-1">Comissoes pagas</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">Historico de transacoes</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <div key={tx.id} className="px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tx.type === 'credit' ? 'bg-secondary-50' : 'bg-red-50'
              }`}>
                {tx.type === 'credit' ? (
                  <ArrowUpRight className="w-4 h-4 text-secondary-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{tx.desc}</p>
                <p className="text-[10px] text-gray-400">{tx.date}</p>
              </div>
              <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-secondary-600' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount} MT
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
