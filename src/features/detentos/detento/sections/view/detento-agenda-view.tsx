'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useBoolean } from 'minimal-shared/hooks';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import interactionPlugin from '@fullcalendar/interaction';
import { useMemo, useState, useEffect, startTransition } from 'react';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import { CalendarRoot } from '../styles';
import { CalendarFilter } from '../calendar-filter';
import { CalendarToolbar } from '../calendar-toolbar';
import { CompromissoForm } from '../compromisso-form';
import { TipoAtendimento } from '../../types/compromisso';
import { useEvent, useCalendar, useListAgenda, useDetentoById } from '../../hooks';

import type { ICompromissoCalendarEvent } from '../../types/calendar';

type DetentoAgendaViewProps = {
  id: string;
};

const flexStyles: SxProps<Theme> = {
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
};

const filterEventsByType = (events: ICompromissoCalendarEvent[], types: string[]) =>
  events.filter((event) => types.includes(event.tipoAtendimento));

export function DetentoAgendaView({ id }: DetentoAgendaViewProps) {
  const [colorPreference, setColorPreference] = useState<string[]>(Object.values(TipoAtendimento));
  const openFilters = useBoolean();
  const { detento, isLoading: isLoadingDetento } = useDetentoById(id);
  const { calendarEvents, isLoading: isLoadingCompromissos } = useListAgenda({ detentoId: id });

  const {
    calendarRef,
    view,
    date,
    openForm,
    selectEventId,
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onInitialView,
    onOpenForm,
    onCloseForm,
    selectedRange,
  } = useCalendar();

  const filteredEvents = useMemo(
    () => filterEventsByType(calendarEvents, colorPreference),
    [calendarEvents, colorPreference]
  );

  const currentEvent = useEvent(calendarEvents, selectEventId, selectedRange, openForm);

  const isLoading = isLoadingDetento || isLoadingCompromissos;

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  if (isLoadingDetento) return <LoadingScreen />;
  if (!detento) return <NotFoundView />;

  const handleClickEventInFilter = (eventId: string) => {};

  return (
    <DashboardContent maxWidth="xl" sx={flexStyles}>
      <CustomBreadcrumbs
        backHref={paths.detento.details(detento.Id)}
        heading="Agenda"
        links={[
          { name: 'Detentos' },
          { name: detento.Nome, href: paths.detento.details(detento.Id) },
          { name: 'Agenda' },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpenForm}
          >
            Adicionar evento
          </Button>
        }
      />
      <Card sx={{ ...flexStyles, minHeight: '50vh' }}>
        <CalendarRoot sx={{ ...flexStyles, '.fc.fc-media-screen': { flex: '1 1 auto' } }}>
          <CalendarToolbar
            date={fDate(date)}
            view={view}
            canReset
            loading={isLoading}
            onNextDate={onDateNext}
            onPrevDate={onDatePrev}
            onToday={onDateToday}
            onChangeView={onChangeView}
            onOpenFilters={openFilters.onTrue}
          />

          <Calendar
            weekends
            editable
            droppable
            selectable
            rerenderDelay={10}
            allDayMaintainDuration
            eventResizableFromStart
            ref={calendarRef}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            events={filteredEvents}
            headerToolbar={false}
            select={onSelectRange}
            eventClick={onClickEvent}
            aspectRatio={3}
            eventDrop={(arg) => {
              startTransition(() => {
                onDropEvent(arg, (compromisso) => {
                  console.log(compromisso);
                });
              });
            }}
            eventResize={(arg) => {
              startTransition(() => {
                onResizeEvent(arg, (compromisso) => {
                  console.log(compromisso);
                });
              });
            }}
            locale={ptLocale}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
          />
        </CalendarRoot>
      </Card>

      <CalendarFilter
        open={openFilters.value}
        onClose={openFilters.onFalse}
        events={calendarEvents}
        colorPreference={colorPreference}
        onChangeColor={setColorPreference}
        onClickEvent={handleClickEventInFilter}
      />

      <CompromissoForm
        open={openForm}
        onClose={onCloseForm}
        isEditing={!!selectEventId}
        defaultValues={currentEvent}
      />
    </DashboardContent>
  );
}
