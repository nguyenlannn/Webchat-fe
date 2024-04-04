import React, {useState} from 'react';
import {Button, Card, Flex, Form, Input} from 'antd';
import TabComponent from "../../common/TabComponent";
import UseFetch from "../../../hooks/UseFetch";
import Api from "../../../api/Api";

const ResetPasswordComponent = ({onChangeTab, onResetPassword, account, messageApi}) => {
    const [data, setData] = useState({loading: false, result: null})

    const callApi = (values) => {
        setData(o => ({...o, loading: true}))
        const fetchAPI = async () => {
            const response = await UseFetch(Api.authsResetPasswordPOST,
                "",
                JSON.stringify({
                    email: values.email,
                }))
            const data = await response.json();
            setData(o => ({...o, loading: false}))
            if (data.success) {
                messageApi.open({
                    type: 'success',
                    content: 'Mật khẩu mới đã được gửi về email của bạn',
                    duration: 3,
                });
                onResetPassword(values.email)
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Email không tồn tại',
                    duration: 1,
                });
            }
        }
        fetchAPI()
    }

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
                        wrapperCol={{
                            offset: 0,
                            span: 24
                        }}
                    >
                        <div
                            style={{
                                margin: "0 auto",
                                width: 132
                            }}
                        >
                            <Button
                                disabled={data.loading}
                                type="primary"
                                htmlType="submit"
                                size={"large"}
                            >
                                Đặt lại mật khẩu
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    )
}
export default ResetPasswordComponent