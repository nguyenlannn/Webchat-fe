import React, {useState} from 'react'
import {Button, Card, Checkbox, Flex, Form, Input} from 'antd'
import TabComponent from "../../common/TabComponent"
import UseFetch from "../../../hooks/UseFetch"
import Api from "../../../api/Api"

const SignInComponent = ({onChangeTab, onRefreshPage, onSignInActiveAccount, account, messageApi}) => {
    const [data, setData] = useState({loading: false, result: null})
    const [remember, setRemember] = useState(true)

    const callApi = (values) => {
        setData(o => ({...o, loading: true}))
        const fetchAPI = async () => {
            const response = await UseFetch(Api.authsLoginPOST,
                "",
                JSON.stringify({
                    email: values.email,
                    password: values.password
                }))
            const data = await response.json();
            setData(o => ({...o, loading: false}))
            if (data.success) {
                localStorage.setItem("token", `Bearer ${data.data.token}`)
                messageApi.open({
                    type: 'success',
                    content: 'Đăng nhập thành công',
                    duration: 3,
                });
                onRefreshPage()
            } else {
                if (data.errorCode === -2) {
                    messageApi.open({
                        type: 'error',
                        content: 'Email không tồn tại',
                        duration: 1,
                    });
                } else if (data.errorCode === -3) {
                    messageApi.open({
                        type: 'error',
                        content: 'Mật khẩu không đúng',
                        duration: 1,
                    });
                } else if (data.errorCode === -4) {
                    messageApi.open({
                        type: 'error',
                        content: 'Tài khoản chưa kích hoạt',
                        duration: 1,
                    });
                    onSignInActiveAccount(values.email)
                }
            }
        }
        fetchAPI()
    }

    const onFinish = (values) => {
        if (remember) {
            localStorage.setItem("account", JSON.stringify({email: values.email, password: values.password}))
        }
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
                        initialValue={
                            account.activeAccountEmail === ""
                                ? (account.resetPasswordEmail === ""
                                        ? (localStorage.getItem("account") !== null
                                                ? JSON.parse(localStorage.getItem("account")).email
                                                : ""
                                        )
                                        : account.resetPasswordEmail
                                )
                                : account.activeAccountEmail
                        }
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
                        initialValue={
                            localStorage.getItem("account") !== null
                                ? JSON.parse(localStorage.getItem("account")).password
                                : ""
                        }
                    >
                        <Input.Password size={"large"}/>
                    </Form.Item>
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 0,
                            span: 24,
                        }}
                    >
                        <Checkbox
                            onClick={() => setRemember(!remember)}
                        >
                            Nhớ mật khẩu
                        </Checkbox>
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
                        wrapperCol={{
                            offset: 0,
                            span: 24
                        }}
                    >
                        <div
                            style={{
                                margin: "0 auto",
                                width: 100
                            }}
                        >
                            <Button
                                disabled={data.loading}
                                type="primary"
                                htmlType="submit"
                                size={"large"}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    )
}
export default SignInComponent