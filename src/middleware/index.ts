import { StatusCodes } from "http-status-codes"
import { returnResponse } from "../types/types.js"
import { Request,Response,Errback,NextFunction } from "express"

interface Errbacka extends Errback{
    statusCode:string |number,
    message:string
}
export const RequestError = (err:Errbacka,req:Request,res:Response,next:NextFunction)=>{
  return res.json({message:'somrhing gone wrong'})
}