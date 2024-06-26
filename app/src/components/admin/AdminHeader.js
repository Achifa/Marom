import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Header = () => {


    let nav = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('');

    const tabs = [
        { id: 'tutor-data', label: 'Tutor' },
        { id: 'student-data', label: 'Student' },
        { id: 'email-prog', label: 'Email Prog' },
        { id: 'new-subject', label: 'New Subject' },
        { id: 'accounting', label: 'Accounting' },
        { id: 'communications', label: 'Communications' },
    ];


    let handleTabClick = e => {
        nav(`/admin/${e.currentTarget.dataset.url}`)
    }

    useEffect(() => {
        const currentTab = location.pathname.split('/').pop();
        setActiveTab(currentTab)
    }, [location])

    let [screen_name, set_screen_name] = useState('')

    useEffect(() => {
        let name = window.localStorage.getItem('admin_screen_name');
        set_screen_name(name)
    }, []);


    return (
        <>
            <div className="screen-name btn-success rounded" style={{ display: screen_name === 'null' ? 'none' : 'flex', position: 'fixed', top: '15px', zIndex: '999', fontWeight: 'bold', color: '#fff', left: '45px', padding: '3px 5px 0', height: '30px' }}>
                {screen_name}
            </div>
            <div className="admin-tab-header shadow-sm">
                <ul>
                    {tabs.map((tab) => (
                        <li key={tab.id} data-url={tab.id} onClick={handleTabClick}
                            id={`${activeTab === tab.id ? 'admin-tab-header-list-active' : ''}`}
                        >
                            <a>{tab.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Header;