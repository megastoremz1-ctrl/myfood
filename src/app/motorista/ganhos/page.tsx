'use client';

import { DollarSign, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

const weekEarnings = [
  { day: 'Seg', amount: 520 },
  { day: 'Ter', amount: 680 },
  { day: 'Qua', amount: 450 },
  { day: 'Qui', amount: 720 },
  { day: 'Sex', amount: 890 },
  { day: 'Sab', amount: 1050 },
  { day: 'Dom', amount: 780 },
];

const maxAmount = Math.max(...weekEarnings.map(d => d.amount));

export default function DriverEarningsPage() {
  const totalWeek = weekEarnings.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      {/* Main Balance */}
      <div className="card p-6 text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">Disponivel para levantamento</p>
        <p className="text-3xl font-bold text-gray-900">10.800 MT</p>
        <button className="mt-4 w-full bg-secondary-500 text-white text-sm font-semibold py-3 rounded-xl hover:bg-secondary-600 transition-colors">
          Levantar para M-Pesa
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-500">Hoje</p>
          <p className="text-base font-bold text-gray-900">680 MT</p>
          <p className="text-[10px] text-secondary-600 flex items-center justify-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />+15%
          </p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-500">Semana</p>
          <p className="text-base font-bold text-gray-900">{totalWeek} MT</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-500">Mes</p>
          <p className="text-base font-bold text-gray-900">14.200 MT</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-4 mb-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Ganhos da semana</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weekEarnings.map(({ day, amount }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-medium text-gray-600">{amount}</span>
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                style={{ height: `${(amount / maxAmount) * 100}%`, minHeight: '8px' }}
              />
              <span className="text-[10px] text-gray-500 mt-1">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Levantamentos recentes</h3>
        <div className="space-y-3">
          {[
            { date: '20 Jul 2026', amount: 5000, method: 'M-Pesa' },
            { date: '15 Jul 2026', amount: 4500, method: 'M-Pesa' },
            { date: '10 Jul 2026', amount: 3800, method: 'e-Mola' },
          ].map((payout, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary-50 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-secondary-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{payout.method}</p>
                <p className="text-[10px] text-gray-400">{payout.date}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">{payout.amount} MT</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
