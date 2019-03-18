const handleProfile = (req,res,db) => {

    const {id}=req.params;
    
    db.select('*').from('users').where({id:id})
    .then(user=>
    {
        if(user.length)
        {
            res.json(user[0])
        }else{
            res.status(400).json('Not found')
        }
        
    })
    .catch(err=>res.status(400).json('error getting user'))
}
const handleProfileUpdate=(req,res,db)=>{
    const{id}=req.params;
    const {name,age,pet}=req.body.formInput;
    console.log(req.params.id)
    db('users')
    .where({id})
    .update({name})
    .then(resp=>{ 
        if(resp){
            res.json('sucess')
        }else{
            res.status(400).json('unable to update')
        }
    })
    .catch(err=>res.status(400).json('error updating profile'))
}
module.exports={
    handleProfile:handleProfile,
    handleProfileUpdate:handleProfileUpdate
}