import express from "express";
import bcrypt from "bcrypt";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMkuv5GZ9VMtU5lgRnKTMTnI6SuTGjx3w",
  authDomain: "ecom-website-2eaa8.firebaseapp.com",
  projectId: "ecom-website-2eaa8",
  storageBucket: "ecom-website-2eaa8.appspot.com",
  messagingSenderId: "199833402497",
  appId: "1:199833402497:web:4fa4ca99652bbde6706180"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(); // connect the Firestore

// init server
const app = express();

// middlewares
app.use(express.static("public"));
app.use(express.json()); // enables form data sharing

//routes
//home route
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" })
})

// sign up
app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root: "public" })
})

app.post('/signup', (req, res) => {
    const { name, email, password, number, tac } = req.body;

    //form validation
    if(name.length < 3){
        res.json({ 'alert' :'Name must be 3 letters long'});
    }else if(!email.length){
        res.json({ 'alert' :'Enter your email'});
    }
    else if(password.length < 8){
        res.json({ 'alert' :'Password must be 8 letters long'});
    }
    else if(number.length < 10){
        res.json({ 'alert' :'Invalid number, please enter valid one'});
    }
    else if(!tac){
        res.json({ 'alert' :'You must agree to our terms and conditions'});
    }else{
        //store the data in db
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
                return res.json({ 'alert' : 'Email already exists'})
            }else{
                // encrypt the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        req.body.seller = false;

                        // set the doc
                        setDoc(doc(users, email), req.body).then(data =>{
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller
                            })
                        })
                    })
                })
            }
        })
    }
})

// log in route
app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: "public" })
})

// post login route
app.post('/login', (req, res) => {
    let { email, password } = req.body;
    
    if(!email.length || !password.length){
       return res.json({ 'alert' : 'fill all the inputs'})
    }

    const users = collection(db, "users");

    getDoc(doc(users, email))
    .then(user => {
        if(!user.exists()){
            return res.json({ 'alert' : 'email does not exists' })
        }else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller
                    })
                }else{
                    return res.json({ 'alert' : 'password is incorrect' })
                }
            })
        }
    })
})

// seller route
app.get('/seller',(req, res) => {
    res.sendFile("seller.html", {root: "public"})
})

// 404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root: "public" })
})

app.use((req, res) => {
    res.redirect('/404')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})