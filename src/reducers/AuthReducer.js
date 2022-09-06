const authState = {
    isLoggedIn: false,
    user:{
        "account_id": "",
        "username": "",
        "role": "",
        "iat": "",
        "exp": "",
      },
};


const authreducer = (state = authState, action) => {
    return state;
}

export default authreducer;