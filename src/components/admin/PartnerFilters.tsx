'use client'

import { useState, useEffect } from 'react'
import { X, Filter, RotateCcw } from 'lucide-react'
import { PartnerFilters } from '@/types/partner'

interface PartnerFiltersProps {
  isOpen: boolean
  onClose: () => void
  filters: PartnerFilters
  onFiltersChange: (filters: PartnerFilters) => void
}

const PartnerFiltersComponent = ({ isOpen, onClose, filters, onFiltersChange }: PartnerFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<PartnerFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleResetFilters = () => {
    const resetFilters: PartnerFilters = {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
    onClose()
  }

  const handleChange = (key: keyof PartnerFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: 1 // Reset page when filters change
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filtros Avançados</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tipo de Parceiro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Parceiro
            </label>
            <select
              value={localFilters.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Todos os tipos</option>
              <option value="dealership">Concessionária</option>
              <option value="brand">Marca</option>
              <option value="service">Serviços</option>
              <option value="insurance">Seguros</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="pending">Pendente</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          {/* Província */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Província
            </label>
            <select
              value={localFilters.province || ''}
              onChange={(e) => handleChange('province', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Todas as províncias</option>
              <option value="Luanda">Luanda</option>
              <option value="Benguela">Benguela</option>
              <option value="Huambo">Huambo</option>
              <option value="Lobito">Lobito</option>
              <option value="Cabinda">Cabinda</option>
              <option value="Huíla">Huíla</option>
              <option value="Namibe">Namibe</option>
              <option value="Malanje">Malanje</option>
              <option value="Lunda Norte">Lunda Norte</option>
              <option value="Lunda Sul">Lunda Sul</option>
              <option value="Moxico">Moxico</option>
              <option value="Cuando Cubango">Cuando Cubango</option>
              <option value="Cunene">Cunene</option>
              <option value="Bié">Bié</option>
              <option value="Uíge">Uíge</option>
              <option value="Zaire">Zaire</option>
              <option value="Bengo">Bengo</option>
              <option value="Cuanza Norte">Cuanza Norte</option>
              <option value="Cuanza Sul">Cuanza Sul</option>
            </select>
          </div>

          {/* Avaliação Mínima */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação Mínima
            </label>
            <select
              value={localFilters.minRating || ''}
              onChange={(e) => handleChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Qualquer avaliação</option>
              <option value="1">1+ estrelas</option>
              <option value="2">2+ estrelas</option>
              <option value="3">3+ estrelas</option>
              <option value="4">4+ estrelas</option>
              <option value="4.5">4.5+ estrelas</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={localFilters.sortBy || 'name'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="name">Nome</option>
                <option value="joinDate">Data de Cadastro</option>
                <option value="rating">Avaliação</option>
                <option value="totalSales">Total de Vendas</option>
                <option value="revenue">Receita</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordem
              </label>
              <select
                value={localFilters.sortOrder || 'asc'}
                onChange={(e) => handleChange('sortOrder', e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </div>
          </div>

          {/* Itens por página */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Itens por página
            </label>
            <select
              value={localFilters.limit || 10}
              onChange={(e) => handleChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value={5}>5 itens</option>
              <option value={10}>10 itens</option>
              <option value={25}>25 itens</option>
              <option value={50}>50 itens</option>
            </select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerFiltersComponent