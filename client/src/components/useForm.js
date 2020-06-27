import { useState } from "react"

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues)
  //console.log(values)
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
