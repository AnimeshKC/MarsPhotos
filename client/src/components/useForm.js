import { useState } from "react"

/*
custom hook for forms
initialValues is an object

The second part of the array is an event function used for a property of the form.
The function will generally used with an onChange event
*/
export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues)
  return [
    values,
    (e) => {
      return setValues({
        ...values,
        [e.target.name]: e.target.value,
      })
    },
  ]
}

export default useForm
