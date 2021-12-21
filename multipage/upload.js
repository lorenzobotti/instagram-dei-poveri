const uploadButton = document.getElementById('upload-button')
const uploadForm = document.getElementById('upload-form')


const apiUrl = 'http://localhost:80'


uploadForm.addEventListener('submit', async event => {
    event.preventDefault()
    event.stopPropagation()

    const contents = uploadForm['contents'].value
    const file = uploadForm['image']

    console.log({ contents })
    console.log(file)
    console.log(file.files)

    let data = new FormData()
    data.append('contents', contents)

    if (file.files && file.files.length > 0) {
        console.log('mando immagine')
        data.append('image', file.files[0])
    }


    const res = await fetch(`${apiUrl}/private/post`, {
        method: 'POST',
        body: data,
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': '*/*',
            // 'Content-Type': 'multipart/form-data'
            // 'Content-Type': undefined,
        },
    })

    console.log({ res })
})
