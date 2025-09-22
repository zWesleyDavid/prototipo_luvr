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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Shield,
  User,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: 'admin' | 'manager' | 'employee';
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  birthDate: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  permissions: string[];
  isActive: boolean;
  avatar?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserRegistrationProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
}

const roles = [
  { value: 'admin', label: 'Administrador', color: 'bg-red-100 text-red-700' },
  { value: 'manager', label: 'Gerente', color: 'bg-blue-100 text-blue-700' },
  { value: 'employee', label: 'Funcionário', color: 'bg-green-100 text-green-700' }
];

const positions = [
  'Recepcionista',
  'Camareira',
  'Segurança',
  'Supervisora',
  'Manutenção',
  'Gerente',
  'Administrador',
  'Contador',
  'Assistente Administrativo'
];

const departments = [
  'Administração',
  'Recepção',
  'Limpeza',
  'Segurança',
  'Manutenção',
  'Financeiro',
  'Recursos Humanos'
];

const availablePermissions = [
  { id: 'rooms_view', label: 'Visualizar Quartos' },
  { id: 'rooms_manage', label: 'Gerenciar Quartos' },
  { id: 'checkin_out', label: 'Check-in/Check-out' },
  { id: 'orders_view', label: 'Visualizar Comandas' },
  { id: 'orders_manage', label: 'Gerenciar Comandas' },
  { id: 'guests_view', label: 'Visualizar Hóspedes' },
  { id: 'guests_manage', label: 'Gerenciar Hóspedes' },
  { id: 'reports_view', label: 'Visualizar Relatórios' },
  { id: 'reports_generate', label: 'Gerar Relatórios' },
  { id: 'users_manage', label: 'Gerenciar Usuários' },
  { id: 'system_config', label: 'Configurações do Sistema' }
];

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function UserRegistration({ appState, updateAppState }: UserRegistrationProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    role: 'employee' as User['role'],
    position: '',
    department: '',
    salary: '',
    hireDate: '',
    birthDate: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    permissions: [] as string[],
    isActive: true,
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  // Load users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('motelUsers');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error loading users:', error);
      }
    } else {
      // Initialize with sample data
      const sampleUsers: User[] = [
        {
          id: '1',
          name: 'Administrador Sistema',
          email: 'admin@motel.com',
          phone: '(11) 99999-0001',
          cpf: '111.111.111-11',
          role: 'admin',
          position: 'Administrador',
          department: 'Administração',
          salary: 8000,
          hireDate: '2023-01-01',
          birthDate: '1985-06-15',
          address: {
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
          },
          permissions: availablePermissions.map(p => p.id),
          isActive: true,
          emergencyContact: {
            name: 'João Silva',
            phone: '(11) 98888-7777',
            relationship: 'Irmão'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'João Silva',
          email: 'joao@motel.com',
          phone: '(11) 99999-1111',
          cpf: '222.222.222-22',
          role: 'manager',
          position: 'Gerente',
          department: 'Administração',
          salary: 5000,
          hireDate: '2023-03-15',
          birthDate: '1990-03-20',
          address: {
            street: 'Av. Paulista',
            number: '456',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01311-100'
          },
          permissions: ['rooms_view', 'rooms_manage', 'checkin_out', 'orders_view', 'orders_manage', 'guests_view', 'guests_manage', 'reports_view'],
          isActive: true,
          emergencyContact: {
            name: 'Maria Silva',
            phone: '(11) 97777-6666',
            relationship: 'Esposa'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setUsers(sampleUsers);
    }
  }, []);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem('motelUsers', JSON.stringify(users));
    if (updateAppState) {
      updateAppState('users', users);
    }
  }, [users, updateAppState]);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      role: 'employee',
      position: '',
      department: '',
      salary: '',
      hireDate: '',
      birthDate: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      permissions: [],
      isActive: true,
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    });
    setEditingUser(null);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!form.name || !form.email || !form.phone || !form.cpf || !form.position || !form.department || !form.salary || !form.hireDate) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error('E-mail inválido');
      return;
    }

    if (!validateCPF(form.cpf)) {
      toast.error('CPF inválido');
      return;
    }

    // Check if email already exists (only for new users)
    if (!editingUser && users.some(user => user.email === form.email)) {
      toast.error('Já existe um usuário com este e-mail');
      return;
    }

    // Check if CPF already exists (only for new users)
    if (!editingUser && users.some(user => user.cpf === form.cpf)) {
      toast.error('Já existe um usuário com este CPF');
      return;
    }

    const userData: User = {
      id: editingUser?.id || Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      cpf: form.cpf,
      role: form.role,
      position: form.position,
      department: form.department,
      salary: parseFloat(form.salary),
      hireDate: form.hireDate,
      birthDate: form.birthDate,
      address: form.address,
      permissions: form.permissions,
      isActive: form.isActive,
      emergencyContact: form.emergencyContact,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? userData : user
      ));
      toast.success('Usuário atualizado com sucesso!');
    } else {
      setUsers(prev => [...prev, userData]);
      toast.success('Usuário cadastrado com sucesso!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      cpf: user.cpf,
      role: user.role,
      position: user.position,
      department: user.department,
      salary: user.salary.toString(),
      hireDate: user.hireDate,
      birthDate: user.birthDate,
      address: user.address,
      permissions: user.permissions,
      isActive: user.isActive,
      emergencyContact: user.emergencyContact
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('Usuário excluído com sucesso!');
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setForm(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setForm(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => id !== permissionId)
      }));
    }
  };

  const getRoleBadge = (role: User['role']) => {
    const roleData = roles.find(r => r.value === role);
    if (!roleData) return null;

    return (
      <Badge className={roleData.color}>
        {roleData.label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const activeUsers = users.filter(user => user.isActive);
  const totalSalaries = users.reduce((sum, user) => sum + user.salary, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departamentos</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(users.map(u => u.department)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Folha de Pagamento</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalSalaries.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-gray-600" />
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
                placeholder="Buscar por nome, email ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Label>Filtros:</Label>
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Funções</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
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
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Informações Pessoais</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          placeholder="João Silva Santos"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="joao@motel.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                          maxLength={15}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          placeholder="123.456.789-00"
                          value={form.cpf}
                          onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                          maxLength={14}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={form.birthDate}
                          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Informações Profissionais</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Função *</Label>
                        <Select value={form.role} onValueChange={(value: User['role']) => setForm({ ...form, role: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map(role => (
                              <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Cargo *</Label>
                        <Select value={form.position} onValueChange={(value) => setForm({ ...form, position: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            {positions.map(position => (
                              <SelectItem key={position} value={position}>{position}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Departamento *</Label>
                        <Select value={form.department} onValueChange={(value) => setForm({ ...form, department: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salary">Salário (R$) *</Label>
                        <Input
                          id="salary"
                          type="number"
                          step="0.01"
                          placeholder="3000.00"
                          value={form.salary}
                          onChange={(e) => setForm({ ...form, salary: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hireDate">Data de Contratação *</Label>
                        <Input
                          id="hireDate"
                          type="date"
                          value={form.hireDate}
                          onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Endereço</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          placeholder="12345-678"
                          value={form.address.zipCode}
                          onChange={(e) => setForm({ 
                            ...form, 
                            address: { ...form.address, zipCode: formatZipCode(e.target.value) }
                          })}
                          maxLength={9}
                        />
                      </div>

                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          placeholder="Rua das Flores"
                          value={form.address.street}
                          onChange={(e) => setForm({ 
                            ...form, 
                            address: { ...form.address, street: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          placeholder="123"
                          value={form.address.number}
                          onChange={(e) => setForm({ 
                            ...form, 
                            address: { ...form.address, number: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          placeholder="Apto 45"
                          value={form.address.complement}
                          onChange={(e) => setForm({ 
                            ...form, 
                            address: { ...form.address, complement: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          placeholder="Centro"
                          value={form.address.neighborhood}
                          onChange={(e) => setForm({ 
                            ...form, 
                            address: { ...form.address, neighborhood: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          placeholder="São Paulo"
                          value={form.address.city}
                          onChange={(e) => setForm({ 
                            ...form, 
                            address: { ...form.address, city: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Select 
                          value={form.address.state} 
                          onValueChange={(value) => setForm({ 
                            ...form, 
                            address: { ...form.address, state: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            {brazilianStates.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Contato de Emergência</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName">Nome</Label>
                        <Input
                          id="emergencyName"
                          placeholder="Maria Silva"
                          value={form.emergencyContact.name}
                          onChange={(e) => setForm({ 
                            ...form, 
                            emergencyContact: { ...form.emergencyContact, name: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Telefone</Label>
                        <Input
                          id="emergencyPhone"
                          placeholder="(11) 98888-7777"
                          value={form.emergencyContact.phone}
                          onChange={(e) => setForm({ 
                            ...form, 
                            emergencyContact: { ...form.emergencyContact, phone: formatPhone(e.target.value) }
                          })}
                          maxLength={15}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyRelationship">Parentesco</Label>
                        <Input
                          id="emergencyRelationship"
                          placeholder="Esposa"
                          value={form.emergencyContact.relationship}
                          onChange={(e) => setForm({ 
                            ...form, 
                            emergencyContact: { ...form.emergencyContact, relationship: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Permissões do Sistema</h3>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                      {availablePermissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={form.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                          />
                          <Label htmlFor={permission.id} className="cursor-pointer text-sm">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={form.isActive}
                      onCheckedChange={(checked) => setForm({ ...form, isActive: !!checked })}
                    />
                    <Label htmlFor="isActive">Usuário ativo</Label>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      {editingUser ? 'Atualizar' : 'Cadastrar'}
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

      {/* Users Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Usuários Cadastrados</h3>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterRole !== 'all' || filterDepartment !== 'all' ? 
                  'Nenhum usuário encontrado com os filtros aplicados.' :
                  'Comece cadastrando um novo usuário.'
                }
              </p>
              {(searchTerm || filterRole !== 'all' || filterDepartment !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('all');
                    setFilterDepartment('all');
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
                    <TableHead>Usuário</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Salário</TableHead>
                    <TableHead>Contratação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-purple-100 text-purple-700">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.position}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>R$ {user.salary.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        {new Date(user.hireDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge className={user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(user.id)}
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