import { Message } from "@/models/user"

export interface ApiResponse {
    success: boolean,
    message: string,
    //isAcceptingMessage is response we sand as a data to the user 
    isAcceptingMessage?: boolean
    messages?: Array<Message>
}