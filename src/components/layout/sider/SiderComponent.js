import React, {useEffect, useState} from 'react';
import {Layout} from 'antd';
import ListCurrentChannelComponent from "./ListCurrentChannelComponent";
import AffixSiderComponent from "./affixsider/AffixSiderComponent";
import {useNavigate} from "react-router-dom";
import UseFetch from "../../../hooks/UseFetch";
import Api from "../../../api/Api";

const {Sider} = Layout;

const SiderComponent = ({responseCollapsed, collapsed, notify}) => {
    const [data, setData] = useState({loading: false, result: []})
    const [search, setSearch] = useState({
        type: "",
        search: "",
        status: "ACCEPT",
        page: 1,
        size: 1000,
        loadMore: false,
        refresh: Math.random()
    })
    const navigate = useNavigate();

    const onRefresh = () => {
        setSearch(o => ({...o, refresh: Math.random()}))
    }

    useEffect(() => {
        if (notify !== null) {
            let list = data.result;

            const x = JSON.parse(notify)
            if (x.currentMessage.type === 'CREATE') {
                list.push(x);
            } else if (x.currentMessage.type === 'UPDATE') {
                list.forEach(o => {
                    if (o.id === x.id) {
                        o.currentMessage.content = x.currentMessage.content
                    }
                })
            } else if (x.currentMessage.type === 'DELETE') {
                list.forEach(o => {
                    if (o.id === x.id) {
                        o.currentMessage.content = ""
                    }
                })
            }

            list = list.sort((a, b) => {
                if (a.currentMessage && b.currentMessage) {
                    return a.currentMessage.createdAt - b.currentMessage.createdAt
                }
                if (b.currentMessage) {
                    return a.createdAt - b.currentMessage.createdAt
                }
                if (a.currentMessage) {
                    return a.currentMessage.createdAt - b.createdAt
                }
                return a.createdAt - b.createdAt
            })
            list = [...new Map(list.map(item => [item["id"], item])).values()];
            list = list.sort((a, b) => {
                if (a.currentMessage && b.currentMessage) {
                    return b.currentMessage.createdAt - a.currentMessage.createdAt
                }
                if (a.currentMessage) {
                    return b.createdAt - a.currentMessage.createdAt
                }
                if (b.currentMessage) {
                    return b.currentMessage.createdAt - a.createdAt
                }
                return a.createdAt - b.createdAt
            })
            setData(o => (
                {
                    ...o,
                    result: list
                }
            ))
        }
    }, [notify])

    useEffect(() => {
        if (!data.loading) {
            setData(o => ({...o, loading: true}))
            const fetchAPI = async () => {
                const response = await UseFetch(Api.channelsGET,
                    `?type=${search.type}&search=${search.search}&status=${search.status}&page=${search.page}&size=${search.size}`
                )
                const res = await response.json();
                if (res.success) {
                    let list
                    if (!search.loadMore) {
                        list = res.data.content.sort((a, b) => {
                                if (a.currentMessage && b.currentMessage) {
                                    return b.currentMessage.createdAt - a.currentMessage.createdAt
                                }
                                if (a.currentMessage) {
                                    return b.createdAt - a.currentMessage.createdAt
                                }
                                if (b.currentMessage) {
                                    return b.currentMessage.createdAt - a.createdAt
                                }
                                return b.createdAt - a.createdAt
                            }
                        )
                    } else {
                        list = data.result.concat(res.data.content).sort((a, b) => {
                            if (a.currentMessage && b.currentMessage) {
                                return b.currentMessage.createdAt - a.currentMessage.createdAt
                            }
                            if (a.currentMessage) {
                                return b.createdAt - a.currentMessage.createdAt
                            }
                            if (b.currentMessage) {
                                return b.currentMessage.createdAt - a.createdAt
                            }
                            return b.createdAt - a.createdAt
                        })
                        list = [...new Map(list.map(item => [item["id"], item])).values()];
                    }
                    setData(o => (
                        {
                            ...o,
                            loading: false,
                            result: list
                        }
                    ))
                } else {
                    localStorage.removeItem("token")
                    navigate("/account")
                }
            }
            fetchAPI()
        }
    }, [search])

    const onChangeSearch = (value) => {
        setSearch(o => ({...o, search: value, page: 1, loadMore: false}))
    }

    const onChangeType = (value) => {
        setSearch(o => ({...o, type: value, page: 1, loadMore: false}))
    }

    const onChangePage = (value) => {
        setSearch(o => ({...o, page: value, loadMore: true}))
    }
    return (
        <Sider
            style={{
                height: window.innerHeight,
                border: "1px solid LightGrey",
                background: "rgb(224, 250, 255)"
            }}
            breakpoint="md"
            collapsedWidth="1"
            onBreakpoint={(broken) => {
            }}
            onCollapse={(collapsed, type) => {
                responseCollapsed(collapsed)
            }}
            collapsed={collapsed}
            width={300}
            theme={"light"}
        >
            <AffixSiderComponent onChangeType={onChangeType} onChangeSearch={onChangeSearch} onRefresh={onRefresh}
                                 search={search} collapsed={collapsed}/>
            <ListCurrentChannelComponent onChangePage={onChangePage} search={search} data={data} collapsed={collapsed}/>
        </Sider>
    )
}
export default SiderComponent