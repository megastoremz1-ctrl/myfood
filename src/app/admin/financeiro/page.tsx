'use client';

import { DollarSign, TrendingUp, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const transactions = [
  { id: 1, desc: 'Comissao - Mundos Restaurant', amount: 915, type: 'credit', date: '23 Jul 14:32' },
  { id: 2, desc: 'Comissao - Pizza House', amount: 720, type: 'credit', date: '23 Jul 14:28' },
  { id: 3, desc: 'Pagamento entregador Carlos M.', amount: -5000, type: 'debit', date: '23 Jul 12:00' },
  { id: 4, desc: 'Comissao - Sushi Master', amount: 1335, type: 'credit', date: '23 Jul 11:45' },
  { id: 5, desc: 'Pagamento entregador Pedro A.', amount: -4200, type: 'debit', date: '22 Jul 18:00' },
  { id: 6, desc: 'Comissao - Frango Piri-Piri', amount: 645, type: 'credit', date: '22 Jul 16:30' },
];

export default function AdminFinancePage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Financeiro</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="card p-5 text-center">
          <DollarSign className="w-6 h-6 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">36.850 MT</p>
          <p className="text-xs text-gray-500">Comissoes hoje</p>
          <p className="text-xs text-secondary-600 mt-1"><TrendingUp className="w-3 h-3 inline" /> +18%</p>
        </div>
        <div className="card p-5 text-center">
          <Percent className="w-6 h-6 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">15%</p>
          <p className="text-xs text-gray-500">Taxa de comissao</p>
        </div>
        <div className="card p-5 text-center">
          <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">892.400 MT</p>
          <p className="text-xs text-gray-500">Receita total (mes)</p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">Transacoes recentes</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <div key={tx.id} className="px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tx.type === 'credit' ? 'bg-secondary-50' : 'bg-red-50'
              }`}>
                {tx.type === 'credit' ? <ArrowUpRight className="w-4 h-4 text-secondary-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{tx.desc}</p>
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
