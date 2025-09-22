import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  Bed,
  Wifi,
  Tv,
  Car,
  Bath,
  Wind,
  Coffee,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'out_of_order';
  capacity: number;
  dailyRate: number;
  hourlyRate: number;
  amenities: string[];
  description: string;
  floor: number;
  size: number; // em m²
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoomRegistrationProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
}

const roomTypes = [
  'Standard',
  'Suíte',
  'Luxo',
  'Premium',
  'VIP',
  'Família',
  'Romântico',
  'Executivo'
];

const availableAmenities = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'tv', label: 'TV a Cabo', icon: Tv },
  { id: 'parking', label: 'Estacionamento Privado', icon: Car },
  { id: 'jacuzzi', label: 'Banheira de Hidromassagem', icon: Bath },
  { id: 'ac', label: 'Ar Condicionado', icon: Wind },
  { id: 'minibar', label: 'Frigobar', icon: Coffee },
  { id: 'safe', label: 'Cofre', icon: Shield }
];

export function RoomRegistration({ appState, updateAppState }: RoomRegistrationProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [form, setForm] = useState({
    number: '',
    type: '',
    capacity: 2,
    dailyRate: '',
    hourlyRate: '',
    amenities: [] as string[],
    description: '',
    floor: 1,
    size: '',
    isActive: true
  });

  // Load rooms from localStorage
  useEffect(() => {
    const savedRooms = localStorage.getItem('motelRooms');
    if (savedRooms) {
      try {
        setRooms(JSON.parse(savedRooms));
      } catch (error) {
        console.error('Error loading rooms:', error);
      }
    } else {
      // Initialize with sample data
      const sampleRooms: Room[] = [
        {
          id: '1',
          number: '101',
          type: 'Standard',
          status: 'available',
          capacity: 2,
          dailyRate: 150,
          hourlyRate: 25,
          amenities: ['wifi', 'tv', 'ac'],
          description: 'Quarto padrão com amenidades básicas',
          floor: 1,
          size: 25,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          number: '201',
          type: 'Suíte',
          status: 'occupied',
          capacity: 2,
          dailyRate: 220,
          hourlyRate: 35,
          amenities: ['wifi', 'tv', 'ac', 'jacuzzi', 'minibar'],
          description: 'Suíte com banheira de hidromassagem',
          floor: 2,
          size: 40,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setRooms(sampleRooms);
    }
  }, []);

  // Save rooms to localStorage
  useEffect(() => {
    localStorage.setItem('motelRooms', JSON.stringify(rooms));
    // Update appState if needed
    if (updateAppState) {
      updateAppState('rooms', rooms);
    }
  }, [rooms, updateAppState]);

  const resetForm = () => {
    setForm({
      number: '',
      type: '',
      capacity: 2,
      dailyRate: '',
      hourlyRate: '',
      amenities: [],
      description: '',
      floor: 1,
      size: '',
      isActive: true
    });
    setEditingRoom(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.number || !form.type || !form.dailyRate || !form.hourlyRate || !form.size) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Check if room number already exists (only for new rooms)
    if (!editingRoom && rooms.some(room => room.number === form.number)) {
      toast.error('Já existe um quarto com este número');
      return;
    }

    const roomData: Room = {
      id: editingRoom?.id || Date.now().toString(),
      number: form.number,
      type: form.type,
      status: editingRoom?.status || 'available',
      capacity: form.capacity,
      dailyRate: parseFloat(form.dailyRate),
      hourlyRate: parseFloat(form.hourlyRate),
      amenities: form.amenities,
      description: form.description,
      floor: form.floor,
      size: parseFloat(form.size),
      isActive: form.isActive,
      createdAt: editingRoom?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingRoom) {
      setRooms(prev => prev.map(room => 
        room.id === editingRoom.id ? roomData : room
      ));
      toast.success('Quarto atualizado com sucesso!');
    } else {
      setRooms(prev => [...prev, roomData]);
      toast.success('Quarto cadastrado com sucesso!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setForm({
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      dailyRate: room.dailyRate.toString(),
      hourlyRate: room.hourlyRate.toString(),
      amenities: room.amenities,
      description: room.description,
      floor: room.floor,
      size: room.size.toString(),
      isActive: room.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este quarto?')) {
      setRooms(prev => prev.filter(room => room.id !== id));
      toast.success('Quarto excluído com sucesso!');
    }
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityId]
      }));
    } else {
      setForm(prev => ({
        ...prev,
        amenities: prev.amenities.filter(id => id !== amenityId)
      }));
    }
  };

  const getStatusBadge = (status: Room['status']) => {
    const variants = {
      available: { className: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Disponível' },
      occupied: { className: 'bg-red-100 text-red-700', icon: XCircle, label: 'Ocupado' },
      cleaning: { className: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle, label: 'Limpeza' },
      maintenance: { className: 'bg-orange-100 text-orange-700', icon: AlertTriangle, label: 'Manutenção' },
      out_of_order: { className: 'bg-gray-100 text-gray-700', icon: XCircle, label: 'Fora de Serviço' }
    };

    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <Badge className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeRooms = rooms.filter(room => room.isActive);
  const totalRevenue = rooms.reduce((sum, room) => sum + room.dailyRate, 0);
  const averageRate = rooms.length > 0 ? totalRevenue / rooms.length : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Quartos</p>
              <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quartos Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeRooms.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tarifa Média</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {averageRate.toFixed(0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bed className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tipos de Quarto</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(rooms.map(r => r.type)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Label>Filtros:</Label>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {roomTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="occupied">Ocupado</SelectItem>
                <SelectItem value="cleaning">Limpeza</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="out_of_order">Fora de Serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Quarto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingRoom ? 'Editar Quarto' : 'Cadastrar Novo Quarto'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">Número do Quarto *</Label>
                      <Input
                        id="number"
                        placeholder="101"
                        value={form.number}
                        onChange={(e) => setForm({ ...form, number: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo *</Label>
                      <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacidade</Label>
                      <Select 
                        value={form.capacity.toString()} 
                        onValueChange={(value) => setForm({ ...form, capacity: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 pessoa</SelectItem>
                          <SelectItem value="2">2 pessoas</SelectItem>
                          <SelectItem value="3">3 pessoas</SelectItem>
                          <SelectItem value="4">4 pessoas</SelectItem>
                          <SelectItem value="6">6 pessoas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floor">Andar</Label>
                      <Select 
                        value={form.floor.toString()} 
                        onValueChange={(value) => setForm({ ...form, floor: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1º Andar</SelectItem>
                          <SelectItem value="2">2º Andar</SelectItem>
                          <SelectItem value="3">3º Andar</SelectItem>
                          <SelectItem value="4">4º Andar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Tamanho (m²) *</Label>
                      <Input
                        id="size"
                        type="number"
                        placeholder="25"
                        value={form.size}
                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dailyRate">Tarifa Diária (R$) *</Label>
                      <Input
                        id="dailyRate"
                        type="number"
                        step="0.01"
                        placeholder="150.00"
                        value={form.dailyRate}
                        onChange={(e) => setForm({ ...form, dailyRate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Tarifa por Hora (R$) *</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        placeholder="25.00"
                        value={form.hourlyRate}
                        onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Comodidades</Label>
                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      {availableAmenities.map(amenity => {
                        const Icon = amenity.icon;
                        return (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity.id}
                              checked={form.amenities.includes(amenity.id)}
                              onCheckedChange={(checked) => handleAmenityChange(amenity.id, !!checked)}
                            />
                            <Label htmlFor={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                              <Icon className="h-4 w-4 text-gray-500" />
                              <span>{amenity.label}</span>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descrição do quarto e características especiais"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={form.isActive}
                      onCheckedChange={(checked) => setForm({ ...form, isActive: !!checked })}
                    />
                    <Label htmlFor="isActive">Quarto ativo</Label>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      {editingRoom ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Rooms Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quartos Cadastrados</h3>
          
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum quarto encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? 
                  'Nenhum quarto encontrado com os filtros aplicados.' :
                  'Comece cadastrando um novo quarto.'
                }
              </p>
              {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterStatus('all');
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Andar</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Tarifa Diária</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comodidades</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">
                        Quarto {room.number}
                      </TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{room.floor}º</TableCell>
                      <TableCell>{room.capacity} pessoa{room.capacity > 1 ? 's' : ''}</TableCell>
                      <TableCell>{room.size}m²</TableCell>
                      <TableCell>R$ {room.dailyRate.toFixed(2)}</TableCell>
                      <TableCell>
                        {getStatusBadge(room.status)}
                        {!room.isActive && (
                          <Badge className="ml-1 bg-gray-100 text-gray-700">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {room.amenities.slice(0, 3).map(amenityId => {
                            const amenity = availableAmenities.find(a => a.id === amenityId);
                            if (!amenity) return null;
                            const Icon = amenity.icon;
                            return (
                              <Icon key={amenityId} className="h-4 w-4 text-gray-500" title={amenity.label} />
                            );
                          })}
                          {room.amenities.length > 3 && (
                            <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(room)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(room.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}