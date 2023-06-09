import { lighten } from '@material-ui/core/styles/colorManipulator';
const styles = theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: "0 10px 15px -5px rgba(62, 57, 107, .07)",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    color: theme.palette.text.primary,
    '&$noMargin': {
      margin: 0
    }
  },
  descBlock: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    }
  },
  titleText: {
    flex: 1
  },
  title: {
    position: 'relative',
    fontSize: 24,
    fontWeight: 400,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    color: theme.palette.mode === 'dark' ? theme.palette.primary.main : "#BF8F30",
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      fontWeight: 600,
      marginBottom: theme.spacing(1)
    }
  },
  description: {
    maxWidth: 960,
    fontSize: 12,
    fontWeight: 250,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  content: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: "12px",
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(2)
    }
  },
  whiteBg: {
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  noMargin: {},
  colorMode: {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
    '& $title': {
      color: theme.palette.grey[100],
      '&:after': {
        borderBottom: `5px solid ${theme.palette.primary.light}`
      }
    },
    '& $description': {
      color: theme.palette.grey[100],
    }
  },
  overflowX: {
    width: '100%',
    overflowX: 'auto',
  },
  iconTitle: {
    borderRadius: "8px",
    border: theme.palette.mode === 'dark' ? 'none' : `1px solid ${lighten(theme.palette.secondary.dark, 0.9)}`,
    boxShadow: `0 2px 15px -5px #BF8F30`,
    background: theme.palette.mode === 'dark' ? theme.palette.primary.main : lighten(theme.palette.background.paper, 0.5),
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: '44px',
    verticalAlign: 'middle',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
    '& i': {
      fontSize: 28,
      verticalAlign: 'baseline',
      color: theme.palette.mode === 'dark' ? theme.palette.common.white : "#BF8F30"
    }
  }
});

export default styles;
