'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios, { AxiosError } from 'axios'
import {  useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState('')
  //to check username available or not 
  const [usernameMessage, setUsernameMessage] = useState('')
  //  loader 
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 500)

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

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsername('')

        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`)
          let message = response.data.message
          console.log("message :" , message)
          setUsernameMessage(message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "error checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
//manual authentication in sign-up and nextauth in sign-in
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      console.log("data", data)

      toast?.success("sucessfully get the response", {
        description: response.data.message
      })

      console.log("redirecting to:",`/verify/${username}`)
      router.replace(`/verify/${username}`)
      
      setIsSubmitting(false)

    } catch (error) {
      console.log("error in signup of user ", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast("Signup failed", {
        description: errorMessage,
      })
      setIsSubmitting(false)

    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md   p-8 space-y-8 bg-white-rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Cipher Voice</h1>
          <p className="mb-4">Sign-up </p>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      />
                    </FormControl>
                      {isCheckingUsername && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                      <p className={`text-sm ${usernameMessage === "available username" ? "text-green-500" : "text-red-300"} `}> {usernameMessage}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> 
                  Please wait
                  </>
                  ) : ('Signup')
                }
              </Button>
            </form>

          </Form>

          <div>
            <p>Already a Member ? (' ')
              <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">Sign in</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default page