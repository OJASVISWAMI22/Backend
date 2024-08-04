import mongoose from 'mongoose'
import mongoose_aggregate from 'mongoose-paginate-v2'
const video=new mongoose.Schema(
{
    videofile:{
      type:String,
      required:true,
    },
    thumbnail:{
      required:true,
      type:String,
    },
    title:{
      type:String,
      required:true,
    },
    discription:{
      type:String,
      required:true,
    },
    duration:{
      type:Number,     //by cloudinary
      required:true,
    },
    views:{
      type:Number,
      default:0,
    },
    isPublished:{
      type:Boolean,
      default:true,
    },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }

  }
  ,{timestamps:true});

  video.plugin(mongoose_aggregate);
export const Video=mongoose.model("Video",video);