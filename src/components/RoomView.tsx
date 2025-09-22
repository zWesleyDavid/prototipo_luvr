import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Plus, 
  Search, 
  Filter, 
  Bed, 
  Clock, 
  User, 
  Settings, 
  MoreVertical, 
  Eye,
  UserPlus,
  Sparkles,
  Wrench,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Room {
  id: number;
  number: string;
  status: 'livre' | 'ocupado' | 'limpeza' | 'manutencao';
  type: 'simples' | 'luxo' | 'master';
  dailyRate: number;
  guest?: string;
  checkIn?: string;
  lastCleaned?: string;
  maintenanceNote?: string;
  nextCheckout?: string;
  isLoading?: boolean;
}

interface RoomViewProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
}

const initialRooms: Room[] = [
  { id: 1, number: '101', status: 'livre', type: 'simples', dailyRate: 120, lastCleaned: '10:30' },
  { id: 2, number: '102', status: 'ocupado', type: 'simples', dailyRate: 120, guest: 'João Silva', checkIn: '14:30', nextCheckout: '12:00' },
  { id: 3, number: '103', status: 'limpeza', type: 'luxo', dailyRate: 180, lastCleaned: '09:15' },
  { id: 4, number: '104', status: 'manutencao', type: 'luxo', dailyRate: 180, maintenanceNote: 'Ar condicionado com defeito' },
  { id: 5, number: '105', status: 'ocupado', type: 'simples', dailyRate: 120, guest: 'Maria Santos', checkIn: '16:00', nextCheckout: '11:00' },
  { id: 6, number: '201', status: 'livre', type: 'master', dailyRate: 250, lastCleaned: '11:45' },
  { id: 7, number: '202', status: 'ocupado', type: 'master', dailyRate: 250, guest: 'Carlos Lima', checkIn: '13:20', nextCheckout: '14:00' },
  { id: 8, number: '203', status: 'livre', type: 'luxo', dailyRate: 180, lastCleaned: '08:30' },
  { id: 9, number: '204', status: 'limpeza', type: 'luxo', dailyRate: 180, lastCleaned: '12:00' },
  { id: 10, number: '301', status: 'livre', type: 'master', dailyRate: 250, lastCleaned: '10:00' },
];

export function RoomView({ appState, updateAppState }: RoomViewProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ number: '', type: '', dailyRate: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto refresh every 30 seconds if enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        toast.info('Atualizando status dos quartos...');
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const statusConfig = {
    livre: { 
      color: 'bg-green-500', 
      textColor: 'text-green-700', 
      bgLight: 'bg-green-50', 
      borderColor: 'border-green-200',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      label: 'Livre',
      icon: <CheckCircle className="h-4 w-4" />
    },
    ocupado: { 
      color: 'bg-red-500', 
      textColor: 'text-red-700', 
      bgLight: 'bg-red-50', 
      borderColor: 'border-red-200',
      gradientFrom: 'from-red-400',
      gradientTo: 'to-red-600',
      label: 'Ocupado',
      icon: <User className="h-4 w-4" />
    },
    limpeza: { 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-700', 
      bgLight: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-yellow-600',
      label: 'Limpeza',
      icon: <Sparkles className="h-4 w-4" />
    },
    manutencao: { 
      color: 'bg-gray-500', 
      textColor: 'text-gray-700', 
      bgLight: 'bg-gray-50', 
      borderColor: 'border-gray-200',
      gradientFrom: 'from-gray-400',
      gradientTo: 'to-gray-600',
      label: 'Manutenção',
      icon: <Wrench className="h-4 w-4" />
    }
  };

  const typeLabels = {
    simples: 'Simples',
    luxo: 'Luxo',
    master: 'Master'
  };

  const typeIcons = {
    simples: '⭐',
    luxo: '⭐⭐',
    master: '⭐⭐⭐'
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Group rooms by status
  const groupedRooms = {
    ocupado: filteredRooms.filter(room => room.status === 'ocupado'),
    livre: filteredRooms.filter(room => room.status === 'livre'),
    limpeza: filteredRooms.filter(room => room.status === 'limpeza'),
    manutencao: filteredRooms.filter(room => room.status === 'manutencao'),
  };

  const handleAddRoom = async () => {
    if (!newRoom.number || !newRoom.type || !newRoom.dailyRate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Check if room number already exists
    if (rooms.find(r => r.number === newRoom.number)) {
      toast.error('Número do quarto já existe');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const room: Room = {
      id: Date.now(),
      number: newRoom.number,
      type: newRoom.type as 'simples' | 'luxo' | 'master',
      dailyRate: parseFloat(newRoom.dailyRate),
      status: 'livre',
      lastCleaned: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setRooms([...rooms, room]);
    toast.success(`Quarto ${newRoom.number} adicionado com sucesso!`);
    setIsAddDialogOpen(false);
    setNewRoom({ number: '', type: '', dailyRate: '' });
    setIsLoading(false);
  };

  const handleRoomAction = async (roomId: number, action: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    // Set loading state for specific room
    setRooms(rooms.map(r => r.id === roomId ? { ...r, isLoading: true } : r));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let newStatus = room.status;
    let message = '';

    switch (action) {
      case 'checkin':
        // This would typically navigate to check-in form
        toast.info(`Iniciando check-in para quarto ${room.number}`);
        break;
      case 'checkout':
        newStatus = 'limpeza';
        message = `Check-out realizado no quarto ${room.number}`;
        break;
      case 'clean':
        newStatus = 'livre';
        message = `Limpeza concluída no quarto ${room.number}`;
        break;
      case 'maintenance':
        newStatus = 'manutencao';
        message = `Quarto ${room.number} enviado para manutenção`;
        break;
      case 'activate':
        newStatus = 'livre';
        message = `Quarto ${room.number} reativado`;
        break;
    }

    setRooms(rooms.map(r => 
      r.id === roomId 
        ? { 
            ...r, 
            status: newStatus, 
            isLoading: false,
            lastCleaned: action === 'clean' ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : r.lastCleaned
          }
        : r
    ));

    if (message) {
      toast.success(message);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    
    const formatted = (parseInt(numericValue) / 100).toFixed(2);
    return `R$ ${formatted.replace('.', ',')}`;
  };

  const RoomCard = ({ room }: { room: Room }) => {
    const config = statusConfig[room.status];
    
    return (
      <Card className={`group hover:shadow-xl transition-all duration-300 border-2 ${config.borderColor} bg-white overflow-hidden relative`}>
        {room.isLoading && (
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
                {room.number.slice(-2)}
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Quarto {room.number}</CardTitle>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="mr-1">{typeIcons[room.type]}</span>
                  {typeLabels[room.type]}
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
                  <DropdownMenuItem onClick={() => toast.info(`Visualizando detalhes do quarto ${room.number}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  
                  {room.status === 'livre' && (
                    <DropdownMenuItem onClick={() => handleRoomAction(room.id, 'checkin')}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Check-in
                    </DropdownMenuItem>
                  )}
                  
                  {room.status === 'ocupado' && (
                    <DropdownMenuItem onClick={() => handleRoomAction(room.id, 'checkout')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Check-out
                    </DropdownMenuItem>
                  )}
                  
                  {room.status === 'limpeza' && (
                    <DropdownMenuItem onClick={() => handleRoomAction(room.id, 'clean')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Concluir Limpeza
                    </DropdownMenuItem>
                  )}
                  
                  {room.status !== 'manutencao' && (
                    <DropdownMenuItem onClick={() => handleRoomAction(room.id, 'maintenance')}>
                      <Wrench className="h-4 w-4 mr-2" />
                      Enviar para Manutenção
                    </DropdownMenuItem>
                  )}
                  
                  {room.status === 'manutencao' && (
                    <DropdownMenuItem onClick={() => handleRoomAction(room.id, 'activate')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reativar Quarto
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Guest info for occupied rooms */}
          {room.status === 'ocupado' && room.guest && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{room.guest}</p>
                    <p className="text-xs text-red-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Entrada: {room.checkIn}
                    </p>
                  </div>
                </div>
                {room.nextCheckout && (
                  <div className="text-right">
                    <p className="text-xs text-red-600">Checkout previsto</p>
                    <p className="text-sm font-medium text-red-800">{room.nextCheckout}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Last cleaned info */}
          {(room.status === 'livre' || room.status === 'limpeza') && room.lastCleaned && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Sparkles className="h-4 w-4" />
                <span>Última limpeza: {room.lastCleaned}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Limpo
              </Badge>
            </div>
          )}

          {/* Maintenance note */}
          {room.status === 'manutencao' && room.maintenanceNote && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {room.maintenanceNote}
              </AlertDescription>
            </Alert>
          )}

          {/* Room details */}
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Bed className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Diária</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-purple-600">R$ {room.dailyRate}</span>
              <p className="text-xs text-gray-500">por dia</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2 pt-2">
            {room.status === 'livre' && (
              <>
                <Button 
                  size="sm" 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleRoomAction(room.id, 'checkin')}
                  disabled={room.isLoading}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Check-in
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info(`Visualizando quarto ${room.number}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {room.status === 'ocupado' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => toast.info(`Visualizando comanda do quarto ${room.number}`)}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Comanda
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRoomAction(room.id, 'checkout')}
                  disabled={room.isLoading}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {room.status === 'limpeza' && (
              <Button 
                size="sm" 
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                onClick={() => handleRoomAction(room.id, 'clean')}
                disabled={room.isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Concluir Limpeza
              </Button>
            )}
            
            {room.status === 'manutencao' && (
              <Button 
                size="sm" 
                className="w-full bg-gray-600 hover:bg-gray-700"
                onClick={() => handleRoomAction(room.id, 'activate')}
                disabled={room.isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Reativar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const RoomSection = ({ title, rooms, icon, color }: { title: string; rooms: Room[]; icon: React.ReactNode; color: string }) => {
    if (rooms.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white`}>
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <Badge variant="outline" className="ml-2">
              {rooms.length} {rooms.length === 1 ? 'quarto' : 'quartos'}
            </Badge>
          </div>
          <Progress value={(rooms.length / filteredRooms.length) * 100} className="w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">{groupedRooms.ocupado.length}</p>
            <p className="text-red-100 text-sm">Ocupados</p>
            <div className="mt-2">
              <Progress value={(groupedRooms.ocupado.length / rooms.length) * 100} className="bg-red-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">{groupedRooms.livre.length}</p>
            <p className="text-green-100 text-sm">Livres</p>
            <div className="mt-2">
              <Progress value={(groupedRooms.livre.length / rooms.length) * 100} className="bg-green-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">{groupedRooms.limpeza.length}</p>
            <p className="text-yellow-100 text-sm">Limpeza</p>
            <div className="mt-2">
              <Progress value={(groupedRooms.limpeza.length / rooms.length) * 100} className="bg-yellow-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">{groupedRooms.manutencao.length}</p>
            <p className="text-gray-100 text-sm">Manutenção</p>
            <div className="mt-2">
              <Progress value={(groupedRooms.manutencao.length / rooms.length) * 100} className="bg-gray-400" />
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
              placeholder="Pesquisar por número do quarto ou hóspede..."
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
                <SelectItem value="livre">Livre</SelectItem>
                <SelectItem value="ocupado">Ocupado</SelectItem>
                <SelectItem value="limpeza">Limpeza</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] border-gray-200">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="simples">Simples</SelectItem>
                <SelectItem value="luxo">Luxo</SelectItem>
                <SelectItem value="master">Master</SelectItem>
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

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Quarto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Quarto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Número do Quarto *</Label>
                    <Input 
                      placeholder="Ex: 105"
                      value={newRoom.number}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, number: e.target.value }))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Suíte *</Label>
                    <Select value={newRoom.type} onValueChange={(value) => setNewRoom(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples">⭐ Simples</SelectItem>
                        <SelectItem value="luxo">⭐⭐ Luxo</SelectItem>
                        <SelectItem value="master">⭐⭐⭐ Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Valor da Diária *</Label>
                    <Input 
                      placeholder="R$ 0,00"
                      value={newRoom.dailyRate}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setNewRoom(prev => ({ ...prev, dailyRate: formatted }));
                      }}
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAddRoom}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Adicionando...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Room Sections */}
      <div className="space-y-12">
        <RoomSection 
          title="Quartos Ocupados" 
          rooms={groupedRooms.ocupado}
          icon={<User className="h-4 w-4" />}
          color="bg-red-500"
        />
        
        <RoomSection 
          title="Quartos Livres" 
          rooms={groupedRooms.livre}
          icon={<CheckCircle className="h-4 w-4" />}
          color="bg-green-500"
        />
        
        <RoomSection 
          title="Aguardando Limpeza" 
          rooms={groupedRooms.limpeza}
          icon={<Sparkles className="h-4 w-4" />}
          color="bg-yellow-500"
        />
        
        <RoomSection 
          title="Em Manutenção" 
          rooms={groupedRooms.manutencao}
          icon={<Wrench className="h-4 w-4" />}
          color="bg-gray-500"
        />
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum quarto encontrado</h3>
          <p className="text-gray-500 mb-6">Não encontramos quartos com os filtros aplicados.</p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setTypeFilter('all');
            toast.success('Filtros limpos!');
          }}>
            <XCircle className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </Card>
      )}
    </div>
  );
}