import React, {useEffect, useState} from "react";
import {List, Modal, Typography} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";
import UseFetch from "../../../../hooks/UseFetch";
import Api from "../../../../api/Api";

const {Text} = Typography;
const ListFileComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [data, setData] = useState({loading: false, result: null})
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (isModalOpen === true) {
            setData(o => ({...o, loading: true}))
            const fetchAPI = async () => {
                const response = await UseFetch(Api.channelsChannelIdFilesGET,
                    `${searchParams.get("channelId")}/files`)
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
    }, [searchParams, isModalOpen])

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Text
                onClick={showModal}
            >
                Tệp
            </Text>
            <Modal
                title="Tệp"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <List
                    size="large"
                    bordered
                    dataSource={data.result ? data.result.content : []}
                    renderItem={(item) =>
                        <List.Item>
                            <a style={{color: "red"}} href={item.url} target="_blank">{item.name}</a>
                        </List.Item>
                    }
                />
            </Modal>
        </>
    )
}
export default ListFileComponent