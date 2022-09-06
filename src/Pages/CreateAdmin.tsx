import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getRole, isExpired } from '../methods/Account'
import { CreateAdminAccount, GetAvailableForms } from '../methods/DynamicForms'
import 'react-confirm-alert/src/react-confirm-alert.css'
import useStore from '../store'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'
import { FormikValues } from 'formik'

const CreateAdmin = () => {
    const navigate = useNavigate()
    const [forms, setForms] = useState<any>([])
    const [isLoading, toggleLoading] = useState(true)
    const [formPermission, setFormPermission] = useState<any>([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const store = useStore()
    const { toggleUpdate } = store
    const [show, setShow] = useState(false)
    const [inputType, setInputType] = useState()
    const [selectedForm, setSelectedForm] = useState<any>()
    const {t, i18n} = useTranslation()

    const removePermission = (index: any) => {
        setFormPermission(formPermission.filter((item: any) => formPermission.indexOf(item) !== index))
    }

    const handleAddFields = () => {
        setFormPermission([...formPermission, { id: uuid(), show: false }])
    }

    const handlePermissionValueParent = (index: any, event: any) => {
        if (
            event.target.name === 'formId' &&
            formPermission.find((e: any) => e.formId === event.target.value)
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Bu izini daha önce gerçekleştirdiniz.',
            })
        } else {
            const updatedPermissions = [...formPermission]
            updatedPermissions[index][event.target.name] =
                event.target.name === 'show' ? event.target.checked : event.target.value
            setFormPermission(updatedPermissions)
        }
    }

    const handleSubmit = (e: any) => {
        const body: any = {}
        body.username = username
        body.password = password
        const allowedForms: any[] = []
        formPermission.map((item: any) => {
            const form: any = {}
            Object.keys(item).forEach((key: any) => {
                if (key !== 'id' || key !== 'show') {
                    form[key] = item[key]
                }
            })
            allowedForms.push(form)
        })
        body.allowedForms = allowedForms

        if (body.username !== '' && body.password !== '') {
            if (body.allowedForms.length > 0) {
                CreateAdminAccount(body)
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Başarılı!',
                            text: 'Hesap başarıyla oluşturuldu.',
                        })
                        toggleUpdate()
                        console.log(res)
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hesap oluşturma işlemi gerçekleştirilemedi.',
                        })
                        console.log(error)
                    })
                e.preventDefault()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oluşturulan hesaba, en az 1 form yetkisi verilmesi gerektir.',
                })
                e.preventDefault()
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Kullanıcı adı ve şifre olmadan hesap oluşturulamaz.',
            })
            e.preventDefault()
        }
    }

    useEffect(() => {
        document.title = 'Admin Create'
        isExpired()
            .then((res) => {
                if (res) {
                    navigate('/dynamic')
                }
                getRole().then((roleResponse: any) => {
                    if (roleResponse.role !== 'root') navigate('/dynamic')
                })
            })
            .catch((error) => {
                console.error(error)
            })

        GetAvailableForms()
            .then((res) => {
                setForms(res)
                toggleLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    if (!isLoading) {
        return (
            <div className="container">
                <div className="form-body">
                    <div className="row">
                        <div className="form-holder">
                            <div className="form-content">
                                <div className="form-items">
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <h3>{t("Account Creation and Authorization")}</h3>
                                            <p>{t("ADMIN ACCOUNT AND PERMISSIONS")}</p>
                                        </div>
                                        <div
                                            style={{ textAlign: 'right' }}
                                            className="form-group col-md-6"
                                        >
                                            
                                            <a  href="/dynamic/form-list" 
                                                data-bs-toggle="tooltip" 
                                                data-bs-placement="top"     
                                                className="btn bg-white btn-sm me-2"    
                                                data-bs-title="Geri dön">
                                                <i className="fa fa-arrow-left"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                        <div className="row mt-2">
                                            <div className="form-group col-md-6 col-sm-12">
                                                <label htmlFor="fullname">
                                                    {t("Username Assignment")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    name="username"
                                                    placeholder="Kullanıcı Adı"
                                                    onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-6 col-sm-12">
                                                <label htmlFor="fullname">{t("Password Assignment")}</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setPassword(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-4 justify-content-center">
                                            <div className="form-group col-auto">
                                                <button
                                                    id="addForm"
                                                    type="button"
                                                    style={{ background: '#495056' }}
                                                    onClick={() => handleAddFields()}
                                                    className="btn btn-sm text-white"
                                                >
                                                    <small>{t("Determine Form and Authorizations")}</small>
                                                    
                                                </button>
                                            </div>
                                            <div className="col-auto">
                                                <p className="mt-2" style={{ fontSize: '12px' }}>
                                                    {t("The Account")}
                                                </p>
                                            </div>
                                        </div>
                                        {formPermission.map((item: any, index: any) => {
                                            return (
                                                <form
                                                    key={item.id}
                                                    className="row mt-4 p-5"
                                                    style={{ border: 'solid 1px coral' }}
                                                    onChange={(e) =>
                                                        handlePermissionValueParent(index, e)
                                                    }
                                                >
                                                    <div className="form-group col-12 col-md-4 col-sm-4">
                                                        <label htmlFor="fullname">{t("Form Assignment")}</label>
                                                        <select
                                                            name="formId"
                                                            id="allowedForms"
                                                            className="form-select"
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                setSelectedForm(e.target.value)
                                                            }}
                                                        >
                                                            <option selected disabled>
                                                                {t("Choose Form")}
                                                            </option>
                                                            {forms.map((form: any, index: any) => {
                                                                return (
                                                                    <option
                                                                        key={form.formName}
                                                                        value={form._id}
                                                                    >
                                                                        {form.formName}
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-12 col-md-5 col-sm-5">
                                                        <label htmlFor="fullname">
                                                            {t("Authorization")}
                                                        </label>
                                                        <select
                                                            id="permission"
                                                            className="form-select"
                                                            name="permissionType"
                                                        >
                                                            <option selected disabled>
                                                                {t("Choose authorization")}
                                                            </option>
                                                            <option value="read">
                                                                {t("Can see. (Listing)")}
                                                            </option>
                                                            <option value="write">
                                                                {t("It can operate. (Listing/Updating/Deleting)")}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="form-check col-12 col-md-2 col-sm-2">
                                                        <div
                                                            style={{ float: 'right' }}
                                                            className="form-group mt-4"
                                                        >
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="show"
                                                                id="flexCheckDefault"
                                                            />
                                                            <label>{t("Customize Authority")}</label>
                                                        </div>
                                                    </div>
                                                    {item.show ? (
                                                        <div className="row">
                                                            {forms.find(
                                                                (e: any) => e._id === item.formId
                                                            ) ? (
                                                                <div className="row">
                                                                    <div className="form-group col-12 col-md-6 col-sm-6 mt-4">
                                                                        <label htmlFor="fullname">
                                                                            {t("Authorize In The Form")}
                                                                        </label>
                                                                        <select
                                                                            name="allowedField"
                                                                            id="allowedField"
                                                                            className="form-select"
                                                                            onChange={(e) => {
                                                                                setInputType(
                                                                                    forms.find(
                                                                                        (e: any) =>
                                                                                            e._id ===
                                                                                            selectedForm
                                                                                    ).formDetails[
                                                                                        e.target
                                                                                            .value
                                                                                    ].type
                                                                                )
                                                                            }}
                                                                        >
                                                                            <option
                                                                                selected
                                                                                disabled
                                                                            >
                                                                                {t("Select a field for the form.")}
                                                                            </option>
                                                                            {Object.entries(
                                                                                forms.find(
                                                                                    (e: any) =>
                                                                                        e._id ===
                                                                                        selectedForm
                                                                                ).formDetails
                                                                            ).map(
                                                                                ([
                                                                                    detail,
                                                                                    value,
                                                                                ]) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={
                                                                                                (value as FormikValues).type
                                                                                            }
                                                                                            value={
                                                                                                detail
                                                                                            }
                                                                                        >
                                                                                            {detail}{' '}
                                                                                            /{' '}
                                                                                            {
                                                                                                (value as FormikValues).type
                                                                                            }
                                                                                        </option>
                                                                                    )
                                                                                }
                                                                            )}
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group col-12 col-md-6 col-sm-6 mt-4">
                                                                        <label htmlFor="fullname">
                                                                            {t("Assigning a Value to an Authorized Field")}
                                                                        </label>
                                                                        <input
                                                                            name="allowedValue"
                                                                            id="allowedValue"
                                                                            type={inputType}
                                                                            className="form-control mt-1"
                                                                        />
                                                                    </div>{' '}
                                                                </div>
                                                            ) : (
                                                                <div className="row">
                                                                    {' '}
                                                                    <p className="formikValidate">
                                                                        {t("The authorization cannot be customized without making a form selection.")}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <div className="row">
                                                        <div className="form-group col-12 col-md-12 col-sm-12">
                                                            <div
                                                                style={{ textAlign: 'center' }}
                                                                className="form-group mt-4"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    id="removeForm"
                                                                    className="btn btn-danger btn-sm"
                                                                    style={{ marginLeft: '5px' }}
                                                                    onClick={() =>
                                                                        removePermission(index)
                                                                    }
                                                                >
                                                                    {t("Delete")}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            )
                                        })}
                                        <div
                                            style={{ textAlign: 'center' }}
                                            className="form-button mt-4"
                                        >
                                            <button
                                                style={{ background: 'coral ' }}
                                                id="submit"
                                                type="submit"
                                                className="btn btn-primary mt-4"
                                                onClick={handleSubmit}
                                            >
                                                {t("Save")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return <div>Loading</div>
}

export default CreateAdmin
