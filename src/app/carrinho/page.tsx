'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, Tag, ArrowLeft, CreditCard, Smartphone, Banknote, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'text-red-500' },
  { id: 'emola', name: 'e-Mola', icon: Smartphone, color: 'text-blue-500' },
  { id: 'visa', name: 'Visa', icon: CreditCard, color: 'text-blue-700' },
  { id: 'mastercard', name: 'Mastercard', icon: CreditCard, color: 'text-orange-500' },
  { id: 'wallet', name: 'Carteira MyFood', icon: Wallet, color: 'text-primary-500' },
  { id: 'cash', name: 'Dinheiro na entrega', icon: Banknote, color: 'text-secondary-500' },
];

const tipOptions = [0, 20, 50, 100];

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    coupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    tip,
    setTip,
    clearCart,
    setCurrentOrder,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('mpesa');
  const deliveryFee = 50;

  const subtotal = cart.reduce((total, item) => {
    const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0);
    return total + (item.menuItem.price + extrasTotal) * item.quantity;
  }, 0);

  const total = subtotal - couponDiscount + tip + deliveryFee;

  const handleCheckout = () => {
    setCurrentOrder({
      id: `ORD-${Date.now()}`,
      status: 'confirmed',
      estimatedTime: 25,
      restaurant: "Mundo's Restaurant",
    });
    clearCart();
    router.push('/rastreamento');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">O seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-6">Adicione itens de um restaurante para começar</p>
        <Link href="/" className="btn-primary inline-block">
          Explorar restaurantes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Carrinho</h1>
        <span className="text-sm text-gray-500">({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-6">
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
                    <p className="text-xs text-gray-400 mt-0.5 italic">{item.notes}</p>
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

      {/* Coupon */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary-500" />
          Cupão de desconto
        </h3>
        {coupon ? (
          <div className="flex items-center justify-between bg-secondary-50 px-4 py-2.5 rounded-xl">
            <div>
              <span className="text-sm font-semibold text-secondary-700">{coupon}</span>
              <span className="text-xs text-secondary-600 ml-2">-{couponDiscount} MT</span>
            </div>
            <button onClick={removeCoupon} className="text-xs text-red-500 font-medium">
              Remover
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Digite o código"
              className="input-field text-sm flex-1"
            />
            <button
              onClick={() => {
                applyCoupon(couponInput);
                setCouponInput('');
              }}
              className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              Aplicar
            </button>
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
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
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

      {/* Payment Methods */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Método de pagamento</h3>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm ${
                  selectedPayment === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${method.color}`} />
                <span className="font-medium text-gray-700">{method.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="card p-4 mb-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Resumo</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{subtotal} MT</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxa de entrega</span>
            <span>{deliveryFee} MT</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-secondary-600">
              <span>Desconto</span>
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
        className="w-full btn-primary text-center text-base"
      >
        Finalizar pedido - {total} MT
      </button>
    </div>
  );
}
