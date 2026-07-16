import { useState, useEffect } from 'react';
import { dbGet, dbUpdate, dbInsert } from '@/lib/dbClient';
import { toast } from 'sonner';

export function useAdminPreview(tableName, defaultData) {
  const [formData, setFormData] = useState(defaultData);
  const [originalData, setOriginalData] = useState(defaultData);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const records = await dbGet(tableName);
      const record = records?.[0];

      if (record) {
        setRecordId(record.id);
        // Merge: defaultData como base, sobrescrito pelos valores reais do banco
        // Inclui TODOS os campos do record (não só os do defaultData)
        const merged = { ...defaultData };
        Object.keys(record).forEach(key => {
          if (key === 'id' || key === 'created_at' || key === 'updated_at') return;
          const val = record[key];
          if (val !== undefined && val !== null) {
            merged[key] = val;
          }
        });
        setFormData(merged);
        setOriginalData(merged);
      }
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCustomChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(originalData);
    toast.info('Alterações descartadas. Formulário restaurado.');
  };

  // Imagens são URLs diretas no Supabase — sem geração de URL via SDK
  const getImageUrl = (fieldName) => {
    const value = formData[fieldName];
    if (!value) return null;
    if (value instanceof File) return URL.createObjectURL(value);
    if (typeof value === 'string') return value;
    return null;
  };

  const save = async (prepareDataFn = null) => {
    setSaving(true);
    try {
      let dataToSave;

      if (prepareDataFn) {
        dataToSave = prepareDataFn(formData);
      } else {
        dataToSave = {};
        for (const key of Object.keys(formData)) {
          const val = formData[key];
          // Arquivos File são tratados externamente (upload via Express API)
          // Aqui só persistimos strings/booleans/arrays/objetos
          if (val instanceof File) continue;
          dataToSave[key] = val;
        }
      }

      // Remove campos de controle que não existem no banco
      delete dataToSave.id;
      delete dataToSave.created_at;
      delete dataToSave.updated_at;

      if (recordId) {
        await dbUpdate(tableName, recordId, dataToSave);
      } else {
        const result = await dbInsert(tableName, dataToSave);
        if (result?.[0]?.id) setRecordId(result[0].id);
      }

      setOriginalData(formData);
      toast.success('Alterações salvas com sucesso!');
      return true;
    } catch (error) {
      console.error(`Error saving ${tableName}:`, error);
      toast.error('Erro ao salvar alterações.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    originalData,
    recordId,
    loading,
    saving,
    handleChange,
    handleCustomChange,
    resetForm,
    getImageUrl,
    save,
    fetchData,
  };
}
