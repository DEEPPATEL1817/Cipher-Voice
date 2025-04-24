'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios, { AxiosError } from 'axios'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, LucideGithub } from "lucide-react";
import { signIn } from "next-auth/react"

const Page = () => {
  const [username, setUsername] = useState('')
  //to check username available or not 
  const [usernameMessage, setUsernameMessage] = useState('')
  //  loader 
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const [isGithubSubmitting, setIsGithubSubmitting] = useState(false);

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


        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`)
          const message = response.data.message
          console.log("message :", message)
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
    setIsFormSubmitting(true);
    //manual authentication in sign-up and nextauth in sign-in
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      console.log("data", data, response)

      toast?.success("sucessfully get the response", {
        description: response.data.message
      })

      console.log("redirecting to:", `/verify/${data.username}`)
      router.replace(`/verify/${data.username}`)

      setIsFormSubmitting(false);

    } catch (error: unknown) {
      console.log("error in signup of user ", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast("Signup failed", {
        description: errorMessage,
      })
      setIsFormSubmitting(false);

    }
  }

  const handleGithubSignIn = async () => {
    setIsGithubSubmitting(true);
    try {
      await signIn('github', { callbackUrl: '/sign-in' })
    } catch (error) {
      toast.error("Failed to sign in with GitHub")
      console.error("GitHub sign-in error:", error)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      await signIn('google', { callbackUrl: '/sign-in' })
    } catch (error) {
      toast.error("Failed to sign in with Google")
      console.error("Google sign-in error:", error)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-[#232429]">
      <div className="w-full max-w-md   p-8 space-y-8 bg-white-rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl mb-6">Join Cipher Voice</h1>
          <p className="mb-4 text-white">Sign-up </p>
        </div>



        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    <div className="flex items-center gap-2 mt-1">
                      {isCheckingUsername && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                      <p className={`text-sm ${usernameMessage === "available username" ? "text-green-500" : "text-red-300"} `}> {usernameMessage}</p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input className="text-white" placeholder="email" {...field}
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
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input className="text-white" type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button className="w-full bg-amber-400 hover:bg-amber-400 hover:-translate-y-0.5" type="submit" disabled={isFormSubmitting}>
                {
                  isFormSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : ('Sign up')
                }
              </Button>
            </form>

          </Form>


          <div className="flex items-center gap-4 my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>


          <div className="flex items-center justify-center mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting}
            >
              {
                isGoogleSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Please wait</span>
                  </div>
                ) : (
                  <>Google</>
                )
              }
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mt-2 cursor-pointer"
            onClick={handleGithubSignIn}
            disabled={isGithubSubmitting}
          >
            {isGithubSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Please wait</span>
              </>
            ) : (
              <>
                <LucideGithub className="w-4 h-4" />
                <span>Sign up with GitHub</span>
              </>
            )}
          </Button>




          <div className="text-center mt-4 text-white">
            <p>Already a Member?{' '}
              <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">Sign in</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Page