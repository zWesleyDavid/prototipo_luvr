import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import {
  Building,
  Eye,
  EyeOff,
  User,
  Lock,
  Shield,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LoginProps {
  onLogin: (user: any) => void;
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const mockUsers = [
  {
    id: "1",
    email: "admin@luvr.com",
    password: "admin123",
    name: "Administrador",
    role: "admin",
    avatar: "AD",
  },
  {
    id: "2",
    email: "gerente@luvr.com",
    password: "gerente123",
    name: "João Silva",
    role: "manager",
    avatar: "JS",
  },
  {
    id: "3",
    email: "funcionario@luvr.com",
    password: "func123",
    name: "Maria Santos",
    role: "employee",
    avatar: "MS",
  },
];

export function Login({ onLogin }: LoginProps) {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!form.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Verificar credenciais
    const user = mockUsers.find(
      (u) =>
        u.email === form.email && u.password === form.password,
    );

    if (user) {
      // Salvar dados de sessão
      const sessionData = {
        user,
        loginTime: new Date().toISOString(),
        rememberMe: form.rememberMe,
      };

      if (form.rememberMe) {
        localStorage.setItem(
          "luvrSession",
          JSON.stringify(sessionData),
        );
      } else {
        sessionStorage.setItem(
          "luvrSession",
          JSON.stringify(sessionData),
        );
      }

      toast.success(`Bem-vindo, ${user.name}!`);
      onLogin(user);
    } else {
      toast.error("E-mail ou senha incorretos");
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (
    userType: "admin" | "manager" | "employee",
  ) => {
    const user = mockUsers.find((u) => u.role === userType);
    if (user) {
      setForm({
        email: user.email,
        password: user.password,
        rememberMe: false,
      });
      toast.info(`Credenciais carregadas para ${user.role}`);
    }
  };

  const currentTime = new Date().toLocaleString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Building className="h-10 w-10 text-purple-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            LUVR GESTÃO
          </h1>
          <p className="text-purple-200">
            Sistema de Gestão Hoteleira
          </p>
          <p className="text-purple-300 text-sm mt-2">
            {currentTime}
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-2xl bg-white/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Acesso ao Sistema
              </h2>
              <p className="text-gray-600 mt-2">
                Entre com suas credenciais
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4 text-gray-500" />
                <span>E-mail</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className={`${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center space-x-2"
              >
                <Lock className="h-4 w-4 text-gray-500" />
                <span>Senha</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={form.rememberMe}
                onCheckedChange={(checked) =>
                  setForm({ ...form, rememberMe: !!checked })
                }
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-gray-600"
              >
                Lembrar-me neste dispositivo
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Entrar no Sistema</span>
                </div>
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Credenciais de Demonstração
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-100 text-red-700">
                  Admin
                </Badge>
                <span className="text-sm text-gray-600">
                  admin@luvr.com
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("admin")}
              >
                Usar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-700">
                  Gerente
                </Badge>
                <span className="text-sm text-gray-600">
                  gerente@luvr.com
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("manager")}
              >
                Usar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-700">
                  Funcionário
                </Badge>
                <span className="text-sm text-gray-600">
                  funcionario@luvr.com
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("employee")}
              >
                Usar
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-purple-200 text-sm">
          <p>
            © 2025 luvr. Todos os direitos reservados.
          </p>
          <p className="mt-1">
            v2.0 - Sistema de Gestão Hoteleira
          </p>
        </div>
      </div>
    </div>
  );
}