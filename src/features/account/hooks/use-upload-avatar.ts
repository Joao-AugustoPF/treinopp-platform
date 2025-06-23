import { useSWRConfig } from 'swr';

import { toast } from 'src/components/snackbar';
import { endpoints } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';

const JWT_STORAGE_KEY = 'jwt_access_token';

export function useUploadAvatar() {
  const { mutate } = useSWRConfig();

  const uploadAvatar = async (file: File, userId: string) => {
    try {
      // Cria FormData para enviar o arquivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      // Obtém o token de autorização
      const token = sessionStorage.getItem(JWT_STORAGE_KEY);

      if (!token) {
        throw new Error('Token de autorização não encontrado');
      }

      // Usa fetch diretamente para evitar problemas com axios e FormData
      const response = await fetch(`${CONFIG.serverUrl}${endpoints.upload.avatar}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer upload');
      }

      const data = await response.json();

      // Mostra toast de sucesso
      toast.success('Avatar enviado com sucesso!');

      return data;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error('Erro ao enviar avatar');
      throw error;
    }
  };

  const deleteAvatar = async (fileId: string) => {
    try {
      // Obtém o token de autorização
      const token = sessionStorage.getItem(JWT_STORAGE_KEY);

      if (!token) {
        throw new Error('Token de autorização não encontrado');
      }

      const response = await fetch(
        `${CONFIG.serverUrl}${endpoints.upload.avatar}?fileId=${fileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir avatar');
      }

      toast.success('Avatar excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir avatar:', error);
      toast.error('Erro ao excluir avatar');
      throw error;
    }
  };

  return {
    uploadAvatar,
    deleteAvatar,
  };
}
