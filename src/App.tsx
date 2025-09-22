import { useState, useEffect, useCallback, useMemo } from 'react';
import { RoomView } from './components/RoomView';
import { ClientOrder } from './components/ClientOrder';
import { OrderList } from './components/OrderList';
import { CheckInOut } from './components/CheckInOut';
import { Dashboard } from './components/Dashboard';
import { GuestView } from './components/GuestView';
import { Login } from './components/Login';
import { ShiftManagement } from './components/ShiftManagement';
import { RoomRegistration } from './components/RoomRegistration';
import { UserRegistration } from './components/UserRegistration';
import { UserProfile } from './components/UserProfile';
import { SystemSettings } from './components/SystemSettings';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { Progress } from './components/ui/progress';
import { 
  Building, 
  Receipt, 
  UserCheck, 
  Home,
  Settings,
  Users,
  BarChart3,
  Menu,
  X,
  Bell,
  Search,
  Clock,
  UserPlus,
  BedDouble,
  User,
  Power,
  Maximize2,
  Minimize2,
  FileText,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type ViewType = 'dashboard' | 'rooms' | 'checkin' | 'orders' | 'order-detail' | 'guests' | 'reports' | 'settings' | 'shifts' | 'room-registration' | 'user-registration' | 'profile';

interface AppState {
  rooms: any[];
  guests: any[];
  orders: any[];
  notifications: any[];
  shifts: any[];
  users: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function AppContent() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'warning',
      title: 'Check-out Atrasado',
      message: 'Quarto 201 - Maria Santos deveria ter saído às 14:30',
      time: '15:45',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Nova Comanda',
      message: 'Quarto 102 solicitou produtos do frigobar',
      time: '15:20',
      read: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    rooms: [],
    guests: [],
    orders: [],
    notifications: [],
    shifts: [],
    users: []
  });

  // Debug theme changes (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Current theme state:', { theme, actualTheme });
    }
  }, [theme, actualTheme]);

  // Check for existing session and load data on mount
  useEffect(() => {
    // Check for existing session
    const sessionData = localStorage.getItem('luvrSession') || sessionStorage.getItem('luvrSession');
    if (sessionData) {
      try {
        const { user } = JSON.parse(sessionData);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading session:', error);
      }
    }

    // Load data from localStorage
    const savedData = localStorage.getItem('luvrSystemData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAppState(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
        toast.error('Erro ao carregar dados salvos');
      }
    }

    // Load notifications
    const savedNotifications = localStorage.getItem('luvrNotifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    // Auto-adjust sidebar based on screen size
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('luvrSystemData', JSON.stringify(appState));
  }, [appState]);

  // Save notifications when they change
  useEffect(() => {
    localStorage.setItem('luvrNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auto-generate notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'info' as const,
          title: 'Novo Check-in',
          message: `Quarto ${100 + Math.floor(Math.random() * 20)} - Check-in realizado`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: false
        },
        {
          type: 'warning' as const,
          title: 'Limpeza Pendente',
          message: `Quarto ${100 + Math.floor(Math.random() * 20)} aguardando limpeza`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: false
        },
        {
          type: 'success' as const,
          title: 'Check-out Concluído',
          message: `Quarto ${100 + Math.floor(Math.random() * 20)} - Check-out finalizado`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: false
        }
      ];

      // Add random notification every 3 minutes
      if (Math.random() > 0.8) {
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        const newNotification = {
          ...randomNotification,
          id: Date.now()
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        toast.info(newNotification.title, {
          description: newNotification.message
        });
      }
    }, 180000); // 3 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const navigation = useMemo(() => {
    const openOrders = appState.orders?.filter((order: any) => order.status === 'aberta')?.length || 0;
    return [
      { id: 'dashboard', label: 'Dashboard', icon: Home, view: 'dashboard' as ViewType, badge: null, shortcut: '1' },
      { id: 'rooms', label: 'Quartos', icon: Building, view: 'rooms' as ViewType, badge: null, shortcut: '2' },
      { id: 'checkin', label: 'Check-in/Out', icon: UserCheck, view: 'checkin' as ViewType, badge: null, shortcut: '3' },
      { id: 'orders', label: 'Comandas', icon: Receipt, view: 'orders' as ViewType, badge: openOrders > 0 ? openOrders.toString() : null, shortcut: '4' },
      { id: 'guests', label: 'Hóspedes', icon: Users, view: 'guests' as ViewType, badge: null, shortcut: '5' },
      { id: 'shifts', label: 'Turnos', icon: Clock, view: 'shifts' as ViewType, badge: null, shortcut: '6' },
      { id: 'room-registration', label: 'Cadastro Quartos', icon: BedDouble, view: 'room-registration' as ViewType, badge: null, shortcut: '7' },
      { id: 'user-registration', label: 'Cadastro Usuários', icon: UserPlus, view: 'user-registration' as ViewType, badge: null, shortcut: '8' },
      { id: 'reports', label: 'Relatórios', icon: BarChart3, view: 'reports' as ViewType, badge: null, shortcut: '9' },
      { id: 'profile', label: 'Meu Perfil', icon: User, view: 'profile' as ViewType, badge: null, shortcut: '0' },
      { id: 'settings', label: 'Configurações', icon: Settings, view: 'settings' as ViewType, badge: null, shortcut: 'S' },
    ];
  }, [appState.orders]);

  const updateAppState = (key: keyof AppState, data: any) => {
    setAppState(prev => ({
      ...prev,
      [key]: data
    }));
  };

  const markNotificationAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setShowNotifications(false);
    toast.success('Todas as notificações foram removidas');
  }, []);

  const unreadNotifications = useMemo(() => 
    notifications.filter(n => !n.read), 
    [notifications]
  );

  const handleViewOrder = useCallback((orderId: number) => {
    setSelectedOrderId(orderId);
    setCurrentView('order-detail');
    toast.success(`Abrindo comanda #${orderId}`);
  }, []);

  const handleBackToOrders = useCallback(() => {
    setSelectedOrderId(null);
    setCurrentView('orders');
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard appState={appState} />;
      case 'rooms':
        return <RoomView appState={appState} updateAppState={updateAppState} />;
      case 'orders':
        return <OrderList appState={appState} updateAppState={updateAppState} onViewOrder={handleViewOrder} />;
      case 'order-detail':
        return <ClientOrder appState={appState} updateAppState={updateAppState} onBack={handleBackToOrders} />;
      case 'checkin':
        return <CheckInOut appState={appState} updateAppState={updateAppState} />;
      case 'guests':
        return <GuestView appState={appState} updateAppState={updateAppState} />;
      case 'shifts':
        return <ShiftManagement appState={appState} updateAppState={updateAppState} />;
      case 'room-registration':
        return <RoomRegistration appState={appState} updateAppState={updateAppState} />;
      case 'user-registration':
        return <UserRegistration appState={appState} updateAppState={updateAppState} />;
      case 'profile':
        return <UserProfile currentUser={currentUser} />;
      case 'settings':
        return <SystemSettings appState={appState} updateAppState={updateAppState} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Relatórios</h3>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento.</p>
              <p className="text-sm text-muted-foreground mt-2">Em breve: gráficos, estatísticas e relatórios detalhados</p>
              <Button 
                className="mt-4" 
                onClick={() => setCurrentView('dashboard')}
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        );
    }
  };

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    const navItem = navigation.find(nav => nav.view === view);
    if (navItem) {
      toast.success(`Navegando para ${navItem.label}`);
    }
  }, [navigation]);

  // Quick theme toggle function - improved
  const toggleTheme = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Toggling theme. Current:', { theme, actualTheme });
    }
    
    // Se está no modo system, alterna baseado no tema atual aplicado
    if (theme === 'system') {
      const newTheme = actualTheme === 'dark' ? 'light' : 'dark';
      if (process.env.NODE_ENV === 'development') {
        console.log('From system to:', newTheme);
      }
      setTheme(newTheme);
      toast.success(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`);
    } else {
      // Se está em light ou dark, alterna entre eles
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      if (process.env.NODE_ENV === 'development') {
        console.log('From', theme, 'to:', newTheme);
      }
      setTheme(newTheme);
      toast.success(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`);
    }
  }, [theme, actualTheme, setTheme]);

  // Alternative toggle that cycles through all themes
  const cycleTheme = useCallback(() => {
    const themeOrder: Array<typeof theme> = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Cycling theme from', theme, 'to', nextTheme);
    }
    setTheme(nextTheme);
    
    const labels = {
      light: 'claro',
      dark: 'escuro',
      system: 'automático'
    };
    
    toast.success(`Tema alterado para ${labels[nextTheme]}`);
  }, [theme, setTheme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        const pressedKey = e.key.toLowerCase();
        navigation.forEach((nav) => {
          if (nav.shortcut && nav.shortcut.toLowerCase() === pressedKey) {
            e.preventDefault();
            handleViewChange(nav.view);
          }
        });
        
        // Special shortcuts
        if (pressedKey === 'f') {
          e.preventDefault();
          toggleFullscreen();
        } else if (pressedKey === 'm') {
          e.preventDefault();
          setSidebarOpen(prev => !prev);
        } else if (pressedKey === 'n') {
          e.preventDefault();
          setShowNotifications(prev => !prev);
        } else if (pressedKey === 't') {
          e.preventDefault();
          if (e.shiftKey) {
            cycleTheme(); // Shift+Alt+T cycles through all themes
          } else {
            toggleTheme(); // Alt+T toggles between light/dark
          }
        }
      }
      
      // ESC to close modals/overlays
      if (e.key === 'Escape') {
        setShowNotifications(false);
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleViewChange, navigation, toggleTheme, cycleTheme]);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    toast.success(`Bem-vindo, ${user.name}!`);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('luvrSession');
    sessionStorage.removeItem('luvrSession');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSidebarOpen(true);
    setShowNotifications(false);
    toast.success('Logout realizado com sucesso');
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        toast.success('Modo tela cheia ativado');
      }).catch(() => {
        toast.error('Não foi possível ativar tela cheia');
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        toast.success('Modo tela cheia desativado');
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const currentTime = useMemo(() => 
    new Date().toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), 
    []
  );

  // Theme icon helper
  const getThemeIcon = useMemo(() => {
    if (theme === 'system') {
      return <Monitor className="h-5 w-5" />;
    }
    return actualTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />;
  }, [theme, actualTheme]);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300">
      <Toaster position="top-right" richColors />
      
      {/* Debug info - development only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 left-2 z-[9999] bg-black text-white p-2 text-xs font-mono rounded opacity-75 pointer-events-none">
          Theme: {theme} | Actual: {actualTheme} | Classes: {typeof window !== 'undefined' ? Array.from(document.documentElement.classList).join(', ') : 'N/A'}
        </div>
      )}
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:relative inset-y-0 left-0 z-50 transition-all duration-300 bg-gradient-to-b from-purple-700 to-purple-900 dark:from-purple-800 dark:to-purple-950 text-white flex flex-col shadow-xl`}>
        {/* Header */}
        <div className="p-4 border-b border-purple-600 dark:border-purple-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-100 rounded-lg flex items-center justify-center shadow-lg">
                  <Building className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">luvr</h1>
                  <p className="text-xs text-purple-200 dark:text-purple-300">Sistema de Gestão</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-purple-600 dark:hover:bg-purple-700 p-2"
              title={`${sidebarOpen ? 'Fechar' : 'Abrir'} menu (Alt+M)`}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            
            return (
              <div key={item.id} className="relative group">
                <Button
                  onClick={() => handleViewChange(item.view)}
                  variant="ghost"
                  className={`w-full justify-start text-left p-3 h-auto transition-all duration-200 ${
                    isActive 
                      ? 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 hover:bg-white dark:hover:bg-gray-800 shadow-lg' 
                      : 'text-purple-100 dark:text-purple-200 hover:bg-purple-600 dark:hover:bg-purple-700 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </Button>
                
                {!sidebarOpen && item.badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{item.badge}</span>
                  </div>
                )}
                
                {!sidebarOpen && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded text-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                    <span className="text-xs block text-gray-400 dark:text-gray-300">Alt+{item.shortcut}</span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {sidebarOpen && (
          <div className="p-4 border-t border-purple-600 dark:border-purple-700">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-purple-200 dark:text-purple-300">
                <span>Quartos Ocupados:</span>
                <span className="text-white font-medium">12/20</span>
              </div>
              <div className="flex justify-between text-purple-200 dark:text-purple-300">
                <span>Taxa de Ocupação:</span>
                <span className="text-white font-medium">60%</span>
              </div>
              <Progress value={60} className="w-full h-1 bg-purple-800 dark:bg-purple-900" />
              <div className="flex justify-between text-purple-200 dark:text-purple-300">
                <span>Receita Hoje:</span>
                <span className="text-green-300 dark:text-green-400 font-medium">R$ 2.400</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-purple-600 dark:border-purple-700">
          {sidebarOpen ? (
            <div className="text-xs text-purple-200 dark:text-purple-300 text-center">
              <p className="font-medium">luvr v2.0</p>
              <p>© 2025 - Todos os direitos reservados</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-600 dark:bg-purple-700 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xs text-white">v2</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Card className="rounded-none border-0 border-b shadow-sm bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                
                <div>
                  <h1 className="text-2xl font-bold">
                    {currentView === 'order-detail' 
                      ? `Comanda #${selectedOrderId}` 
                      : navigation.find(nav => nav.view === currentView)?.label || 'Sistema'
                    }
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    {currentTime}
                  </p>
                </div>
                
                {/* Quick Search */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Busca rápida... (Ctrl+K)"
                      className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 bg-background"
                      onFocus={() => toast.info('Busca rápida em desenvolvimento')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleTheme}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    cycleTheme();
                  }}
                  title={`Alternar tema (Alt+T) - Atual: ${actualTheme === 'dark' ? 'Escuro' : 'Claro'} | Modo: ${theme} | Click direito para ciclar`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {getThemeIcon}
                </Button>

                {/* Fullscreen Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleFullscreen}
                  title="Tela Cheia (Alt+F)"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
                
                {/* Notifications */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNotifications(!showNotifications)}
                    title="Notificações (Alt+N)"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{unreadNotifications.length}</span>
                      </div>
                    )}
                  </Button>
                  
                  {/* Notification panel */}
                  {showNotifications && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-popover rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
                      <div className="p-3 border-b">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Notificações</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{unreadNotifications.length} novas</Badge>
                            {notifications.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllNotifications}
                                className="text-xs h-6 px-2"
                              >
                                Limpar tudo
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma notificação</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification) => (
                            <div 
                              key={notification.id}
                              className={`p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-2">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  notification.type === 'warning' ? 'bg-yellow-500' :
                                  notification.type === 'error' ? 'bg-red-500' :
                                  notification.type === 'success' ? 'bg-green-500' :
                                  'bg-blue-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 5 && (
                        <div className="p-2 border-t bg-muted/30">
                          <Button variant="ghost" size="sm" className="w-full text-xs">
                            Ver todas as notificações
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => handleViewChange('profile')}
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                      title="Meu Perfil (Alt+0)"
                    >
                      <span className="text-white font-medium text-sm">
                        {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </button>
                    
                    {/* Quick Logout Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="absolute -bottom-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      title="Logout (Alt+L)"
                    >
                      <Power className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto bg-background">
          {renderContent()}
        </div>
      </div>
      
      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="motel-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
}