'use client'
import { useParams } from "next/navigation";
import { useState } from "react"
import { messageSchema } from "@/src/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { toast } from "sonner";
import { ApiResponse } from "@/src/types/ApiResponse";
import { Separator } from "@radix-ui/react-separator";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from "lucide-react";
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar).filter(msg => msg.trim() !== '');
};

const initialMessages = "Kuthe rahatos tu?||Kay Khattos tu?||Yeto ka CODM vr?";

const SendMessagePage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState<boolean>(false);
    const [suggestedMessages, setSuggestedMessages] = useState<string>(initialMessages);
    const [error, setError] = useState<string | null>(null);

    const params = useParams<{ username: string }>();
    const username = params.username;

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    });

    const messageContent = form.watch('content');

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {

        setIsLoading(true);

        try {
            const response = await axios.post(`/api/send-message`, {
                username,
                content: data.content
            });

            toast.success(response.data.message ?? "Message sent Successfully!!");
            form.reset({ ...form.getValues(), content: '' });

        } catch (error) {

            console.log("Error while sending the message!!", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to send the message!!");
            
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessage = async () => {

        setIsSuggestLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/suggest-messages');
            console.log('Response:', response.data);
            
            if (response.data.success && response.data.text) {
                setSuggestedMessages(response.data.text);
            } else {
                setError("Failed to get suggestions");
            }

        } catch (err) {
            console.error("Error while fetching the suggested message!!", err);
            const axiosError = err as AxiosError<ApiResponse>;
            setError(axiosError.response?.data.message ?? "Failed to fetch suggestions");
        } finally {
            setIsSuggestLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center mt-15 text-4xl font-bold">Public Profile Link</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchSuggestedMessage}
                        className="my-4"
                        disabled={isSuggestLoading}
                    >
                        {isSuggestLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Suggest Messages'
                        )}
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            parseStringMessages(suggestedMessages).map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/register'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    );
};

export default SendMessagePage;