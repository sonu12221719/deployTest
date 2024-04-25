const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

const PORT = process.env || 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

mongoose.connect(mongoURI)
    .then(()=>console.log('Connected to MongoDB'))
    .catch(err=> console.error('Error connecting to MongoDB:',err));

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password: String
});

const User = mongoose.model('User',userSchema);

app.get('/users',(req,res)=>{
    User.find({})
    .then(res.redirect('./index.html'))
    .catch(err=>res.status(500).json({
        message: err.message
    }));
})

app.post('/users',(req,res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    res.json({
        message: 'User created successfully'
    })
    
})

app.put('/users/:id',(req,res)=>{
    const userId = req.params.id;
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    User.findByIdAndUpdate(userId, updateData, {new:true})
    .then(updatedData =>{
        if(!updatedData){
            return res.status(404).json({message: 'User not found'});
        }
        res.json(updatedData);
    })
    
    .catch(err=>{
        console.error(err);
        res.status(400).json({message:err.message})});
    
})

app.delete('/users/:id',async(req,res)=>{
    const userId = req.params.id;
    await User.deleteOne({_id:userId});
    res.json({message:'user deleted'});
});



app.listen(PORT,()=>{
    console.log(`your server is running on http://localhost:${PORT}`);
})