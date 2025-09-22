import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { useTheme } from './ThemeProvider';
import { 
  Settings, 
  Bell, 
  Database, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  Monitor,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemSettingsProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
}

export function SystemSettings({ appState, updateAppState }: SystemSettingsProps) {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Notifications
    notifications: {
      enabled: true,
      email: true,
      push: false,
      sound: true,
      checkoutReminders: true,
      maintenanceAlerts: true,
      lowStockAlerts: false
    },
    // Theme and Display
    theme: {
      mode: theme,
      primaryColor: 'purple',
      fontSize: 'medium',
      sidebarCompact: false,
      animations: true
    },
    // System
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      twoFactorAuth: false,
      auditLog: true
    },
    // Business
    business: {
      checkoutTime: '12:00',
      lateCheckoutFee: 50,
      currency: 'BRL',
      taxRate: 0,
      receiptLogo: true,
      autoReceiptEmail: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('luvrSystemSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings,
          theme: {
            ...prev.theme,
            mode: theme
          }
        }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [theme]);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));

    // Handle theme change immediately
    if (category === 'theme' && setting === 'mode') {
      setTheme(value);
      toast.success(`Tema alterado para ${
        value === 'light' ? 'claro' : 
        value === 'dark' ? 'escuro' : 
        'automático'
      }`);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem('luvrSystemSettings', JSON.stringify(settings));
    toast.success('Configurações salvas com sucesso!');
    setIsLoading(false);
  };

  const resetSettings = () => {
    const defaultSettings = {
      notifications: {
        enabled: true,
        email: true,
        push: false,
        sound: true,
        checkoutReminders: true,
        maintenanceAlerts: true,
        lowStockAlerts: false
      },
      theme: {
        mode: 'system',
        primaryColor: 'purple',
        fontSize: 'medium',
        sidebarCompact: false,
        animations: true
      },
      system: {
        autoBackup: true,
        backupFrequency: 'daily',
        sessionTimeout: 30,
        maxLoginAttempts: 3,
        twoFactorAuth: false,
        auditLog: true
      },
      business: {
        checkoutTime: '12:00',
        lateCheckoutFee: 50,
        currency: 'BRL',
        taxRate: 0,
        receiptLogo: true,
        autoReceiptEmail: false
      }
    };
    
    setSettings(defaultSettings);
    setTheme('system');
    localStorage.setItem('luvrSystemSettings', JSON.stringify(defaultSettings));
    toast.success('Configurações restauradas para os valores padrão!');
  };

  const exportData = () => {
    const data = {
      settings,
      appState,
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `luvr-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Backup exportado com sucesso!');
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.settings) {
              setSettings(data.settings);
              localStorage.setItem('luvrSystemSettings', JSON.stringify(data.settings));
              if (data.settings.theme?.mode) {
                setTheme(data.settings.theme.mode);
              }
              toast.success('Dados importados com sucesso!');
            } else {
              toast.error('Arquivo de backup inválido');
            }
          } catch (error) {
            toast.error('Erro ao importar dados');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (confirm('Esta ação irá apagar todos os dados salvos. Deseja continuar?')) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Todos os dados foram removidos. Recarregue a página.');
    }
  };

  const getThemeIcon = (themeMode: string) => {
    switch (themeMode) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeMode: string) => {
    switch (themeMode) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'system': return 'Automático';
      default: return 'Automático';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl">Configurações do Sistema</h2>
          <p className="text-muted-foreground mt-1">Gerencie preferências e configurações avançadas</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={saveSettings} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={resetSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Restaurar Padrões
          </Button>
        </div>
      </div>

      {/* Theme Preview */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-purple-600" />
              <span className="font-semibold">Tema Atual</span>
              <Badge variant="outline" className="ml-2">
                {getThemeIcon(theme)}
                <span className="ml-1">{getThemeLabel(theme)}</span>
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Aplicado: {actualTheme === 'dark' ? 'Escuro' : 'Claro'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSettingChange('theme', 'mode', 'light')}
              className="flex items-center space-x-1"
            >
              <Sun className="h-4 w-4" />
              <span>Claro</span>
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSettingChange('theme', 'mode', 'dark')}
              className="flex items-center space-x-1"
            >
              <Moon className="h-4 w-4" />
              <span>Escuro</span>
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSettingChange('theme', 'mode', 'system')}
              className="flex items-center space-x-1"
            >
              <Monitor className="h-4 w-4" />
              <span>Auto</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações Ativadas</Label>
                <p className="text-sm text-muted-foreground">Receber todas as notificações do sistema</p>
              </div>
              <Switch 
                checked={settings.notifications.enabled}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'enabled', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Notificações por E-mail</Label>
                <Switch 
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Notificações Push</Label>
                <Switch 
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Som das Notificações</Label>
                <Switch 
                  checked={settings.notifications.sound}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'sound', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Lembrete de Check-out</Label>
                <Switch 
                  checked={settings.notifications.checkoutReminders}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'checkoutReminders', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Alertas de Manutenção</Label>
                <Switch 
                  checked={settings.notifications.maintenanceAlerts}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'maintenanceAlerts', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme and Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-purple-600" />
              <span>Exibição</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Modo de Cores</Label>
              <Select 
                value={settings.theme.mode} 
                onValueChange={(value) => handleSettingChange('theme', 'mode', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <span>Claro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <span>Escuro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4" />
                      <span>Automático</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                O modo automático segue a preferência do sistema operacional
              </p>
            </div>

            <div>
              <Label>Cor Primária</Label>
              <Select 
                value={settings.theme.primaryColor} 
                onValueChange={(value) => handleSettingChange('theme', 'primaryColor', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purple">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full" />
                      <span>Roxo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="blue">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full" />
                      <span>Azul</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="green">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                      <span>Verde</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tamanho da Fonte</Label>
              <Select 
                value={settings.theme.fontSize} 
                onValueChange={(value) => handleSettingChange('theme', 'fontSize', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Aa</span>
                      <span>Pequena</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Aa</span>
                      <span>Média</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="large">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">Aa</span>
                      <span>Grande</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sidebar Compacta</Label>
                <p className="text-sm text-muted-foreground">Reduzir largura da barra lateral</p>
              </div>
              <Switch 
                checked={settings.theme.sidebarCompact}
                onCheckedChange={(checked) => handleSettingChange('theme', 'sidebarCompact', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Animações</Label>
                <p className="text-sm text-muted-foreground">Efeitos visuais e transições</p>
              </div>
              <Switch 
                checked={settings.theme.animations}
                onCheckedChange={(checked) => handleSettingChange('theme', 'animations', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span>Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Timeout da Sessão (minutos)</Label>
              <Input 
                type="number"
                value={settings.system.sessionTimeout}
                onChange={(e) => handleSettingChange('system', 'sessionTimeout', parseInt(e.target.value))}
                min="5"
                max="120"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Máximo de Tentativas de Login</Label>
              <Input 
                type="number"
                value={settings.system.maxLoginAttempts}
                onChange={(e) => handleSettingChange('system', 'maxLoginAttempts', parseInt(e.target.value))}
                min="1"
                max="10"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">Segurança adicional para login</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={settings.system.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('system', 'twoFactorAuth', checked)}
                />
                <Badge variant="outline" className="text-xs">Em breve</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Log de Auditoria</Label>
                <p className="text-sm text-muted-foreground">Registrar ações dos usuários</p>
              </div>
              <Switch 
                checked={settings.system.auditLog}
                onCheckedChange={(checked) => handleSettingChange('system', 'auditLog', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span>Configurações do Negócio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Horário Padrão de Check-out</Label>
              <Input 
                type="time"
                value={settings.business.checkoutTime}
                onChange={(e) => handleSettingChange('business', 'checkoutTime', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Taxa de Check-out Tardio (R$)</Label>
              <Input 
                type="number"
                value={settings.business.lateCheckoutFee}
                onChange={(e) => handleSettingChange('business', 'lateCheckoutFee', parseFloat(e.target.value))}
                min="0"
                step="0.01"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Taxa de Imposto (%)</Label>
              <Input 
                type="number"
                value={settings.business.taxRate}
                onChange={(e) => handleSettingChange('business', 'taxRate', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.01"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Logo no Recibo</Label>
                <p className="text-sm text-muted-foreground">Incluir logo da empresa nos recibos</p>
              </div>
              <Switch 
                checked={settings.business.receiptLogo}
                onCheckedChange={(checked) => handleSettingChange('business', 'receiptLogo', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Envio Automático de Recibo</Label>
                <p className="text-sm text-muted-foreground">Enviar recibo por e-mail automaticamente</p>
              </div>
              <Switch 
                checked={settings.business.autoReceiptEmail}
                onCheckedChange={(checked) => handleSettingChange('business', 'autoReceiptEmail', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-purple-600" />
            <span>Gerenciamento de Dados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Backup Automático</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={settings.system.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('system', 'autoBackup', checked)}
                />
                <span className="text-sm text-muted-foreground">
                  {settings.system.autoBackup ? 'Ativado' : 'Desativado'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Frequência do Backup</Label>
              <Select 
                value={settings.system.backupFrequency} 
                onValueChange={(value) => handleSettingChange('system', 'backupFrequency', value)}
                disabled={!settings.system.autoBackup}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Último Backup</Label>
              <p className="text-sm text-muted-foreground py-2">
                {new Date().toLocaleDateString('pt-BR')} às 10:30
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={exportData} variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar Dados</span>
            </Button>

            <Button onClick={importData} variant="outline" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Importar Dados</span>
            </Button>

            <Button onClick={clearAllData} variant="outline" className="flex items-center space-x-2 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              <span>Limpar Dados</span>
            </Button>
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Os backups são salvos localmente no navegador. Para maior segurança, faça downloads regulares dos seus dados.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <Label>Versão</Label>
              <p className="text-muted-foreground">v2.0.0</p>
            </div>
            <div>
              <Label>Última Atualização</Label>
              <p className="text-muted-foreground">27/08/2025</p>
            </div>
            <div>
              <Label>Dispositivo</Label>
              <p className="text-muted-foreground flex items-center">
                <Smartphone className="h-4 w-4 mr-1" />
                {/Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop'}
              </p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}