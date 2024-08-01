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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Route, Routes, Link } from 'react-router-dom';
import logo from '..//../assets/logo2.png';
import { useJwt } from 'react-jwt';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AdminDashboard from '../../Pages/AdminPage/AdminDashboard';
import AdminAllJobsCards from './AdminAllJobsCards';
import AdminAllCandidatesCards from './AdminAllCandidatesCards';
import AdminFooter from './AdminFooter';
import AdminEachJob from '../../Pages/AdminPage/EachJob';
import EachCandidate from '../../Pages/AdminPage/EachCandidate';
import UpdateStatus from '../../Pages/AdminPage/UpdateStatus';
import AdminERP from '../../Pages/AdminPage/AdminERP';
import AddERPForm from '../../Pages/AdminPage/AddNewERP';
import AddJobs from '../../Pages/AdminPage/Addjobs';
import AllReviews from '../../Pages/AdminPage/AllReviews';
import AllEmployee from '../../Pages/AdminPage/AllEmployee';
import EachEmployeeGoalSheet from '../../Pages/AdminPage/EachEmployeeGoalSheet';
import AddRecruiter from '../../Pages/AdminPage/AddRecruiter';
import Employeesignup from '../../Pages/AdminPage/Employeesignup';
import Prompt from '../../Pages/AdminPage/Prompt';
import AdminSignup from '../../Pages/AdminPage/AdminSignup';
import AdminEditprofile from './AdminEditprofile';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import ReviewsIcon from '@mui/icons-material/Reviews';
import BadgeIcon from '@mui/icons-material/Badge';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EmployeeBranchesPage from '../../Pages/AdminPage/EmployeeBranchesPage';
import erpicon from '../../assets/erpicon.png'
import AllEmployeeAccounts from '../../Pages/AdminPage/AllEmployeeAccounts';
import EachEmployeeAccounts from '../../Pages/AdminPage/EachEmployeeAccounts';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AllDuplicatePhoneRequest from '../../Pages/AdminPage/AllDuplicatePhoneRequest';
import EachEmployeeKPIScore from '../../Pages/AdminPage/EachEmployeeKPIScore';


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

const AdminDrawerSidebar = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const { decodedToken } = useJwt(localStorage.getItem("token"));
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/admin-login"); // Redirect to login page if not authenticated
            return;
        }

        const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

        if (tokenExpiration && tokenExpiration < Date.now()) {
            // Token expired, remove from local storage and redirect to login page
            localStorage.removeItem("token");
            navigate("/admin-login");
        }
    }, [decodedToken, navigate, token]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    // Token not found in local storage, handle the error or redirect to the login page
                    console.error("No token found");
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    "https://api.diamondore.in/api/admin-confi/user-data",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setUserData(response.data);
                } else {
                    setUserData("Did not get any response!!!");
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin-login");
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleNavigation = (path) => {
        navigate(`/admin-dashboard${path}`);
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
                        <img src={logo} alt='logo' className='w-40 cursor-pointer' />
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Link to={'/admin-dashboard/edit-profile'}><img src={userData?.profilePic} alt="" className='w-10 h-10 object-cover mr-2 rounded-full cursor-pointer '/></Link>
                    <IconButton
                        style={{ color: 'white' }}
                        aria-label='logout'
                        onClick={handleLogout}
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
                        { text: 'All Jobs', icon: <WorkIcon />, path: '/all-Jobs' },
                        { text: 'All Candidate', icon: <GroupIcon />, path: '/all-candidates' },
                        { text: 'ERP', icon: <img src={erpicon} className='w-6 h-6' />, path: '/erp-dashboard' },
                        { text: 'Add & Delete Jobs', icon: <DomainAddIcon />, path: '/add-jobs' },
                        { text: 'All Reviews', icon: <ReviewsIcon />, path: '/all-reviews' },
                        { text: 'All Employees', icon: <BadgeIcon />, path: '/all-employees' },
                        { text: 'Add Recruiter', icon: <AddCircleOutlineIcon />, path: '/add-recruiter' },
                        { text: 'Add Employee', icon: <PersonAddIcon />, path: '/add-employee' },
                        { text: 'Prompt', icon: <SaveAsIcon />, path: '/prompt' },
                        { text: 'Make Admin', icon: <AdminPanelSettingsIcon />, path: '/make-admin' },
                        { text: 'Edit Profile', icon: <AccountBoxIcon />, path: '/edit-profile' },
                        { text: 'All Accounts', icon: <ManageAccountsIcon />, path: '/all-accounts' },

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
                    <Route path='/' element={<AdminDashboard />} />
                    <Route path='/home' element={<AdminDashboard />} />
                    <Route path='/all-Jobs' element={<AdminAllJobsCards />} />
                    <Route path='/all-candidates' element={<AdminAllCandidatesCards />} />
                    <Route path='/each-candidate/:id' element={<EachCandidate />} />
                    <Route path='/each-job/:id' element={<AdminEachJob />} />
                    <Route path='/update-status/:id1/:id2' element={<UpdateStatus />} />
                    <Route path='/erp-dashboard' element={<AdminERP />} />
                    <Route path='/add-erp' element={<AddERPForm />} />
                    <Route path='/add-jobs' element={<AddJobs />} />
                    <Route path='/all-reviews' element={<AllReviews />} />
                    <Route path='/all-employees' element={<AllEmployee />} />
                    <Route path='/employee/:id' element={<EmployeeBranchesPage/>}/>
                    <Route path='/goal-sheet/:id' element={<EachEmployeeGoalSheet />} />
                    <Route path='/each-account/:id' element={<EachEmployeeAccounts/>}/>
                    <Route path='/kpi/:id' element={<EachEmployeeKPIScore/>}/>
                    <Route path='/add-recruiter' element={<AddRecruiter />} />
                    <Route path='/add-employee' element={<Employeesignup />} />
                    <Route path='/prompt' element={<Prompt />} />
                    <Route path='/make-admin' element={<AdminSignup />} />
                    <Route path='/edit-profile' element={<AdminEditprofile />} />
                    <Route path='/all-accounts' element={<AllEmployeeAccounts/>}/>
                    <Route path='/all-duplicate-phone/request' element={<AllDuplicatePhoneRequest/>}/>
                </Routes>
                <AdminFooter />
            </Box>
        </Box>
    );
}

export default AdminDrawerSidebar;
