import {Avatar, List, message, Typography} from "antd";
import React, {useEffect, useState} from "react";
import UseFetch from "../../../../../hooks/UseFetch";
import Api from "../../../../../api/Api";
import {useNavigate} from "react-router-dom";
import UpdateUserComponent from "./update/UpdateUserComponent";

const {Text} = Typography;
const UserSiderComponent = () => {
    const [data, setData] = useState({loading: false, result: null})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(Math.random)
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate();

    useEffect(() => {
        setData(o => ({...o, loading: true}))
        const fetchAPI = async () => {
            const response = await UseFetch(Api.usersGET,)
            const res = await response.json();
            if (res.success) {
                setData(o => ({...o, loading: false, result: res.data}))
            } else {
                localStorage.removeItem("token")
                navigate("/account")
            }
        }
        fetchAPI()
    }, [refresh])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const onRefresh = () => {
        setRefresh(Math.random)
    }

    return (
        <>
            <List
                style={{
                    width: "100%",
                    cursor: "pointer"
                }}
                itemLayout="horizontal"
                dataSource={[
                    {
                        name: data.result && data.result.name,
                        avatarUrl: data.result && data.result.avatarUrl,
                        email: data.result && data.result.email
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
                    </List.Item>
                )}
            />
            <UpdateUserComponent isModalOpen={isModalOpen} closeModal={closeModal} onRefresh={onRefresh} data={data}
                                 messageApi={messageApi}/>
            {contextHolder}
        </>
    )
}
export default UserSiderComponent