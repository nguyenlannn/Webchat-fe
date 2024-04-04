import {Flex, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import React, {useState} from "react";

const SearchSiderComponent = ({onChangeSearch}) => {

    const [input, setInput] = useState("")
    const onChange = (e) => {
        setInput(e.target.value)
    };
    return (
        <Flex
            style={{
                paddingLeft: 16,
                paddingRight: 16,
            }}
        >
            <Input
                style={{
                    fontSize: 18
                }}
                placeholder="Tìm kiếm"
                prefix={
                    <SearchOutlined onClick={o => onChangeSearch(input)}/>
                }
                onChange={onChange}
            />
        </Flex>
    )
}
export default SearchSiderComponent