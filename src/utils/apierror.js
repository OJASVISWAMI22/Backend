class Apierror extends Error{
  constructor(
    statusCode,
    message="Something Went Wrong",
    errors=[],
  ){
    super(message)
    this.statusCode=statusCode
    this.data=null
    this.message=message
    this.sucess=false
    this.error=errors
  }
}