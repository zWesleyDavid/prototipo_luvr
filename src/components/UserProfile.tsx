import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Eye, 
  EyeOff, 
  Save, 
  Upload,
  Bell,
  Moon,
  Sun,
  Globe,
  Key,
  AlertTriangle,
  CheckCircle,
  Settings,
  Calendar,
  Clock,
  Briefcase,
  Camera
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  position: string;
  department: string;
  hireDate: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisible: boolean;
      showOnlineStatus: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordLastChanged: string;
  };
}

interface UserProfileProps {
  currentUser?: any;
}

export function UserProfile({ currentUser }: UserProfileProps) {
  const [profileData, setProfileData] = useState<UserProfileData>({
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@motel.com',
    phone: '(11) 99999-0001',
    role: 'Administrador',
    position: 'Administrador',
    department: 'Administração',
    hireDate: '2023-01-01',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    preferences: {
      language: 'pt-BR',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisible: true,
        showOnlineStatus: true
      }
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordLastChanged: '2024-01-01'
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Load profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  // Save profile data to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  }, [profileData]);

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      checks: {
        minLength: hasMinLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        numbers: hasNumbers,
        specialChar: hasSpecialChar
      }
    };
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Perfil atualizado com sucesso!');
    setIsLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (!passwordValidation.isValid) {
      toast.error('A nova senha não atende aos critérios de segurança');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProfileData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        passwordLastChanged: new Date().toISOString().split('T')[0]
      }
    }));

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    toast.success('Senha alterada com sucesso!');
    setIsLoading(false);
  };

  const handleAvatarUpload = () => {
    // Simulate file upload
    toast.info('Funcionalidade de upload em desenvolvimento');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const passwordValidation = validatePassword(passwordForm.newPassword);

  const languages = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' }
  ];

  const themes = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Settings }
  ];

  const sessionTimeouts = [
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 240, label: '4 horas' },
    { value: 0, label: 'Nunca' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                {getInitials(profileData.name)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={handleAvatarUpload}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
            <p className="text-gray-600">{profileData.position} • {profileData.department}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className="bg-purple-100 text-purple-700">
                {profileData.role}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Desde {new Date(profileData.hireDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Último acesso</p>
            <p className="font-medium">Hoje às 14:30</p>
            <div className="flex items-center justify-end mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">Online</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Informações Pessoais</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      phone: formatPhone(e.target.value) 
                    }))}
                    maxLength={15}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input value={profileData.position} disabled />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={profileData.address.zipCode}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, zipCode: formatZipCode(e.target.value) }
                      }))}
                      maxLength={9}
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={profileData.address.number}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, number: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={profileData.address.complement}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, complement: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={profileData.address.neighborhood}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, neighborhood: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={profileData.address.state}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value }
                      }))}
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleProfileSave} 
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Salvar Alterações</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Password Change */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Alterar Senha</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordForm.newPassword && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Critérios de Senha</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { key: 'minLength', label: 'Mínimo 8 caracteres' },
                      { key: 'upperCase', label: 'Letra maiúscula' },
                      { key: 'lowerCase', label: 'Letra minúscula' },
                      { key: 'numbers', label: 'Números' },
                      { key: 'specialChar', label: 'Caracteres especiais' }
                    ].map(criterion => (
                      <div key={criterion.key} className="flex items-center space-x-2">
                        {passwordValidation.checks[criterion.key as keyof typeof passwordValidation.checks] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          passwordValidation.checks[criterion.key as keyof typeof passwordValidation.checks] 
                            ? 'text-green-700' 
                            : 'text-gray-500'
                        }`}>
                          {criterion.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading || !passwordValidation.isValid}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Alterando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4" />
                      <span>Alterar Senha</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Configurações de Segurança</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                  <p className="text-sm text-gray-500">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Switch
                  checked={profileData.security.twoFactorEnabled}
                  onCheckedChange={(checked) => setProfileData(prev => ({
                    ...prev,
                    security: { ...prev.security, twoFactorEnabled: checked }
                  }))}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sessão</Label>
                <Select 
                  value={profileData.security.sessionTimeout.toString()}
                  onValueChange={(value) => setProfileData(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: parseInt(value) }
                  }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTimeouts.map(timeout => (
                      <SelectItem key={timeout.value} value={timeout.value.toString()}>
                        {timeout.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Informações de Segurança</h4>
                </div>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>Última alteração de senha: {new Date(profileData.security.passwordLastChanged).toLocaleDateString('pt-BR')}</p>
                  <p>IP do último acesso: 192.168.1.100</p>
                  <p>Dispositivo: Windows 11 - Chrome 120</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Preferências do Sistema</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select 
                  value={profileData.preferences.language}
                  onValueChange={(value) => setProfileData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: value }
                  }))}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>{lang.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-4">
                  {themes.map(theme => {
                    const Icon = theme.icon;
                    const isSelected = profileData.preferences.theme === theme.value;
                    
                    return (
                      <button
                        key={theme.value}
                        onClick={() => setProfileData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: theme.value as any }
                        }))}
                        className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}>
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Notificações</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">E-mail</h5>
                      <p className="text-sm text-gray-500">Receber notificações por e-mail</p>
                    </div>
                    <Switch
                      checked={profileData.preferences.notifications.email}
                      onCheckedChange={(checked) => setProfileData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: { ...prev.preferences.notifications, email: checked }
                        }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Push</h5>
                      <p className="text-sm text-gray-500">Notificações push no navegador</p>
                    </div>
                    <Switch
                      checked={profileData.preferences.notifications.push}
                      onCheckedChange={(checked) => setProfileData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: { ...prev.preferences.notifications, push: checked }
                        }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">SMS</h5>
                      <p className="text-sm text-gray-500">Notificações por mensagem de texto</p>
                    </div>
                    <Switch
                      checked={profileData.preferences.notifications.sms}
                      onCheckedChange={(checked) => setProfileData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: { ...prev.preferences.notifications, sms: checked }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleProfileSave} 
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Configurações de Privacidade</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Perfil Visível</h4>
                  <p className="text-sm text-gray-500">
                    Permitir que outros usuários vejam seu perfil
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences.privacy.profileVisible}
                  onCheckedChange={(checked) => setProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      privacy: { ...prev.preferences.privacy, profileVisible: checked }
                    }
                  }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Status Online</h4>
                  <p className="text-sm text-gray-500">
                    Mostrar quando você está online
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => setProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      privacy: { ...prev.preferences.privacy, showOnlineStatus: checked }
                    }
                  }))}
                />
              </div>

              <Separator />

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-900">Política de Privacidade</h4>
                </div>
                <p className="text-sm text-yellow-700">
                  Seus dados são protegidos de acordo com a LGPD. Para mais informações sobre como 
                  tratamos seus dados pessoais, consulte nossa política de privacidade.
                </p>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleProfileSave} 
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}