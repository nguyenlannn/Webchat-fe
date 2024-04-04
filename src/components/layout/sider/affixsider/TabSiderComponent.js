import {Tabs} from "antd";
import React from "react";

const TabSiderComponent = ({onChangeType}) => {
    const onChange = (key) => {
        onChangeType(key)
    };
    return (
        <Tabs
            style={
                {
                    paddingLeft: 16,
                    paddingRight: 16,
                }}
            defaultActiveKey=""
            items={[
                {
                    label: "Tất cả",
                    key: "",
                },
                {
                    label: "Bạn bè",
                    key: "FRIEND",
                },
                {
                    label: "Nhóm",
                    key: "GROUP",
                },
            ]}
            onChange={onChange}
        />
    )
}
export default TabSiderComponent