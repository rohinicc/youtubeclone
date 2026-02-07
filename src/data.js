export const API_KEY='AIzaSyDwsbR04GOTZxwRLeY9FPNth1t2qnO-AFY'
 export const value_converter =(value) =>{
if(value>=1000000)
{
    return Math.floor(value/1000000)+"M"
}
else if(value>=1000)
{
    return Math.floor(value/1000)+"k"
}
return value
}
