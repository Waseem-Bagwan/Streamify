import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js"

export const getRecommendedUser = async (req,res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and : [
                {_id : { $ne : currentUserId } }, // exclude logged in user 
                {_id : { $nin : currentUser.friends} }, // exclude current user friends
                {isOnboarding:true} // include only who completed onboarding 
            ]
        })

        res.status(200).json(recommendedUsers);

    } catch (error) {
        console.log(`Error in get-recommended-user controller : ${error}`);
        res.status(500).json({
            message : 'Internal server error'
        });
    }
}

export const getMyFriends = async (req,res) => {
    try {
        
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic bio nativeLanguage learningLanguage");

        res.status(200).json(user.friends)
       
        
    } catch (error) {
        console.log(`Error in get-my-friends controller : ${error}`);
        res.status(500).json({
            message : `Internal server error`
        });
    }
}

export const sendFriendRequest = async (req,res) => {
    try {
        const senderId = req.user.id;
        const {id : recipientId} = req.params

        //
        if(senderId === recipientId){
            return res.status(400).json({
                message : "you can't send friend request to yourself"
            })
        }

        const recipient = await User.findById(recipientId)

        if(!recipient){
            return res.status(404).json({
                message : "User not exist"
            })
        }

        if(recipient.friends.includes(senderId)){
            return res.status(400).json({
                message : "you are already friend with this user"
            })
        }

        const existingRequest = await FriendRequest.findOne({
            $or : [
                { sender : senderId, recipient : recipientId },
                { sender : recipientId , recipient : senderId }
            ],
        })

        if(existingRequest){
            return res
            .status(400)
            .json({ message : "A friend request is already exist between you and this user "})
        }

        //make a friend request
        const friendRequest = await FriendRequest.create({
            sender : senderId,
            recipient : recipientId
        })

        res.status(201).json(friendRequest)
       
    } catch (error) {
        
        console.log(`Error in sendFriendRequest controller : ${error}`);

        res.status(500).json({
            message : "Internal server error"
        });
    }
}

export const acceptFriendRequest = async (req,res) => {
    try {
        
        const {id : requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(403).json({
                message : "friend request not found"
            });
        }

        //objectID and req.user.id should be same, so that logged in recipient should accept the request not other 
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({
                message : "you are not authorized to accept this request"
            });
        }

        friendRequest.status = "accepted";

        await friendRequest.save();

        //updating the friendList of sender and recipient, now they're friends
        //addtoSet used to add element to an array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet : { friends : friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet : { friends : friendRequest.sender}
        });

        res.status(200).json({ message : "friend request accepted" });


    } catch (error) {
        console.log(`Error in acceptFriendRequest controller : ${error}`);
        res.status(500).json({
            message : `Internal server error`
        });
    }
}

export const getFriendRequests = async (req,res) => {
    try {

        const incomingRequest = await FriendRequest.find({
            recipient:req.user.id,
            status: "pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequest = await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
        }).populate("recipient","fullName profilePic");

        res.status(200).json( { incomingRequest , acceptedRequest} );
    } catch (error) {
        console.log(`Error in getFriendRequest controller : ${error}`);
        res.status(500).json({
            message : "Internal server error"
        })
    }
}


export const getOutGoingFriendRequest = async (req,res) => {
    try {
        const outGointRequest = await FriendRequest.find({
        sender:req.user.id,
        status:"pending"
    }).populate("recipient","fullName profilePic nativeLanguage learingLanguage");

    res.status(200).json(outGointRequest);
    
    } catch (error) {
        console.log(`error in getOutGoingRequest controller ${error}`);
        res.status(500).json({
            message : "Internal server error"
        });
    }
}