const express = require('express');
const port = 4000;
const cors = require('cors')
const db = require('./db/dbConnection');
const userService = require('./Services/UserService');
const { default: mongoose } = require('mongoose');
const connectionString = 'mongodb+srv://root:root@wtd.bsahy.mongodb.net/ToDo?retryWrites=true&w=majority'

    mongoose.connect(connectionString,{ useUnifiedTopology: true, useNewUrlParser: true }).then(()=>{
        console.log("Connect Success");
    });

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
    
    app.get('/api/getUserData/:id', (req,res) => {
        const servise = new userService();
        servise.getUserData(req.params.id).then((result)=>{
            res.send(result);
        })
        
        
    });

    app.post('/api/registration',async (req,res)=>{
        const service = new userService();
        const result = await service.RegistrationUser(req?.body);
        console.log(result);
        if (result === null){
            res.status(400).send({err : "Email is already used"});
        }else res.status(200).send(result);
    }); 
    

    app.post('/api/login', (req,res)=>{
        const service = new userService();
        service.LoginUser(req.body).then(result =>{
            if (result === null || result ===undefined){
                res.status(401)
                res.send({
                   error :  "Incorect login or password"}
                );
            }
            else{
                console.log(result)
                res.send(result)
            }
            
        })
    });

    app.post('/api/addNewTask/:id', (req,res) =>{
        const service  = new userService();
        service.AddNewTask(req.params.id, req.body).then(result =>{
            service.getUserData(req.params.id).then((result)=>{
                res.status(200).send(result);
            });
            

        }) 
       
    });

    app.get('/api/deleteTask/:id/:taskId', (req,res) => {
        const service = new userService();

        service.DeleteTask(req.params.id, req.params.taskId).then( result =>{
            res.status(200).send(result)
        });

    });

    app.get('/api/markIsDone/:id/:taskId', (req, res)=>{
        const service = new userService();

        service.MarkIsDone(req.params.id,req.params.taskId).then(result =>{
            service.getUserData(req.params.id).then((user)=>{
                res.status(200).send(user);
            })
            
        })
    })

    app.post('/api/changeLocation/:id', (req, res)=>{
        const service = new userService();
        service.ChangeLocation(req.params.id, req.body.location).then((result)=>{
            service.getUserData(req.params.id).then((resss)=>{
                res.status(200).send(resss);
            });
        })
        
    })

    app.post('/api/updateTask/:id/:taskid', (req,res)=>{
        const service = new userService();
        console.log(req.body);
        service.UpdateTask(req.params.id, req.params.taskid, req.body).then((result)=>{
            service.getUserData(req.params.id).then( user => {
                res.send(user);
            })
        })
    })











