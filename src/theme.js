import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5296a5',
      light: '#82ddf0',
      dark: '#5296a5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a57548',
      light: '#f6c28b',
      dark: '#a57548',
      contrastText: '#fff',
    },
    warning: {
      main: '#f6c28b',
      light: '#fcd7ad',
    },
    success: {
      main: '#2E7D32',
      light: '#E8F5E9',
    },
    error: {
      main: '#C62828',
      light: '#FFEBEE',
    },
    background: {
      default: '#FAFAF8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B1E23',
      secondary: '#586069',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: '#a57548',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.35rem',
      lineHeight: 1.3,
      color: '#a57548',
      marginTop: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.05rem',
      lineHeight: 1.4,
      color: '#1B1E23',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#f6c28b',
            color: '#1B1E23',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          border: '1px solid #E8ECF0',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F5F7F8',
          color: '#1B1E23',
          whiteSpace: 'nowrap',
        },
        root: {
          padding: '10px 14px',
          borderColor: '#E8ECF0',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
        },
        thumb: {
          width: 22,
          height: 22,
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(82,150,165,0.16)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: '#fdf3e7',
          borderLeft: '4px solid #c9a47a',
          color: '#1B1E23',
          '& .MuiAlertTitle-root': {
            fontWeight: 700,
            color: '#a57548',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E8ECF0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          borderLeft: '3px solid transparent',
          '&.Mui-selected': {
            backgroundColor: '#fcd7ad',
            borderLeftColor: '#a57548',
            '&:hover': {
              backgroundColor: '#fcd7ad',
            },
          },
          '&:hover': {
            backgroundColor: '#F5F7F8',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlinedPrimary: {
          borderColor: '#82ddf0',
          color: '#5296a5',
        },
      },
    },
  },
})

export default theme
