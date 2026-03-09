'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Activity, 
  Globe, 
  Smartphone, 
  Mail, 
  Save, 
  RefreshCw, 
  Check, 
  Info, 
  Settings, 
  Database, 
  Server, 
  FileText, 
  Download, 
  Upload,
  Trash2,
  Plus,
  Edit,
  Search
} from 'lucide-react'

const SecuritySettings = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('authentication')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [securitySettings, setSecuritySettings] = useState({
    authentication: {
      requireTwoFactor: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: true,
      passwordExpiration: 90,
      preventPasswordReuse: 5
    },
    access: {
      allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
      blockedIPs: ['192.168.1.100'],
      allowedCountries: ['AO', 'PT', 'BR'],
      blockedCountries: [],
      requireSSL: true,
      allowedUserAgents: [],
      blockedUserAgents: ['bot', 'crawler']
    },
    monitoring: {
      logFailedLogins: true,
      logSuccessfulLogins: true,
      logAdminActions: true,
      logFileChanges: true,
      alertOnSuspiciousActivity: true,
      alertOnMultipleFailedLogins: true,
      alertOnNewDeviceLogin: true,
      retentionDays: 90
    },
    backup: {
      automaticBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      encryptBackups: true,
      backupLocation: 'cloud',
      lastBackup: '2024-01-15T10:30:00Z'
    }
  })

  const [loginAttempts, setLoginAttempts] = useState([] as Array<{ id: number; ip: string; user: string; success: boolean; timestamp: string; location: string }>)

  const [activeSessions, setActiveSessions] = useState([] as Array<{ id: number; user: string; ip: string; device: string; location: string; lastActivity: string; current: boolean }>)

  const tabs = [
    { id: 'authentication', label: 'Autenticação', icon: Lock },
    { id: 'access', label: 'Controle de Acesso', icon: Shield },
    { id: 'monitoring', label: 'Monitoramento', icon: Activity },
    { id: 'backup', label: 'Backup & Recuperação', icon: Database },
    { id: 'logs', label: 'Logs de Segurança', icon: FileText }
  ]

  const sessionTimeouts = [
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 120, label: '2 horas' },
    { value: 240, label: '4 horas' },
    { value: 480, label: '8 horas' }
  ]

  const backupFrequencies = [
    { value: 'hourly', label: 'A cada hora' },
    { value: 'daily', label: 'Diariamente' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'monthly', label: 'Mensalmente' }
  ]

  const backupLocations = [
    { value: 'local', label: 'Servidor Local' },
    { value: 'cloud', label: 'Nuvem' },
    { value: 'both', label: 'Local + Nuvem' }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const terminateSession = (sessionId: number) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO')
  }

  const renderAuthenticationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Autenticação de Dois Fatores</h3>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={securitySettings.authentication.requireTwoFactor}
              onChange={(e) => handleInputChange('authentication', 'requireTwoFactor', e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-900">Exigir autenticação de dois fatores</span>
          </label>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout de Sessão (minutos)
            </label>
            <select
              value={securitySettings.authentication.sessionTimeout}
              onChange={(e) => handleInputChange('authentication', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {sessionTimeouts.map(timeout => (
                <option key={timeout.value} value={timeout.value}>{timeout.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Proteção contra Ataques</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de tentativas de login
            </label>
            <input
              type="number"
              value={securitySettings.authentication.maxLoginAttempts}
              onChange={(e) => handleInputChange('authentication', 'maxLoginAttempts', parseInt(e.target.value))}
              min="1"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração do bloqueio (minutos)
            </label>
            <input
              type="number"
              value={securitySettings.authentication.lockoutDuration}
              onChange={(e) => handleInputChange('authentication', 'lockoutDuration', parseInt(e.target.value))}
              min="5"
              max="1440"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Política de Senhas</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento mínimo
              </label>
              <input
                type="number"
                value={securitySettings.authentication.passwordMinLength}
                onChange={(e) => handleInputChange('authentication', 'passwordMinLength', parseInt(e.target.value))}
                min="6"
                max="32"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={securitySettings.authentication.passwordRequireUppercase}
                  onChange={(e) => handleInputChange('authentication', 'passwordRequireUppercase', e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-900">Exigir letras maiúsculas</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={securitySettings.authentication.passwordRequireLowercase}
                  onChange={(e) => handleInputChange('authentication', 'passwordRequireLowercase', e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-900">Exigir letras minúsculas</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={securitySettings.authentication.passwordRequireNumbers}
                  onChange={(e) => handleInputChange('authentication', 'passwordRequireNumbers', e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-900">Exigir números</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={securitySettings.authentication.passwordRequireSymbols}
                  onChange={(e) => handleInputChange('authentication', 'passwordRequireSymbols', e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-900">Exigir símbolos especiais</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiração da senha (dias)
              </label>
              <input
                type="number"
                value={securitySettings.authentication.passwordExpiration}
                onChange={(e) => handleInputChange('authentication', 'passwordExpiration', parseInt(e.target.value))}
                min="0"
                max="365"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">0 = nunca expira</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prevenir reutilização (últimas senhas)
              </label>
              <input
                type="number"
                value={securitySettings.authentication.preventPasswordReuse}
                onChange={(e) => handleInputChange('authentication', 'preventPasswordReuse', parseInt(e.target.value))}
                min="0"
                max="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">0 = permitir reutilização</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAccessTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Controle de IP</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPs Permitidos (CIDR)
              </label>
              <textarea
                value={securitySettings.access.allowedIPs.join('\n')}
                onChange={(e) => handleInputChange('access', 'allowedIPs', e.target.value.split('\n').filter(ip => ip.trim()))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                placeholder="192.168.1.0/24&#10;10.0.0.0/8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPs Bloqueados
              </label>
              <textarea
                value={securitySettings.access.blockedIPs.join('\n')}
                onChange={(e) => handleInputChange('access', 'blockedIPs', e.target.value.split('\n').filter(ip => ip.trim()))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                placeholder="192.168.1.100&#10;203.45.67.89"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Controle Geográfico</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Países Permitidos (códigos ISO)
              </label>
              <textarea
                value={securitySettings.access.allowedCountries.join('\n')}
                onChange={(e) => handleInputChange('access', 'allowedCountries', e.target.value.split('\n').filter(country => country.trim()))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                placeholder="AO&#10;PT&#10;BR"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Países Bloqueados
              </label>
              <textarea
                value={securitySettings.access.blockedCountries.join('\n')}
                onChange={(e) => handleInputChange('access', 'blockedCountries', e.target.value.split('\n').filter(country => country.trim()))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                placeholder="RU&#10;CN"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Outras Configurações</h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={securitySettings.access.requireSSL}
              onChange={(e) => handleInputChange('access', 'requireSSL', e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-900">Exigir conexão SSL/HTTPS</span>
          </label>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Agents Bloqueados
              </label>
              <textarea
                value={securitySettings.access.blockedUserAgents.join('\n')}
                onChange={(e) => handleInputChange('access', 'blockedUserAgents', e.target.value.split('\n').filter(ua => ua.trim()))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                placeholder="bot&#10;crawler&#10;spider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Logs de Atividade</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.monitoring.logFailedLogins}
                onChange={(e) => handleInputChange('monitoring', 'logFailedLogins', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Registrar tentativas de login falhadas</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.monitoring.logSuccessfulLogins}
                onChange={(e) => handleInputChange('monitoring', 'logSuccessfulLogins', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Registrar logins bem-sucedidos</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.monitoring.logAdminActions}
                onChange={(e) => handleInputChange('monitoring', 'logAdminActions', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Registrar ações administrativas</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.monitoring.logFileChanges}
                onChange={(e) => handleInputChange('monitoring', 'logFileChanges', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Registrar alterações de arquivos</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas de Segurança</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.monitoring.alertOnSuspiciousActivity}
                onChange={(e) => handleInputChange('monitoring', 'alertOnSuspiciousActivity', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Alertar sobre atividade suspeita</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.monitoring.alertOnMultipleFailedLogins}
                onChange={(e) => handleInputChange('monitoring', 'alertOnMultipleFailedLogins', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Alertar sobre múltiplas tentativas falhadas</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.monitoring.alertOnNewDeviceLogin}
                onChange={(e) => handleInputChange('monitoring', 'alertOnNewDeviceLogin', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-900">Alertar sobre login em novo dispositivo</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Retenção de Logs</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Dias:</label>
            <input
              type="number"
              value={securitySettings.monitoring.retentionDays}
              onChange={(e) => handleInputChange('monitoring', 'retentionDays', parseInt(e.target.value))}
              min="7"
              max="365"
              className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Importante</p>
              <p className="text-sm text-yellow-700">
                Logs mais antigos que {securitySettings.monitoring.retentionDays} dias serão automaticamente removidos.
                Certifique-se de fazer backup dos logs importantes antes da remoção.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessões Ativas */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sessões Ativas</h3>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP / Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atividade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeSessions.map((session) => (
                  <tr key={session.id} className={session.current ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{session.user}</div>
                          {session.current && (
                            <div className="text-xs text-green-600">Sessão atual</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{session.ip}</div>
                      <div className="text-sm text-gray-500">{session.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(session.lastActivity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!session.current && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Terminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Backup</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.backup.automaticBackup}
                onChange={(e) => handleInputChange('backup', 'automaticBackup', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Backup automático</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência do backup
              </label>
              <select
                value={securitySettings.backup.backupFrequency}
                onChange={(e) => handleInputChange('backup', 'backupFrequency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {backupFrequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retenção de backups (dias)
              </label>
              <input
                type="number"
                value={securitySettings.backup.backupRetention}
                onChange={(e) => handleInputChange('backup', 'backupRetention', parseInt(e.target.value))}
                min="1"
                max="365"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local do backup
              </label>
              <select
                value={securitySettings.backup.backupLocation}
                onChange={(e) => handleInputChange('backup', 'backupLocation', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {backupLocations.map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.backup.encryptBackups}
                onChange={(e) => handleInputChange('backup', 'encryptBackups', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-900">Criptografar backups</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status do Backup</h3>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Último backup realizado</p>
                  <p className="text-sm text-green-700">{formatDate(securitySettings.backup.lastBackup)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Fazer Backup Agora</span>
              </button>
              
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Restaurar Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Logs de Segurança</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar logs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loginAttempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(attempt.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {attempt.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attempt.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attempt.success ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Sucesso
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Falha
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attempt.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações de Segurança</h1>
          <p className="text-gray-600 mt-1">Gerencie a segurança e proteção do sistema.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Configurações de segurança salvas com sucesso!</span>
        </div>
      )}

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-green-900">Status Geral</h4>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900 mb-2">Seguro</div>
          <p className="text-sm text-green-700">Todas as proteções ativas</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-blue-900">Sessões Ativas</h4>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-2">{activeSessions.length}</div>
          <p className="text-sm text-blue-700">Usuários conectados</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-yellow-900">Tentativas Falhadas</h4>
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-900 mb-2">
            {loginAttempts.filter(attempt => !attempt.success).length}
          </div>
          <p className="text-sm text-yellow-700">Últimas 24h</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-purple-900">Último Backup</h4>
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-purple-900 mb-2">Hoje</div>
          <p className="text-sm text-purple-700">10:30</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'authentication' && renderAuthenticationTab()}
        {activeTab === 'access' && renderAccessTab()}
        {activeTab === 'monitoring' && renderMonitoringTab()}
        {activeTab === 'backup' && renderBackupTab()}
        {activeTab === 'logs' && renderLogsTab()}
      </div>
    </div>
  )
}

export default SecuritySettings