import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUpdatePassword } from '@/lib/authClient';
import { Button } from '@/components/ui/button';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase envia o token no hash da URL: #access_token=...&type=recovery
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type = params.get('type');

    if (token && type === 'recovery') {
      setAccessToken(token);
    } else {
      setError('Link inválido ou expirado. Solicite um novo email de recuperação.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setStatus('loading');
    try {
      await authUpdatePassword(accessToken, password);
      setStatus('success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8">
        <h1 className="heading-font text-2xl font-bold text-foreground mb-2">Redefinir senha</h1>
        <p className="text-muted-foreground text-sm mb-6">Digite e confirme sua nova senha.</p>

        {status === 'success' ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-medium text-lg">Senha alterada com sucesso!</p>
            <p className="text-muted-foreground text-sm mt-2">Redirecionando para o login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Mínimo 6 caracteres"
                disabled={!accessToken || status === 'loading'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirmar nova senha</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Repita a senha"
                disabled={!accessToken || status === 'loading'}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!accessToken || status === 'loading'}
            >
              {status === 'loading' ? 'Salvando...' : 'Salvar nova senha'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
