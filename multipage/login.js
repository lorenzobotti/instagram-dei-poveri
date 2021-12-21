const loginButton = document.getElementById('login-button')
const loginForm = document.getElementById('login-form')



if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()
    
        const username = loginForm['username'].value
        const password = loginForm['password'].value
    
        console.log({ username, password })
    
        login(username, password)
            .then(success => console.log({ success }))
            .catch(e => console.error({ e }))
    })
}




const apiUrl = 'http://localhost:80'


/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
async function login(username, password) {
    const reqUrl = `${apiUrl}/private/login/${username}`
    const reqBody = JSON.stringify({ password })

    console.log({ reqUrl, reqBody })

    const res = await fetch(reqUrl, {
        method: 'POST',
        body: reqBody,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (res.status != 200) {
        return false
    }

    await saveUserInfo(username)

    const token = await res.text()
    sessionStorage['token'] = token
    sessionStorage['logged-in'] = 'true'

    const homeLink = document.createElement('a')
    homeLink.href = 'index.html'
    homeLink.click()
}


const signupButton = document.getElementById('signup-button')
const signupForm = document.getElementById('signup-form')

if (signupForm) {
    signupForm.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()
    
        const username = signupForm['username'].value
        const fullName = signupForm['full-name'].value
        const email = signupForm['email'].value
        const password = signupForm['password'].value
        const passwordConfirm = signupForm['password-confirm'].value

        if(password !== passwordConfirm) {
            console.log('passwords dont match')
        }
    
        // TODO:
        console.log({ username, password, fullName, email })
    
        signup(username, fullName, email, password  )
            .then(success => console.log({ success }))
            .catch(e => console.error({ e }))
    })
}


/**
 * 
 * @param {string} username 
 * @param {string} fullName 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
async function signup(username, fullName, email, password) {
    const reqUrl = `${apiUrl}/users`
    const reqBody = JSON.stringify({ username, fullName, email, password })

    console.log('requesting signup')

    const res = await fetch(reqUrl, {
        method: 'POST',
        body: reqBody,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    console.log('requested signup')


    if (res.status != 200 && res.status != 201) {
        return false
    }

    const loginSuccess = await login(username, password)
    if (!loginSuccess) {
        return false
    }
}


/**
 * @param {string} username 
 */
async function saveUserInfo(username) {
    const userInfoRes = await fetch(`${apiUrl}/users/username/${username}`)
    const userInfo = await userInfoRes.json()

    if (userInfoRes.status != 200) {
        return false
    } 

    sessionStorage['user-info'] = JSON.stringify(userInfo)
}