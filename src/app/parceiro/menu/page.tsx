'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, X, Save, Loader2, RefreshCw, Image } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface MenuCategory {
  id: string;
  name: string;
}

interface MenuItemExtra {
  id: string;
  name: string;
  price: number;
  menu_item_id: string;
}

interface MenuItemRow {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
  category_id: string;
  restaurant_id: string;
  sort_order: number;
  menu_categories: { name: string } | null;
  menu_item_extras: MenuItemExtra[];
}

interface FormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
}

const emptyForm: FormData = {
  name: '',
  description: '',
  price: 0,
  category_id: '',
  image_url: '',
};

export default function PartnerMenuPage() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemRow | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = getSupabase();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!restaurant) return;
      setRestaurantId(restaurant.id);

      const { data: items } = await supabase
        .from('menu_items')
        .select('*, menu_categories(name), menu_item_extras(*)')
        .eq('restaurant_id', restaurant.id)
        .order('sort_order');

      setItems((items as MenuItemRow[]) || []);

      const { data: cats } = await supabase
        .from('menu_categories')
        .select('id, name')
        .eq('restaurant_id', restaurant.id)
        .order('name');

      setCategories((cats as MenuCategory[]) || []);
    } catch (error) {
      console.error('Erro ao carregar menu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || i.category_id === filterCat;
    return matchSearch && matchCat;
  });

  const availableCount = items.filter((i) => i.available).length;

  const toggleAvailability = async (item: MenuItemRow) => {
    const newAvailable = !item.available;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, available: newAvailable } : i))
    );
    await supabase
      .from('menu_items')
      .update({ available: newAvailable })
      .eq('id', item.id);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      ...emptyForm,
      category_id: categories.length > 0 ? categories[0].id : '',
    });
    setImagePreview('');
    setShowModal(true);
  };

  const openEditModal = (item: MenuItemRow) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category_id: item.category_id || '',
      image_url: item.image_url || '',
    });
    setImagePreview(item.image_url || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(emptyForm);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um ficheiro de imagem (JPG, PNG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);
      setFormData((prev) => ({ ...prev, image_url: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || formData.price <= 0 || !restaurantId) return;

    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: formData.price,
            category_id: formData.category_id || null,
            image_url: formData.image_url,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: formData.price,
            category_id: formData.category_id || null,
            image_url: formData.image_url,
            restaurant_id: restaurantId,
            available: true,
            sort_order: items.length,
          });

        if (error) throw error;
      }

      closeModal();
      await fetchData();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      alert('Erro ao excluir item. Tente novamente.');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Atualizar"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={openAddModal}
            className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Item
          </button>
        </div>
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
              placeholder="Pesquisar por nome..."
              className="input-field pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterCat('all')}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterCat === 'all'
                  ? 'bg-secondary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  filterCat === cat.id
                    ? 'bg-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
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
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? 'Nenhum item no menu. Adicione o primeiro prato!'
                : 'Nenhum item encontrado'}
            </p>
            {items.length > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                Tente ajustar os filtros ou adicione novos itens ao menu.
              </p>
            )}
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`card p-4 flex items-center gap-4 transition-opacity ${
                !item.available ? 'opacity-60' : ''
              }`}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
              )}
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
                {item.description && (
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-primary-600">
                    {item.price.toFixed(0)} MT
                  </span>
                  {item.menu_categories?.name && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.menu_categories.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleAvailability(item)}
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
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category_id: e.target.value }))
                    }
                    className="input-field text-sm"
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Imagem do prato
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Image URL input */}
                <div className="relative mb-3">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, image_url: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="URL da imagem ou carregue do dispositivo"
                    className="input-field pl-10 text-sm"
                  />
                </div>

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 hover:bg-primary-50/50 transition-colors"
                >
                  Ou carregue uma imagem do dispositivo
                </button>

                {/* Preview */}
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-36 object-cover rounded-xl border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData((prev) => ({ ...prev, image_url: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white shadow-sm"
                    >
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </button>
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
                disabled={!formData.name.trim() || formData.price <= 0 || saving}
                className="flex-1 btn-primary text-sm py-2.5 px-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingItem ? 'Guardar Alterações' : 'Adicionar Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
