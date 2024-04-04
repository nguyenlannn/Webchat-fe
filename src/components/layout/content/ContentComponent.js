import React from 'react';
import {Layout} from 'antd';
import AffixContentComponent from "./affix/AffixContentComponent";

const {Content} = Layout;
const ContentComponent = ({children, clickCollapsed, collapsed}) => {

    return (
        <Layout
            style={{
                height: window.innerHeight,
                background: "rgb(224, 250, 255)"
            }}
        >
            <AffixContentComponent clickCollapsed={clickCollapsed} collapsed={collapsed}/>
            <Content
                style={{
                    background: "LightGrey"
                }}
            >
                {children}
            </Content>
        </Layout>
    )
}
export default ContentComponent