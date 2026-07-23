'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, X, Save, Image } from 'lucide-react';
import { menuItems as initialMenuItems, MenuItem } from '@/data/mock';

interface MenuItemWithAvailability extends MenuItem {
  available: boolean;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const emptyForm: FormData = {
  name: '',
  description: '',
  price: 0,
  category: 'Entradas',
  image: '',
};

const categoryOptions = ['Entradas', 'Pratos Principais', 'Bebidas', 'Sobremesas'];
const filterCategories = ['all', ...categoryOptions];

export default function PartnerMenuPage() {
  const [items, setItems] = useState<MenuItemWithAvailability[]>(
    initialMenuItems.map((i) => ({ ...i, available: true }))
  );
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemWithAvailability | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const filtered = items.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || i.category === filterCat;
    return matchSearch && matchCat;
  });

  const availableCount = items.filter((i) => i.available).length;

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
    );
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (item: MenuItemWithAvailability) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(emptyForm);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0) {
      return;
    }

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, ...formData }
            : i
        )
      );
    } else {
      const newItem: MenuItemWithAvailability = {
        id: `m${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        available: true,
      };
      setItems((prev) => [...prev, newItem]);
    }

    closeModal();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestão de Menu</h2>
          <p className="text-sm text-gray-500">
            {items.length} itens no menu • {availableCount} disponíveis
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Item
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou descrição..."
              className="input-field pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  filterCat === cat
                    ? 'bg-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      {search || filterCat !== 'all' ? (
        <p className="text-xs text-gray-500 mb-3 px-1">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} encontrados
        </p>
      ) : null}

      {/* Menu Items List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhum item encontrado</p>
            <p className="text-sm text-gray-400 mt-1">
              Tente ajustar os filtros ou adicione novos itens ao menu.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`card p-4 flex items-center gap-4 transition-opacity ${
                !item.available ? 'opacity-60' : ''
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {item.name}
                  </h3>
                  {!item.available && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Indisponível
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-primary-600">
                    {item.price.toFixed(0)} MT
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    item.available
                      ? 'bg-secondary-50 text-secondary-500 hover:bg-secondary-100'
                      : 'bg-red-50 text-red-500 hover:bg-red-100'
                  }`}
                  title={item.available ? 'Desativar item' : 'Ativar item'}
                >
                  {item.available ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                  title="Editar item"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Excluir item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nome do item
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Frango Piri-Piri"
                  className="input-field text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Descreva o item do menu..."
                  rows={3}
                  className="input-field text-sm resize-none"
                />
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preço (MT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="input-field text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="input-field text-sm"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  URL da Imagem
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="input-field pl-10 text-sm"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim() || !formData.description.trim() || formData.price <= 0}
                className="flex-1 btn-primary text-sm py-2.5 px-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {editingItem ? 'Guardar Alterações' : 'Adicionar Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
