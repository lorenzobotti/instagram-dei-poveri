function getUserInfo() {
    if (!loggedIn()) {
        return undefined
    }

    return JSON.parse(sessionStorage['user-info'])
}

function getToken() {
    return sessionStorage['token']
}


/**
 * @returns {boolean}
 */
function loggedIn() {
    return sessionStorage['logged-in'] == 'true'
}   

console.log({ logged: loggedIn() })

if (!loggedIn()) {
    const loginLink = document.createElement('a')
    loginLink.href = 'login.html'
    loginLink.click()
} else {
    document.getElementById('logged').style.display = 'inline'
    document.getElementById('not-logged').style.display = 'none'
    document.getElementById('welcome-username').textContent = getUserInfo().username
}