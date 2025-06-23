import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import { useUploadAvatar } from 'src/features/account/hooks/use-upload-avatar';

import type { IAluno } from '../types/aluno';

export function useUpdateAluno() {
  const { mutate } = useSWRConfig();
  const { uploadAvatar } = useUploadAvatar();

  const updateAluno = async (aluno: IAluno) => {
    try {
      console.log('[useUpdateAluno] - Dados recebidos:', aluno);

      let fotoUrl = aluno.Foto;

      // Se a Foto é um File, faz upload primeiro
      if (aluno.Foto instanceof File) {
        console.log('[useUpdateAluno] - Fazendo upload da foto...');
        const uploadResult = await uploadAvatar(aluno.Foto, aluno.Id);
        console.log('uploadResult', uploadResult);
        fotoUrl = uploadResult.fileUrl; // Usa a URL retornada pelo upload
        console.log('[useUpdateAluno] - Upload concluído, fotoUrl:', fotoUrl);
      }

      // Prepara os dados para atualização, substituindo o File pela URL
      const updateData = {
        ...aluno,
        Foto: fotoUrl,
      };

      console.log('[useUpdateAluno] - Enviando dados para atualização:', updateData);

      const response = await axios.put<IAluno>(endpoints.aluno.update(aluno.Id), updateData);
      await mutate(revalidateEndpoint(endpoints.aluno.details(aluno.Id)));
      await mutate(revalidateEndpoint(endpoints.aluno.list));

      return response.data;
    } catch (error) {
      console.error('[useUpdateAluno] - Erro ao atualizar aluno:', error);
      throw error;
    }
  };

  return {
    updateAluno,
  };
}
