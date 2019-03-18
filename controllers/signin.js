const jwt = require('jsonwebtoken');

const handleSignin = (req,res,db,bcrypt)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return Promise.reject('incorrect form submission')
    }

    return db.select('email','hash').from('login')
    .where('email','=', req.body.email)
    .then(data=>{
        const isValid=bcrypt.compareSync(req.body.password, data[0].hash); 
        if(isValid)
        {
           return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user=>user[0])
            .catch(err=>Promise.reject.json('unable to get user'))
        }else{
         Promise.reject('wrong credentials')
        }
        
    })
    .catch(err=>Promise.reject('wrong credentials'))
 }
 const getAuthTokenid=(req,res,redisClient)=>{
    const{authorization}=req.headers;
    return redisClient.get(authorization,(err,reply)=>{
        if(err || !reply){
            return res.status(400).json('Unauthorized');
        }
        return res.json({id:reply})
    })
 }

const signToken =(email)=>{
    const jwtPayload = {email};
    return  jwt.sign(jwtPayload, 'JWT_SECRET',{expiresIn: '2 days'});
}

const setToken =(key,value,redisClient) =>{
    return Promise.resolve(redisClient.set(key,value))
}

 const createSessions=(user,redisClient)=>{
    const {email,id}=user;
    const token= signToken(email);
    return setToken(token,id,redisClient)
    .then(()=>{
        return {success:'true',userId:id,token}})
    .catch(console.log)
 }

 const signinAuthentication= (req,res,db,bcrypt,redisClient)=>{
    const {authorization}=req.headers;
    return authorization?getAuthTokenid(req,res,redisClient):handleSignin(req,res,db,bcrypt)
    .then(data=>{
      return data.id && data.email ?createSessions(data,redisClient):Promise.reject(data)
    })
    .then(session=>res.json(session))
    .catch(err=>res.status(400).json(err))
 }
 module.exports={
     signinAuthentication:signinAuthentication
 }