import React, { useEffect, useState } from 'react'
import '../UserCreate.css'
import camelcase from 'camelcase'
import useStore from '../store'
import { CreateForm } from '../methods/DynamicForms'
import { getRole, isExpired } from '../methods/Account'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'

const FormCreate = () => {
    const [formFields, setFormFields] = useState([{ id: uuid() }])
    const [formName, setFormName] = useState()
    const [selectedColor, setSelectedColor] = useState()
    const [file, setFile] = useState()
    const [formDescription, setFormDescription] = useState()
    const [isLoading, setLoading] = useState(true)
    const [formClassName, setFormClassName] = useState('needs-validation')
    const store = useStore()
    const { colors, fieldTypes } = store
    const [errors, setErrors] = useState({
        formName: { status: false, message: null },
        selectedColor: { status: false, message: null },
        file: { status: false, message: null },
        formDescription: { status: false, message: null },
    })
    const {t, i18n} = useTranslation()
    const navigate = useNavigate()
    useEffect(() => {
        isExpired()
            .then((res) => {
                if (res) {
                    navigate('/dynamic')
                }
                getRole().then((roleResponse) => {
                    if (roleResponse.role !== 'root') navigate('/dynamic/form-list')
                })
                setLoading(false)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const deleteFormField = (index) => {
        if (formFields.length > 1) {
            setFormFields(formFields.filter((item) => formFields.indexOf(item) !== index))
        }
    }

    const handleInputChange = (index, event) => {
        const updatedFormFields = [...formFields]

        updatedFormFields[index][event.target.name] =
            event.target.type === 'checkbox' ? event.target.checked : event.target.value
        setFormFields(updatedFormFields)
        clearDynamicErrors(index, event)
    }

    const clearDynamicErrors = (index, event) => {
        const updatedFormFields = [...formFields]
        if (event.target.name === 'min' || event.target.name === 'max') {
            updatedFormFields[index].minError = null
            updatedFormFields[index].maxError = null
        } else {
            updatedFormFields[index][event.target.name + 'Error'] = null
        }
    }
    const clearNormalErrors = (errorField) => {
        const updatedErrors = errors
        updatedErrors[errorField] = { status: false, message: null }
    }

    const checkValidation = () => {
        let isValid = true
        const updatedFormFields = [...formFields]
        const updatedErrors = errors
        if (!formName) {
            updatedErrors.formName.status = true
            updatedErrors.formName.message = 'Form Adı boş bırakılamaz'
        }
        if (!selectedColor) {
            updatedErrors.selectedColor.status = true
            updatedErrors.selectedColor.message = 'Bir Renk seçmelisiniz'
        }
        if (!file) {
            updatedErrors.file.status = true
            updatedErrors.file.message = 'Form için bir ikon eklemelisiniz'
        }
        if (!formDescription) {
            updatedErrors.formDescription.status = true
            updatedErrors.formDescription.message = 'Form açıklaması boş bırakılamaz'
        }

        formFields.map((item, index) => {
            if (!item.fieldName) {
                updatedFormFields[index].fieldNameError = 'Alan adı boş bırakılamaz.'
                isValid = false
            }
            if (!item.type && item.type !== 0) {
                updatedFormFields[index].typeError = 'Alan tipini doldurmalısınız.'
                isValid = false
            }
            if (item.min >= item.max) {
                updatedFormFields[index].minError = 'Minimum değer maksimum değerden yüksek olamaz'
                updatedFormFields[index].maxError = 'Minimum değer maksimum değerden yüksek olamaz'
                isValid = false
            }
        })
        setErrors(updatedErrors)
        setFormFields(updatedFormFields)
        if (formFields.length < 2) {
            isValid = false
            toast.error('En az 2 Alan ekleyiniz')
        }
        return isValid
    }
    const submitForm = () => {
        const isValid = checkValidation()
        console.log(isValid)
        if (isValid) {
            const formData = new FormData()
            formData.append('file', file)
            const formFieldDetails = {}
            formFields.map((item) => {
                const fieldNameCamelCased = camelcase(item.fieldName)

                formFieldDetails[fieldNameCamelCased] = {
                    type: fieldTypes[item.type].type,
                    htmlLabel: item.fieldName,
                    htmlType: fieldTypes[item.type].typeName,
                    placeholder: item.placeholder,
                }
                if (item.required !== '')
                    formFieldDetails[fieldNameCamelCased].required = item.required
                if (item.max > item.min) {
                    if (item.max && item.max > 0)
                        formFieldDetails[fieldNameCamelCased].max = item.max
                    if (item.min) formFieldDetails[fieldNameCamelCased].min = item.min
                }
            })
            const formDetails = {
                formName: formName,
                description: formDescription,
                primaryColor: selectedColor,
            }
            const formStructure = JSON.stringify([formFieldDetails, formDetails])
            formData.append('formStructure', formStructure)
            setFormClassName('needs-validation')

            CreateForm(formData)
                .then((res) => {
                    if (res) toast.success('Form Oluşturuldu', { position: 'top-center' })
                })
                .catch((err) => console.log(err))
        } else {
            setFormClassName('was-validated')
        }
    }

    const placeholderType = (type) => {
        if (type) {
            switch (fieldTypes[type].type) {
                case 'String':
                    return 'text'
                case 'Number':
                    return 'number'
            }
        }
        return 'text'
    }

    const isMinMaxDisabled = (type) => {
        if (type) {
            switch (fieldTypes[type].type) {
                case 'Date':
                    return true
            }
        }
        return false
    }

    return (
        <div
            className="container justify-content-center align-items-center d-flex"
            style={{ height: '100vh' }}
        >
            {!isLoading ? (
                <div
                    className=" rounded shadow-sm"
                    id="bodyColor"
                    style={{ backgroundColor: '#FFFFFF' }}
                >
                    <div
                        style={{
                            backgroundColor: selectedColor || '#4d4c4c',
                            transition: '1s all',
                        }}
                    >
                        <div className="row py-4 px-3">
                            <div className="form-group col-xs-12 col-sm-4 col-md-4">
                                <h3 className="form-header text-white">{t("Create Form")}</h3>
                                <p className="form-subtitle text-white">
                                    {t("DYNAMIC FORM DESIGN")}
                                </p>
                            </div>

                            <div style={{ textAlign: 'right' }} className="form-group col-xs-12 col-sm-8 col-md-8">
                                
                                <a href="/dynamic/form-list"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    class="btn btn-sm me-2"
                                    data-bs-title="Geri dön"><i class="fa fa-arrow-left icon-create"></i></a>
                            </div>
                        </div>
                    </div>

                    <form
                        className={`form-control needs-validation py-4  px-3`}
                        noValidate
                        encType="multipart/formData"
                    >
                        <div className="row align-items-center">
                            <div className="col-xs-12 col-sm-6 col-md-4">                                

                                <label for="formName">{("Form Name")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    sx={{ width: '100%' }}
                                    id="formName"
                                    name="formName"
                                    placeholder='Form adı'
                                    variant="outlined"
                                    required
                                    onChange={(e) => {
                                        setFormName(e.target.value)
                                        clearNormalErrors(e.target.name)
                                    }}

                                />
                                <div class="invalid-feedback">
                                    {errors.formName.message}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-4" my-2>                                

                                <label for="demo-multiple-checkbox-label">{t("Choose a color")}</label>
                                <select class="form-control"
                                    id="demo-multiple-checkbox"
                                    aria-label="Default select example"
                                    value={selectedColor || null}
                                    sx={{ width: '100%' }}
                                    name="selectedColor"
                                    onChange={(e) => {
                                        setSelectedColor(e.target.value)
                                        clearNormalErrors(e.target.name)
                                    }}
                                >
                                    {colors.map((item) => {
                                        console.log(item)
                                        return (

                                            <option
                                                placeholder='test'
                                                value={item.HEX}
                                                className="d-flex justify-content-between align-items-center"
                                                style={{
                                                    height: '15px',
                                                    width: '15px',

                                                    borderRadius: '50%',
                                                    justifySelf: 'flex-end',
                                                }}
                                            >
                                                {item.color}
                                            </option>
                                        )
                                    })}

                                </select>
                            </div>
                            <div className="col-xs-12 col-sm-10 col-md-4 align-items-center d-flex justify-content-evenly my-2">


                                <label for="formFileSm" class="form-label">{t("Choose a photo")}</label>
                                <input class="form-control form-control-sm"
                                    id="formFileSm"
                                    type="file"
                                    required
                                    onChange={(e) => {
                                        setFile(e.target.files[0])
                                        clearNormalErrors(e.target.name)
                                    }} />


                                {file && <label>{file.name}</label>}

                            </div>
                        </div>

                        <div className="row align-items-center mx-1 mt-3">                           
                            

                            <label for="formDecription">{t("Form Description")}</label>
                            <textarea class="form-control"
                                id="formDescription"
                                placeholder='Form açıklamasını giriniz'
                                rows="2"
                                onChange={(e) => {
                                    setFormDescription(e.target.value)
                                    clearNormalErrors(e.target.name)
                                }}
                                error={errors.formDescription.status}
                                helperText={errors.formDescription.message} required>

                            </textarea>

                        </div>
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            

                            <button
                                type="button"
                                class="btn btn-primary"
                                onClick={() =>
                                    setFormFields((formFields) => [...formFields, { id: uuid() }])
                                }
                                
                            >{t("Add")}</button>
                            
                        </div>
                        {formFields.map((field, index) => {
                            return (
                                <form onChange={(e) => handleInputChange(index, e)}
                                    className={`${formClassName}`}
                                    noValidate
                                    key={field.id}>
                                    <div className="col mt-2 align-items-center my-2">
                                        <hr />                                        
                                        <div className="row">
                                            <div className="col-xs-12 col-sm-4 col-md-2 my-2">
                                                

                                                <label for="outlined-basic">{t("Domain Name")}</label>
                                                <input
                                                    type="text"
                                                    placeholder='Alan adı'
                                                    className="form-control"
                                                    sx={{ width: '100%' }}
                                                    variant="outlined"
                                                    id="outlined-basic"
                                                    name="fieldName"
                                                    value={field.fieldName}
                                                    required

                                                />
                                                <div className='invalid-feedback'>
                                                    {field.fieldNameError}
                                                </div>

                                            </div>
                                            <div className="col-xs-12 col-sm-4 col-md-2 my-2">
                                                

                                                <label for="demo-multiple-checkbox-label"> {t("Type")}</label>
                                                <select className="form-control"
                                                    id="demo-multiple-checkbox"
                                                    aria-label="Default select example"
                                                    value={field.type}
                                                    name="type"
                                                    onChange={(e) =>
                                                        handleInputChange(index, e)
                                                    }
                                                    required
                                                >
                                                    {fieldTypes.map((item, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={index}
                                                                className=""
                                                            >
                                                                {item.typeName}
                                                            </option>
                                                        )
                                                    })}

                                                </select>
                                            </div>
                                            <div className="col-xs-12 col-sm-4 col-md-2 my-2" >
                                                

                                                <label for="outlined-basic">{t("Hint")}</label>
                                                <input
                                                    type={placeholderType(field.type)}
                                                    placeholder="İpucu"
                                                    sx={{ width: '100%' }}
                                                    variant="outlined"
                                                    className="form-control"
                                                    id="outlined-basic"
                                                    name="placeholder"
                                                    required
                                                />
                                                <div className='invalid-feedback'>
                                                    {field.fieldNameError}
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-6 col-md-2 my-2">
                                                

                                                <label
                                                    className="form-label"
                                                    for="typeNumber"
                                                >Min:
                                                </label>
                                                <input
                                                    disabled={isMinMaxDisabled(field.type)}
                                                    className="form-control mx-1"
                                                    name="min"
                                                    placeholder='0'
                                                    value={field.min}
                                                    min="1"
                                                    error={field.minError}
                                                    helperText={field.minError || null}
                                                    type="number"
                                                />

                                                
                                            </div>
                                            <div className="col-xs-12 col-sm-6 col-md-2 my-2">
                                                <label
                                                    className="form-label"
                                                    for="typeNumber"
                                                >Max:
                                                </label>
                                                <input
                                                    disabled={isMinMaxDisabled(field.type)}
                                                    className="form-control mx-1"
                                                    name="max"
                                                    min="1"
                                                    value={field.max}
                                                    error={field.minError}
                                                    helperText={field.minError || null}
                                                    type="number"
                                                />
                                            </div>

                                            <div className="col-xs-12 col-sm-5 col-md-1">
                                                

                                                <p>{t("Required Field")}</p>
                                                <input
                                                    type="checkbox"
                                                    label="Zorunlu alan"
                                                    value={field.required}
                                                    name="required"
                                                    required
                                                />

                                            </div>
                                            <div className="col-xs-12 col-sm-1 col-md-1">
                                                
                                                <button className="btn" color="error"
                                                    onClick={() => {
                                                        deleteFormField(index)
                                                    }}><i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )
                        })}
                        
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            

                            <button type="button"
                                className="btn btn-primary"
                                variant="contained"
                                onClick={(e) => {
                                    e.preventDefault()
                                    submitForm()
                                }}
                            >
                                {t("Save")}
                            </button>
                        </div>
                        
                    </form>
                </div>
            ) : (
                <div>{t("Loading...")}</div>
            )}
        </div>
    )
}

export default FormCreate