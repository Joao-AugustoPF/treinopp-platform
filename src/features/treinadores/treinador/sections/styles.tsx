import { alpha, styled } from '@mui/material/styles';

export const CalendarRoot = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  '& .fc': {
    '--fc-border-color': alpha(theme.palette.grey[500], 0.2),
    '--fc-now-indicator-color': theme.palette.error.main,
    '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.08),
    '--fc-page-bg-color': theme.palette.background.default,
    '--fc-neutral-bg-color': theme.palette.background.neutral,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    '.fc-day-today': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },

    '.fc-scrollgrid': {
      border: 'none',
    },

    '.fc-scrollgrid-section-header > th, .fc-scrollgrid-section-footer > th': {
      border: 'none',
    },

    '.fc-scrollgrid-section-body > td': {
      border: 'none',
    },

    '.fc-col-header-cell': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      backgroundColor: theme.palette.background.neutral,
    },

    '.fc-event': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.92),
      },
      '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.92),
      },
    },

    '.fc-day-other .fc-daygrid-day-number': {
      color: theme.palette.text.disabled,
    },

    '.fc-timegrid-axis-cushion, .fc-timegrid-slot-label-cushion, .fc-list-event-time': {
      color: theme.palette.text.secondary,
    },

    '.fc-list-event-graphic': {
      paddingTop: 8,
    },

    '.fc-list-day': {
      backgroundColor: theme.palette.background.neutral,
    },

    '.fc-list-day-text, .fc-list-day-side-text': {
      color: theme.palette.text.primary,
      ...theme.typography.subtitle2,
    },

    '.fc-event, .fc-list-event-time': {
      ...theme.typography.body2,
    },

    '.fc-list-event-title': {
      ...theme.typography.body1,
    },

    '.fc-daygrid-day-number': {
      ...theme.typography.body2,
      padding: theme.spacing(1, 3),
    },

    '.fc-col-header-cell-cushion': {
      ...theme.typography.subtitle2,
      padding: theme.spacing(1),
    },

    '.fc-list': {
      borderColor: alpha(theme.palette.grey[500], 0.2),
    },

    '.fc-list-empty': {
      ...theme.typography.subtitle1,
      backgroundColor: 'transparent',
    },

    '.fc-popover': {
      borderColor: theme.palette.divider,
      boxShadow: theme.customShadows.dropdown,
    },

    '.fc-popover-header': {
      backgroundColor: theme.palette.background.neutral,
      ...theme.typography.subtitle2,
      padding: theme.spacing(1),
    },

    '.fc-popover-close': {
      opacity: 0.48,
      transition: theme.transitions.create('opacity'),
      '&:hover': { opacity: 1 },
    },

    '.fc-event-create-button': {
      ...theme.typography.caption,
      backgroundColor: theme.palette.primary.lighter,
      color: theme.palette.primary.darker,
      padding: theme.spacing(0.5, 0.75),
      borderRadius: theme.shape.borderRadius * 0.75,
    },

    '.fc-day-header': {
      ...theme.typography.subtitle2,
      backgroundColor: theme.palette.background.neutral,
      padding: theme.spacing(1),
      borderColor: alpha(theme.palette.grey[500], 0.2),
    },

    '.fc .fc-daygrid-day.fc-day-today': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },

    '.fc-license-message': {
      display: 'none',
    },
  },
}));
