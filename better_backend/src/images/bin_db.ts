import axios from 'axios'


export const storageUrl = 'http://images_db'

export async function store(image: Buffer): Promise<string> {
    const response = await axios(storageUrl, {
        method: 'POST',
        data: image.buffer,
    })

    return response.data as string
}


export async function remove(id: string) {
    const response = await axios(`${storageUrl}/${id}`, {
        method: 'DELETE',
    })

    if (response.status < 200 || response.status >= 300) {
        throw `can't delete ${id}, response:  ${response.status} - ${response.data}`
    }
}

export async function get(id: string): Promise<[Buffer, string]> {
    const response = await axios(`${storageUrl}/${id}`, {
        method: 'GET',
    })

    if (response.status < 200 || response.status >= 300) {
        throw `can't get ${id}, response:  ${response.status} - ${response.data}`
    }

    console.log({ headers: response.headers })

    const contentType = response.headers['content-type']
    return [response.data, contentType]
}

export async function list(): Promise<string[]> {
    const response = await axios(storageUrl)

    if (response.status < 200 || response.status >= 300) {
        throw `can't list files: ${response.status} - ${response.data}`
    }

    return JSON.parse(response.data)
}
