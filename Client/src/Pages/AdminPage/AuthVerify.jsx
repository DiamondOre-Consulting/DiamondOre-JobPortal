import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

const AuthVerify = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.get('https://api.diamondore.in/api/admin-confi/user-data', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // If the request is successful, we assume the user is authenticated
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                // If there's an error, redirect to login
                navigate('/');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
               
            </div>
        );
    }

    // If not loading and not redirected, render the outlet
    return <Outlet />;
};

export default AuthVerify;