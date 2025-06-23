'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import 'dayjs/locale/fr';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/ar-sa';

import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';

import { defaultLang } from './all-langs';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function LocalizationProvider({ children }: Props) {
  dayjs.locale(defaultLang.adapterLocale);
  return (
    <Provider dateAdapter={AdapterDayjs} adapterLocale={defaultLang.adapterLocale}>
      {children}
    </Provider>
  );
}
