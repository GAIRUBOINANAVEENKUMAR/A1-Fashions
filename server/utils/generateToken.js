const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    };

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        });
};

module.exports = sendToken;
