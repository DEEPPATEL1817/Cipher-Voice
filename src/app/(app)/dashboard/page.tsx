'use client'


import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message, User } from "@/models/user"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"





const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const [profileUrl, setProfileUrl] = useState('');

  const [currentPage, setCurrentPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(1);   // total pages

  const inputRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const messagesPerPage = 10;

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchMessages(false, newPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchMessages(false, newPage);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };


  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.get('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch message setting"
      })
    } finally {
      setIsSwitchLoading(false)
    }

  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false, page = 1) => {
    setIsLoading(true)
    setIsSwitchLoading(false)

    try {
      const response = await axios.get<ApiResponse>(`/api/get-all-messagesOf-User?page=${page}&limit=${messagesPerPage}`)
      setMessages(response.data.messages || [])

      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(page);

      if (refresh) {

        toast("Showing Latest messages")
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description: axiosError.response?.data.message ?? 'Failed to fetch messages',
      })
    } finally {
      setIsSwitchLoading(false)
      setIsLoading(false)
    }
  }, [setIsLoading, setMessages])


  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages(false, 1)
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  //handle switch change 

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)

      toast(response.data.message)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description: axiosError.response?.data.message ??
          'Failed to update message settings',
      })
    }
  }

  //copy to clipboard
  const username = (session?.user as unknown as User)?.username

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [username]);


  const copyToClipboard = () => {
    if (!profileUrl) return;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    const urlToCopy = `${baseUrl}/u/${username}`

    if (inputRef.current) {
      inputRef.current.value = urlToCopy;
      inputRef.current.select(); // Select text
      inputRef.current.setSelectionRange(0, urlToCopy.length);
    }
    navigator.clipboard.writeText(urlToCopy);
    setIsCopied(true);


    if (inputRef.current) {
      inputRef.current.setSelectionRange(0, profileUrl.length);
    }

    setTimeout(() => {
      setIsCopied(false);

    }, 500);

    toast("Profile URL is copied");
  };

  if (!session || !session.user) {
    return (
      <div>
        Please Login
      </div>
    )
  }





  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-900 rounded w-full max-w-6xl text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={profileUrl}
            disabled
            className={`input input-bordered w-full p-2 mr-2 transition-all duration-300 
          rounded-2xl text-black dark:text-white   ${isCopied ? "bg-blue-300" : "bg-gray-100 dark:bg-gray-800"
              }`}
          />
          <Button className="p-5 cursor-pointer" onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
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
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 italic">
            You have no messages yet.
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

    </div>
  );
}

export default Page