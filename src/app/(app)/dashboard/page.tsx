'use client'

import { useState,useEffect, useCallback } from 'react'
import { MessageCard } from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Message } from '@/src/models/User';
import { ApiResponse } from '@/src/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 , RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { acceptingMessageSchema } from '@/src/schemas/acceptMessageSchema';
import axios, {AxiosError} from 'axios';


const DashBoard = () => {

    const [messages,setMessages] = useState<Message[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [isRefreshing,setIsRefreshing] = useState<boolean>(false);

    const handleDeleteMessage = (messageId : string) => {
      setMessages(messages.filter((m) => m._id.toString() !== messageId))
    }

    const {data : session} = useSession();

    const form = useForm({
        resolver : zodResolver(acceptingMessageSchema)
    })

    const {register, watch ,setValue} = form;

     const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', !!response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsRefreshing(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');

        setMessages(Array.isArray(response.data?.messages) ? response.data.messages : []);

        if (refresh) {
          toast.success("Showing latest messages");
        }

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const msg = axiosError?.response?.data?.message;

      // avoid showing toast for "empty" messagessetVa
      if (msg && msg !== "user messages not found") {
        toast.error(msg);
      }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {

    try {

      const response = await axios.post<ApiResponse>('/api/accept-messages', {acceptMessages: !acceptMessages,});
      setValue('acceptMessages', !acceptMessages);

    toast.success(response.data.message);
    
    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
      
    }
  };

  if (!session || !session.user) {
    // return <h1 className='text-center mt-20'>Hello User: you are not signed in : Please signin</h1>
    return <h1 className='text-center mt-20'>Hello User: you are not signed in : Please signin</h1>
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isRefreshing}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
                key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default DashBoard;