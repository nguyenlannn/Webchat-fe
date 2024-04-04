import {InfoCircleOutlined} from "@ant-design/icons";
import {Dropdown, message, Typography} from "antd";
import React from "react";
import ListMemberComponent from "./ListMemberComponent";
import ListFileComponent from "./ListFileComponent";
import UseFetch from "../../../../hooks/UseFetch";
import Api from "../../../../api/Api";
import {useNavigate, useSearchParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import ChannelOwnerComponent from "./ChannelOwnerComponent";

const {Text} = Typography;
const InfoComponent = ({data, changeRefresh}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const [messageApi, contextHolder] = message.useMessage()

    let items = [];
    const sub = jwtDecode(localStorage.getItem("token")).sub
    if (data.result && data.result.status === "ACCEPT") {
        items.push({
            key: '1',
            label: (
                <ListFileComponent/>
            ),
        },)
        if (data.result.type === 'GROUP') {
            items.push({
                key: '2',
                label: (
                    <ListMemberComponent data1={data}/>
                ),
            },)
            if (sub !== data.result.ownerId) {
                items.push({
                    key: '3',
                    label: (
                        <Text onClick={() => huy("GROUP")}>Rời nhóm</Text>
                    ),
                },)
            } else {
                items.push({
                    key: '4',
                    label: (
                        <ChannelOwnerComponent data1={data} messageApi={messageApi} changeRefresh={changeRefresh}/>
                    ),
                },)
            }
        } else {
            items.push({
                key: '5',
                label: (
                    <Text onClick={() => huy("FRIEND")}>Hủy kết bạn</Text>
                ),
            },)
        }
    }

    const huy = (type) => {
        const fetchAPI = async () => {
            let response
            if (type === 'GROUP') {
                response = await UseFetch(Api.channelsChannelIdReactUserGroupPOST,
                    `${searchParams.get("channelId")}/react-user-group`,
                    JSON.stringify({status: "REJECT", userId: sub})
                )
            } else {
                response = await UseFetch(Api.channelsChannelIdReactUserFriendPOST,
                    `${searchParams.get("channelId")}/react-user-friend`,
                    JSON.stringify({status: "REJECT"})
                )
            }
            const res = await response.json();
            if (res.success) {
                window.location.reload()
            } else {
                localStorage.removeItem("token")
                navigate("/account")
            }
        }
        fetchAPI()
    }

    return (
        <>{contextHolder}
            <Dropdown
                menu={{items}}
                placement="bottomRight"
                arrow={{
                    pointAtCenter: true,
                }}
            >
                <InfoCircleOutlined
                    style={{
                        fontSize: 18,
                        paddingLeft: 8,
                        paddingRight: 0,
                        cursor: "pointer"
                    }}
                />
            </Dropdown>
        </>
    )
}
export default InfoComponent