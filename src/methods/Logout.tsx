const Logout = (navigate:any) => {
    localStorage.removeItem('jwt')
    navigate('/dynamic')
}
export default Logout
