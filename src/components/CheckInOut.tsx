import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  UserCheck, 
  LogIn, 
  LogOut, 
  Clock, 
  CreditCard, 
  Car, 
  Users, 
  Receipt, 
  Printer, 
  MessageSquare, 
  Mail,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Search
} from 'lucide-react';

interface Room {
  id: number;
  number: string;
  status: 'livre' | 'ocupado' | 'limpeza' | 'manutencao';
  type: 'simples' | 'luxo' | 'master';
  dailyRate: number;
  guest?: string;
}

interface Companion {
  id: number;
  name: string;
  document: string;
}

interface CheckInData {
  roomId: string;
  guestName: string;
  document: string;
  phone: string;
  companions: Companion[];
  vehicle: string;
  plate: string;
  checkInTime: string;
  checkOutTime: string;
  lateCheckout: boolean;
  paymentMethod: string;
  deposit: string;
  discount: string;
  observations: string;
}

interface CheckOutData {
  roomId: string;
  guestName: string;
  checkInTime: string;
  checkOutTime: string;
  totalTime: string;
  dailyRate: number;
  consumption: number;
  extraFees: number;
  discount: number;
  totalAmount: number;
}

interface CheckInOutProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
}

const mockRooms: Room[] = [
  { id: 1, number: '101', status: 'livre', type: 'simples', dailyRate: 120 },
  { id: 2, number: '102', status: 'ocupado', type: 'simples', dailyRate: 120, guest: 'João Silva' },
  { id: 3, number: '103', status: 'limpeza', type: 'luxo', dailyRate: 180 },
  { id: 4, number: '104', status: 'manutencao', type: 'luxo', dailyRate: 180 },
  { id: 5, number: '201', status: 'livre', type: 'master', dailyRate: 250 },
  { id: 6, number: '202', status: 'ocupado', type: 'master', dailyRate: 250, guest: 'Maria Santos' },
];

const statusConfig = {
  livre: { color: 'bg-green-500', text: 'text-green-700', bgLight: 'bg-green-50', label: 'Livre' },
  ocupado: { color: 'bg-red-500', text: 'text-red-700', bgLight: 'bg-red-50', label: 'Ocupado' },
  limpeza: { color: 'bg-yellow-500', text: 'text-yellow-700', bgLight: 'bg-yellow-50', label: 'Limpeza' },
  manutencao: { color: 'bg-gray-500', text: 'text-gray-700', bgLight: 'bg-gray-50', label: 'Manutenção' }
};

const typeLabels = {
  simples: 'Simples',
  luxo: 'Luxo',
  master: 'Master'
};

export function CheckInOut({ appState, updateAppState }: CheckInOutProps) {
  const [rooms] = useState<Room[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckOutData | null>(null);
  
  // Check-in form state
  const [checkInData, setCheckInData] = useState<CheckInData>({
    roomId: '',
    guestName: '',
    document: '',
    phone: '',
    companions: [],
    vehicle: '',
    plate: '',
    checkInTime: new Date().toISOString().slice(0, 16),
    checkOutTime: '',
    lateCheckout: false,
    paymentMethod: '',
    deposit: '',
    discount: '',
    observations: ''
  });

  // Check-out form state
  const [selectedCheckoutRoom, setSelectedCheckoutRoom] = useState<string>('');

  const availableRooms = rooms.filter(room => room.status === 'livre');
  const occupiedRooms = rooms.filter(room => room.status === 'ocupado');
  
  const filteredOccupiedRooms = occupiedRooms.filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addCompanion = () => {
    const newCompanion: Companion = {
      id: Date.now(),
      name: '',
      document: ''
    };
    setCheckInData(prev => ({
      ...prev,
      companions: [...prev.companions, newCompanion]
    }));
  };

  const removeCompanion = (id: number) => {
    setCheckInData(prev => ({
      ...prev,
      companions: prev.companions.filter(c => c.id !== id)
    }));
  };

  const updateCompanion = (id: number, field: 'name' | 'document', value: string) => {
    setCheckInData(prev => ({
      ...prev,
      companions: prev.companions.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const selectedRoom = rooms.find(room => room.id.toString() === checkInData.roomId);

  const handleCheckIn = () => {
    // Validation
    if (!checkInData.roomId || !checkInData.guestName || !checkInData.document) {
      return;
    }
    
    // Simulate check-in process
    console.log('Check-in data:', checkInData);
    
    // Reset form
    setCheckInData({
      roomId: '',
      guestName: '',
      document: '',
      phone: '',
      companions: [],
      vehicle: '',
      plate: '',
      checkInTime: new Date().toISOString().slice(0, 16),
      checkOutTime: '',
      lateCheckout: false,
      paymentMethod: '',
      deposit: '',
      discount: '',
      observations: ''
    });
  };

  const handleCheckOut = () => {
    const room = occupiedRooms.find(r => r.id.toString() === selectedCheckoutRoom);
    if (!room) return;

    const mockCheckoutData: CheckOutData = {
      roomId: room.number,
      guestName: room.guest || '',
      checkInTime: '19/08/2025 14:30',
      checkOutTime: new Date().toLocaleString('pt-BR'),
      totalTime: '21h 30min',
      dailyRate: room.dailyRate,
      consumption: 94.00,
      extraFees: 0,
      discount: 0,
      totalAmount: room.dailyRate + 94.00
    };

    setCheckoutData(mockCheckoutData);
    setIsConfirmDialogOpen(true);
  };

  const confirmCheckOut = () => {
    console.log('Check-out confirmed:', checkoutData);
    setIsConfirmDialogOpen(false);
    setCheckoutData(null);
    setSelectedCheckoutRoom('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl">Check-in e Check-out</h2>
          <p className="text-gray-600 mt-1">Gerencie entradas e saídas de hóspedes</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="checkin" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="checkin" className="flex items-center space-x-2">
            <LogIn className="h-4 w-4" />
            <span>Check-in</span>
          </TabsTrigger>
          <TabsTrigger value="checkout" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Check-out</span>
          </TabsTrigger>
        </TabsList>

        {/* Check-in Tab */}
        <TabsContent value="checkin" className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span>Formulário de Check-in</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Room Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Quarto *</Label>
                  <Select value={checkInData.roomId} onValueChange={(value) => setCheckInData(prev => ({ ...prev, roomId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um quarto" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <span>#{room.number}</span>
                            <Badge className={`${statusConfig[room.status].color} text-white text-xs`}>
                              {statusConfig[room.status].label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Suíte</Label>
                  <Input 
                    value={selectedRoom ? typeLabels[selectedRoom.type] : ''} 
                    disabled 
                    placeholder="Automático"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tarifa Diária</Label>
                  <Input 
                    value={selectedRoom ? `R$ ${selectedRoom.dailyRate}` : ''} 
                    disabled 
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              {/* Guest Information */}
              <Separator />
              <div className="space-y-4">
                <h4 className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Dados do Hóspede</span>
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input 
                      value={checkInData.guestName}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, guestName: e.target.value }))}
                      placeholder="Nome do hóspede"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Documento/RG *</Label>
                    <Input 
                      value={checkInData.document}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, document: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone/WhatsApp</Label>
                    <Input 
                      value={checkInData.phone}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Companions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Acompanhantes</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addCompanion}
                      className="flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar</span>
                    </Button>
                  </div>
                  
                  {checkInData.companions.map((companion) => (
                    <div key={companion.id} className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <Input 
                        placeholder="Nome do acompanhante"
                        value={companion.name}
                        onChange={(e) => updateCompanion(companion.id, 'name', e.target.value)}
                      />
                      <Input 
                        placeholder="Documento"
                        value={companion.document}
                        onChange={(e) => updateCompanion(companion.id, 'document', e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeCompanion(companion.id)}
                        className="flex items-center space-x-1 text-red-600"
                      >
                        <Minus className="h-4 w-4" />
                        <span>Remover</span>
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Vehicle */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-1">
                      <Car className="h-4 w-4" />
                      <span>Veículo</span>
                    </Label>
                    <Input 
                      value={checkInData.vehicle}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, vehicle: e.target.value }))}
                      placeholder="Modelo do veículo (opcional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Placa</Label>
                    <Input 
                      value={checkInData.plate}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, plate: e.target.value }))}
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>
              </div>

              {/* Dates and Times */}
              <Separator />
              <div className="space-y-4">
                <h4 className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Horários</span>
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Horário de Entrada</Label>
                    <Input 
                      type="datetime-local"
                      value={checkInData.checkInTime}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, checkInTime: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Previsão de Saída</Label>
                    <Input 
                      type="datetime-local"
                      value={checkInData.checkOutTime}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Late Check-out</Label>
                    <div className="flex items-center space-x-2 h-10">
                      <Switch 
                        checked={checkInData.lateCheckout}
                        onCheckedChange={(checked) => setCheckInData(prev => ({ ...prev, lateCheckout: checked }))}
                      />
                      <span className="text-sm text-gray-600">Permitir saída tardia</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <Separator />
              <div className="space-y-4">
                <h4 className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Pagamento</span>
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                    <Select value={checkInData.paymentMethod} onValueChange={(value) => setCheckInData(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sinal/Depósito</Label>
                    <Input 
                      value={checkInData.deposit}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, deposit: e.target.value }))}
                      placeholder="R$ 0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Desconto/Cupom</Label>
                    <Input 
                      value={checkInData.discount}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, discount: e.target.value }))}
                      placeholder="Código ou valor"
                    />
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div className="space-y-2">
                <Label>Observações Internas</Label>
                <Textarea 
                  value={checkInData.observations}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Observações sobre o hóspede ou estadia..."
                  rows={3}
                />
              </div>

              {/* Validation Alert */}
              {(!checkInData.roomId || !checkInData.guestName || !checkInData.document) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Preencha os campos obrigatórios: Quarto, Nome e Documento.
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={handleCheckIn}
                  disabled={!checkInData.roomId || !checkInData.guestName || !checkInData.document}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Check-in
                </Button>
                <Button variant="outline" className="flex-1">
                  Salvar Rascunho
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check-out Tab */}
        <TabsContent value="checkout" className="space-y-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LogOut className="h-5 w-5 text-red-600" />
                <span>Check-out de Hóspede</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Selection */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por quarto ou nome do hóspede..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Selecionar Quarto/Hóspede</Label>
                  <Select value={selectedCheckoutRoom} onValueChange={setSelectedCheckoutRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o quarto para check-out" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredOccupiedRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <span>#{room.number}</span>
                            <span>-</span>
                            <span>{room.guest}</span>
                            <Badge className={`${statusConfig[room.status].color} text-white text-xs`}>
                              {statusConfig[room.status].label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedCheckoutRoom && (
                <>
                  {/* Current Stay Info */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-blue-600">Check-in</Label>
                          <p>19/08/2025 14:30</p>
                        </div>
                        <div>
                          <Label className="text-blue-600">Check-out Previsto</Label>
                          <p>20/08/2025 12:00</p>
                        </div>
                        <div>
                          <Label className="text-blue-600">Tempo Total</Label>
                          <p>21h 30min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Summary */}
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5 text-green-600" />
                        <span>Resumo Financeiro</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex justify-between items-center">
                          <span>Diárias/Períodos:</span>
                          <span>R$ 180,00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Consumos:</span>
                          <span>R$ 94,00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Taxas Extras:</span>
                          <span>R$ 0,00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Descontos:</span>
                          <span className="text-green-600">- R$ 0,00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-xl">
                          <span>Total a Pagar:</span>
                          <span className="text-blue-600">R$ 274,00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Printer className="h-4 w-4" />
                      <span>Gerar Recibo</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Enviar WhatsApp</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Enviar E-mail</span>
                    </Button>
                    <Button 
                      onClick={handleCheckOut}
                      className="bg-red-600 hover:bg-red-700 flex items-center space-x-2 flex-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Finalizar Check-out</span>
                    </Button>
                  </div>
                </>
              )}

              {occupiedRooms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum quarto ocupado no momento.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Check-out</DialogTitle>
          </DialogHeader>
          {checkoutData && (
            <div className="space-y-4">
              <div className="text-center">
                <p><strong>Quarto:</strong> #{checkoutData.roomId}</p>
                <p><strong>Hóspede:</strong> {checkoutData.guestName}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Diárias:</span>
                  <span>R$ {checkoutData.dailyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Consumos:</span>
                  <span>R$ {checkoutData.consumption.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="text-lg text-blue-600">R$ {checkoutData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={confirmCheckOut} className="bg-red-600 hover:bg-red-700 flex-1">
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}