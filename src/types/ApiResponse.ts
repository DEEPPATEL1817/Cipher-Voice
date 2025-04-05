import { Message } from "@/models/user"

export interface ApiResponse {
    success: boolean,
    message: string,
    //isAcceptingMessage is response we sand as a data to the user 
    isAcceptingMessages?: boolean
    messages?: Array<Message>
}