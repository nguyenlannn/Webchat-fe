import {Affix, Flex, message} from "antd";
import React from "react";
import AddFriendComponent from "./AddFriendComponent";
import AddGroupComponent from "./AddGroupComponent";
import SearchSiderComponent from "./SearchSiderComponent";
import TabSiderComponent from "./TabSiderComponent";
import UserSiderComponent from "./user/UserSiderComponent";
import EllipsisComponent from "./EllipsisComponent";


const AffixContentComponent = ({onChangeType, onChangeSearch, onRefresh,search, collapsed}) => {
    const [messageApi, contextHolder] = message.useMessage()
    return (
        <Affix
            style={{
                display: collapsed ? "none" : "inline"
            }}
            offsetTop={0}
        >
            <div>
                {contextHolder}
                <EllipsisComponent onRefresh={onRefresh}/>
                <Flex
                    style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                    }}
                >
                    <UserSiderComponent/>
                    <AddFriendComponent messageApi={messageApi} onRefresh={onRefresh}/>
                    <AddGroupComponent messageApi={messageApi} onRefresh={onRefresh} search={search}/>
                </Flex>
                <SearchSiderComponent onChangeSearch={onChangeSearch}/>
                <TabSiderComponent onChangeType={onChangeType}/>
            </div>
        </Affix>
    )
}
export default AffixContentComponent