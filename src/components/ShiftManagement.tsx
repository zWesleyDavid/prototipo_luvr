import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Clock, 
  Users, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter,
  Download,
  Clock3
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Shift {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isActive: boolean;
}

interface ShiftManagementProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'João Silva',
    position: 'Recepcionista',
    email: 'joao@motel.com',
    phone: '(11) 99999-1111',
    isActive: true
  },
  {
    id: '2',
    name: 'Maria Santos',
    position: 'Camareira',
    email: 'maria@motel.com',
    phone: '(11) 99999-2222',
    isActive: true
  },
  {
    id: '3',
    name: 'Pedro Costa',
    position: 'Segurança',
    email: 'pedro@motel.com',
    phone: '(11) 99999-3333',
    isActive: true
  },
  {
    id: '4',
    name: 'Ana Lima',
    position: 'Supervisora',
    email: 'ana@motel.com',
    phone: '(11) 99999-4444',
    isActive: true
  }
];

export function ShiftManagement({ appState, updateAppState }: ShiftManagementProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees] = useState<Employee[]>(mockEmployees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [form, setForm] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    position: '',
    notes: ''
  });

  // Load shifts from localStorage
  useEffect(() => {
    const savedShifts = localStorage.getItem('motelShifts');
    if (savedShifts) {
      try {
        setShifts(JSON.parse(savedShifts));
      } catch (error) {
        console.error('Error loading shifts:', error);
      }
    } else {
      // Initialize with some sample data
      const sampleShifts: Shift[] = [
        {
          id: '1',
          employeeName: 'João Silva',
          employeeId: '1',
          date: new Date().toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '16:00',
          position: 'Recepcionista',
          status: 'active',
          notes: 'Turno regular',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          employeeName: 'Maria Santos',
          employeeId: '2',
          date: new Date().toISOString().split('T')[0],
          startTime: '16:00',
          endTime: '00:00',
          position: 'Camareira',
          status: 'scheduled',
          notes: 'Limpeza geral',
          createdAt: new Date().toISOString()
        }
      ];
      setShifts(sampleShifts);
    }
  }, []);

  // Save shifts to localStorage
  useEffect(() => {
    localStorage.setItem('motelShifts', JSON.stringify(shifts));
  }, [shifts]);

  const resetForm = () => {
    setForm({
      employeeId: '',
      date: '',
      startTime: '',
      endTime: '',
      position: '',
      notes: ''
    });
    setEditingShift(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.employeeId || !form.date || !form.startTime || !form.endTime || !form.position) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const employee = employees.find(emp => emp.id === form.employeeId);
    if (!employee) {
      toast.error('Funcionário não encontrado');
      return;
    }

    const shiftData: Shift = {
      id: editingShift?.id || Date.now().toString(),
      employeeName: employee.name,
      employeeId: form.employeeId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      position: form.position,
      status: editingShift?.status || 'scheduled',
      notes: form.notes,
      createdAt: editingShift?.createdAt || new Date().toISOString()
    };

    if (editingShift) {
      setShifts(prev => prev.map(shift => 
        shift.id === editingShift.id ? shiftData : shift
      ));
      toast.success('Turno atualizado com sucesso!');
    } else {
      setShifts(prev => [...prev, shiftData]);
      toast.success('Turno agendado com sucesso!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setForm({
      employeeId: shift.employeeId,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      position: shift.position,
      notes: shift.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este turno?')) {
      setShifts(prev => prev.filter(shift => shift.id !== id));
      toast.success('Turno excluído com sucesso!');
    }
  };

  const handleStatusChange = (id: string, status: Shift['status']) => {
    setShifts(prev => prev.map(shift => 
      shift.id === id ? { ...shift, status } : shift
    ));
    
    const statusMessages = {
      scheduled: 'Turno agendado',
      active: 'Turno iniciado',
      completed: 'Turno finalizado',
      cancelled: 'Turno cancelado'
    };
    
    toast.success(statusMessages[status]);
  };

  const getStatusBadge = (status: Shift['status']) => {
    const variants = {
      scheduled: { className: 'bg-blue-100 text-blue-700', icon: Clock },
      active: { className: 'bg-green-100 text-green-700', icon: CheckCircle },
      completed: { className: 'bg-gray-100 text-gray-700', icon: CheckCircle },
      cancelled: { className: 'bg-red-100 text-red-700', icon: XCircle }
    };

    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <Badge className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status === 'scheduled' && 'Agendado'}
        {status === 'active' && 'Ativo'}
        {status === 'completed' && 'Concluído'}
        {status === 'cancelled' && 'Cancelado'}
      </Badge>
    );
  };

  const filteredShifts = shifts.filter(shift => {
    const statusMatch = filterStatus === 'all' || shift.status === filterStatus;
    const dateMatch = !filterDate || shift.date === filterDate;
    return statusMatch && dateMatch;
  });

  const todayShifts = shifts.filter(shift => 
    shift.date === new Date().toISOString().split('T')[0]
  );

  const activeShifts = shifts.filter(shift => shift.status === 'active');

  const positions = ['Recepcionista', 'Camareira', 'Segurança', 'Supervisora', 'Manutenção', 'Gerente'];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Turnos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{todayShifts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Turnos Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeShifts.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Funcionários</p>
              <p className="text-2xl font-bold text-purple-600">{employees.filter(e => e.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Turnos</p>
              <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Label>Filtros:</Label>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Data"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-40"
            />
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
                  Novo Turno
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingShift ? 'Editar Turno' : 'Agendar Novo Turno'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Funcionário *</Label>
                    <Select value={form.employeeId} onValueChange={(value) => setForm({ ...form, employeeId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter(emp => emp.isActive).map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Hora Início *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={form.startTime}
                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Hora Fim *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={form.endTime}
                        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Função *</Label>
                    <Select value={form.position} onValueChange={(value) => setForm({ ...form, position: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(position => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Input
                      id="notes"
                      placeholder="Observações do turno"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      {editingShift ? 'Atualizar' : 'Agendar'}
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

      {/* Shifts Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Turnos Agendados</h3>
          
          {filteredShifts.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum turno encontrado</h3>
              <p className="text-gray-500 mb-4">
                {filterStatus !== 'all' || filterDate ? 
                  'Nenhum turno encontrado com os filtros aplicados.' :
                  'Comece agendando um novo turno.'
                }
              </p>
              {(filterStatus !== 'all' || filterDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterDate('');
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
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">
                        {shift.employeeName}
                      </TableCell>
                      <TableCell>
                        {new Date(shift.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {shift.startTime} - {shift.endTime}
                      </TableCell>
                      <TableCell>{shift.position}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {getStatusBadge(shift.status)}
                          {shift.status === 'scheduled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(shift.id, 'active')}
                              className="h-6 px-2 text-xs"
                            >
                              Iniciar
                            </Button>
                          )}
                          {shift.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(shift.id, 'completed')}
                              className="h-6 px-2 text-xs"
                            >
                              Finalizar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {shift.notes || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(shift)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(shift.id)}
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