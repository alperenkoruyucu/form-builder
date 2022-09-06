import React, { useEffect, useState } from 'react'
import '../UserCreate.css'
import Swal from 'sweetalert2'
import { GetAvailableForms, DeleteFormsByIds } from '../methods/DynamicForms'
import 'react-confirm-alert/src/react-confirm-alert.css'
import useStore from '../store'
import { isExpired } from '../methods/Account'
import { GetUserDetails } from '../methods/GetUsers'
import logout from '../methods/Logout'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AdminPanel = () => {
    const [data, setData] = useState<any>([])
    const [userDetail, setUserDetail] = useState<any>('')
    const [search, setSearch] = useState<any>('')
    const store = useStore()
    const { toggleUpdate } = store
    const { isUpdated } = store
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const { t, i18n } = useTranslation()
    const CrudTools = (permission: any, id: any) => {
        if (permission === 'write') {
            return (
                <div>

                    <Link
                        to={`/dynamic/form/${id}`}
                        style={{
                            color: 'white',
                        }}
                        type="button"
                        id="update"
                        className="btn btn-md"
                    >
                        <i className="fa fa-eye icon-green" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title={t("View Form")}></i>
                    </Link>


                    <Link
                        to={`/dynamic/form-table/${id}`}
                        style={{
                            color: 'white',
                            marginLeft: '0.3rem',
                        }}
                        type="button"
                        id="update"
                        className="btn btn-md"
                    >
                        <i className="fa fa-info-circle icon-blue" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title={t("View Data Saved to Form")}></i>
                    </Link>


                    <Link
                        to={`/dynamic/form-edit/${id}`}
                        style={{
                            marginLeft: '0.3rem',
                            color: 'white',
                        }}
                        type="button"
                        className="btn btn-md"
                    >
                        {' '}
                        <i className="fa fa-pencil-square-o icon-orange" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title={t("Update Form")}></i>

                    </Link>


                    <button
                        style={{
                            marginLeft: '0.4rem',
                        }}
                        type="button"
                        onClick={() => {
                            DeleteForms([id])
                        }}
                        id="sil"
                        className="btn btn-md"
                    >
                        <i className="fa fa-trash icon-red" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title={t("Delete Form")}></i>
                    </button>
                    {' '}
                </div>
            )
        } else if (permission === 'read') {
            return (
                <div>

                    <Link
                        to={`/dynamic/form/${id}`}
                        style={{
                            color: 'green',
                        }}
                        type="button"
                        id="update"
                        className="btn btn-sm bg-white"
                    >
                        <i className="fa fa-eye icon-green" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title={t("View Form")}></i>
                    </Link>
                    {' '}

                    <Link
                        to={`/dynamic/form-table/${id}`}
                        style={{
                            color: 'white',
                        }}
                        type="button"
                        id="update"
                        className="btn btn-md"
                    >
                        <i className="fa fa-info-circle icon-blue" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title={t("View Data Saved to Form")}></i>
                    </Link>
                    {' '}
                </div>
            )
        }
    }

    useEffect(() => {
        document.title = 'Form List'
        isExpired()
            .then((res) => {
                if (res) {
                    navigate('/dynamic')
                }
            })
            .catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        GetAvailableForms().then((response) => {
            setData(response)
        })
    }, [isUpdated])

    useEffect(() => {
        GetUserDetails().then((response: any) => {
            setUserDetail(response)
            setIsLoading(false)
        })
    }, [])

    const DeleteForms = (id: any) => {
        Swal.fire({
            title: 'Emin misin?',
            text: 'Seçilen form tüm içeriğiyle birlikte silinecektir!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sil',
            cancelButtonText: 'Vazgeç',
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteFormsByIds(id)
                    .then((response: any) => {
                        if (response.deletedCount > 0) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Başarılı!',
                                text: ' Form başarıyla silindi.',
                            })
                            toggleUpdate()
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Silme işlemi geçersiz.',
                        })
                    })
            }
        })
    }
    return (
        <div className="container">
            {!isLoading ? (
                <div className="form-body">
                    <div className="row">
                        <div className="form-holder">
                            <div className="form-content">
                                <div className="form-items">
                                    <div className="row">
                                        <div className="form-group col-md-4">
                                            <h3>{t("Form Management")}</h3>
                                            <p style={{ textTransform: 'uppercase' }}>
                                                {t("WELCOME")} {userDetail.username}
                                            </p>
                                        </div>
                                        <div
                                            style={{ textAlign: 'center' }}
                                            className="form-group col-xs-12 col-sm-4 col-md-4"
                                        >
                                            <input
                                                className="form-control border-end-0 border rounded-pill"
                                                type="text"
                                                placeholder={t("Search...")}
                                                id="example-search-input"
                                                onChange={(e) => {
                                                    setSearch(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{ textAlign: 'right' }}
                                            className="form-group col-md-4 mt-2"
                                        >
                                            {userDetail.role === 'root' ? (

                                                <Link to="/dynamic/form-create" className="btn btn-primary btn-sm col-xs-12 col-sm-3 col-md-3">
                                                    {t("New Form")}
                                                </Link>


                                            ) : (
                                                ''
                                            )}
                                            {userDetail.role === 'root' ? (


                                                <Link to="/dynamic/create-admin" className="btn btn-primary btn-sm col-xs-12 col-sm-3 col-md-4 mx-2">
                                                    {t("Account Management")}
                                                </Link>
                                            ) : (
                                                ''
                                            )}


                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm col-xs-12 col-sm-4 col-md-4"
                                                onClick={() => logout(navigate)}
                                            >{t("Sign Out")}</button>

                                            <a href="/"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                className="btn btn-sm col-xs-12 col-sm-1 col-md-1 "
                                                data-bs-title="Geri dön">
                                                <i className="fa fa-arrow-left icon-black"></i>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="row">
                                        {data
                                            .filter((form: any) => {
                                                if (search === '') {
                                                    return form
                                                } else if (
                                                    form.formName
                                                        .toLowerCase()
                                                        .includes(search.toLowerCase())
                                                ) {
                                                    return form
                                                }
                                            })
                                            .map((form: any) => (
                                                <div className="form-group col-xl-6 col-md-6 col-sm-12 mt-5">
                                                    <div className="card">
                                                        <div
                                                            className="card-header"
                                                            style={{
                                                                backgroundColor: form.primaryColor,
                                                            }}
                                                        >
                                                            <div className="row align-items-center">
                                                                <div
                                                                    className="col-xl-6 col-md-6 col-sm-12"
                                                                    style={{ color: '#fff' }}
                                                                >
                                                                    {form.formName}
                                                                </div>
                                                                <div
                                                                    className="col-xl-6 col-md-6 col-sm-12"
                                                                    style={{ textAlign: 'right' }}
                                                                >
                                                                    {userDetail.role !== 'root'
                                                                        ? userDetail.allowedForms.map(
                                                                            (item: any) => {
                                                                                if (
                                                                                    item.formId ===
                                                                                    form._id &&
                                                                                    item.permissionType ===
                                                                                    'write'
                                                                                ) {
                                                                                    return CrudTools(
                                                                                        'write',
                                                                                        form._id
                                                                                    )
                                                                                } else if (
                                                                                    item.formId ===
                                                                                    form._id &&
                                                                                    item.permissionType ===
                                                                                    'read'
                                                                                ) {
                                                                                    return CrudTools(
                                                                                        'read',
                                                                                        form._id
                                                                                    )
                                                                                }
                                                                            }
                                                                        )
                                                                        : CrudTools(
                                                                            'write',
                                                                            form._id
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="form-group col-md-12 col-sm-12">
                                                                <p className="card-text">
                                                                    {form.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div> {t("Loading...")}</div>
            )}
        </div>
    )
}

export default AdminPanel
