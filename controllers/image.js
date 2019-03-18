const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'bcc1900efcaf42bcaf85d79423404348'
});

const handleApiCall = (req, res) => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => {
          //console.log(data.outputs[0].data.regions)
        res.json(data);
      })
      .catch(err => res.json('unable to work with API'))
  }


const handleImage=(req,res,db)=>{
    const { id } = req.body;
    //console.log("here",id)
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=>{
        //console.log(entries)
        res.json(entries[0]);
    })
    .catch(err=>res.status(400).json('unable to get entries'))
}
module.exports={
    handleImage:handleImage,
    handleApiCall:handleApiCall
}