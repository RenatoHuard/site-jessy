import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getAuthToken, dbUpdate } from '@/lib/dbClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function MembersProfile() {
  const { currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: currentUser?.nome || '',
    descricao: currentUser?.descricao || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.foto_perfil_url || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let foto_perfil_url = currentUser?.foto_perfil_url || null;

      // Upload da foto via Supabase Storage
      if (selectedFile) {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const token = await getAuthToken();
        const ext = selectedFile.name.split('.').pop();
        const path = `profiles/${currentUser.id}-${Date.now()}.${ext}`;
        const uploadRes = await window.fetch(
          `${SUPABASE_URL}/storage/v1/object/images/${path}`,
          {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${token}`,
              'Content-Type': selectedFile.type,
              'x-upsert': 'true',
            },
            body: selectedFile,
          }
        );
        if (!uploadRes.ok) {
          const errBody = await uploadRes.json().catch(() => ({}));
          throw new Error(`Upload falhou (${uploadRes.status}): ${errBody.message || 'token expirado — faça logout e login novamente'}`);
        }
        foto_perfil_url = `${SUPABASE_URL}/storage/v1/object/public/images/${path}`;
      }

      // Atualiza a tabela profiles no Supabase
      await dbUpdate('profiles', currentUser.id, {
        nome: formData.nome,
        descricao: formData.descricao,
        foto_perfil_url,
      });

      // Atualiza o contexto com os dados novos
      await refreshProfile();

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Erro ao atualizar perfil. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <Helmet>
        <title>{`Meu Perfil | Área de Membros`}</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/members/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Dashboard
        </Button>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  {previewUrl && <AvatarImage src={previewUrl} alt="Preview" className="object-cover" />}
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials(formData.nome || currentUser?.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-2">
                  <Label>Foto de Perfil</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Escolher Imagem
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG ou WebP. Max 20MB.
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Não editável)</Label>
                  <Input
                    id="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="bg-background text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Sobre Mim (Descrição)</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre você..."
                    className="min-h-[120px] bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
