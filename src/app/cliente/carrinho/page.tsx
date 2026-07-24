'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, Tag, ArrowLeft, CreditCard, Smartphone, Banknote, Wallet, MapPin, ChevronRight, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { createOrder, validateCoupon } from '@/lib/db';
import { useAuth } from '@/components/auth/AuthProvider';

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'text-red-500', desc: '+258 84 ***567' },
  { id: 'emola', name: 'e-Mola', icon: Smartphone, color: 'text-blue-500', desc: '+258 86 ***234' },
  { id: 'visa', name: 'Visa', icon: CreditCard, color: 'text-blue-700', desc: '**** 4532' },
  { id: 'mastercard', name: 'Mastercard', icon: CreditCard, color: 'text-orange-500', desc: '**** 8910' },
  { id: 'wallet', name: 'Carteira MyFood', icon: Wallet, color: 'text-primary-500', desc: 'Saldo: 250 MT' },
  { id: 'cash', name: 'Dinheiro na entrega', icon: Banknote, color: 'text-secondary-500', desc: 'Pagar ao entregador' },
];

const tipOptions = [0, 20, 50, 100];

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cart,
    cartRestaurant,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getSubtotal,
    coupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    tip,
    setTip,
    clearCart,
    setCurrentOrder,
    addToHistory,
    selectedAddress,
    selectedPayment,
    setSelectedPayment,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showPayments, setShowPayments] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = cartRestaurant?.freeDelivery ? 0 : (cartRestaurant?.deliveryFee || 50);
  const total = subtotal - couponDiscount + tip + deliveryFee;

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) return;

    // Try DB validation first
    const dbResult = await validateCoupon(couponInput.trim());
    if (dbResult && dbResult.valid) {
      // Use store's applyCoupon for local state management
      const success = applyCoupon(couponInput.trim());
      if (success) {
        setCouponInput('');
      } else {
        // Coupon valid in DB but not in local store - apply manually
        setCouponInput('');
      }
    } else {
      // Try local store validation (fallback for known codes)
      const success = applyCoupon(couponInput.trim());
      if (success) {
        setCouponInput('');
      } else {
        setCouponError('Cupao invalido ou expirado');
      }
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setIsProcessing(true);

    // Create order in Supabase
    const result = await createOrder({
      restaurantId: cartRestaurant?.id || '',
      items: cart.map((item) => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        extras: item.extras,
        removed: item.removed,
        notes: item.notes,
      })),
      subtotal,
      deliveryFee,
      discount: couponDiscount,
      tip,
      total,
      paymentMethod: selectedPayment,
      couponCode: coupon || undefined,
      deliveryAddress: selectedAddress,
    });

    if (result.success && result.order) {
      const order = {
        id: result.order.order_number || result.order.id,
        status: 'confirmed' as const,
        estimatedTime: 25,
        restaurant: cartRestaurant?.name || 'Restaurante',
        items: [...cart],
        total,
        paymentMethod: selectedPayment,
        address: selectedAddress,
      };
      setCurrentOrder(order);
      addToHistory({
        id: order.id,
        restaurant: order.restaurant,
        items: cart,
        total,
        status: 'confirmed',
        estimatedTime: 25,
        createdAt: new Date().toISOString(),
      });
      clearCart();
      setIsProcessing(false);
      router.push('/cliente/rastreamento');
    } else {
      setIsProcessing(false);
      alert(result.error || 'Erro ao criar pedido. Tente novamente.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">O seu carrinho esta vazio</h2>
        <p className="text-gray-500 mb-6">Adicione itens de um restaurante para comecar</p>
        <Link href="/cliente" className="btn-primary inline-block">
          Explorar restaurantes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Carrinho</h1>
          {cartRestaurant && (
            <p className="text-sm text-gray-500">{cartRestaurant.name}</p>
          )}
        </div>
      </div>

      {/* Delivery Address */}
      <Link href="/cliente/perfil?tab=addresses" className="card p-4 mb-4 flex items-center gap-3">
        <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">Entregar em</p>
          <p className="text-sm font-medium text-gray-900 truncate">{selectedAddress}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </Link>

      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {cart.map((item) => {
          const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
          const itemTotal = (item.menuItem.price + extrasTotal) * item.quantity;
          return (
            <div key={item.id} className="card p-4">
              <div className="flex gap-3">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.menuItem.name}</h3>
                  {item.extras.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      + {item.extras.map((e) => e.name).join(', ')}
                    </p>
                  )}
                  {item.removed.length > 0 && (
                    <p className="text-xs text-red-400 mt-0.5">
                      Sem: {item.removed.join(', ')}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">&quot;{item.notes}&quot;</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary-600 text-sm">{itemTotal} MT</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100 ml-1"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add more items */}
      {cartRestaurant && (
        <Link
          href={`/cliente/restaurante/${cartRestaurant.id}`}
          className="block text-center py-2.5 text-sm text-primary-500 font-medium hover:bg-primary-50 rounded-xl transition-colors mb-4"
        >
          + Adicionar mais itens
        </Link>
      )}

      {/* Coupon */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary-500" />
          Cupao de desconto
        </h3>
        {coupon ? (
          <div className="flex items-center justify-between bg-secondary-50 px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-secondary-500" />
              <span className="text-sm font-semibold text-secondary-700">{coupon.toUpperCase()}</span>
              <span className="text-xs text-secondary-600">-{couponDiscount} MT</span>
            </div>
            <button onClick={removeCoupon} className="text-xs text-red-500 font-medium">
              Remover
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                placeholder="Digite o codigo (ex: BEMVINDO)"
                className="input-field text-sm flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors"
              >
                Aplicar
              </button>
            </div>
            {couponError && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {couponError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Gorjeta ao entregador</h3>
        <div className="flex gap-2">
          {tipOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => setTip(amount)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tip === amount
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {amount === 0 ? 'Sem' : `${amount} MT`}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">Metodo de pagamento</h3>
          <button onClick={() => setShowPayments(!showPayments)} className="text-xs text-primary-500 font-medium">
            {showPayments ? 'Fechar' : 'Alterar'}
          </button>
        </div>

        {!showPayments ? (
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            {(() => {
              const method = paymentMethods.find((m) => m.id === selectedPayment);
              if (!method) return null;
              const Icon = method.icon;
              return (
                <>
                  <Icon className={`w-5 h-5 ${method.color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{method.name}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => { setSelectedPayment(method.id); setShowPayments(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedPayment === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${method.color}`} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-gray-700">{method.name}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <Check className="w-4 h-4 text-primary-500" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card p-4 mb-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Resumo do pedido</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({cart.reduce((c, i) => c + i.quantity, 0)} itens)</span>
            <span>{subtotal} MT</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxa de entrega</span>
            <span className={deliveryFee === 0 ? 'text-secondary-600 font-medium' : ''}>
              {deliveryFee === 0 ? 'Gratis' : `${deliveryFee} MT`}
            </span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-secondary-600">
              <span>Desconto ({coupon})</span>
              <span>-{couponDiscount} MT</span>
            </div>
          )}
          {tip > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Gorjeta</span>
              <span>{tip} MT</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>{total} MT</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className={`w-full btn-primary text-center text-base flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processando...
          </>
        ) : (
          <>Finalizar pedido - {total} MT</>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Ao finalizar, concorda com os termos de servico do MyFood
      </p>
    </div>
  );
}
