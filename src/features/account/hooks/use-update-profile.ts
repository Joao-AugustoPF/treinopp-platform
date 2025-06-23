import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import { useUploadAvatar } from './use-upload-avatar';

import type { UpdateUserSchemaType } from '../sections/view/account-general';

export function useUpdateProfile() {
  const { mutate } = useSWRConfig();
  const { uploadAvatar, deleteAvatar } = useUploadAvatar();

  const updateProfile = async (account: UpdateUserSchemaType) => {
    try {
      let avatarUrl = account.AvatarUrl;
      // Se o AvatarUrl é um File, faz upload primeiro
      if (account.AvatarUrl instanceof File) {
        console.log('[useUpdateProfile] - Fazendo upload do avatar...');
        const uploadResult = await uploadAvatar(account.AvatarUrl, account.Id);
        console.log('uploadResult', uploadResult);
        avatarUrl = uploadResult.fileUrl; // Usa o fileId retornado pelo upload
        console.log('[useUpdateProfile] - Upload concluído, fileId:', avatarUrl);
      }

      // Prepara os dados para atualização, substituindo o File pelo fileId
      const updateData = {
        ...account,
        AvatarUrl: avatarUrl, // Pode ser fileId (string) ou URL (string) ou null
      };

      console.log('[useUpdateProfile] - Enviando dados para atualização:', updateData);

      const response = await axios.put(endpoints.accounts.update(account.Id), updateData);

      // Revalida os dados do usuário
      await mutate(revalidateEndpoint(endpoints.accounts.details(account.Id)));
      await mutate(revalidateEndpoint(endpoints.accounts.list));

      return response.data;
    } catch (error) {
      console.error('[useUpdateProfile] - Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  return {
    updateProfile,
    uploadAvatar,
    deleteAvatar,
  };
}
