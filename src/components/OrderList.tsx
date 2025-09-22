import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Progress } from './ui/progress';
import { 
  Plus, 
  Search, 
  Filter, 
  Receipt, 
  Clock, 
  User, 
  Settings, 
  MoreVertical, 
  Eye,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Printer,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OrderItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: number;
  room: string;
  guest: string;
  status: 'aberta' | 'fechada' | 'pendente';
  checkIn: string;
  checkOut?: string;
  totalItems: number;
  dailyRate: number;
  consumptionTotal: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  isLoading?: boolean;
}

interface OrderListProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
  onViewOrder?: (orderId: number) => void;
}

const initialOrders: Order[] = [
  {
    id: 1,
    room: '102',
    guest: 'João Silva',
    status: 'aberta',
    checkIn: '19/08/2025 14:30',
    totalItems: 4,
    dailyRate: 180,
    consumptionTotal: 94.00,
    totalAmount: 274.00,
    items: [
      { id: 1, name: 'Refrigerante Coca-Cola', category: 'Bebidas', quantity: 2, unitPrice: 8.50, total: 17.00 },
      { id: 2, name: 'Água Mineral', category: 'Bebidas', quantity: 1, unitPrice: 4.00, total: 4.00 },
      { id: 3, name: 'Cerveja Heineken', category: 'Bebidas', quantity: 4, unitPrice: 12.00, total: 48.00 },
      { id: 4, name: 'Sanduíche Natural', category: 'Lanches', quantity: 1, unitPrice: 25.00, total: 25.00 }
    ],
    createdAt: '19/08/2025 14:45',
    updatedAt: '19/08/2025 18:30'
  },
  {
    id: 2,
    room: '201',
    guest: 'Maria Santos',
    status: 'fechada',
    checkIn: '18/08/2025 16:00',
    checkOut: '19/08/2025 11:00',
    totalItems: 6,
    dailyRate: 250,
    consumptionTotal: 158.50,
    totalAmount: 408.50,
    items: [
      { id: 5, name: 'Champagne', category: 'Bebidas', quantity: 1, unitPrice: 89.00, total: 89.00 },
      { id: 6, name: 'Chocolate Gourmet', category: 'Doces', quantity: 2, unitPrice: 22.50, total: 45.00 },
      { id: 7, name: 'Água com Gás', category: 'Bebidas', quantity: 2, unitPrice: 6.25, total: 12.50 },
      { id: 8, name: 'Frutas Frescas', category: 'Lanches', quantity: 1, unitPrice: 12.00, total: 12.00 }
    ],
    createdAt: '18/08/2025 16:15',
    updatedAt: '19/08/2025 10:45'
  },
  {
    id: 3,
    room: '105',
    guest: 'Carlos Lima',
    status: 'pendente',
    checkIn: '19/08/2025 13:20',
    totalItems: 2,
    dailyRate: 120,
    consumptionTotal: 26.50,
    totalAmount: 146.50,
    items: [
      { id: 9, name: 'Cerveja Local', category: 'Bebidas', quantity: 3, unitPrice: 7.50, total: 22.50 },
      { id: 10, name: 'Amendoim', category: 'Lanches', quantity: 1, unitPrice: 4.00, total: 4.00 }
    ],
    createdAt: '19/08/2025 13:45',
    updatedAt: '19/08/2025 15:20'
  },
  {
    id: 4,
    room: '301',
    guest: 'Ana Rodrigues',
    status: 'aberta',
    checkIn: '19/08/2025 15:45',
    totalItems: 8,
    dailyRate: 250,
    consumptionTotal: 143.75,
    totalAmount: 393.75,
    items: [
      { id: 11, name: 'Vinho Tinto', category: 'Bebidas', quantity: 1, unitPrice: 67.50, total: 67.50 },
      { id: 12, name: 'Queijo e Crackers', category: 'Lanches', quantity: 1, unitPrice: 28.75, total: 28.75 },
      { id: 13, name: 'Água Mineral', category: 'Bebidas', quantity: 4, unitPrice: 4.00, total: 16.00 },
      { id: 14, name: 'Chocolate Belga', category: 'Doces', quantity: 2, unitPrice: 15.75, total: 31.50 }
    ],
    createdAt: '19/08/2025 16:00',
    updatedAt: '19/08/2025 19:15'
  },
  {
    id: 5,
    room: '203',
    guest: 'Pedro Oliveira',
    status: 'fechada',
    checkIn: '17/08/2025 12:30',
    checkOut: '18/08/2025 12:00',
    totalItems: 3,
    dailyRate: 180,
    consumptionTotal: 45.25,
    totalAmount: 225.25,
    items: [
      { id: 15, name: 'Whisky Premium', category: 'Bebidas', quantity: 1, unitPrice: 32.50, total: 32.50 },
      { id: 16, name: 'Gelo', category: 'Outros', quantity: 2, unitPrice: 2.75, total: 5.50 },
      { id: 17, name: 'Mix de Nuts', category: 'Lanches', quantity: 1, unitPrice: 7.25, total: 7.25 }
    ],
    createdAt: '17/08/2025 13:00',
    updatedAt: '18/08/2025 11:30'
  }
];

export function OrderList({ appState, updateAppState, onViewOrder }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto refresh every 30 seconds if enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        toast.info('Atualizando comandas...');
        // Simulate data refresh
        setOrders(prev => [...prev]);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const statusConfig = {
    aberta: { 
      color: 'bg-green-500', 
      textColor: 'text-green-700', 
      bgLight: 'bg-green-50', 
      borderColor: 'border-green-200',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      label: 'Aberta',
      icon: <CheckCircle className="h-4 w-4" />
    },
    fechada: { 
      color: 'bg-gray-500', 
      textColor: 'text-gray-700', 
      bgLight: 'bg-gray-50', 
      borderColor: 'border-gray-200',
      gradientFrom: 'from-gray-400',
      gradientTo: 'to-gray-600',
      label: 'Fechada',
      icon: <XCircle className="h-4 w-4" />
    },
    pendente: { 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-700', 
      bgLight: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-yellow-600',
      label: 'Pendente',
      icon: <AlertCircle className="h-4 w-4" />
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.guest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group orders by status
  const groupedOrders = {
    aberta: filteredOrders.filter(order => order.status === 'aberta'),
    pendente: filteredOrders.filter(order => order.status === 'pendente'),
    fechada: filteredOrders.filter(order => order.status === 'fechada'),
  };

  const handleOrderAction = async (orderId: number, action: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Set loading state for specific order
    setOrders(orders.map(o => o.id === orderId ? { ...o, isLoading: true } : o));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let newStatus = order.status;
    let message = '';

    switch (action) {
      case 'view':
        if (onViewOrder) {
          onViewOrder(orderId);
        } else {
          toast.info(`Visualizando comanda do quarto ${order.room}`);
        }
        break;
      case 'close':
        newStatus = 'fechada';
        message = `Comanda do quarto ${order.room} fechada com sucesso`;
        break;
      case 'reopen':
        newStatus = 'aberta';
        message = `Comanda do quarto ${order.room} reaberta`;
        break;
      case 'pending':
        newStatus = 'pendente';
        message = `Comanda do quarto ${order.room} marcada como pendente`;
        break;
      case 'print':
        toast.info(`Imprimindo comanda do quarto ${order.room}`);
        break;
      case 'delete':
        setOrders(orders.filter(o => o.id !== orderId));
        toast.success(`Comanda do quarto ${order.room} removida`);
        return;
    }

    if (newStatus !== order.status) {
      setOrders(orders.map(o => 
        o.id === orderId 
          ? { 
              ...o, 
              status: newStatus, 
              isLoading: false,
              updatedAt: new Date().toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              checkOut: newStatus === 'fechada' ? new Date().toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : o.checkOut
            }
          : o
      ));
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, isLoading: false } : o));
    }

    if (message) {
      toast.success(message);
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const config = statusConfig[order.status];
    
    return (
      <Card className={`group hover:shadow-xl transition-all duration-300 border-2 ${config.borderColor} bg-white overflow-hidden relative`}>
        {order.isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
          </div>
        )}
        
        {/* Header with gradient */}
        <div className={`h-3 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`} />
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {order.room}
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Quarto {order.room}</CardTitle>
                <p className="text-sm text-gray-500 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {order.guest}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${config.color} text-white border-0 font-medium flex items-center space-x-1`}>
                {config.icon}
                <span>{config.label}</span>
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'view')}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Comanda
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'print')}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </DropdownMenuItem>
                  
                  {order.status === 'aberta' && (
                    <>
                      <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'pending')}>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Marcar Pendente
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'close')}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Fechar Comanda
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {order.status === 'pendente' && (
                    <>
                      <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'reopen')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reabrir Comanda
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'close')}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Fechar Comanda
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {order.status === 'fechada' && (
                    <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'reopen')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reabrir Comanda
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    onClick={() => handleOrderAction(order.id, 'delete')}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Order Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Check-in: {order.checkIn}</span>
              </div>
              {order.checkOut && (
                <div className="text-gray-500">
                  <span>Check-out: {order.checkOut}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Última atualização: {order.updatedAt}
            </div>
          </div>

          {/* Order Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600">Itens</p>
                  <p className="text-lg font-bold text-blue-800">{order.totalItems}</p>
                </div>
                <Receipt className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600">Consumo</p>
                  <p className="text-lg font-bold text-green-800">R$ {order.consumptionTotal.toFixed(2)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Popular Items Preview */}
          {order.items.length > 0 && (
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-700 mb-2">Itens mais consumidos:</h4>
              <div className="flex flex-wrap gap-1">
                {order.items.slice(0, 3).map((item) => (
                  <Badge key={item.id} variant="outline" className="text-xs">
                    {item.name} ({item.quantity}x)
                  </Badge>
                ))}
                {order.items.length > 3 && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    +{order.items.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <div>
              <span className="text-sm text-gray-600">Total Geral</span>
              <p className="text-xs text-gray-500">Diária + Consumo</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-purple-600">R$ {order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => handleOrderAction(order.id, 'view')}
              disabled={order.isLoading}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver Comanda
            </Button>
            
            {order.status === 'aberta' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleOrderAction(order.id, 'close')}
                disabled={order.isLoading}
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleOrderAction(order.id, 'print')}
              disabled={order.isLoading}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const OrderSection = ({ title, orders, icon, color }: { title: string; orders: Order[]; icon: React.ReactNode; color: string }) => {
    if (orders.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white`}>
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <Badge variant="outline" className="ml-2">
              {orders.length} {orders.length === 1 ? 'comanda' : 'comandas'}
            </Badge>
          </div>
          <Progress value={(orders.length / filteredOrders.length) * 100} className="w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">{groupedOrders.aberta.length}</p>
            <p className="text-green-100 text-sm">Abertas</p>
            <div className="mt-2">
              <Progress value={(groupedOrders.aberta.length / orders.length) * 100} className="bg-green-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">{groupedOrders.pendente.length}</p>
            <p className="text-yellow-100 text-sm">Pendentes</p>
            <div className="mt-2">
              <Progress value={(groupedOrders.pendente.length / orders.length) * 100} className="bg-yellow-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">{groupedOrders.fechada.length}</p>
            <p className="text-gray-100 text-sm">Fechadas</p>
            <div className="mt-2">
              <Progress value={(groupedOrders.fechada.length / orders.length) * 100} className="bg-gray-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">
              R$ {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
            </p>
            <p className="text-purple-100 text-sm">Total Geral</p>
            <div className="mt-2">
              <Progress value={100} className="bg-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por quarto ou hóspede..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-gray-200">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="aberta">Abertas</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="fechada">Fechadas</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-green-50 border-green-300 text-green-700' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-Refresh
            </Button>

            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Comanda
            </Button>
          </div>
        </div>
      </Card>

      {/* Order Sections */}
      <div className="space-y-12">
        <OrderSection 
          title="Comandas Abertas" 
          orders={groupedOrders.aberta}
          icon={<CheckCircle className="h-4 w-4" />}
          color="bg-green-500"
        />
        
        <OrderSection 
          title="Comandas Pendentes" 
          orders={groupedOrders.pendente}
          icon={<AlertCircle className="h-4 w-4" />}
          color="bg-yellow-500"
        />
        
        <OrderSection 
          title="Comandas Fechadas" 
          orders={groupedOrders.fechada}
          icon={<XCircle className="h-4 w-4" />}
          color="bg-gray-500"
        />
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma comanda encontrada</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Tente ajustar os filtros para encontrar comandas' 
              : 'Ainda não há comandas registradas no sistema'
            }
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            variant="outline"
          >
            Limpar Filtros
          </Button>
        </Card>
      )}
    </div>
  );
}