'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useBoolean } from 'minimal-shared/hooks';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { useMemo, useState, useEffect, startTransition } from 'react';

import { Card, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import { useAuthContext } from 'src/auth/hooks';

import { CalendarRoot } from '../styles';
import { AgendaForm } from '../agenda-form';
import { TipoEvento } from '../../types/calendar';
import { CalendarFilter } from '../calendar-filter';
import { CalendarToolbar } from '../calendar-toolbar';
import { DisponibilidadeForm } from '../disponibilidade-form';
import {
  useEvent,
  useCalendar,
  useListAgenda,
  useTreinadorById,
  useListDisponibilidade,
  useCreateDisponibilidade,
} from '../../hooks';

import type { IAgendaCalendarEvent } from '../../types';

type TreinadorAgendaViewProps = { id: string };
const flexStyles: SxProps<Theme> = { flex: '1 1 auto', display: 'flex', flexDirection: 'column' };
const filterEventsByType = (events: IAgendaCalendarEvent[], types: string[]) =>
  events.filter((event) => types.includes(event.tipoEvento));

export function TreinadorAgendaView({ id }: TreinadorAgendaViewProps) {
  const [colorPreference, setColorPreference] = useState<string[]>(Object.values(TipoEvento));
  const openFilters = useBoolean();
  const openDisponibilidade = useBoolean();
  const { treinador, isLoading: isLoadingTreinador } = useTreinadorById(id);
  const { calendarEvents, isLoading: isLoadingCompromissos, agenda } = useListAgenda({ treinadorId: id });
  const { createDisponibilidade } = useCreateDisponibilidade();
  const { disponibilidades, isLoading: isLoadingDisponibilidade } = useListDisponibilidade(id);
  const { user } = useAuthContext();

  const profile = user?.profile;

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

  const currentEvent = useEvent(calendarEvents, selectEventId, selectedRange, openForm, id);
  const isLoading = isLoadingTreinador || isLoadingCompromissos;

  // Debug logs para verificar os dados
  useEffect(() => {
    if (agenda && agenda.length > 0) {
      console.log('=== DEBUG AGENDA ===');
      console.log('Raw agenda data:', agenda);
      console.log('Calendar events:', calendarEvents);
      console.log('Filtered events:', filteredEvents);
      console.log('Color preferences:', colorPreference);
      console.log('===================');
    }
  }, [agenda, calendarEvents, filteredEvents, colorPreference]);

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);
  
  if (isLoadingTreinador) return <LoadingScreen />;
  if (!treinador) return <NotFoundView />;

  const handleUpdateDisponibilidade = async (data: any) => {
    try {
      await createDisponibilidade(id, {
        ...data,
        tenantId: profile?.tenantId || '',
      });
      openDisponibilidade.onFalse();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
    <DashboardContent maxWidth="xl" sx={flexStyles}>
      <CustomBreadcrumbs
        backHref={paths.treinador.details((treinador as any)?.treinador?.Id || '')}
        heading="Agenda"
        links={[
          { name: 'Treinadores' },
          {
            name: (treinador as any)?.treinador?.Nome || '',
            href: paths.treinador.details((treinador as any)?.treinador?.Id || ''),
          },
          { name: 'Agenda' },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon="mdi:clock-outline" />}
              onClick={openDisponibilidade.onTrue}
            >
              Disponibilidade
            </Button>
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={onOpenForm}
            >
              Adicionar evento
            </Button> */}
          </Stack>
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
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            ref={calendarRef}
            initialView={view}
            initialDate={date}
            timeZone="America/Sao_Paulo"
            events={filteredEvents}
            weekends
            editable={false}
            selectable={false}
            droppable={false}
            rerenderDelay={10}
            allDayMaintainDuration
            eventResizableFromStart={false}
            headerToolbar={false}
            dayMaxEventRows={3}
            eventDisplay="block"
            // eventClick={onClickEvent}
            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
            slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
            aspectRatio={3}
            height="auto"
            eventContent={(eventInfo) => {
              // Customizar a exibição do evento para garantir que os dados sejam mostrados corretamente
              const event = eventInfo.event;
              
              // Buscar os dados originais da agenda através dos extendedProps
              const agendaData = filteredEvents.find(e => e.id === event.id);
              let startTime = '';
              let endTime = '';
              
              if (agendaData) {
                // Usar os dados originais da agenda para extrair horários corretos
                const originalAgenda = agenda.find(a => a.Id === agendaData.agendaId);
                
                if (originalAgenda) {
                  // Se DataInicio está no formato ISO, extrair horário diretamente
                  if (originalAgenda.DataInicio && originalAgenda.DataInicio.includes('T')) {
                    startTime = originalAgenda.DataInicio.split('T')[1]?.substring(0, 5) || '';
                    endTime = originalAgenda.DataFim ? originalAgenda.DataFim.split('T')[1]?.substring(0, 5) : '';
                  } else {
                    // Formato separado
                    startTime = originalAgenda.HoraInicio || '';
                    endTime = originalAgenda.HoraFim || '';
                  }
                }
              }
              
              // Fallback para o método anterior se não encontrar dados originais
              if (!startTime) {
                startTime = event.startStr ? event.startStr.split('T')[1]?.substring(0, 5) : '';
                endTime = event.endStr ? event.endStr.split('T')[1]?.substring(0, 5) : '';
              }
              
              return (
                <div style={{ padding: '2px 4px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                  {startTime && endTime && (
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                      {startTime} - {endTime}
                    </div>
                  )}
                  {event.extendedProps?.local && (
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>
                      {event.extendedProps.local}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </CalendarRoot>
      </Card>

      <CalendarFilter
        open={openFilters.value}
        onClose={openFilters.onFalse}
        events={calendarEvents}
        colorPreference={colorPreference}
        onChangeColor={setColorPreference}
        onClickEvent={(eventId) => onClickEvent({ event: { id: eventId } } as any)}
      />

      <AgendaForm
        open={openForm}
        onClose={onCloseForm}
        isEditing={!!selectEventId}
        defaultValues={currentEvent}
        treinadorId={id}
      />

      <DisponibilidadeForm
        open={openDisponibilidade.value}
        onClose={openDisponibilidade.onFalse}
        treinadorId={id}
        tenantId={profile?.tenantId || ''}
        disponibilidades={disponibilidades}
        isLoading={isLoadingDisponibilidade}
      />
    </DashboardContent>
  );
}
