'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/src/schemas/verifySchema';
import { ApiResponse } from "@/src/types/ApiResponse"
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react'

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {

    try {
      console.log("Username : ",params.username);
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        verifyCode : data.verifyCode,
      });

      toast.success(response.data.message);

      // Auto-login after successful verification
      const tempPassword = sessionStorage.getItem('temp_register_password');
      const tempIdentifier = sessionStorage.getItem('temp_register_identifier');

      if (tempPassword && tempIdentifier) {
        // Clear temporary storage
        sessionStorage.removeItem('temp_register_password');
        sessionStorage.removeItem('temp_register_identifier');

        // Sign in the user
        const signInResult = await signIn('credentials', {
          redirect: false,
          identifier: tempIdentifier,
          password: tempPassword,
        });

        if (signInResult?.error) {
          toast.error('Verification successful but auto-login failed. Please login manually.');
          router.replace('/login');
        } else {
          toast.success('Account verified and logged in successfully!');
          router.replace('/dashboard');
        }
      } else {
        // Fallback if session data not found
        toast.success('Account verified! Please login to continue.');
        router.replace('/login');
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

        toast.error(axiosError.response?.data.message ??
          'An error occurred. Please try again.');
          
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}