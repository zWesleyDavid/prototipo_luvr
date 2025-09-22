import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Label } from './ui/label';
import { Plus, Minus, Clock, User, Receipt, Calculator, Printer, Share, Trash2, Edit, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OrderItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Client {
  name: string;
  room: string;
  checkIn: string;
  checkOut: string;
  dailyRate: number;
  photo?: string;
}

interface ClientOrderProps {
  appState: any;
  updateAppState: (key: string, data: any) => void;
  onBack?: () => void;
}

const mockClient: Client = {
  name: 'João Silva',
  room: '102',
  checkIn: '19/08/2025 14:30',
  checkOut: '20/08/2025 12:00',
  dailyRate: 180
};

const mockItems: OrderItem[] = [
  { id: 1, name: 'Refrigerante Coca-Cola', category: 'Bebidas', quantity: 2, unitPrice: 8.50, total: 17.00 },
  { id: 2, name: 'Água Mineral', category: 'Bebidas', quantity: 1, unitPrice: 4.00, total: 4.00 },
  { id: 3, name: 'Cerveja Heineken', category: 'Bebidas', quantity: 4, unitPrice: 12.00, total: 48.00 },
  { id: 4, name: 'Sanduíche Natural', category: 'Lanches', quantity: 1, unitPrice: 25.00, total: 25.00 }
];

const availableProducts = [
  { name: 'Refrigerante Coca-Cola', category: 'Bebidas', price: 8.50 },
  { name: 'Água Mineral', category: 'Bebidas', price: 4.00 },
  { name: 'Cerveja Heineken', category: 'Bebidas', price: 12.00 },
  { name: 'Sanduíche Natural', category: 'Lanches', price: 25.00 },
  { name: 'Batata Frita', category: 'Lanches', price: 18.00 },
  { name: 'Hambúrguer', category: 'Lanches', price: 32.00 },
  { name: 'Suco de Laranja', category: 'Bebidas', price: 6.50 },
  { name: 'Chocolate', category: 'Doces', price: 15.00 }
];

const categoryColors = {
  'Bebidas': 'bg-blue-100 text-blue-800',
  'Lanches': 'bg-orange-100 text-orange-800',
  'Doces': 'bg-pink-100 text-pink-800',
  'Outros': 'bg-gray-100 text-gray-800'
};

export function ClientOrder({ appState, updateAppState, onBack }: ClientOrderProps) {
  const [client] = useState<Client>(mockClient);
  const [items, setItems] = useState<OrderItem[]>(mockItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isOrderFinalized, setIsOrderFinalized] = useState(false);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);

  const totalConsumption = items.reduce((sum, item) => sum + item.total, 0);
  const totalAmount = totalConsumption + client.dailyRate;

  const addItem = () => {
    const product = availableProducts.find(p => p.name === selectedProduct);
    if (!product) return;

    const existingItem = items.find(item => item.name === selectedProduct);
    
    if (existingItem) {
      setItems(items.map(item => 
        item.name === selectedProduct 
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        id: Date.now(),
        name: product.name,
        category: product.category,
        quantity,
        unitPrice: product.price,
        total: quantity * product.price
      };
      setItems([...items, newItem]);
    }

    setSelectedProduct('');
    setQuantity(1);
    setIsAddDialogOpen(false);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
        : item
    ));
  };

  const finalizeOrder = async () => {
    setIsFinalizingOrder(true);
    
    try {
      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar registro da comanda finalizada
      const finalizedOrder = {
        id: Date.now(),
        clientName: client.name,
        room: client.room,
        items: items,
        totalConsumption: totalConsumption,
        dailyRate: client.dailyRate,
        totalAmount: totalAmount,
        status: 'finalizada',
        finalizedAt: new Date().toLocaleString('pt-BR'),
        checkIn: client.checkIn,
        checkOut: client.checkOut
      };

      // Atualizar lista de comandas no appState
      const currentOrders = appState.orders || [];
      const updatedOrders = currentOrders.map((order: any) => 
        order.room === client.room && order.status === 'aberta' 
          ? { ...order, ...finalizedOrder }
          : order
      );

      // Se não encontrou uma comanda existente, adicionar nova
      if (!updatedOrders.find((order: any) => order.room === client.room && order.status === 'finalizada')) {
        updatedOrders.push(finalizedOrder);
      }

      updateAppState('orders', updatedOrders);
      
      setIsOrderFinalized(true);
      toast.success('Comanda finalizada com sucesso!', {
        description: `Total: R$ ${totalAmount.toFixed(2)} - Quarto ${client.room}`
      });

      // Voltar para lista de comandas após 2 segundos
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 2000);

    } catch (error) {
      toast.error('Erro ao finalizar comanda', {
        description: 'Tente novamente ou contate o suporte'
      });
    } finally {
      setIsFinalizingOrder(false);
    }
  };

  const printOrder = () => {
    toast.info('Imprimindo comanda...', {
      description: 'Funcionalidade de impressão em desenvolvimento'
    });
  };

  const shareOrder = () => {
    const orderSummary = `
Comanda - Quarto ${client.room}
Cliente: ${client.name}
------------------------------
${items.map(item => `${item.name} x${item.quantity} - R$ ${item.total.toFixed(2)}`).join('\n')}
------------------------------
Diária: R$ ${client.dailyRate.toFixed(2)}
Consumo: R$ ${totalConsumption.toFixed(2)}
Total: R$ ${totalAmount.toFixed(2)}
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: `Comanda - Quarto ${client.room}`,
        text: orderSummary
      });
    } else {
      navigator.clipboard.writeText(orderSummary).then(() => {
        toast.success('Comanda copiada para a área de transferência!');
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar às Comandas</span>
          </Button>
        </div>
      )}
      
      {/* Client Header Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <p className="text-purple-100 flex items-center">
                  <span className="mr-4">Quarto #{client.room}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  {client.checkIn}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <Badge className={`border-0 mb-2 ${isOrderFinalized ? 'bg-green-600 text-white' : 'bg-blue-500 text-white'}`}>
                {isOrderFinalized ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Comanda Finalizada
                  </>
                ) : (
                  'Comanda Aberta'
                )}
              </Badge>
              <p className="text-purple-100 text-sm">
                {isOrderFinalized ? 'Finalizada com sucesso' : `Previsão de saída: ${client.checkOut}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Itens Consumidos</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <Receipt className="h-8 w-8 text-blue-200" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Consumo</p>
              <p className="text-2xl font-bold">R$ {totalConsumption.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Geral</p>
              <p className="text-2xl font-bold">R$ {totalAmount.toFixed(2)}</p>
            </div>
            <Calculator className="h-8 w-8 text-purple-200" />
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-purple-600" />
              <span>Itens da Comanda</span>
            </CardTitle>
            
            <div className="flex space-x-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Item à Comanda</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Produto</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((product) => (
                            <SelectItem key={product.name} value={product.name}>
                              <div className="flex items-center justify-between w-full">
                                <span>{product.name}</span>
                                <span className="text-sm text-gray-500 ml-2">R$ {product.price.toFixed(2)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Quantidade</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button onClick={addItem} className="w-full bg-green-600 hover:bg-green-700" disabled={!selectedProduct}>
                      Adicionar à Comanda
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Produto</TableHead>
                    <TableHead className="font-semibold">Categoria</TableHead>
                    <TableHead className="text-center font-semibold">Quantidade</TableHead>
                    <TableHead className="text-right font-semibold">Valor Unit.</TableHead>
                    <TableHead className="text-right font-semibold">Total</TableHead>
                    <TableHead className="text-center font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge className={`${categoryColors[item.category] || categoryColors['Outros']} border-0`}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">R$ {item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold text-purple-600">
                        R$ {item.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum item na comanda</h3>
              <p className="text-gray-500 mb-6">Adicione itens consumidos pelo hóspede</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-gray-600" />
                <span>Resumo Financeiro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Valor da Diária:</span>
                  <span className="font-semibold">R$ {client.dailyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Total Consumo:</span>
                  <span className="font-semibold">R$ {totalConsumption.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 border-purple-200">
                  <span className="text-xl font-semibold text-gray-800">Total Geral:</span>
                  <span className="text-3xl font-bold text-purple-600">R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ações da Comanda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={printOrder}
                disabled={isOrderFinalized}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Comanda
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={shareOrder}
              >
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              
              {isOrderFinalized ? (
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6" 
                    disabled
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Comanda Finalizada
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Retornando à lista de comandas...
                  </p>
                </div>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
                      disabled={isFinalizingOrder || items.length === 0}
                    >
                      {isFinalizingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Finalizando...
                        </>
                      ) : (
                        <>
                          <Receipt className="h-5 w-5 mr-2" />
                          Finalizar Comanda
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Finalizar Comanda</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>Tem certeza que deseja finalizar esta comanda?</p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Cliente:</span>
                            <span>{client.name} - Quarto {client.room}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Itens:</span>
                            <span>{items.length} produto(s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Diária:</span>
                            <span>R$ {client.dailyRate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Consumo:</span>
                            <span>R$ {totalConsumption.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-purple-600 border-t pt-2">
                            <span>Total:</span>
                            <span>R$ {totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-amber-600">
                          ⚠️ Esta ação não pode ser desfeita. A comanda será marcada como finalizada.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={finalizeOrder}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Sim, Finalizar Comanda
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}