// ----------------------------------------------------------------------

import { defaultLang } from '../all-langs';

export function formatNumberLocale() {
  return { code: defaultLang.numberFormat.code, currency: defaultLang.numberFormat.currency };
}
