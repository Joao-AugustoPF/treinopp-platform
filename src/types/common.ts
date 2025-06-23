// ----------------------------------------------------------------------

import type { Dayjs } from 'dayjs';

export type IDateValue = string | number | null;

export type ISocialLink = {
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
};

export type IDatePickerControl = Dayjs | null;

export type ICalendarDate = string | number;

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarRange = {
  start: ICalendarDate;
  end: ICalendarDate;
} | null;

export type ICalendarEvent = {
  id: string;
  color: string;
  title: string;
  allDay: boolean;
  description: string;
  end: ICalendarDate;
  start: ICalendarDate;
};
