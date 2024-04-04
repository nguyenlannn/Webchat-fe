import {UploadOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {Avatar, Flex, Input, Modal, TreeSelect, Upload} from 'antd';
import UseFetch from "../../../../hooks/UseFetch";
import Api from "../../../../api/Api";
import {useNavigate} from "react-router-dom";

const AddGroupComponent = ({messageApi, onRefresh, search}) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        if (userIds.length < 2) {
            messageApi.open({
                type: 'error',
                content: 'Thêm tối thiểu 2 bạn bè vào nhóm',
                duration: 1,
            });
        } else if (name.trim() === "") {
            messageApi.open({
                type: 'error',
                content: 'Vui lòng nhập tên nhóm',
                duration: 1,
            });
        } else {
            const fetchAPI = async () => {
                const response = await UseFetch(Api.channelsCreateGroupPOST,
                    "",
                    JSON.stringify({avatarUrl: avatarUrl, name: name, userIds: userIds}))
                const res = await response.json();
                if (res.success) {
                    messageApi.open({
                        type: 'success',
                        content: 'Tạo nhóm thành công',
                        duration: 3,
                    });
                    onRefresh()
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
            fetchAPI()

            setOpen(false);
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const [value, setValue] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState("")
    const [name, setName] = useState("")
    const [userIds, setUserIds] = useState([])
    const [treeData, setTreeData] = useState([])

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await UseFetch(Api.usersToAddGroupGET)
            const res = await response.json();
            if (res.success) {
                setTreeData(res.data.content.map(o => ({
                    title: (<>
                        <Avatar
                            style={{
                                width: 20,
                                height: 20
                            }}
                            src={o.avatarUrl}
                            alt={o.id}
                        /> {o.name}
                    </>),
                    value: `${o.name}`,
                    key: o.id,
                })))
            } else {
                localStorage.removeItem("token")
                navigate("/account")
            }
        }
        fetchAPI()
    }, [search]);

    const onChange = (newValue, newTitle) => {
        setValue(newValue);
        setUserIds(newTitle.map(o => o.props.children[0].props.alt))
    };
    const tProps = {
        treeData,
        value,
        onChange,
        treeCheckable: true,
        placeholder: "Thêm bạn bè vào nhóm",
        style: {
            width: '100%',
        },
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
                    setAvatarUrl(info.file.response.data.url)
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
        },
    };

    return (
        <>
            <UsergroupAddOutlined
                style={{
                    fontSize: 18,
                    paddingLeft: 8,
                }}
                onClick={showModal}
            />
            <Modal
                title="Thêm nhóm"
                open={open}
                onOk={handleOk}
                okText={"Tạo"}
                onCancel={handleCancel}
                cancelText={"Hủy bỏ"}
            >
                <TreeSelect {...tProps} />

                <Input
                    style={{
                        marginTop: 15
                    }}
                    placeholder="Tên nhóm"
                    onChange={(e) => setName(e.target.value)}
                />

                <Flex
                    style={{
                        marginTop: 15
                    }}
                    justify={"center"}
                    vertical={true}
                >
                    <Flex justify={"center"}>
                        <Avatar
                            style={{
                                width: 200,
                                height: 200
                            }}
                            src={avatarUrl}
                        >
                        </Avatar>
                    </Flex>
                    <Flex justify={"center"}>
                        <Upload
                            {...props}
                        >
                            <UploadOutlined/>
                        </Upload>
                    </Flex>
                </Flex>
            </Modal>
        </>
    )
}
export default AddGroupComponent