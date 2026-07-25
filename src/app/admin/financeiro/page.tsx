'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2, RefreshCw, Filter, Search } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  created_at: string;
  status: string;
  profiles: { full_name: string } | null;
}

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [commission, setCommission] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const supabase = getSupabase();

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (transactionsError) {
      console.error('Erro ao buscar transacoes:', transactionsError);
    } else {
      setTransactions(transactionsData || []);
      setFilteredTransactions(transactionsData || []);

      const pending = (transactionsData || [])
        .filter((t: Transaction) => t.status === 'pending')
        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
      setPendingPayouts(pending);
    }

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('total')
      .eq('payment_status', 'paid');

    if (ordersError) {
      console.error('Erro ao buscar pedidos:', ordersError);
    } else {
      const revenue = (ordersData || []).reduce((sum: number, order: { total: number }) => sum + order.total, 0);
      setTotalRevenue(revenue);
      setCommission(revenue * 0.15);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [filterType, searchTerm, transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      order_payment: { label: 'Pagamento', color: 'bg-green-100 text-green-800' },
      commission: { label: 'Comissao', color: 'bg-blue-100 text-blue-800' },
      driver_payout: { label: 'Repasse Motorista', color: 'bg-purple-100 text-purple-800' },
      restaurant_payout: { label: 'Repasse Restaurante', color: 'bg-orange-100 text-orange-800' },
      refund: { label: 'Reembolso', color: 'bg-red-100 text-red-800' },
    };
    const badge = badges[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Receita Total</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Comissao (15%)</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(commission)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transacoes</p>
              <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ArrowUpRight className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Repasses Pendentes</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(pendingPayouts)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ArrowDownRight className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transacao..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="relative flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pr-8"
            >
              <option value="all">Todos</option>
              <option value="order_payment">Pagamentos</option>
              <option value="commission">Comissao</option>
              <option value="driver_payout">Repasse Motorista</option>
              <option value="restaurant_payout">Repasse Restaurante</option>
              <option value="refund">Reembolso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma transacao encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.amount >= 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction.amount >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.profiles?.full_name || 'Usuario'} &bull; {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  {getTypeBadge(transaction.type)}
                  <span
                    className={`font-semibold ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount >= 0 ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
