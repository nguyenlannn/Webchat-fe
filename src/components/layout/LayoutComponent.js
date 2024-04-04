import SiderComponent from "./sider/SiderComponent";
import React, {useState} from 'react';
import {Layout} from 'antd';
import ContentComponent from "./content/ContentComponent";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

const LayoutComponent = ({children}) => {
    let stompClient = null;
    const [collapsed, setCollapsed] = useState(false);
    const [notify, setNotify] = useState(null)

    const clickCollapsed = () => {
        setCollapsed(!collapsed)
    }

    const responseCollapsed = (collapsed) => {
        setCollapsed(collapsed)
    }

    const token = localStorage.getItem("token")
    let sub = ""
    try {
        sub = JSON.parse(atob(token.split('.')[1])).sub
    } catch (o) {
    }

    const connect = () => {
        let Sock = new SockJS(`${process.env.REACT_APP_HOST}/wsjs?token=${token}`);
        stompClient = over(Sock);
        stompClient.connect({},
            () => {
                stompClient.subscribe('/user/' + sub + '/private', (payload) => {
                    let res = payload.body;
                    setNotify(res)
                });
            },
            (err) => {
            }
        );
    }
    connect()

    return (
        <Layout
        >
            <SiderComponent responseCollapsed={responseCollapsed} collapsed={collapsed} notify={notify}/>
            <ContentComponent clickCollapsed={clickCollapsed} collapsed={collapsed}>
                {children}
            </ContentComponent>
        </Layout>
    )
}
export default LayoutComponent