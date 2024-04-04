import React, {useEffect, useState} from "react";
import {Avatar, Button, List, message, Modal, Radio, Typography} from "antd";
import UseFetch from "../../../../hooks/UseFetch";
import Api from "../../../../api/Api";
import {useNavigate, useSearchParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const {Text} = Typography;
const ListMemberComponent = ({data1}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState({loading: false, result: null})
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const [refresh, setRefresh] = useState(Math.random)
    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        if (isModalOpen === true) {
            setData(o => ({...o, loading: true}))
            const fetchAPI = async () => {
                const response = await UseFetch(Api.channelsChannelIdMemberGET,
                    `${searchParams.get("channelId")}/member`)
                const res = await response.json();
                if (res.success) {
                    setData(o => ({...o, loading: false, result: res.data}))
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
            fetchAPI()
        }
    }, [searchParams, isModalOpen, refresh])

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const sub = jwtDecode(localStorage.getItem("token")).sub

    const [value, setValue] = useState(1);
    const onChange = (e) => {
        setValue(e.target.value);
    };

    const reactUserGroup = (status, userId, message) => {
        const fetchAPI = async () => {
            setData(o => ({...o, loading: true}))
            const response = await UseFetch(Api.channelsChannelIdReactUserGroupPOST,
                `${searchParams.get("channelId")}/react-user-group`,
                JSON.stringify({status: status, userId: userId})
            )
            const res = await response.json();
            if (res.success) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                setData(o => ({...o, loading: false}))
                setRefresh(Math.random)
            } else {
                localStorage.removeItem("token")
                navigate("/account")
            }
        }
        fetchAPI()
    }

    const addFriend = (userId) => {
        const fetchAPI = async () => {
            setData(o => ({...o, loading: true}))
            const response = await UseFetch(Api.channelsAddUserFriendPOST,
                "",
                JSON.stringify({userId: userId})
            )
            const res = await response.json();
            setData(o => ({...o, loading: false}))
            if (res.success) {
                messageApi.open({
                    type: 'success',
                    content: 'Gửi lời mời kết bạn thành công',
                    duration: 3,
                });
                let newData = data.result
                newData.content.forEach(o => {
                    if (o.id === userId) {
                        o.send = true
                    }
                })
                setData(o => ({...o, result: newData}))
            } else {
                if (res.errorCode === 401) {
                    localStorage.removeItem("token")
                    navigate("/account")
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Gửi lời mời kết bạn thất bại',
                        duration: 1,
                    });
                }
            }
        }
        fetchAPI()
    }


    return (
        <>
            {contextHolder}
            <Text
                onClick={showModal}
            >
                Thành viên
            </Text>
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                {sub === data1.result.ownerId ?
                    <Radio.Group onChange={onChange} value={value}>
                        <Radio value={1}>Thành viên</Radio>
                        <Radio value={2}>Đang chờ</Radio>
                    </Radio.Group>
                    : null
                }
                <List
                    itemLayout="horizontal"
                    dataSource={data.result
                        ? (value === 1
                                ? data.result.content.filter(o => o.status === 'ACCEPT')
                                : data.result.content.filter(o => o.status === 'NEW')
                        )
                        : []
                    }
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{
                                            width: 48,
                                            height: 48,
                                        }}
                                        src={item.avatarUrl}
                                    />
                                }
                                title={
                                    <Text
                                        style={{
                                            width: 200,
                                        }}
                                        ellipsis={{
                                            tooltip: item.name
                                        }}
                                    >
                                        {data1.result.ownerId === item.id ? "(Chủ kênh)" : ""} {item.name}
                                    </Text>
                                }
                                description={
                                    <Text
                                        style={{
                                            width: 200,
                                            color: "black"
                                        }}
                                        ellipsis={{
                                            tooltip: item.email
                                        }}
                                    >
                                        {item.email}
                                    </Text>
                                }
                            />
                            {sub !== item.id && value === 1
                                ? (item.friendStatus === 'ACCEPT'
                                        ? <Button disabled={true}>Bạn bè</Button>
                                        :
                                        <Button disabled={item.send || data.loading} onClick={() => addFriend(item.id)}>Kết
                                            bạn</Button>
                                )
                                : null
                            }
                            {data1.result.ownerId === sub
                                ? (value === 2
                                        ? <>
                                            <Button
                                                disabled={data.loading}
                                                onClick={() => reactUserGroup("ACCEPT", item.id, `Bạn đã duyệt ${item.name}`)}
                                                style={{marginLeft: 10, color: "green", borderColor: "green"}}
                                            >
                                                Duyệt
                                            </Button>
                                            <Button
                                                disabled={data.loading}
                                                onClick={() => reactUserGroup("REJECT", item.id, `Bạn đã từ chối ${item.name}`)}
                                                style={{marginLeft: 10, color: "red", borderColor: "red"}}
                                            >
                                                Từ chối
                                            </Button>
                                        </>
                                        : <Button
                                            onClick={() => reactUserGroup("REJECT", item.id, `Bạn đã xóa ${item.name}`)}
                                            style={{
                                                marginLeft: 10,
                                                color: "red",
                                                borderColor: "red"
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                )
                                : null
                            }
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    )
}
export default ListMemberComponent