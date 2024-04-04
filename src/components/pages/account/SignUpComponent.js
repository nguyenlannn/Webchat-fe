import React, {useState} from 'react';
import {Button, Card, Flex, Form, Input} from 'antd';
import TabComponent from "../../common/TabComponent";
import UseFetch from "../../../hooks/UseFetch";
import Api from "../../../api/Api";

const SignUpComponent = ({onChangeTab, onSignUp, account, messageApi}) => {
    const [data, setData] = useState({loading: false, result: null})

    const callApi = (values) => {
        setData(o => ({...o, loading: true}))
        const fetchAPI = async () => {
            const response = await UseFetch(Api.authsRegisterPOST,
                "",
                JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password
                }))
            const data = await response.json();
            setData(o => ({...o, loading: false}))
            if (data.success) {
                messageApi.open({
                    type: 'success',
                    content: "Đăng ký thành công. Vui lòng kích hoạt tài khoản",
                    duration: 3,
                });
                onSignUp(values.email)
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Email đã tồn tại',
                    duration: 1,
                });
            }
        }
        fetchAPI()
    };

    const onFinish = (values) => {
        callApi(values)
    };
    const onFinishFailed = () => {
    };
    return (
        <Flex
            justify="center"
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 500,
                    marginTop: 20
                }}
            >
                <TabComponent onChangeTab={onChangeTab} activeKey={account.activeKey}/>
                <Form
                    name="basic"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        style={{
                            marginTop: -45
                        }}
                        label="Tên"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Tên từ 1-50 ký tự.',
                                pattern: /^.{1,50}$/
                            },
                        ]}
                    >
                        <Input size={"large"}/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Sai định dạng.',
                                type: "email"
                            },
                            {
                                required: false,
                                message: 'Chứa tối đa 50 ký tự.',
                                max: 50
                            },
                        ]}
                    >
                        <Input size={"large"}/>
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
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
                        <Input.Password size={"large"}/>
                    </Form.Item>
                    <Form.Item
                        label="Nhập lại mật khẩu"
                        dependencies={['password']}
                        name="repassword"
                        rules={[
                            {
                                required: true,
                                message: 'Mật khẩu không khớp',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp.'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password size={"large"}/>
                    </Form.Item>
                    <div
                        onClick={o => onChangeTab("reset-password")}
                        style={{
                            margin: "0 auto",
                            width: 96,
                            marginBottom: 10,
                            cursor: "pointer"
                        }}
                    >
                        Quên mật khẩu
                    </div>
                    <div
                        onClick={o => onChangeTab("active-account")}
                        style={{
                            margin: "0 auto",
                            width: 120,
                            marginBottom: 20,
                            cursor: "pointer"
                        }}
                    >
                        Kích hoạt tài khoản
                    </div>
                    <Form.Item
                        style={{
                            marginBottom: -0
                        }}
                        wrapperCol={{
                            offset: 0,
                            span: 24
                        }}
                    >
                        <div
                            style={{
                                margin: "0 auto",
                                width: 82
                            }}
                        >
                            <Button
                                disabled={data.loading}
                                type="primary"
                                htmlType="submit"
                                size={"large"}
                            >
                                Đăng ký
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    )
}
export default SignUpComponent