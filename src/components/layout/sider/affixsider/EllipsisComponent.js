import {Avatar, Badge, Button, Dropdown, Flex, List, message, Modal, Typography} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import UseFetch from "../../../../hooks/UseFetch";
import Api from "../../../../api/Api";

const {Text} = Typography;

const EllipsisComponent = ({onRefresh}) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState({loading: false, result: null})
    const [load, setLoad] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()
    const [refresh, setRefresh] = useState(Math.random)
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const items = [
        {
            key: '1',
            label: (
                <Text
                    onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/account")
                    }}
                >
                    Đăng xuất
                </Text>
            ),
        },
        {
            key: '2',
            label: (
                <Text
                    onClick={showModal}
                >
                    Lời mời kết bạn <Badge
                    className="site-badge-count-109"
                    count={data.result ? data.result.content.length : 0}
                    style={{
                        backgroundColor: 'red',
                    }}
                />
                </Text>
            ),
        },
    ];

    useEffect(() => {
        // setInterval(() => {
            const fetchAPI = async () => {
                const response = await UseFetch(Api.channelsGET,
                    "?type=FRIEND&status=NEW"
                )
                const res = await response.json();
                if (res.success) {
                    setData(o => ({...o, result: res.data}))
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
            fetchAPI()
        // }, 5000)
    }, [refresh]);

    const reactUser = (channelId, status) => {
        const fetchAPI = async () => {
            setLoad(true)
            const response = await UseFetch(Api.channelsChannelIdReactUserFriendPOST,
                `${channelId}/react-user-friend`,
                JSON.stringify({status: status})
            )
            const res = await response.json();
            setLoad(false)
            if (res.success) {
                messageApi.open({
                    type: 'success',
                    content: 'Phản hồi thành công',
                    duration: 3,
                });
                setRefresh(Math.random)
                onRefresh()
            } else {
                if (res.errorCode === 401) {
                    localStorage.removeItem("token")
                    navigate("/account")
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Phản hồi thành công',
                        duration: 1,
                    });
                }
            }
        }
        fetchAPI()
    }

    return (
        <Flex
            style={{
                paddingLeft: 16,
                paddingRight: 16,
            }}
            justify={"flex-end"}
        >
            {contextHolder}
            <Dropdown
                menu={{items}}
                placement="bottomRight"
                arrow={{
                    pointAtCenter: true,
                }}
            >
                <EllipsisOutlined
                    style={{
                        fontSize: 24,
                        cursor: "pointer"
                    }}
                />
            </Dropdown>
            <Modal
                title="Lời mời kết bạn"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <List
                    pagination={{
                        position: "bottom",
                        align: "center",
                        pageSize: 6,
                    }}
                    dataSource={data.result && data.result.content}
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
                                        {item.name}
                                    </Text>
                                }
                                description={
                                    <Text
                                        style={{
                                            width: 200,
                                        }}
                                        ellipsis={{
                                            tooltip: item.email
                                        }}
                                    >
                                        {item.friendEmail}
                                    </Text>
                                }
                            />
                            <Flex>
                                <Button
                                    style={{
                                        color: "green",
                                        borderColor: "green"
                                    }}
                                    disabled={load}
                                    onClick={() => reactUser(item.id, "ACCEPT")}
                                >
                                    Đồng ý
                                </Button>
                                <div style={{width: 10}}></div>
                                <Button
                                    style={{
                                        color: "red",
                                        borderColor: "red"
                                    }}
                                    disabled={load}
                                    onClick={() => reactUser(item.id, "REJECT")}
                                >
                                    Từ chối
                                </Button>
                            </Flex>
                        </List.Item>
                    )}
                />
            </Modal>
        </Flex>
    )
}
export default EllipsisComponent