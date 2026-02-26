import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Building2, Lock } from 'lucide-react';

export default function Login() {
  const { users, setCurrentUser } = useCRM();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setError('');
    } else {
      setError('User not found. Please use a valid email.');
    }
  };

  const quickLogin = (role: 'admin' | 'manager' | 'employee') => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">CRM System</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  defaultValue="demo"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Quick Login Demo</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => quickLogin('admin')}
              >
                Login as Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => quickLogin('manager')}
              >
                Login as Manager
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => quickLogin('employee')}
              >
                Login as Employee
              </Button>
            </div>
          </div>

          <div className="mt-6 text-xs text-center text-gray-500 space-y-1">
            <p>Demo Accounts:</p>
            <p>admin@crm.com | john@crm.com | sarah@crm.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
