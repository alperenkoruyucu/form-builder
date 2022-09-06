import './App.css'
import {
    BrowserRouter,
    Routes,
    Route,
    // Link
} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import 'font-awesome/css/font-awesome.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer } from 'react-toastify'
import UserCreate from './components/UserCreate'
import "./UserCreate.css"
import LoginPage from './components/LoginPage'
import UserTable from './components/UserTable'
import FormList from './Pages/FormList'
import DynamicLoginPage from './Pages/DynamicLoginPage'
import CreateAdmin from './Pages/CreateAdmin'
import FormCreate from './Pages/FormCreate'
import FormTable from './Pages/FormTable'
import FormEdit from './Pages/FormEdit'
import FormView from './Pages/FormView'
import './i18n'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from "react-redux";
import { changeLanguage, changeTheme } from './actions'






const App = () => {        
    
    const {theme, language} = useSelector(state=>state.ui)
    console.log(theme)    
    console.log(language)
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation()
    
    
    
    useEffect(()=>{
        console.log('useEffect language geldi')
        i18n.changeLanguage(language)        

    },[language])

    
    return (
        <div className={theme}>
            <header>
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="nav__links navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href="/">Home</a>
                                </li>
                                <li className="nav-item active">
                                    <a className="nav-link" href="/dynamic/form-list">Form List</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/users">Admin Panel</a>
                                </li>
                                <li className="nav-item">
                                    <select name='language' onChange={(e) => dispatch(changeLanguage(e.target.value))}>
                                        <option value="en">English</option>
                                        <option value="tr">Turkish</option>
                                    </select>
                                </li>
                            </ul>                            
                            <span className="span.navbar-nav.mr-sm-2" id="google_translate_element"></span>
                        </div>
                    </div>
                </nav>
                <div id="google_translate_element"></div>

            </header>
            <div id="toggle">

                <i className="indicator" onClick={() => {                    
                    dispatch(changeTheme(theme==="dark"?"light":"dark"))                    
                }}></i>                
            </div>
                        
                <BrowserRouter>
                
                    <ToastContainer
                        position="top-right"
                        autoClose={500}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <Routes>
                        <Route path="/">
                            <Route index element={<UserCreate />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="users" element={<UserTable />} />
                        </Route>
                        <Route path="/dynamic">
                            <Route index element={<DynamicLoginPage />} />
                            <Route path="create-admin" element={<CreateAdmin />} />
                            <Route path="form-create" element={<FormCreate />} />
                            <Route path="form-list" element={<FormList />} />
                            <Route path="form-table/:id" element={<FormTable />} />
                            <Route path="form-edit/:id" element={<FormEdit />} />
                            <Route path="form/:id" element={<FormView />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
        </div>
    )
}

export default App
