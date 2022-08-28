const { mongo } = require('mongoose');
const bcrypt = require('bcryptjs');
const bcryptfunctions = require('./bcrypt')


async function createUser(x , newClient){
  const MongoClient = require('mongodb').MongoClient;
  url = "mongodb://localhost:27017";
  const instance = new MongoClient(url)
  try {
      await instance.connect();

      console.log('im connected');

      const res = await instance.db("clients").collection(`${x}`).insertOne(newClient);
      console.log(res);
  }
  catch(err){
      console.log('there is an error' + err)
  }
  finally{
      instance.close();
      console.log('the connection was closed')
  }
}



async function uniqueEmail(x , newClientEmail){
    const MongoClient = require('mongodb').MongoClient;
    url = "mongodb://localhost:27017";
    const instance = new MongoClient(url)
    try {
        await instance.connect();
  
        console.log('im connected');
  
        const res = await instance.db("clients").collection(`${x}`).findOne(newClientEmail);
        console.log(res);

        return res;
        

    }
    catch(err){
        console.log('there is an error' + err)
    }
    finally{
        instance.close();
        console.log('the connection was closed')
    }
  }


  
async function loginCheck(x , email , userInputPassword){
    const MongoClient = require('mongodb').MongoClient;
    url = "mongodb://localhost:27017";
    const instance = new MongoClient(url)
    let res;
    try {
        await instance.connect();
  
        console.log('im connected');
  
        res = await instance.db("clients").collection(`${x}`).findOne(email);
        // console.log(res);
        if (res) {
            let hash = res.password;
            bcrypt.compare(userInputPassword , hash ).then((res) => {
                if (res){
                    console.log('log in complete')
                }
                else { console.log('password is incorrect')}
            });
    
        }
        else {console.log('email not found')};
        return res;
    }
    catch(err){
        console.log('there is an error' + err)
    }
    finally{
        instance.close();
        console.log('the connection was closed');


    }
  }







module.exports = {
    createUser : createUser,
    uniqueEmail : uniqueEmail,
    loginCheck : loginCheck
};