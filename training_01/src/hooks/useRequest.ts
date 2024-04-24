import axios, { AxiosHeaders } from "axios"

export const request = async ({
    url,
    body,
    method,
    headers,
}: { url: string, body: unknown, method: string, headers?: AxiosHeaders }) => {
    const reqHeaders =  {
        ...headers,
        'Content-Type': 'application/json'
    }

    const res = await axios({
        url,
        method,
        headers: reqHeaders,
        ...(body ? { data: body } : {})
    })

    return res.data
}

export const requestWithToken = async ({
    url,
    body,
    method,
    headers,
    typeAuthorized
}: { url: string, body?: unknown, method: string, headers?: AxiosHeaders, typeAuthorized: string }) => {
    const token = localStorage.getItem('token') as string
    const reqHeaders =  {
        ...headers,
        'Content-Type': 'application/json',
        [typeAuthorized]: `Bearer ${token}`
    }

    const res = await axios({
        url,
        method,
        headers: reqHeaders,
        ...(body ? { data: body } : {})
    })

    return res.data
}