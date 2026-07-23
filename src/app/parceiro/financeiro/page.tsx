'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Search,
  Filter,
  X,
  Check,
  Wallet,
  Building,
  Smartphone,
  Calendar,
} from 'lucide-react';

type TransactionType = 'credit' | 'debit';
type FilterType = 'all' | 'credit' | 'debit';
type PeriodFilter = 'hoje' | 'semana' | 'mes' | 'personalizado';
type WithdrawalStep = 'amount' | 'confirm' | 'success';
type Destination = 'mpesa' | 'emola' | 'bank';

interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const transactions: Transaction[] = [
  { id: 't1', type: 'credit', description: 'Pedido #P-1042 - Antonio Machava', amount: 1250, date: '23 Jul, 14:32', category: 'Pedido' },
  { id: 't2', type: 'credit', description: 'Pedido #P-1041 - Maria Santos', amount: 960, date: '23 Jul, 13:18', category: 'Pedido' },
  { id: 't3', type: 'debit', description: 'Comissão MyFood (15%) - Pedido #P-1042', amount: -187, date: '23 Jul, 14:32', category: 'Comissão' },
  { id: 't4', type: 'debit', description: 'Comissão MyFood (15%) - Pedido #P-1041', amount: -144, date: '23 Jul, 13:18', category: 'Comissão' },
  { id: 't5', type: 'credit', description: 'Pedido #P-1040 - João Pereira', amount: 650, date: '22 Jul, 18:45', category: 'Pedido' },
  { id: 't6', type: 'debit', description: 'Levantamento M-Pesa - 84 712 3456', amount: -10000, date: '22 Jul, 16:00', category: 'Levantamento' },
  { id: 't7', type: 'credit', description: 'Pedido #P-1039 - Ana Lopes', amount: 440, date: '22 Jul, 12:30', category: 'Pedido' },
  { id: 't8', type: 'credit', description: 'Pedido #P-1038 - Carlos Mondlane', amount: 1850, date: '21 Jul, 20:15', category: 'Pedido' },
  { id: 't9', type: 'debit', description: 'Comissão MyFood (15%) - Pedido #P-1038', amount: -277, date: '21 Jul, 20:15', category: 'Comissão' },
  { id: 't10', type: 'credit', description: 'Pedido #P-1037 - Fátima Nguenha', amount: 780, date: '21 Jul, 19:00', category: 'Pedido' },
  { id: 't11', type: 'debit', description: 'Levantamento e-Mola - 86 456 7890', amount: -5000, date: '20 Jul, 10:00', category: 'Levantamento' },
  { id: 't12', type: 'credit', description: 'Pedido #P-1036 - Ricardo Tembe', amount: 2100, date: '20 Jul, 13:22', category: 'Pedido' },
];

const destinationOptions: { value: Destination; label: string; icon: React.ReactNode }[] = [
  { value: 'mpesa', label: 'M-Pesa', icon: <Smartphone className="w-4 h-4" /> },
  { value: 'emola', label: 'e-Mola', icon: <Wallet className="w-4 h-4" /> },
  { value: 'bank', label: 'Transferência Bancária', icon: <Building className="w-4 h-4" /> },
];

export default function PartnerFinancePage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('mes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawalStep>('amount');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDestination, setWithdrawDestination] = useState<Destination>('mpesa');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const availableBalance = 45800;
  const totalRevenue = 103000;
  const commissionsPaid = 15450;
  const pendingWithdrawals = 0;

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filter === 'all' || tx.type === filter;
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExport = () => {
    showToastMessage('Exportado!');
  };

  const openWithdrawModal = () => {
    setWithdrawStep('amount');
    setWithdrawAmount('');
    setWithdrawDestination('mpesa');
    setShowWithdrawModal(true);
  };

  const handleWithdrawConfirm = () => {
    setWithdrawStep('success');
  };

  const handleWithdrawClose = () => {
    setShowWithdrawModal(false);
    if (withdrawStep === 'success') {
      showToastMessage('Levantamento solicitado com sucesso!');
    }
  };

  const isAmountValid = () => {
    const amount = parseFloat(withdrawAmount);
    return amount > 0 && amount <= availableBalance;
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Financeiro</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
            <Wallet className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{availableBalance.toLocaleString('pt-MZ')} MT</p>
          <p className="text-xs text-gray-500 mt-1">Saldo disponível</p>
          <button
            onClick={openWithdrawModal}
            className="btn-primary mt-3 w-full text-xs py-2"
          >
            Levantar
          </button>
        </div>

        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{totalRevenue.toLocaleString('pt-MZ')} MT</p>
          <p className="text-xs text-gray-500 mt-1">Receita este mês</p>
        </div>

        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{commissionsPaid.toLocaleString('pt-MZ')} MT</p>
          <p className="text-xs text-gray-500 mt-1">Comissões pagas</p>
        </div>

        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{pendingWithdrawals.toLocaleString('pt-MZ')} MT</p>
          <p className="text-xs text-gray-500 mt-1">Levantamentos pendentes</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {([
          { key: 'hoje', label: 'Hoje' },
          { key: 'semana', label: 'Esta Semana' },
          { key: 'mes', label: 'Este Mês' },
          { key: 'personalizado', label: 'Personalizado' },
        ] as { key: PeriodFilter; label: string }[]).map((period) => (
          <button
            key={period.key}
            onClick={() => setPeriodFilter(period.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              periodFilter === period.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar transações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Filter className="w-3.5 h-3.5 inline mr-1" />
            Todos
          </button>
          <button
            onClick={() => setFilter('credit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'credit' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Créditos
          </button>
          <button
            onClick={() => setFilter('debit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'debit' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Débitos
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">Histórico de Transações</h3>
          <span className="text-xs text-gray-400">{filteredTransactions.length} transações</span>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Nenhuma transação encontrada.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] text-gray-400">{tx.date}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        tx.category === 'Pedido'
                          ? 'bg-green-50 text-green-700'
                          : tx.category === 'Comissão'
                          ? 'bg-orange-50 text-orange-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {tx.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : ''}
                  {tx.amount.toLocaleString('pt-MZ')} MT
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">
                {withdrawStep === 'amount' && 'Levantar Fundos'}
                {withdrawStep === 'confirm' && 'Confirmar Levantamento'}
                {withdrawStep === 'success' && 'Sucesso!'}
              </h3>
              <button
                onClick={handleWithdrawClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Step: Amount */}
            {withdrawStep === 'amount' && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Valor a levantar
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={availableBalance}
                      min={1}
                      className="input-field text-lg font-semibold pr-12 w-full"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      MT
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Saldo disponível: {availableBalance.toLocaleString('pt-MZ')} MT
                  </p>
                  {withdrawAmount && !isAmountValid() && (
                    <p className="text-xs text-red-500 mt-1">
                      O valor deve ser entre 1 e {availableBalance.toLocaleString('pt-MZ')} MT
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Destino
                  </label>
                  <div className="space-y-2">
                    {destinationOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setWithdrawDestination(opt.value)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                          withdrawDestination === opt.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            withdrawDestination === opt.value
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                        {withdrawDestination === opt.value && (
                          <Check className="w-4 h-4 text-primary-500 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setWithdrawStep('confirm')}
                  disabled={!isAmountValid()}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Step: Confirm */}
            {withdrawStep === 'confirm' && (
              <div className="p-4 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Valor</span>
                    <span className="text-sm font-bold text-gray-900">
                      {parseFloat(withdrawAmount).toLocaleString('pt-MZ')} MT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Destino</span>
                    <span className="text-sm font-medium text-gray-900">
                      {destinationOptions.find((d) => d.value === withdrawDestination)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Taxa</span>
                    <span className="text-sm font-medium text-gray-900">0 MT</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {parseFloat(withdrawAmount).toLocaleString('pt-MZ')} MT
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setWithdrawStep('amount')}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleWithdrawConfirm}
                    className="btn-primary flex-1 py-3"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {/* Step: Success */}
            {withdrawStep === 'success' && (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Levantamento Solicitado!</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    O seu levantamento de{' '}
                    <span className="font-semibold">
                      {parseFloat(withdrawAmount).toLocaleString('pt-MZ')} MT
                    </span>{' '}
                    via{' '}
                    <span className="font-semibold">
                      {destinationOptions.find((d) => d.value === withdrawDestination)?.label}
                    </span>{' '}
                    está a ser processado.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Tempo estimado: 1-24 horas úteis
                  </p>
                </div>
                <button
                  onClick={handleWithdrawClose}
                  className="btn-primary w-full py-3"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-green-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
