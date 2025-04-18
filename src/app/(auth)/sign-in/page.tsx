'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  //zod implimentation 

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      //we are using next auth for authentication
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (result?.error) {
        toast.error("Login failed", {
          description: "Incorrect username or password"
        });
        return;
      }

      if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("An error occurred", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md   p-8 space-y-8 bg-white-rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Cipher Voice</h1>
          <p className="mb-4">Sign-in </p>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">



              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email / Username</FormLabel>
                    <FormControl>
                      <Input placeholder="email / username" {...field}
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
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button className="w-full text-white" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Please wait</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

          </Form>

          <div className="text-center mt-4">
            <p>Already a Member?{' '}
              <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">Sign up</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Page