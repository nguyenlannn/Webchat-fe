const UseFetch = (api, params = "", body = null) => {

    return fetch(`${process.env.REACT_APP_HOST}${api.path}${params}`,
        {
            method: api.method,
            headers: {
                "Content-Type": api.contentType,
                "Authorization": localStorage.getItem("token")
            },
            body: body
        }
    )
}
export default UseFetch