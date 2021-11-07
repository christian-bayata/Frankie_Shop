//Store user details(user and token) in cookie
const storeToken = (user, statusCode, res) => {
    //Get the token
    const token = user.generateAuthToken()
    
    //define the cookies options
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRATION_TIME * 24 * 60 * 60 * 1000
        ),
  
        httpOnly: true
    }; 

    res.status(statusCode).cookie('token', token, cookieOptions).json({
        success: true,
        token,
        user
    })
}
 
module.exports = storeToken;