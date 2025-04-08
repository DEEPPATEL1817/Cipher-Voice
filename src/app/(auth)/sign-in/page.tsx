'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios, { AxiosError } from 'axios'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {
  const [username, setUsername] = useState('')
  //to check username available or not 
  const [usernameMessage , setUsernameMessage] = useState('')
//  loader 
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 500)

  const router = useRouter()

  //zod implimentation 

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(()=> {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsername('')

        try {
        const response = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)

        setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "error checking username"
          )
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  return (
    <div>page</div>
  )
}

export default page