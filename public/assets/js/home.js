const getCookie = (cookie_name) => {
    // Construct a RegExp object as to include the variable name
    const re = new RegExp(`(?<=${cookie_name}=)[^;]*`);
    try {
        if (document.cookie.match(re)[0])
            return true // Will raise TypeError if cookie is not found
    } catch {
        return false
    }
}

(
    function islogged() {
        // console.log(getCookie('User_Session'))
        if (getCookie('User_Session')) {
            document.getElementById('login').style.display = 'none'
        } else {
            document.getElementById('logout').style.display = 'none'
            document.getElementById('profile').style.display = 'none'
        }

    }
)()