import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import DialpadOutlinedIcon from '@mui/icons-material/DialpadOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Route, Routes } from 'react-router-dom';
import EmpHome from './EmpHome';
import EmpGoalSheet from './EmpGoalSheet';
import logo from '..//../assets/logo2.png';
import { useJwt } from 'react-jwt';
import axios from 'axios';
import { useEffect, useState } from 'react';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function EmpDrawerSidebar() {
  const [empofthemonth, setempofthemonth] = useState(null);
  const [latestnews, setlatestnews] = useState(null);
  const [hrname, sethrname] = useState(null);
  const [client, setclient] = useState(null);
  const [RnRinterns, setRnRinterns] = useState(null);
  const [RnRRecruiter, setRnRRecruiter] = useState(null);
  const [Joinings, setjoinings] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { decodedToken } = useJwt(token);

  useEffect(() => {
    if (!token) {
      navigate('/employee-login');
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;
      if (tokenExpiration && tokenExpiration < Date.now()) {
        localStorage.removeItem('token');
        navigate('/employee-login');
      }
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.diamondore.in/api/employee/all-erp-data',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const lastData = response.data.reverse()[0];

          setempofthemonth(lastData.EmpOfMonth);
          setlatestnews(lastData.BreakingNews || []);
          sethrname(lastData.Top5HRs || []);
          setclient(lastData.Top5Clients || []);
          setRnRRecruiter(lastData.RnRRecruiters || []);
          setRnRinterns(lastData.RnRInterns || []);
          setjoinings(lastData.JoningsForWeek || []);
        } else {
          console.log('Error occurred');
        }
      } catch (e) {
        console.log('Error occurred', e);
      }
    };

    fetchData();
  }, [decodedToken, token, navigate]);

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(`/employee-dashboard${path}`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{ background: '#0d47a1' }}>
        <Toolbar>
          <IconButton
            style={{ color: 'white' }}
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            <img src={logo} alt='' className='w-40' />
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            style={{ color: 'white' }}
            aria-label='user profile'
            onClick={() => handleNavigation('/profile')}
          >
            <AccountCircleIcon />
          </IconButton>
          <IconButton
            style={{ color: 'white' }}
            aria-label='logout'
            onClick={() => handleNavigation('/logout')}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: 'Home', icon: <HomeIcon />, path: '/home' },
            { text: 'Goal Sheet', icon: <TaskOutlinedIcon />, path: '/goal-sheet' },
            { text: 'Incentive', icon: <MonetizationOnOutlinedIcon />, path: '/incentive' },
            { text: 'KPI-Score', icon: <DialpadOutlinedIcon />, path: '/kpi-score' },
          ].map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route path='/' element={<EmpHome empofthemonth={empofthemonth} latestnews={latestnews} hrname={hrname} client={client} RnRRecruiter={RnRRecruiter} RnRinterns={RnRinterns} Joinings={Joinings} />} />
          <Route path='/home' element={<EmpHome empofthemonth={empofthemonth} latestnews={latestnews} hrname={hrname} client={client} RnRRecruiter={RnRRecruiter} RnRinterns={RnRinterns} Joinings={Joinings} />} />
          <Route path='/goal-sheet' element={<EmpGoalSheet />} />
        </Routes>
      </Box>
    </Box>
  );
}
