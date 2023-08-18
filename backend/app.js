const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());

app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginproject'

});

db.connect((err) =>{
    if(err){
        console.log("Error coonecting to MySQL:", err);
    } else{
        console.log('Connected to MySQL successfully!!!');
    }
});

const saltRounds = 10;

app.post('/api/register', (req,res) => {
    const{ username, password, fullName, gender, dateOfBirth, email, phoneNumber } = req.body;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error while hashing password:', err);
        } else {
          // Store the hashedPassword in the database or use it as needed
          console.log('Hashed Password:', hashedPassword);

          db.query('SELECT * FROM login WHERE username = ?',[username], (error, results) => {
            if(error){
                console.error('Error while querying the database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
    
            }
    
            if(results.length > 0){
                return res.status(409).json({ success:false, message: 'Username aleady exists' });
    
            }
    
            db.query('INSERT INTO login (username, password, fullName, gender, dateOfBirth, email, phoneNumber) VALUES (?,?,?,?,?,?,?)', [username, hashedPassword, fullName, gender, dateOfBirth, email, phoneNumber], (error, results) => {
                if(error){
                    console.error('Error while inserting user into the database', error);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
    
                console.log(results);
                const token = jwt.sign({ userId: results.insertId }, 'rinku123', { expiresIn: '1h' });
                return res.json({ success:true, token});
            })
        })

        }
      });


    
})


app.post('/api/updateUser', (req,res) => {
    const{ username, password, fullName, gender, dateOfBirth, email, phoneNumber, username2 } = req.body;

    db.query('UPDATE login SET username=?, password=?, fullName=?, gender=?, dateOfBirth=?, email=?, phoneNumber=? WHERE username=?', [username, password, fullName, gender, dateOfBirth, email, phoneNumber,username2], (error, results) => {
        if(error){
            console.error('Error while inserting user into the database', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        console.log(results);
        // const token = jwt.sign({ userId: results.insertId }, 'rinku123', { expiresIn: '1h' });
        return res.json({ success:true});
    })
})

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM login WHERE username = ?', [username], (error, results) => {
        if(error){
            console.error("Error while querying the database:", error);
            return res.status(500).json({ success:false, message: 'Internal Sever Error' });

        }

        if(results.length === 0){
            return res.status(401).json({ success: false, message: 'Invalid username or password' });

        }


        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) {
              console.error('Error while comparing passwords:', err);
              return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
          
            if (!isMatch) {
              return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
          
            const { id, username, fullName } = results[0];
            const token = jwt.sign({ userId: results[0].id }, 'rinku123', { expiresIn: '1h' });
            return res.json({ success: true, token });
          });
        


    });
});


app.get('/api/getFullName', (req, res) => {

    const token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({ success:false, message: 'Unauthorized. Missing token.' });   
    }

    jwt.verify(token, 'rinku123', (err, decoded) => {
        if(err){
            console.error('Error while verifying the token:', err);
            return res.status(401).json({ success: false, message:'Unauthorized. Invalid token.' });

        }

        const userId = decoded.userId;
        console.log(userId);

        db.query('SELECT fullName,username FROM login WHERE id = ?', [userId], (error, results) => {
            if(error){
                console.error('Error while querying the database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });

            }

            if(results.length === 0){
                return res.status(404).json({ success: false, message: 'User not found' });

            }

            const fullName = results[0].fullName;
            const username = results[0].username;
            return res.json({ success: true, fullName, username });
        })

    })
})


app.get('/api/fetchAllDetails', (req, res) => {

    const token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({ success:false, message: 'Unauthorized. Missing token.' });   
    }

    jwt.verify(token, 'rinku123', (err, decoded) => {
        if(err){
            console.error('Error while verifying the token:', err);
            return res.status(401).json({ success: false, message:'Unauthorized. Invalid token.' });

        }

        const userId = decoded.userId;
        // console.log(userId);

        db.query('SELECT * FROM login WHERE id = ?', [userId], (error, results) => {
            if(error){
                console.error('Error while querying the database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });

            }

            if(results.length === 0){
                return res.status(404).json({ success: false, message: 'User not found' });

            }
            
            // console.log(results);
            // const fullName = results[0].fullName;
            return res.json({ success: true, data:results });
        })

    })
})


const port = 3000;
app.listen( port, () => console.log(`Server running on port ${port}`) );
