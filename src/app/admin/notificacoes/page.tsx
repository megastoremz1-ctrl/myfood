'use client';

import { useState } from 'react';
import { Bell, Send, Users, Store, Bike } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (title && message) {
      setSent(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Enviar Notificacao</h2>

      <div className="card p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Destinatarios</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'all', label: 'Todos', icon: Bell },
              { id: 'clients', label: 'Clientes', icon: Users },
              { id: 'restaurants', label: 'Restaurantes', icon: Store },
              { id: 'drivers', label: 'Entregadores', icon: Bike },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTarget(id)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  target === id ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-100 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Titulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titulo da notificacao"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva a mensagem..."
            className="input-field h-24 resize-none text-sm"
          />
        </div>

        <button
          onClick={handleSend}
          className="w-full btn-primary text-sm flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {sent ? 'Enviado com sucesso!' : 'Enviar notificacao'}
        </button>
      </div>
    </div>
  );
}
