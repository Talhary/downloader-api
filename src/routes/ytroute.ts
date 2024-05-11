import { Router } from "express";
import { Request,Response } from "express";
import { returnResponse } from "../types/types.js";
import DownloadYt from '../lib/yt-dl.js'
import DetailsYt from '../lib/yt-dl-details.js'
import {BadRequestError} from '../error/index.js'
import { UploadAndGetDownLoadLink } from "../lib/upload.js";
import fs from 'fs'
import convertKbToMb from "../fuctions.js";
const route = Router();
route.route('/').get(async (req:Request,res:Response)=>{
    let {url,quality} = req.query
    if(!url){
        return res.json({message:'Please provide url'}).status(400)
    }
    if(!quality){
        quality = '720p'
    }
    const response =  await DownloadYt(url as string,quality as string)
    if(response.statusCode == 200){
    if(!response.name) response.name = 'video.mp4';
    if(!response.mimeType) response.mimeType == 'video/mp4'
    const data1=  await UploadAndGetDownLoadLink(response.name as string,response.mimeType as string)
    const size =convertKbToMb(data1.size as string)
    data1.size = size
    res.json({status:200,message:data1,url:data1.webContentLink,ok:true} as returnResponse)
    fs.unlinkSync(response.name as string)
    }
    else return res.json({message:"error lol ",ok:false,status:404}).status(404)
}) 
route.route('/details').get(async(req:Request,res:Response)=>{
    const {url} = req.query;
    if(!url){
        return res.json({message:'Please enter url',status:400,ok:false})
    }
    const response = await DetailsYt(url as string)
    res.json({message:response,status:200,ok:true})
})
const Ytroute = route
export {Ytroute}