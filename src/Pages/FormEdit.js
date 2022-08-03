import React, { useEffect, useState } from 'react'
import '../UserCreate.css'
import camelcase from 'camelcase'
import useStore from '../store'
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    OutlinedInput,
    Select,
    TextField,
    MenuItem,
    FormHelperText,
} from '@mui/material'
import { DeleteOutlined, Add, ArrowBack } from '@material-ui/icons'
import Tooltip from '@mui/material/Tooltip'
import { CreateForm, GetFormDetails, UpdateForm } from '../methods/DynamicForms'
import { getRole, isExpired } from '../methods/Account'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

const FormEdit = () => {
    const { id } = useParams()
    const [formFields, setFormFields] = useState([])
    const [formName, setFormName] = useState()
    const [selectedColor, setSelectedColor] = useState()
    const [file, setFile] = useState()
    const [formDescription, setFormDescription] = useState()
    const [isLoading, setLoading] = useState(true)
    const [iconURL, setIconURL] = useState()
    const store = useStore()
    const { colors, fieldTypes, isUpdated, toggleUpdate } = store
    const [errors, setErrors] = useState({
        formName: { status: false, message: null },
        selectedColor: { status: false, message: null },
        file: { status: false, message: null },
        formDescription: { status: false, message: null },
    })
    const navigate = useNavigate()

    useEffect(() => {
        isExpired()
            .then((res) => {
                if (res) {
                    navigate('/dynamic')
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])
    const urlToObject = async (image) => {
        const response = await fetch(process.env.REACT_APP_API_URL + image)
        const blob = await response.blob()
        const file = new File([blob], 'image.jpg', { type: blob.type })
        setFile(file)
        return file
    }

    useEffect(() => {
        setFormFields([])
        GetFormDetails(id)
            .then((res) => {
                setFormName(res.formName)
                setFormDescription(res.description)
                setSelectedColor(res.primaryColor)
                setIconURL(res.icon)
                document.title = res.formName
                document.getElementById(
                    'favicon'
                ).href = `${process.env.REACT_APP_API_URL}${res.icon}`

                Object.keys(res.formDetails).map((item, index) => {
                    const formDetail = res.formDetails[item]
                    formDetail.fieldName = item
                    formDetail.type = fieldTypes.findIndex((item) => item.type === formDetail.type)
                    setFormFields((formFields) => [...formFields, formDetail])
                })
            })
            .then(() => {
                setLoading(false)
                setFile()
            })
            .catch((error) => console.log(error))
    }, [isUpdated])

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
        console.log(formFields)
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
            console.log(1)
            updatedErrors.formName.status = true
            updatedErrors.formName.message = 'Form Adı boş bırakılamaz'
        }
        if (!selectedColor) {
            console.log(2)

            updatedErrors.selectedColor.status = true
            updatedErrors.selectedColor.message = 'Bir Renk seçmelisiniz'
        }

        if (!formDescription) {
            console.log(3)

            updatedErrors.formDescription.status = true
            updatedErrors.formDescription.message = 'Form açıklaması boş bırakılamaz'
        }

        formFields.map((item, index) => {
            if (!item.fieldName) {
            console.log(4)

                updatedFormFields[index].fieldNameError = 'Alan adı boş bırakılamaz.'
                isValid = false
            }
            if (!item.type && item.type !== 0) {
            console.log(5)

                updatedFormFields[index].typeError = 'Alan tipini doldurmalısınız.'
                isValid = false
            }
            if (item.min >= item.max) {
                updatedFormFields[index].minError = 'Minimum değer maksimum değerden yüksek olamaz'
                updatedFormFields[index].maxError = 'Minimum değer maksimum değerden yüksek olamaz'
                isValid = false
            console.log(6)

            }
        })
        setErrors(updatedErrors)
        setFormFields(updatedFormFields)
        if (formFields.length < 2) {
            console.log(7)

            isValid = false
            toast.error('En az 2 Alan ekleyiniz')
        }
        return isValid
    }
    console.log(iconURL)
    const updateForm = async () => {
        console.log("a")
        const isValid = checkValidation()
        console.log("--->,",isValid)
        if (isValid) {
            const formData = new FormData()
            if (!file) setFile()
            formData.append('file', file ? file : await urlToObject(iconURL))
            console.log(file)
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
            const formStructure = JSON.stringify([formFieldDetails, formDetails, { form_id: id }])
            formData.append('formStructure', formStructure)
            console.log(formStructure)
            UpdateForm(formData)
                .then((res) => {
                    if (res) {
                        toast.success('Form Güncellendi', { position: 'top-center' })
                        toggleUpdate()
                    }
                })
                .catch((err) => console.log(err))
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
                            <div className="form-group col-md-4">
                                <h3 className="form-header text-white">Form Güncelle</h3>
                                <p
                                    className="form-subtitle text-white"
                                    style={{ textTransform: 'uppercase' }}
                                >
                                    {formName} TASARIMINI DÜZENLE
                                </p>
                            </div>

                            <div style={{ textAlign: 'right' }} className="form-group col-md-8">
                                
                                <a  href="/dynamic/form-list" 
                                data-bs-toggle="tooltip" 
                                data-bs-placement="top"     
                                className="btn bg-white btn-sm me-2"    
                                data-bs-title="Geri dön"><i className="fa-solid fa-arrow-left"></i></a>
                            </div>
                        </div>
                    </div>

                    <form
                        className="needs-validation py-4  px-3"
                        noValidate
                        encType="multipart/formData"
                    >
                        <div className="row align-items-center">
                            <div className="col-md-4">                                

                                <label for="formName">Formun Adı</label>
                                <input
                                                type="text"
                                                className="form-control"
                                                id="formName"                                                
                                                name="formName"
                                                placeholder='Form adı'                                                
                                                onChange={(e) => {
                                                    setFormName(e.target.value)
                                                    clearNormalErrors(e.target.name)
                                                }}
                                                value={formName}
                                            />
                            </div>
                            <div className="col-md-4">                                

                                <label for= "demo-multiple-checkbox-label"> Bir renk seçiniz</label>                            
                                <select className="form-control" 
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
                                        {colors.map((item) => { console.log(item)
                                            return (
                                                <option
                                                    value={item.HEX}
                                                    className="d-flex justify-content-between align-items-center"
                                                >                                                    
                                                    {item.color}
                                                </option>
                                            )
                                        })}                                   
                                    
                                </select>
                                                      
                            </div>
                            
                            <div className="col-md-4 align-items-center d-flex justify-content-evenly">
                                {/* <FormControl error={errors.file.status}>
                                    <Button variant="contained" component="label">
                                        Form İkonu Yükle
                                        <input
                                            type="file"
                                            hidden
                                            name="file"
                                            onChange={(e) => {
                                                setFile(e.target.files[0])
                                                clearNormalErrors(e.target.name)
                                            }}
                                        />
                                    </Button>

                                    <FormHelperText>{errors.file.message || null}</FormHelperText>
                                </FormControl>
                                {file && <label>{file.name}</label>} */}
                                
                                <label for="formFileSm" className="form-label">Fotoğraf Seçiniz</label>
                                <input className="form-control form-control-sm" 
                                id="formFileSm" 
                                type="file" 
                                onChange={(e) => 
                                    {
                                    setFile(e.target.files[0])
                                     clearNormalErrors(e.target.name)
                                    }}/>                                                                 
                                    
                                {file && <label>{file.name}</label>}

                            </div>
                        </div>

                        <div className="row align-items-center mx-1 mt-3">
                            
                            <label for="formDecription">Form Açıklaması</label>
                            <textarea className="form-control" 
                            id="formDescription" 
                            rows="2" 
                            value={formDescription}
                            onChange={(e) => {
                                    setFormDescription(e.target.value)
                                    clearNormalErrors(e.target.name)
                                }}
                            error={errors.formDescription.status}
                            helperText={errors.formDescription.message}></textarea>
                            
                        </div>
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            {/* <IconButton
                                onClick={() =>
                                    setFormFields((formFields) => [...formFields, { id: uuid() }])
                                }
                            >
                                <Tooltip title="Alan Ekle">
                                    <Add />
                                </Tooltip>
                            </IconButton> */}
                            
                            <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={() =>
                                    setFormFields((formFields) => [...formFields, { id: uuid() }])
                                }
                            >Ekle</button>

                        </div>
                        {formFields.map((field, index) => {
                            return (
                                <form onChange={(e) => handleInputChange(index, e)} key={field.id}>
                                    <div className="col mt-2 align-items-center">
                                        <div className="row">
                                            <div className="col-md-3">
                                                {/* <TextField
                                                    id="outlined-basic"
                                                    sx={{ width: '100%' }}
                                                    label="Alan Adı"
                                                    variant="outlined"
                                                    name="fieldName"
                                                    value={field.fieldName}
                                                    helperText={field.fieldNameError || null}
                                                    error={field.fieldNameError}
                                                /> */}

                                                <label for="outlined-basic">Alan Adı</label>
                                                <input
                                                type="text"
                                                className="form-control"
                                                id="outlined-basic"                                                
                                                name="fieldName"                                             
                                                value={field.fieldName}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                {/* <FormControl
                                                    sx={{ width: 'auto', display: 'flex' }}
                                                    error={field.typeError}
                                                >
                                                    <InputLabel id="demo-multiple-checkbox-label">
                                                        Alan Tipi
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        input={<OutlinedInput label="Alan Tipi" />}
                                                        name="type"
                                                        value={field.type}
                                                        onChange={(e) =>
                                                            handleInputChange(index, e)
                                                        }
                                                    >
                                                        {fieldTypes.map((item, index) => {
                                                            return (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={index}
                                                                    className=""
                                                                >
                                                                    {item.typeName}
                                                                </MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                    <FormHelperText>
                                                        {field.typeError || null}
                                                    </FormHelperText>
                                                </FormControl> */}

                                                <label for= "demo-multiple-checkbox-label"> Alan Tipi</label>                            
                                                <select className="form-control" 
                                                        id="demo-multiple-checkbox" 
                                                        aria-label="Default select example"
                                                        value={field.type}                                                        
                                                        name="type"
                                                        onChange={(e) => 
                                                            handleInputChange(index, e)
                                                        }
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
                                            <div className="col-md-2">
                                                {/* <Tooltip title="Kullanıcıya gireceği değer hakkında örnek veri">
                                                    <TextField
                                                        id="outlined-basic"
                                                        sx={{ width: '100%' }}
                                                        label="İpucu"
                                                        variant="outlined"
                                                        name="placeholder"
                                                        value={field.placeholder || ''}
                                                        type={placeholderType(field.type)}
                                                    />
                                                </Tooltip> */}

                                                <label for="outlined-basic">İpucu</label>
                                                <input
                                                type={placeholderType(field.type)}
                                                sx={{ width: '100%' }}
                                                variant="outlined"
                                                className="form-control"
                                                id="outlined-basic"                                                
                                                name="placeholder"                                             
                                                value={field.placeholder || ''}
                                                />
                                            </div>
                                            <div className="col-md-2 d-flex justify-content-between">
                                                {/* <TextField
                                                    disabled={isMinMaxDisabled(field.type)}
                                                    name="min"
                                                    className="mx-1"
                                                    label="Min"
                                                    type="number"
                                                    value={field.min}
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    error={field.minError}
                                                    helperText={field.minError || null}
                                                /> */}
                                                <label
                                                className="form-label" 
                                                for="typeNumber"
                                                >Min:</label>  
                                                <input
                                                disabled={isMinMaxDisabled(field.type)}
                                                className="form-control mx-1" 
                                                name="min"
                                                value={field.min}
                                                min="1"
                                                error={field.minError}
                                                helperText={field.minError || null}
                                                type="number" />
                                                {/* <TextField
                                                    disabled={isMinMaxDisabled(field.type)}
                                                    name="max"
                                                    className="mx-1"
                                                    label="Maks"
                                                    type="number"
                                                    value={field.max}
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    error={field.maxError}
                                                    helperText={field.maxError || null}
                                                /> */}                                            

                                                <label
                                                className="form-label" 
                                                for="typeNumber"
                                                >Maks:</label>  
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

                                            <div className="col-md-2">
                                                {/* <FormGroup>
                                                    <FormControlLabel
                                                        control={<Checkbox name="required" />}
                                                        label="Zorunlu alan"
                                                        value={field.required}
                                                    />
                                                </FormGroup> */}
                                                <p>Zorunlu Alan</p>
                                                <input 
                                                type="checkbox" 
                                                label="Zorunlu alan"
                                                value={field.required}
                                                />
                                                
                                            </div>
                                            <div className="col-md-1">
                                                {/* <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        deleteFormField(index)
                                                    }}
                                                >
                                                    <DeleteOutlined />
                                                </IconButton> */}

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
                            {/* <Button
                                variant="contained"
                                onClick={(e) => {
                                    e.preventDefault()
                                    updateForm()
                                }}
                            >
                                Kaydet
                            </Button> */}

                            <button type="button" 
                                className="btn btn-primary"
                                variant="contained"
                                onClick={(e) => {
                                e.preventDefault()
                                updateForm()
                                }}
                            >
                            Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div>Loading</div>
            )}
        </div>
    )
}

export default FormEdit
