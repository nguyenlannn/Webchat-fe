import {Flex, Pagination} from "antd";

const PaginationComponent = ({data, onChange}) => {
    return (
        <Flex
            justify="center"
        >
            <Pagination
                total={data.result && data.result.totalElements || 0}
                onChange={(page, pageSize) => onChange(page, pageSize)}
                pageSizeOptions={[1, 10, 20, 40, 80, 160, 320, 640, 1280]}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `${total} kết quả`}
            />
        </Flex>
    )
}
export default PaginationComponent