import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  Building,
  Clock,
  Filter,
  Download,
  Star
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  city: string;
  state: string;
  birthDate: string;
  registeredAt: string;
  lastVisit: string;
  totalStays: number;
  totalSpent: number;
  status: 'active' | 'blocked' | 'vip';
  notes: string;
  room?: string;
}

interface GuestViewProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
}

const mockGuests: Guest[] = [
  {
    id: 1,
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    document: '123.456.789-00',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    birthDate: '1985-05-15',
    registeredAt: '2024-01-15',
    lastVisit: '2025-08-19',
    totalStays: 5,
    totalSpent: 2350.00,
    status: 'vip',
    notes: 'Cliente preferencial, solicita sempre quarto com vista.',
    room: '102'
  },
  {
    id: 2,
    name: 'Maria Santos Oliveira',
    email: 'maria.santos@email.com',
    phone: '(11) 88888-8888',
    document: '987.654.321-00',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    birthDate: '1990-12-22',
    registeredAt: '2024-03-20',
    lastVisit: '2025-08-18',
    totalStays: 3,
    totalSpent: 1250.00,
    status: 'active',
    notes: 'Cliente pontual, sem restrições.',
    room: '202'
  },
  {
    id: 3,
    name: 'Carlos Lima Costa',
    email: 'carlos.lima@email.com',
    phone: '(11) 77777-7777',
    document: '456.789.123-00',
    address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
    birthDate: '1975-08-10',
    registeredAt: '2023-11-05',
    lastVisit: '2025-08-15',
    totalStays: 8,
    totalSpent: 4200.00,
    status: 'vip',
    notes: 'Cliente antigo, sempre solicita late check-out.'
  },
  {
    id: 4,
    name: 'Ana Paula Ferreira',
    email: 'ana.ferreira@email.com',
    phone: '(11) 66666-6666',
    document: '789.123.456-00',
    address: 'Rua da Consolação, 800',
    city: 'São Paulo',
    state: 'SP',
    birthDate: '1988-03-28',
    registeredAt: '2024-07-10',
    lastVisit: '2025-08-10',
    totalStays: 2,
    totalSpent: 890.00,
    status: 'active',
    notes: 'Primeira hospedagem foi excelente.'
  }
];

export function GuestView({ appState, updateAppState }: GuestViewProps) {
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    city: '',
    state: '',
    birthDate: '',
    notes: ''
  });

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phone.includes(searchTerm) ||
                         guest.document.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusConfig = {
    active: { label: 'Ativo', color: 'bg-green-500' },
    vip: { label: 'VIP', color: 'bg-purple-500' },
    blocked: { label: 'Bloqueado', color: 'bg-red-500' }
  };

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.email || !newGuest.phone || !newGuest.document) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const guest: Guest = {
      id: Date.now(),
      name: newGuest.name!,
      email: newGuest.email!,
      phone: newGuest.phone!,
      document: newGuest.document!,
      address: newGuest.address || '',
      city: newGuest.city || '',
      state: newGuest.state || '',
      birthDate: newGuest.birthDate || '',
      registeredAt: new Date().toISOString().split('T')[0],
      lastVisit: '',
      totalStays: 0,
      totalSpent: 0,
      status: 'active',
      notes: newGuest.notes || ''
    };

    setGuests([...guests, guest]);
    toast.success('Hóspede cadastrado com sucesso!');
    setIsAddDialogOpen(false);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
      city: '',
      state: '',
      birthDate: '',
      notes: ''
    });
  };

  const handleViewGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsViewDialogOpen(true);
  };

  const handleDeleteGuest = (id: number) => {
    setGuests(guests.filter(g => g.id !== id));
    toast.success('Hóspede removido com sucesso!');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDocument = (doc: string) => {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Hóspedes</p>
              <p className="text-2xl font-bold">{guests.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-200" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Hóspedes VIP</p>
              <p className="text-2xl font-bold">{guests.filter(g => g.status === 'vip').length}</p>
            </div>
            <Star className="h-8 w-8 text-purple-200" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Hospedados Hoje</p>
              <p className="text-2xl font-bold">{guests.filter(g => g.room).length}</p>
            </div>
            <Building className="h-8 w-8 text-green-200" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Receita Total</p>
              <p className="text-2xl font-bold">R$ {guests.reduce((sum, g) => sum + g.totalSpent, 0).toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome, email, telefone ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Hóspede
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Hóspede</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome Completo *</Label>
                      <Input 
                        value={newGuest.name || ''}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="João Silva Santos"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input 
                        type="email"
                        value={newGuest.email || ''}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="joao@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Telefone *</Label>
                      <Input 
                        value={newGuest.phone || ''}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <Label>CPF *</Label>
                      <Input 
                        value={newGuest.document || ''}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, document: e.target.value }))}
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Endereço</Label>
                    <Input 
                      value={newGuest.address || ''}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Rua das Flores, 123"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Cidade</Label>
                      <Input 
                        value={newGuest.city || ''}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input 
                        value={newGuest.state || ''}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="SP"
                      />
                    </div>
                    <div>
                      <Label>Data de Nascimento</Label>
                      <Input 
                        type="date"
                        value={newGuest.birthDate || ''}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, birthDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Observações</Label>
                    <Textarea 
                      value={newGuest.notes || ''}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre o hóspede..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddGuest} className="bg-purple-600 hover:bg-purple-700">
                    Cadastrar Hóspede
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Guests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Hóspedes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hóspede</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hospedagens</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(guest.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          {guest.room && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Quarto {guest.room}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{formatPhone(guest.phone)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{guest.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{formatDocument(guest.document)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig[guest.status].color} text-white`}>
                        {statusConfig[guest.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <span className="font-semibold">{guest.totalStays}</span>
                        <p className="text-xs text-gray-500">hospedagens</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        R$ {guest.totalSpent.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {guest.lastVisit ? (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">
                            {new Date(guest.lastVisit).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewGuest(guest)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredGuests.length === 0 && (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum hóspede encontrado</h3>
              <p className="text-gray-500">Não encontramos hóspedes com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Hóspede</DialogTitle>
          </DialogHeader>
          {selectedGuest && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                    {getInitials(selectedGuest.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedGuest.name}</h3>
                  <Badge className={`${statusConfig[selectedGuest.status].color} text-white mt-1`}>
                    {statusConfig[selectedGuest.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Informações Pessoais</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedGuest.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{formatPhone(selectedGuest.phone)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{formatDocument(selectedGuest.document)}</span>
                    </div>
                    {selectedGuest.birthDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(selectedGuest.birthDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Estatísticas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total de Hospedagens:</span>
                      <span className="font-semibold">{selectedGuest.totalStays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Gasto:</span>
                      <span className="font-semibold text-green-600">
                        R$ {selectedGuest.totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cadastrado em:</span>
                      <span>{new Date(selectedGuest.registeredAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {selectedGuest.lastVisit && (
                      <div className="flex justify-between">
                        <span>Última Visita:</span>
                        <span>{new Date(selectedGuest.lastVisit).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedGuest.address && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Endereço</h4>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p>{selectedGuest.address}</p>
                      <p>{selectedGuest.city} - {selectedGuest.state}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedGuest.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Observações</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedGuest.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}