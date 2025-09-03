import pkg from 'stream-chat'
const { StreamChat } = pkg
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.STREAM_API_KEY
const secretKey = process.env.STREAM_SECRET_KEY

if(!apiKey || !secretKey){
    console.error(`Stream API or Secret are missing`)
}

//Creates a connection to the Stream Chat service.
const streamClient = StreamChat.getInstance(apiKey,secretKey)

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.log(`Error in upsertStreamUser : ${error}`);
    }
}

export const generateStreamToken = async (userId) => {
    try {
        //make sure the id is string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    
    } catch (error) {
        console.log(`Error while generating StreamToken method : ${error}`);
    }
}

