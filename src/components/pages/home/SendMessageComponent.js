import {Affix, Divider, Flex, Modal, Upload} from "antd";
import React, {useState} from "react";
import {FileAddOutlined, FolderAddOutlined, SendOutlined} from "@ant-design/icons";
import UseFetch from "../../../hooks/UseFetch";
import Api from "../../../api/Api";
import {useNavigate, useSearchParams} from "react-router-dom";

const SendMessageComponent = ({editContent, setContent}) => {
    const [data, setData] = useState({loading: false})
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()

    const send = () => {
        // if (message.content !== "") {
        setData(o => ({...o, loading: true}))
        const fetchAPI = async () => {
            if (editContent.id != null) {
                const response = await UseFetch(Api.channelsChannelIdMessagesMessageIdPATCH,
                    `${searchParams.get("channelId")}/messages/${editContent.id}`,
                    JSON.stringify({content: editContent.content})
                )
                const res = await response.json();
                if (res.success) {
                    setContent(null, "")
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            } else {
                const response = await UseFetch(Api.channelsChannelIdMessagesPOST,
                    `${searchParams.get("channelId")}/messages`,
                    JSON.stringify({content: editContent.content})
                )
                const res = await response.json();
                if (res.success) {
                    setContent(null, "")
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
        }
        fetchAPI()
        // }
    }

    const onChangeFiles = (info) => {
        if (info.file.status === 'done') {
            if (info.file.response.success) {

                let files = [{
                    contentType: info.file.response.data.contentType,
                    name: info.file.response.data.name,
                    size: info.file.response.data.size,
                    url: info.file.response.data.url
                }]
                const fetchAPI = async () => {
                    const response = await UseFetch(Api.channelsChannelIdMessagesPOST,
                        `${searchParams.get("channelId")}/messages`,
                        JSON.stringify({files: files})
                    )
                    const res = await response.json();
                    if (res.success) {
                        // setData(o => ({...o, loading: false,}))
                    } else {
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
    }

    const items = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗',
        '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟',
        '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😶',
        '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
        '😮', '😲', '🥱', '😴', '🤤', '😪', '😮', '😵', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
        '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '️👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼',
        '😽', '🙀', '😿', '😾'
    ]

    console.log("hehe", editContent)
    return (
        <Affix
            offsetBottom={0}
        >
            <Flex
                vertical={true}
                style={{
                    background: "white",
                }}
            >
                <Flex
                    align={"flex-start"}
                    style={{
                        paddingTop: 5,
                        paddingLeft: 16,
                        paddingRight: 16
                    }}
                >
                    <Upload
                        multiple={true}
                        // directory={false}
                        name='file'
                        action={`${process.env.REACT_APP_HOST}${Api.filesPOST.path}`}
                        headers={
                            {"Authorization": localStorage.getItem("token")}
                        }
                        onChange={onChangeFiles}
                        showUploadList={false}
                    >
                        <FileAddOutlined
                            style={{
                                cursor: "pointer",
                                fontSize: 24,
                                marginTop: 5
                            }}
                        />
                    </Upload>
                    <Upload
                        multiple={true}
                        directory={true}
                        name='file'
                        action={`${process.env.REACT_APP_HOST}${Api.filesPOST.path}`}
                        headers={
                            {"Authorization": localStorage.getItem("token")}
                        }
                        onChange={onChangeFiles}
                        showUploadList={false}
                    >
                        <FolderAddOutlined
                            style={{
                                cursor: "pointer",
                                fontSize: 24,
                                marginLeft: 16,
                                marginTop: 5
                            }}
                        />
                    </Upload>

                    <i
                        className="bi bi-emoji-smile"
                        style={{
                            fontSize: 24,
                            marginLeft: 16,
                            marginBottom: 5,
                            cursor: "pointer"
                        }}
                        onClick={() => setOpen(true)}
                    />
                    <Modal
                        title=""
                        open={open}
                        onOk={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        footer={[]}
                        width={250}
                        style={{
                            top: 480,
                            marginLeft: 300,
                        }}
                        bodyStyle={{overflowY: 'auto', maxHeight: 200}}
                        closeIcon={null}
                    >
                        <Flex
                            wrap="wrap"
                            gap="small"
                            style={{
                                fontSize: 24
                            }}
                        >
                            {items.map(o =>
                                <div
                                    style={{cursor: "pointer"}}
                                    onClick={(e) => {
                                        setContent('1', editContent.content + e.target.outerText)
                                    }}
                                >
                                    {o}
                                </div>
                            )}
                        </Flex>
                    </Modal>
                    <div style={{width: "100%"}}></div>
                    <SendOutlined
                        style={{
                            fontSize: 24,
                            marginLeft: 12,
                            marginTop: 5
                        }}
                        disabled={true}
                        onClick={() => send()}
                    />
                </Flex>
                <Divider
                    style={{
                        margin: 0
                    }}
                />
                <textarea
                    rows="4"
                    style={{
                        margin: "0 16px 16px 16px",
                        border: "none",
                        outline: "none",
                        resize: "none"
                    }}
                    placeholder="Nhập tin nhắn"
                    onChange={(e) =>
                        setContent('1', e.target.value)
                    }
                    // defaultValue={editContent.id != null ? editContent.content : message.content}
                    value={editContent.content}
                >
                    {/*{editContent.content}*/}
                </textarea>
            </Flex>
        </Affix>
    )
}
export default SendMessageComponent