import React, {useState} from "react";
import {Button, Card, Flex, Form, Input} from "antd";
import UseFetch from "../../../hooks/UseFetch";
import Api from "../../../api/Api";
import TabComponent from "../../common/TabComponent";

const ActiveAccountComponent = ({onChangeTab, onActiveAccount, account, messageApi}) => {
    const [data, setData] = useState({loading: false, result: null})

    const callApi = (values) => {
        setData(o => ({...o, loading: true}))
        const fetchAPI = async () => {
            const response = await UseFetch(Api.authsActivePOST,
                "",
                JSON.stringify({
                    email: values.email,
                    verifyToken: values.verifyToken
                }))
            const data = await response.json();
            setData(o => ({...o, loading: false}))
            if (data.success) {
                messageApi.open({
                    type: 'success',
                    content: 'Kích hoạt tài khoản thành công',
                    duration: 3,
                });
                onActiveAccount(values.email)
            } else {
                if (data.errorCode === -5) {
                    messageApi.open({
                        type: 'error',
                        content: 'Email không tồn tại',
                        duration: 1,
                    });
                } else if (data.errorCode === -6) {
                    messageApi.open({
                        type: 'error',
                        content: 'Mã kích hoạt không đúng',
                        duration: 1,
                    });
                }
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
                        initialValue={account.signUpEmail === "" ? account.signInActiveAccountEmail : account.signUpEmail}
                    >
                        <Input size={"large"}/>
                    </Form.Item>

                    <Form.Item
                        label="Mã kích hoạt"
                        name="verifyToken"
                        rules={[
                            {
                                required: true,
                                message: 'Sai định dạng.',
                                pattern: /^\d{4}$/
                            },
                        ]}
                    >
                        <Input.Password size={"large"}/>
                    </Form.Item>
                    <div
                        onClick={o => onChangeTab("reset-password")}
                        style={{
                            margin: "0 auto",
                            width: 96,
                            marginBottom: 20,
                            cursor: "pointer"
                        }}
                    >
                        Quên mật khẩu
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
                                width: 150
                            }}
                        >
                            <Button
                                disabled={data.loading}
                                type="primary"
                                htmlType="submit"
                                size={"large"}
                            >
                                Kích hoạt tài khoản
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    )
}
export default ActiveAccountComponent