import React from 'react';
import {Avatar, List, Typography} from 'antd';
import {useSearchParams} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const {Text} = Typography;

const ContainerHeight = window.innerHeight - 198;

const ListCurrentChannelComponent = ({onChangePage, search, data, collapsed}) => {
    const [, setSearchParams] = useSearchParams()
    const onScroll = (e) => {
        if (Math.floor(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) === ContainerHeight) {
            if (!data.loading) {
                onChangePage(search.page + 1)
            }
        }
    };

    return (
        <div
            id="scrollableDiv"
            style={{
                height: ContainerHeight,
                overflow: 'auto',
                padding: "0 16px 0",
                visibility: !collapsed ? (data.result.length > 0 ? "visible" : "hidden") : "hidden"
            }}
            onScroll={onScroll}
        >
            <InfiniteScroll
                dataLength={data.result.length}
                next={null}
                hasMore={null}
                loader={null}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={data.result}
                    renderItem={(item) =>
                        <List.Item
                            style={{
                                margin: "8px 0",
                                cursor: "pointer"
                            }}
                            key={item.id}
                            onClick={() => setSearchParams({channelId: item.id, page: 1, loadMore: false})}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{
                                            width: 48,
                                            height: 48
                                        }}
                                        src={item.avatarUrl}
                                    />
                                }
                                title={
                                    <Text
                                        style={{
                                            width: 200,
                                        }}
                                        ellipsis={{
                                            tooltip: item.name
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                }
                                description={
                                    <Text
                                        style={{
                                            width: 200,
                                        }}
                                        ellipsis={{
                                            tooltip: item.currentMessage && item.currentMessage.content
                                        }}
                                    >
                                        {item.currentMessage && item.currentMessage.content}
                                    </Text>
                                }
                            />
                            {/*<div>Content</div>*/}
                        </List.Item>}
                />
            </InfiniteScroll>
        </div>
    )
}
export default ListCurrentChannelComponent