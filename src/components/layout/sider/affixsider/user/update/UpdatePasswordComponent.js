import {Button, Flex, Form, Input, Modal, Typography} from "antd";
import React, {useState} from "react";
import {EditOutlined} from "@ant-design/icons";
import Api from "../../../../../../api/Api";
import UseFetch from "../../../../../../hooks/UseFetch";
import {useNavigate} from "react-router-dom";

const {Text} = Typography;

const UpdatePasswordComponent = ({messageApi}) => {
    const [loading, setLoadling] = useState(false)
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

    const onFinish = (values) => {
        const fetchAPI = async () => {
            setLoadling(true)
            const response = await UseFetch(Api.usersPATCH,
                "",
                JSON.stringify({
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                }))
            const data = await response.json();
            setLoadling(false)
            if (data.success) {
                messageApi.open({
                    type: 'success',
                    content: 'Cập nhật mật khẩu thành công',
                    duration: 3,
                });
            } else {
                if (data.errorCode === -37) {
                    messageApi.error("Mật khẩu cũ không đúng")
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
        }
        fetchAPI()
    };
    const onFinishFailed = () => {
    };

    return (
        <Flex
            style={{
                marginTop: 16,
            }}
            justify="center"
        >
            <Text> Đổi mật khẩu <EditOutlined onClick={showModal}/></Text>
            <Modal
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <Form
                    style={{
                        marginTop: 30
                    }}
                    name="basic"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        style={{
                            marginLeft: 30,
                            marginRight: 30
                        }}
                        name="oldPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký số.',
                                pattern: /^(?=.*\d).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký tự ặc biệt.',
                                pattern: /^(?=.*[\W]).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký tự in hoa.',
                                pattern: /^(?=.*[A-Z]).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký tự in thường.',
                                pattern: /^(?=.*[a-z]).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa từ 8-16 ký tự.',
                                pattern: /^.{8,16}$/
                            },
                        ]}
                    >
                        <Input.Password placeholder={"Mật khẩu cũ"}/>
                    </Form.Item>
                    <Form.Item
                        style={{
                            marginLeft: 30,
                            marginRight: 30
                        }}
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký số.',
                                pattern: /^(?=.*\d).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký tự ặc biệt.',
                                pattern: /^(?=.*[\W]).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký tự in hoa.',
                                pattern: /^(?=.*[A-Z]).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa ít nhất 1 ký tự in thường.',
                                pattern: /^(?=.*[a-z]).*$/
                            },
                            {
                                required: true,
                                message: 'Chứa từ 8-16 ký tự.',
                                pattern: /^.{8,16}$/
                            },
                        ]}
                    >
                        <Input.Password placeholder={"Mật khẩu mới"}/>
                    </Form.Item>
                    <Form.Item
                        style={{
                            marginLeft: 30,
                            marginRight: 30
                        }}
                        dependencies={['newPassword']}
                        name="repassword"
                        rules={[
                            {
                                required: true,
                                message: 'Mật khẩu không khớp.',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder={"Nhâp lại mật khẩu"}/>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 0,
                            span: 24
                        }}
                    >
                        <div
                            style={{
                                margin: "0 auto",
                                width: 87
                            }}
                        >
                            <Button
                                disabled={loading}
                                type="primary"
                                htmlType="submit"
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    )
}
export default UpdatePasswordComponent