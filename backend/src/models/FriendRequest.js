import mongoose from "mongoose";

const FriendRequsetSchema = new mongoose.Schema({

    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    recipient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    status : {
        type : String,
        enum : ['pending', 'accepted','reject'],
        default : 'pending'
    }
    

},{ timestamps : true })

const FriendRequset = mongoose.model("FriendRequest",FriendRequsetSchema)

export default FriendRequset