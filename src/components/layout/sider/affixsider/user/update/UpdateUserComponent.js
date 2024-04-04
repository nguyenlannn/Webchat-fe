import {Flex, Modal, Typography} from "antd";
import React from "react";
import UpdateAvatarComponent from "./UpdateAvatarComponent";
import UpdateNameComponent from "./UpdateNameComponent";
import UpdatePasswordComponent from "./UpdatePasswordComponent";

const {Text} = Typography;

const UpdateUserComponent = ({isModalOpen, closeModal, onRefresh, data, messageApi}) => {
    const handleOk = () => {
        closeModal()
    };
    const handleCancel = () => {
        closeModal()
    };
    return (
        <Modal
            title="Cập nhật tài khoản"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[]}
        >

            <UpdateAvatarComponent onRefresh={onRefresh} data={data} messageApi={messageApi}/>
            <Flex
                justify="center"
                style={{
                    marginTop: 16,
                }}
            >
                <Text>{data.result && data.result.email}</Text>
            </Flex>
            <UpdateNameComponent onRefresh={onRefresh} data={data} messageApi={messageApi}/>
            <UpdatePasswordComponent messageApi={messageApi}/>
        </Modal>
    )
}
export default UpdateUserComponent