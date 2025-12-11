'use client'

import { ApiResponse } from "@/src/types/ApiResponse"
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from 'axios';
import { useState , useEffect } from "react";
import {useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation";
import { registerSchema } from "@/src/schemas/registerSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function RegisterForm() {
  // to set the username state
  const [username , setUsername] = useState('');

  //if username available : to show this message
  const [usernameMessage , setUsernameMessage] = useState('');

  //loading state while we check the username
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // checking is form submitting
  const [isFormSubmitting , setIsFormSubmitting] = useState(false);

  // when username gets set , the request is fire to the backend to check is the username is unique or not and to take the values from the backend.
  const debounced = useDebounceCallback(setUsername, 400); 

  const router = useRouter()

  // zod implementation
  //iss form se jo bhi value dega woh schema se follow honi chahi ae so added the registerSchema in the Type
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver : zodResolver(registerSchema),

    // form default state
    defaultValues : {
      username : '',
      email : '',
      password : ''
    }
  });


  useEffect(() => {
    const checkingUsernameUniqeness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const respsonse = await axios.get(`/api/check-username-unique?username=${username}`);
  
          console.log("Response message from the checking username uniqueness is : ",respsonse);
  
          setUsernameMessage(respsonse.data.message);
        } catch (error) {
          console.log("Error in checking the username uniqueness: ",error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? 'Error checking the username');
        }
        finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkingUsernameUniqeness();
  },[username])

  const onSubmit = async(data : z.infer<typeof registerSchema>) => {
    console.log("Incoming data from the form is : ",data);

    setIsFormSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/register',data);

      console.log("Reponse from the axios post while submitting the from is ",response);

      toast.success(response.data.message);

      router.replace(`/verify/${username}`);

    } catch (error) {
      console.error("Error in signup of user",error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.warning(errorMessage);
    } finally {
      setIsFormSubmitting(false);
    }
  }


    return (

    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your Username" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e) 
                    debounced(e.target.value)
                  }} 
                    />
              </FormControl>
              {
                isCheckingUsername && <Loader2 className="animate-spin" />
              } 
              {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is Unique"
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="Enter your Email" 
                  {...field} 
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
                <Input 
                  type="password"
                  placeholder="Enter Password" 
                  {...field}  
                    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isFormSubmitting}>
          {
            isFormSubmitting ? 
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
            </> 
            : ("Sign Up")
           }
        </Button>
        </form>
      </Form>
      <div className="text-center *:mt-4">
           <p>
            Already a member? {' '} <Link href='/login' className="text-blue-600 hover:text-blue-800">Sign In</Link>
           </p>
      </div>
    </div>
  </div>
</div>
    )
}