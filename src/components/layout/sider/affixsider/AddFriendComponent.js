import {SearchOutlined, UserAddOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {Avatar, Button, Flex, Input, List, Modal, Typography} from 'antd';
import UseFetch from "../../../../hooks/UseFetch";
import Api from "../../../../api/Api";
import {useNavigate} from "react-router-dom";

const {Text} = Typography;
const AddFriendComponent = ({messageApi, onRefresh}) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("")
    const [data, setData] = useState({loading: false, result: null})
    const navigate = useNavigate();
    const callApi = () => {
        const fetchAPI = async () => {
            const response = await UseFetch(Api.usersToAddFriendGET,
                "",
                JSON.stringify([input])
            )
            const res = await response.json();
            if (res.success) {
                setData(o => ({...o, loading: false, result: res.data[0]}))
            } else {
                if (res.errorCode === 401) {
                    localStorage.removeItem("token")
                    navigate("/account")
                } else {
                    setData(o => ({...o, loading: false, result: null}))
                    messageApi.open({
                        type: 'error',
                        content: 'Không tìm thấy thông tin',
                        duration: 1,
                    });
                }
            }
        }
        fetchAPI()
    }

    const addFriend = () => {
        const fetchAPI = async () => {
            setData(o => ({...o, loading: true}))
            const response = await UseFetch(Api.channelsAddUserFriendPOST,
                "",
                JSON.stringify({userId: data.result.id})
            )
            const res = await response.json();
            if (res.success) {
                messageApi.open({
                    type: 'success',
                    content: 'Gửi lời mời kết bạn thành công',
                    duration: 3,
                });
                onRefresh()
            } else {
                if (res.errorCode === 401) {
                    localStorage.removeItem("token")
                    navigate("/account")
                } else {
                    setData(o => ({...o, loading: false}))
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

    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const onChange = (e) => {
        setInput(e.target.value)
    };
    return (
        <>
            <UserAddOutlined
                style={{
                    fontSize: 18,
                    paddingLeft: 16,
                    paddingRight: 8,
                }}
                onClick={showModal}
            />
            <Modal
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <Flex
                    vertical={true}
                    style={{
                        margin: "30px 30px 30px 30px",
                    }}
                >
                    <Input
                        placeholder="Tìm kiếm"
                        prefix={
                            <SearchOutlined
                                onClick={() => callApi()}
                            />
                        }
                        onChange={onChange}
                    />
                    <Flex
                        align={"center"}
                    >
                        {data.result !== null
                            ? <><List
                                style={{
                                    width: "100%",
                                    marginTop: 20
                                }}
                                itemLayout="horizontal"
                                dataSource={[
                                    {
                                        name: data.result.name,
                                        avatarUrl: data.result.avatarUrl,
                                        email: data.result.email,
                                    },
                                ]}
                                onClick={showModal}
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
                                            description={<Text
                                                style={{
                                                    width: 200,
                                                }}
                                                ellipsis={{
                                                    tooltip: item.email
                                                }}
                                            >
                                                {item.email}
                                            </Text>}
                                        />
                                    </List.Item>
                                )}
                            />
                                <Button
                                    onClick={() => addFriend()}
                                    style={{
                                        marginTop: 20,
                                    }}
                                    disabled={!data.loading ? data.result.status === "ACCEPT" : true}
                                >
                                    {data.result.status === "ACCEPT" ? "Bạn bè" : "Kết bạn"}
                                </Button>
                            </>
                            : ""}
                    </Flex>
                </Flex>
            </Modal>
        </>
    )
}
export default AddFriendComponent