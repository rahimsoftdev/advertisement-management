
import Navbar from '../components/shared/Navbar';
import { Outlet } from 'react-router';

const DashbaordLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    );
};

export default DashbaordLayout;