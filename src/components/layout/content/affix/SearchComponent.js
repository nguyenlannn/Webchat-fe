import {SearchOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {Flex, Input} from "antd";
import {useSearchParams} from "react-router-dom";

const SearchComponent = () => {
    const [input, setInput] = useState("")
    const [searchParams, setSearchParams] = useSearchParams()
    const onChange = (e) => {
        setInput(e.target.value)
    };

    const search = () => {
        setSearchParams({channelId: searchParams.get("channelId"), page: 1, loadMore: false, content: input})
    }

    return (
        <Flex
            style={{
                width: "100%",
                height: 38,
                marginTop: 16,
                marginLeft: 16
            }}
        >
            <Input
                style={{
                    fontSize: 18
                }}
                placeholder="Tìm kiếm"
                prefix={
                    <SearchOutlined onClick={o => search()}/>
                }
                onChange={onChange}
            />
        </Flex>
    )
}
export default SearchComponent