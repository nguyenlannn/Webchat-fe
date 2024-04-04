import LayoutComponent from "../../layout/LayoutComponent";
import React, {useEffect, useState} from "react";
import SendMessageComponent from "./SendMessageComponent";
import ListMessageComponent from "./ListMessageComponent";
import {useNavigate} from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const [editContent, setEditContent] = useState({id: null, content: ""})

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/account")
        }
    }, []);

    const setContent = (id, content) => {
        setEditContent(o => {
            if (id !== '1') {
                o.id = id
                return ({...o, id: id, content: content})
            } else {
                return ({...o, content: content})
            }
        })
    }
    return (
        <LayoutComponent>
            <ListMessageComponent setContent={setContent}/>
            <SendMessageComponent editContent={editContent} setContent={setContent}/>
        </LayoutComponent>
    )
}
export default HomePage