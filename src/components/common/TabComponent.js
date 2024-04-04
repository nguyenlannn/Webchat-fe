import {Tabs} from "antd";
import React from "react";

const TabComponent = ({activeKey, onChangeTab}) => {
    return (
        <Tabs
            activeKey={activeKey}
            onChange={activeKey => onChangeTab(activeKey)}
            centered
            size={"large"}
            items={
                [
                    {
                        label: `Đăng nhập`,
                        key: "sign-in",
                    },
                    {
                        label: `Đăng ký`,
                        key: "sign-up"
                    },
                ]
            }
            style={{
                marginBottom: 50
            }}
        />
    )
}
export default TabComponent