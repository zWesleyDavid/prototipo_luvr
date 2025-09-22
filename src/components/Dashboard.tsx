import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Building, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Activity
} from 'lucide-react';

interface DashboardProps {
  appState: any;
}

export function Dashboard({ appState }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app would come from appState
  const stats = {
    totalRooms: 20,
    occupiedRooms: 12,
    availableRooms: 5,
    cleaningRooms: 2,
    maintenanceRooms: 1,
    todayCheckIns: 6,
    todayCheckOuts: 4,
    todayRevenue: 2400,
    monthRevenue: 45600,
    occupancyRate: 60,
    averageStay: 18.5
  };

  const recentActivities = [
    { id: 1, type: 'checkin', message: 'Check-in realizado - Quarto 102', time: '14:30', status: 'success' },
    { id: 2, type: 'checkout', message: 'Check-out finalizado - Quarto 201', time: '12:15', status: 'success' },
    { id: 3, type: 'cleaning', message: 'Limpeza concluída - Quarto 105', time: '11:45', status: 'info' },
    { id: 4, type: 'maintenance', message: 'Manutenção solicitada - Quarto 304', time: '10:20', status: 'warning' },
    { id: 5, type: 'order', message: 'Nova comanda - Quarto 202', time: '09:55', status: 'info' }
  ];

  const upcomingCheckouts = [
    { room: '102', guest: 'João Silva', time: '12:00', status: 'pending' },
    { room: '201', guest: 'Maria Santos', time: '14:30', status: 'late' },
    { room: '105', guest: 'Carlos Lima', time: '16:00', status: 'pending' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h2>
            <p className="text-purple-100">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })} • {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-sm">Taxa de Ocupação</p>
            <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Quartos Ocupados</p>
                <p className="text-3xl font-bold">{stats.occupiedRooms}/{stats.totalRooms}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {stats.availableRooms} disponíveis
                </p>
              </div>
              <Building className="h-12 w-12 text-blue-200" />
            </div>
            <div className="mt-4">
              <Progress 
                value={(stats.occupiedRooms / stats.totalRooms) * 100} 
                className="bg-blue-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Check-ins Hoje</p>
                <p className="text-3xl font-bold">{stats.todayCheckIns}</p>
                <p className="text-green-100 text-xs mt-1">
                  {stats.todayCheckOuts} check-outs
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-green-200" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-200 mr-1" />
              <span className="text-green-100 text-sm">+15% vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Receita Hoje</p>
                <p className="text-3xl font-bold">R$ {stats.todayRevenue.toLocaleString()}</p>
                <p className="text-orange-100 text-xs mt-1">
                  Meta: R$ 3.000
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
            <div className="mt-4">
              <Progress 
                value={(stats.todayRevenue / 3000) * 100} 
                className="bg-orange-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Tempo Médio</p>
                <p className="text-3xl font-bold">{stats.averageStay}h</p>
                <p className="text-purple-100 text-xs mt-1">
                  Por hospedagem
                </p>
              </div>
              <Clock className="h-12 w-12 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center">
              <Activity className="h-4 w-4 text-purple-200 mr-1" />
              <span className="text-purple-100 text-sm">Estável</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-600" />
              <span>Status dos Quartos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Ocupados</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">{stats.occupiedRooms}</span>
                <Badge className="bg-green-500 text-white">60%</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Disponíveis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">{stats.availableRooms}</span>
                <Badge className="bg-blue-500 text-white">25%</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Limpeza</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-yellow-600">{stats.cleaningRooms}</span>
                <Badge className="bg-yellow-500 text-white">10%</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="font-medium">Manutenção</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-600">{stats.maintenanceRooms}</span>
                <Badge className="bg-gray-500 text-white">5%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Checkouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Check-outs Previstos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingCheckouts.map((checkout) => (
              <div key={checkout.room} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">{checkout.room}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{checkout.guest}</p>
                    <p className="text-sm text-gray-500">Previsto: {checkout.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {checkout.status === 'late' ? (
                    <Badge className="bg-red-500 text-white">Atrasado</Badge>
                  ) : (
                    <Badge variant="outline">Pendente</Badge>
                  )}
                  <Button size="sm" variant="outline">
                    Ação
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Check-outs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span>Atividades Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <p className="text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Ver
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" className="w-full">
              Ver Todas as Atividades
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700">
              <UserCheck className="h-6 w-6" />
              <span className="text-sm">Novo Check-in</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Building className="h-6 w-6" />
              <span className="text-sm">Ver Quartos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Hóspedes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}