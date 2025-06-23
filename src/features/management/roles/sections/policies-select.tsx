import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, Chip, Paper, Divider, capitalize } from '@mui/material';

import { useListPolicies } from '../hooks/use-list-policies';

import type { RoleCreateSchemaType } from './role-form';

export const PoliciesSelect = () => {
  const { policies = [], isLoading: isLoadingPolicies } = useListPolicies();

  const { control } = useFormContext<RoleCreateSchemaType>();

  if (isLoadingPolicies) {
    return null;
  }

  return (
    <Controller
      name="policies"
      control={control}
      render={({ field, fieldState }) => {
        const handleSelectAllPolicies = (event: React.ChangeEvent<HTMLInputElement>) => {
          const checked = event.target.checked;
          field.onChange(checked ? policies : []);
        };

        const totalPermissions = policies?.reduce?.(
          (acc, policy) => acc + (policy?.permissions?.length || 0),
          0
        );

        const actualPermissions = field.value?.reduce(
          (acc, policy) => acc + (policy?.permissions?.length || 0),
          0
        );

        const isAllPoliciesSelected = totalPermissions === actualPermissions;

        const isSomePoliciesSelected =
          actualPermissions > 0 && actualPermissions < totalPermissions;

        return (
          <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.neutral' }}>
              <Stack
                direction="row"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
              >
                <Typography variant="h6" color="primary.main" fontWeight={700}>
                  Políticas Disponíveis
                </Typography>

                <FormControlLabel
                  label="Selecionar Todas"
                  control={
                    <Checkbox
                      checked={isAllPoliciesSelected}
                      indeterminate={isSomePoliciesSelected}
                      onChange={handleSelectAllPolicies}
                    />
                  }
                />
              </Stack>
            </Paper>

            <Grid container spacing={2}>
              {policies.map((policy) => {
                const handleSelectPolicy = (event: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = event.target.checked;
                  if (checked) {
                    field.onChange([...(field.value || []), policy]);
                  } else {
                    field.onChange(field.value?.filter((p) => p.id !== policy.id) || []);
                  }
                };

                const isPolicySelected = field.value?.some((p) => p.id === policy.id);

                const isAllPermissionsSelected = policy.permissions.every((permission) =>
                  field.value?.some((p) => p.permissions.some((pe) => pe.id === permission.id))
                );

                return (
                  <Grid item xs={12} key={policy.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: isPolicySelected ? 'primary.main' : 'divider',
                        bgcolor: isPolicySelected ? 'primary.lighter' : 'background.paper',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                              checked={isPolicySelected && isAllPermissionsSelected}
                              indeterminate={isPolicySelected && !isAllPermissionsSelected}
                              onChange={handleSelectPolicy}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Typography variant="subtitle1" fontWeight={600}>
                              {policy.name}
                            </Typography>
                          </Stack>
                          <Chip
                            label={`${policy.permissions.length} permissões`}
                            size="small"
                            color={isPolicySelected ? 'primary' : 'default'}
                          />
                        </Stack>

                        <Divider />

                        <Grid container spacing={1}>
                          {policy.permissions.map((permission) => {
                            const isPermissionSelected = field.value?.some((p) =>
                              p.permissions.some((pe) => permission.id === pe.id)
                            );

                            const handleSelectPermission = (
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const checked = event.target.checked;
                              const existingPolicy = field.value?.find((p) => p.id === policy.id);

                              if (checked && !existingPolicy) {
                                const newPolicy = {
                                  ...policy,
                                  permissions: [permission],
                                };
                                field.onChange([...(field.value || []), newPolicy]);
                                return;
                              }

                              if (!checked && existingPolicy) {
                                const updatedPermissions = existingPolicy.permissions.filter(
                                  (p) => p.id !== permission.id
                                );

                                const updatedPolicy = {
                                  ...existingPolicy,
                                  permissions: updatedPermissions,
                                };

                                const newPolicies = field.value?.map((p) =>
                                  p.id === policy.id ? updatedPolicy : p
                                );

                                field.onChange(newPolicies || []);
                                return;
                              }

                              if (checked && existingPolicy) {
                                const updatedPermissions = [
                                  ...existingPolicy.permissions,
                                  permission,
                                ];

                                const updatedPolicy = {
                                  ...existingPolicy,
                                  permissions: updatedPermissions,
                                };

                                const newPolicies = field.value?.map((p) =>
                                  p.id === policy.id ? updatedPolicy : p
                                );

                                field.onChange(newPolicies || []);
                                return;
                              }
                            };

                            return (
                              <Grid item xs={12} sm={6} md={4} key={permission.id}>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 1,
                                    border: '1px solid',
                                    borderColor: isPermissionSelected ? 'primary.main' : 'divider',
                                    bgcolor: isPermissionSelected
                                      ? 'primary.lighter'
                                      : 'background.paper',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      <Checkbox
                                        size="small"
                                        checked={isPermissionSelected}
                                        onChange={handleSelectPermission}
                                      />
                                      <Stack>
                                        <Typography variant="body2" fontWeight={500}>
                                          {capitalize(permission.name)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {permission.action} • {permission.subject}
                                        </Typography>
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {fieldState.error?.message && (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};
