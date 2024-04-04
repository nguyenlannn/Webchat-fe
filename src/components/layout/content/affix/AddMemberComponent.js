import {UsergroupAddOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {Avatar, Modal, TreeSelect} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";
import UseFetch from "../../../../hooks/UseFetch";
import Api from "../../../../api/Api";

const AddMemberComponent = ({messageApi}) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [userIds, setUserIds] = useState([])
    const [treeData, setTreeData] = useState([])
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        if (userIds.length < 1) {
            messageApi.open({
                type: 'error',
                content: 'Vui lòng chọn bạn bè',
                duration: 1,
            });
        } else {
            const fetchAPI = async () => {
                const response = await UseFetch(Api.channelsAddUserGroupPOST,
                    `${searchParams.get("channelId")}/add-user-group`,
                    JSON.stringify({userIds: userIds})
                )
                const res = await response.json();
                if (res.success) {
                    messageApi.open({
                        type: 'success',
                        content: 'Thêm thành viên thành công',
                        duration: 3,
                    });
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

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await UseFetch(Api.usersToAddGroupGET,
                `?channelId=${searchParams.get("channelId")}`
            )
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
                    value: o.name,
                    key: o.id,
                    disabled: o.status === "ACCEPT"
                })))
            }
        }
        fetchAPI()
    }, [searchParams]);

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

    return (
        <>
            <UsergroupAddOutlined
                style={{
                    fontSize: 18,
                    paddingLeft: 8,
                    paddingRight: 8
                }}
                onClick={showModal}
            />
            <Modal
                title="Thêm thành viên"
                open={open}
                onOk={handleOk}
                okText={"Thêm"}
                onCancel={handleCancel}
                cancelText={"Hủy bỏ"}
            >
                <TreeSelect {...tProps} />
            </Modal>
        </>
    )
}
export default AddMemberComponent