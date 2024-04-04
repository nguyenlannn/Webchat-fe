import {Button, Flex, Image, Modal, Space, Upload} from "antd";
import React, {useState} from "react";
import {UploadOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import Api from "../../../../../../api/Api";
import UseFetch from "../../../../../../hooks/UseFetch";

const UpdatePasswordComponent = ({onRefresh, data, messageApi}) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const props = {
        name: 'file',
        action: `${process.env.REACT_APP_HOST}${Api.filesPOST.path}`,
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        onChange(info) {
            if (info.fileList.length === 0) {
                const fetchAPI = async () => {
                    await UseFetch(Api.filesFileIdDELETE,
                        `${info.file.response.data.id}`
                    )
                }
                fetchAPI()
                onRefresh()
            } else if (info.fileList.length > 1) {
                const fetchAPI = async () => {
                    await UseFetch(Api.filesFileIdDELETE,
                        `${info.fileList[0].response.data.id}`
                    )
                }
                fetchAPI()
                info.fileList.shift()
            }
            if (info.file.status === 'done') {
                if (info.file.response.success) {
                    const fetchAPI = async () => {
                        const response = await UseFetch(Api.usersPATCH,
                            "",
                            JSON.stringify({avatarUrl: info.file.response.data.url})
                        )
                        const data = await response.json();
                        if (data.success) {
                            messageApi.open({
                                type: 'success',
                                content: 'Cập nhật ảnh đại diện thành công',
                                duration: 3,
                            });
                            onRefresh()
                        } else {
                            const fetchAPI = async () => {
                                await UseFetch(Api.filesFileIdDELETE,
                                    `${info.file.response.data.id}`
                                )
                            }
                            fetchAPI()
                            localStorage.removeItem("token")
                            navigate("/account")
                        }
                    }
                    fetchAPI()
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
        },
    };

    return (
        <Flex
            justify="center"
        >
            <Image
                style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%"
                }}
                src={data.result && data.result.avatarUrl}
            />
            <Space align={"end"}>
                <UploadOutlined onClick={showModal}/>
                <Modal
                    open={open}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[]}
                >
                    <Upload {...props}>
                        <Button>
                            <UploadOutlined/> Tải ảnh lên
                        </Button>
                    </Upload>,
                </Modal>
            </Space>
        </Flex>
    )
}
export default UpdatePasswordComponent