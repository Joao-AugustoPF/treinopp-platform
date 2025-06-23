import type { ITreinador } from '../types';
import type { Theme, SxProps } from '@mui/material/styles';

import { useState, useCallback } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useDebounce } from 'minimal-shared/hooks';

import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link, { linkClasses } from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses, createFilterOptions } from '@mui/material/Autocomplete';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  redirectPath: (id: string) => string;
  options: ITreinador[];
  loading?: boolean;
};

export function TreinadorSearch({ redirectPath, sx, options, loading }: Props) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ITreinador | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 500);

  const handleChange = useCallback(
    (item: ITreinador | null) => {
      setSelectedItem(item);
      if (item) {
        router.push(redirectPath(item.Id));
      }
    },
    [redirectPath, router]
  );

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: ITreinador) => `${option.Nome} ${option.Email} ${option.Telefone}`,
  });

  const paperStyles: SxProps<Theme> = {
    width: 320,
    [` .${autocompleteClasses.listbox}`]: {
      [` .${autocompleteClasses.option}`]: {
        p: 0,
        [` .${linkClasses.root}`]: {
          p: 0.75,
          gap: 1.5,
          width: 1,
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  };

  return (
    <Autocomplete
      autoHighlight
      popupIcon={null}
      loading={loading}
      options={options}
      value={selectedItem}
      filterOptions={filterOptions}
      onChange={(event, newValue) => handleChange(newValue)}
      onInputChange={(event, newValue) => setSearchQuery(newValue)}
      getOptionLabel={(option) => option.Nome}
      noOptionsText={<SearchNotFound query={debouncedQuery} />}
      isOptionEqualToValue={(option, value) => option.Id === value.Id}
      slotProps={{ paper: { sx: paperStyles } }}
      sx={[{ width: { xs: 1, sm: 260 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Buscar treinador..."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, treinador, { inputValue }) => {
        const matches = match(treinador.Nome, inputValue);
        const parts = parse(treinador.Nome, matches);

        return (
          <li {...props} key={treinador.Id}>
            <Link
              component={RouterLink}
              href={redirectPath(treinador.Id)}
              color="inherit"
              underline="none"
            >
              <Avatar
                key={treinador.Id}
                alt={treinador.Nome}
                src={treinador.Foto || treinador.FotoPerfil || undefined}
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 1,
                }}
              />

              <div key={inputValue}>
                {parts.map((part, index) => (
                  <Typography
                    key={index}
                    component="span"
                    color={part.highlight ? 'primary' : 'textPrimary'}
                    sx={{
                      typography: 'body2',
                      fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                    }}
                  >
                    {part.text}
                  </Typography>
                ))}
              </div>
            </Link>
          </li>
        );
      }}
    />
  );
}
