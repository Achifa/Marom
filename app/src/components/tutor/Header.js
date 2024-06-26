import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { get_tutor_setup, get_tutor_status } from "../../axios/tutor";


const Header = () => {


    let nav = useNavigate()
    let location = useLocation()
    const [activeTab, setActiveTab] = useState('intro');

    let [screen_name, set_screen_name] = useState(window.localStorage.getItem('tutor_screen_name'));

    let [tutorState, setTutorState] = useState('Pending')

    let { screenName } = useSelector(s => s.screenName);

    useEffect(() => {
        const element = document.getElementById('tutor-tab-header-list-active');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    const tabs = [
        { url: 'intro', name: 'Introduction' },
        { url: 'setup', name: 'Tutor Setup' },
        { url: 'education', name: 'Education' },
        { url: 'rates', name: 'Motivate' },
        { url: 'accounting', name: 'Accounting' },
        { url: 'subjects', name: 'Subjects' },
        { url: 'my-students', name: 'My students' },
        { url: 'scheduling', name: 'Scheduling' },
        { url: 'term-of-use', name: 'Terms Of Use' },
        { url: 'message-board', name: 'Message Board' },
        { url: 'market-place', name: 'Market place' },
        { url: 'collaboration', name: 'Collaboration' },
        { url: 'tutor-profile', name: 'Tutor Profile' },
    ];

    useEffect(() => {
        set_screen_name(screenName)
    }, [screenName]);



    useEffect(() => {
        let user_id = window.localStorage.getItem('tutor_user_id');
        get_tutor_setup(user_id)
            .then((result) => {

                setTutorState(result[0].Status)
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        const currentTab = location.pathname.split('/').pop();
        setActiveTab(currentTab)
    }, [location])

    let handleTabClick = e => {
        let url = e.currentTarget.dataset.url;
        nav(`/tutor/${url}`)

        let urls = [
            'intro', 'setup', 'education', 'rates', 'accounting', 'subjects', 'my-students', 'scheduling', 'term-of-use', 'market-place', 'collaboration', 'tutor-profile'
        ]
        let new_index = urls.indexOf(url);
        window.localStorage.setItem('tab_index', new_index)

    }

    let handle_scroll_right = () => {

        let div = document.querySelector('.tutor-tab-header');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {

        let div = document.querySelector('.tutor-tab-header');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }


    return (
        <>

            <div className="screen-name btn-success rounded" 
            style={{ display: screen_name === 'null' ? 'none' : 'flex', position: 'fixed', 
            top: '15px', zIndex: '999', fontWeight: 'bold', color: '#fff', left: '45px', 
            padding: '3px 5px 0', height: '30px', 
            background: tutorState === 'Pending' ? 'yellow' : tutorState === 'Active' ? 'green' : tutorState === 'Suspended' ? 'orange' : 'red', color: tutorState === 'Pending' ? '#000' : tutorState === 'Active' ? '#fff' : tutorState === 'Suspended' ? '#fff' : '#fff' }}>
                {localStorage.getItem('tutor_screen_name')}
            </div>

            <div className="tutor-tab-header shadow-sm">
                <div style={{
                    margin: '0 0 0 0', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef',
                    opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                }} className="scroller-left" onClick={handle_scroll_left}>
                    <div style={{ opacity: '1' }}>
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

                </div>
                <ul id="tutor-header-menus" className="header">
                    {tabs.map((tab) => (
                        <li
                            key={tab.url}
                            data-url={tab.url}
                            onClick={handleTabClick}
                            id={tab.url === activeTab ? 'tutor-tab-header-list-active' : ''}
                        >
                            <a>{tab.name}</a>
                        </li>
                    ))}
                </ul>

                <div className="scroller-right" onClick={handle_scroll_right}></div>
                <div style={{
                    margin: '0 0 0 0', background: '#efefef', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                }} className="scroller-right" onClick={handle_scroll_right}>
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </div>



            </div>
        </>
    );
}

export default Header;

