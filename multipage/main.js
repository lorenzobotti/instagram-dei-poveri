const postsDiv = document.getElementById('posts-div')

const userInfo = getUserInfo()
const apiUrl = 'http://localhost:80'



let users = {}
let posts = []



async function getAllPosts() {
    const res = await fetch(`${apiUrl}/users`)
    const usersRes = await res.json()

    for (const user of usersRes) {
        users[user._id] = user

        for (const post of user.posts) {
            posts.push(post)
        }
    }

    return posts
}

function makePost(post) {
    console.log({ post })

    const cardDiv = document.createElement('div')
    cardDiv.classList.add('column', 'is-half')
    
    if (post.image) {
        const imageDiv = document.createElement('div')
        imageDiv.classList.add('card-image')
        
        const figure = document.createElement('figure')
        figure.classList.add('image')

        const image = document.createElement('img')
        image.src = `${apiUrl}/images/${post.image}`

        figure.appendChild(image)
        imageDiv.appendChild(figure)
        cardDiv.appendChild(imageDiv)
    }
    
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-content')

    const userFullName = document.createElement('b')
    userFullName.textContent = users[post.author].fullName

    const userUsername = document.createElement('p')
    userUsername.textContent = users[post.author].userFullName
    
    const postContents = document.createElement('p')
    postContents.textContent = post.contents

    const likeCount = document.createElement('p')
    likeCount.textContent = post.likes.length

    const likeButton = document.createElement('button')
    likeButton.classList.add('button')

    if (post.likes.includes(userInfo._id)) {
        likeButton.textContent = 'dislike'
        likeButton.onclick = event => dislikePost(post, event.target, likeCount)
    } else {
        likeButton.textContent = 'like'
        likeButton.onclick = event => likePost(post, event.target, likeCount)
    }


    
    cardBody.appendChild(userFullName)
    cardBody.appendChild(userUsername)
    cardBody.appendChild(postContents)
    cardBody.appendChild(likeButton)
    cardBody.appendChild(likeCount)

    cardDiv.appendChild(cardBody)
    return cardDiv
}

populatePosts()
async function populatePosts() {
    await getAllPosts()

    for (const post of posts) {
        const postDiv = makePost(post)
        postsDiv.appendChild(postDiv)
    }
}



/**
 * 
 * @param {HTMLButtonElement} button 
 * @param {Object} post 
 * @param {HTMLParagraphElement} count 
 */
async function likePost(post, button, count) {
    console.log({ liking: post })


    const res = await fetch(`${apiUrl}/private/like/${post._id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        }
    })


    console.log({ res })

    if(res.status == 200) {
        button.textContent = 'dislike'
        button.onclick = event => dislikePost(post, event.target, count)


        count.textContent = parseInt(count.textContent) + 1
    }
}

/**
 * 
 * @param {HTMLButtonElement} button 
 * @param {Object} post 
 * @param {HTMLParagraphElement} count 
 */
async function dislikePost(post, button, count) {
    console.log({ disliking: post })
    const res = await fetch(`${apiUrl}/private/like/${post._id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        }
    })


    console.log({ res })

    if(res.status == 200) {
        button.textContent = 'like'
        button.onclick = event => likePost(post, event.target, count)


        count.textContent = parseInt(count.textContent) - 1
    }
}


async function deletePost(id) {
    const res = await fetch(`${apiUrl}/`)
}