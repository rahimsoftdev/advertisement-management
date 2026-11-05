import  { useEffect, useState } from 'react';
import { getAuthInfo } from '../utils/auth';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { 
  FiFileText, 
  FiCreditCard, 
  FiShield, 
  FiUser, 
  FiPlus, 
  FiLogOut, 
  FiHome, 
  FiChevronRight 
} from 'react-icons/fi';

export default function UserDashboardPage() {
    const { t } = useTranslation('userdashboard');
    const [userInfo, setUserInfo] = useState(getAuthInfo());
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            localStorage.removeItem("authInfo");
        } catch {
            // localStorage access na pele ignore
        }
        setUserInfo(null);
        navigate("/login");
    };

    const handleCreateAnnouncement = () => {
        navigate("/announcement/new");
    };

    useEffect(() => { 
        if (!userInfo) {
            navigate('/login');
        }
        if(userInfo?.role !== 'user'){
        navigate('/login');
    }
    }, [userInfo, navigate]);

    const userName = userInfo?.name || "Md Sahin";

    return (
        <div className='min-h-screen bg-[#FAF9F7] text-slate-800 p-6 md:p-10'>
            <div className='container px-4 lg:px-10 mx-auto space-y-8'>
                
                {/* Top Workspace & Actions Header */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div className='space-y-1'>
                        <span className='inline-block px-3 py-1 bg-[#ECEDFA] text-[#4048CD] text-xs font-semibold rounded-full uppercase tracking-wider'>
                            {t('user_workspace_tag')}
                        </span>
                        <p className='text-sm text-slate-500 font-medium'>lundi 2 février 2026</p>
                        <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900'>
                            {t('welcome_prefix')} {userName}
                        </h1>
                        <p className='text-slate-600 max-w-xl text-sm md:text-base'>
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <button
                            onClick={handleCreateAnnouncement}
                            className='flex items-center gap-2 px-5 py-2.5 bg-[#3A7D6C] hover:bg-[#2f6658] text-white font-medium rounded shadow-sm transition-all duration-200 cursor-pointer'
                        >
                            <FiPlus size={18} />
                            <span>{t('buttons.create_announcement')}</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 rounded shadow-sm transition-all duration-200 cursor-pointer'
                        >
                            <FiLogOut size={18} />
                            <span>{t('buttons.logout')}</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                    
                    {/* Total Announcements Card */}
                    <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4'>
                        <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600'>
                            <FiFileText size={20} />
                        </div>
                        <div>
                            <h3 className='text-3xl font-bold text-slate-900'>01</h3>
                            <p className='text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1'>
                                {t('stats.total_announcements')}
                            </p>
                        </div>
                    </div>

                    {/* Credits Card */}
                    <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4'>
                        <div className='w-10 h-10 rounded-xl bg-[#ECEDFA] flex items-center justify-center text-[#4048CD]'>
                            <FiCreditCard size={20} />
                        </div>
                        <div>
                            <h3 className='text-3xl font-bold text-slate-900'>00</h3>
                            <p className='text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1'>
                                {t('stats.credits')}
                            </p>
                        </div>
                    </div>

                    {/* Pending Reviews Card */}
                    <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4'>
                        <div className='w-10 h-10 rounded-xl bg-[#FDE8E9] flex items-center justify-center text-[#EE1C25]'>
                            <FiShield size={20} />
                        </div>
                        <div>
                            <h3 className='text-3xl font-bold text-slate-900'>00</h3>
                            <p className='text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1'>
                                {t('stats.pending_reviews')}
                            </p>
                        </div>
                    </div>

                    {/* Plan Card */}
                    <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4'>
                        <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600'>
                            <FiUser size={20} />
                        </div>
                        <div>
                            <h3 className='text-2xl font-bold text-slate-900'>{t('stats.free_plan')}</h3>
                            <p className='text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1'>
                                {t('stats.plan_label')}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Created Announcements Section */}
                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6'>
                    
                    <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
                        <div>
                            <h2 className='text-xl font-bold text-slate-900'>
                                {t('created_announcements.title')}
                            </h2>
                            <p className='text-xs text-slate-500 mt-0.5'>
                                {t('created_announcements.subtitle')}
                            </p>
                        </div>

                        <div className='flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full'>
                            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                            <span>{t('created_announcements.active_session')}</span>
                        </div>
                    </div>

                    {/* Announcement Card Item */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                        <div className='border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 space-y-3 bg-white max-w-xs'>
                            <div className='flex items-center justify-between'>
                                <div className='w-8 h-8 rounded-lg bg-emerald-50 text-[#3A7D6C] flex items-center justify-center'>
                                    <FiHome size={18} />
                                </div>
                                <span className='px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded tracking-wide'>
                                    {t('created_announcements.status_ready')}
                                </span>
                            </div>

                            <div>
                                <h4 className='font-semibold text-slate-900'>Appartement à</h4>
                                <p className='text-xs text-slate-400 mt-0.5'>02/02/2026</p>
                            </div>

                            <div 
                                onClick={handleCreateAnnouncement}
                                className='pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#4048CD] cursor-pointer hover:underline'
                            >
                                <span>{t('created_announcements.project_ia_label')}</span>
                                <FiChevronRight size={14} />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}