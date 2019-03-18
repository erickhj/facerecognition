const express=require('express');
const bodyParser= require('body-parser');
const cors=require('cors');
const bcrypt=require('bcrypt-nodejs');
const knex=require('knex');
const morgan=require('morgan');
const redis =require ('redis');

//Set up redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const register=require('./controllers/register')
const signin=require('./controllers/signin')
const profile=require('./controllers/profile')
const image= require('./controllers/image')
const auth= require('./controllers/authorization')


/*const db=knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl:true,
    }
});*/

//console.log('???')
const db=knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

const app=express();

app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{res.send('It is working!')})
app.post('/signin',(req,res)=>{signin.signinAuthentication(req,res,db,bcrypt,redisClient)})
app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)})
app.get('/profile/:id',(req,res,next)=>auth.requireAuth(req,res,next,redisClient),(req,res)=>{profile.handleProfile(req,res,db)})
app.post('/profile/:id',(req,res,next)=>auth.requireAuth(req,res,next,redisClient),(req,res)=>{profile.handleProfileUpdate(req,res,db)})
app.put('/image',(req,res,next)=>auth.requireAuth(req,res,next,redisClient),(req,res)=>{image.handleImage(req,res,db)})
app.post('/imageurl',(req,res,next)=>auth.requireAuth(req,res,next,redisClient),(req,res)=>{image.handleApiCall(req,res)})
app.listen(3000,()=>{//process.env.PORT|| 
    console.log(`app is running on port 3000`);//process.env.PORT|| 
})

/*
/ --> res= is working
/signin -->POST=success/fail
/register--> POST= user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
 


