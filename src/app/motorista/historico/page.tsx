'use client';

import { CheckCircle, Star, Clock } from 'lucide-react';

const history = [
  { id: 'H-001', restaurant: 'Cafe Central', customer: 'Ana L.', time: '14:30', earnings: 65, rating: 5, distance: '1.2 km' },
  { id: 'H-002', restaurant: 'Sushi Master', customer: 'Pedro M.', time: '13:15', earnings: 120, rating: 5, distance: '3.5 km' },
  { id: 'H-003', restaurant: 'Frango Piri-Piri', customer: 'Carlos F.', time: '12:00', earnings: 75, rating: 4, distance: '1.8 km' },
  { id: 'H-004', restaurant: "Mundo's Restaurant", customer: 'Maria S.', time: '11:20', earnings: 90, rating: 5, distance: '2.1 km' },
  { id: 'H-005', restaurant: 'Pizza House Maputo', customer: 'Joao P.', time: '10:45', earnings: 85, rating: 5, distance: '2.3 km' },
  { id: 'H-006', restaurant: 'Doce Tentacao', customer: 'Sara M.', time: '09:30', earnings: 55, rating: 4, distance: '1.5 km' },
  { id: 'H-007', restaurant: 'Cafe Central', customer: 'Luis A.', time: '09:00', earnings: 60, rating: 5, distance: '0.8 km' },
  { id: 'H-008', restaurant: 'Frango Piri-Piri', customer: 'Rita C.', time: '08:30', earnings: 70, rating: 5, distance: '1.9 km' },
];

export default function DriverHistoryPage() {
  const totalEarnings = history.reduce((sum, h) => sum + h.earnings, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Historico de hoje</h2>
          <p className="text-sm text-gray-500">{history.length} entregas concluidas</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-secondary-600">{totalEarnings} MT</p>
          <p className="text-xs text-gray-500">Total ganho</p>
        </div>
      </div>

      <div className="space-y-2">
        {history.map((delivery) => (
          <div key={delivery.id} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-secondary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{delivery.restaurant}</p>
              <p className="text-xs text-gray-500">{delivery.customer} - {delivery.distance}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400">{delivery.time}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900">+{delivery.earnings} MT</p>
              <div className="flex items-center gap-0.5 justify-end mt-0.5">
                {Array.from({ length: delivery.rating }).map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
