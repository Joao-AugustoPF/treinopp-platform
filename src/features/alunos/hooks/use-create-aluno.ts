import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import { useUploadAvatar } from 'src/features/account/hooks/use-upload-avatar';

import type { IAluno } from '../types/aluno';
import type { AlunoSchemaType } from '../schemas/aluno-schema';

export const useCreateAluno = () => {
  const { mutate } = useSWRConfig();
  const { uploadAvatar } = useUploadAvatar();

  const createAluno = async (data: Partial<AlunoSchemaType>) => {
    try {
      let fotoUrl = data.Foto;

      // Se a Foto é um File, faz upload primeiro
      if (data.Foto instanceof File) {
        console.log('[useCreateAluno] - Fazendo upload da foto...');
        const uploadResult = await uploadAvatar(data.Foto, 'temp'); // Usa 'temp' como userId temporário
        console.log('uploadResult', uploadResult);
        fotoUrl = uploadResult.fileUrl; // Usa a URL retornada pelo upload
        console.log('[useCreateAluno] - Upload concluído, fotoUrl:', fotoUrl);
      }

      // Prepara os dados para criação, substituindo o File pela URL
      const createData = {
        ...data,
        Foto: fotoUrl,
      };

      console.log('[useCreateAluno] - Enviando dados para criação:', createData);

      const response = await axios.post<IAluno>(endpoints.aluno.list, createData);
      await mutate(revalidateEndpoint(endpoints.aluno.list));
      return response.data;
    } catch (error) {
      console.error('[useCreateAluno] - Erro ao criar aluno:', error);
      throw error;
    }
  };

  return {
    createAluno,
  };
};
