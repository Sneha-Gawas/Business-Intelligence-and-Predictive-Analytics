import express from 'express';
import axios from 'axios';
import cors from 'cors';
import passport from 'passport';
import { connectDb } from './config/db.js';
import session from 'express-session';
import LocalStrategy from 'passport-local';
import { createProxyMiddleware } from 'http-proxy-middleware';
import User from './models/user.js';
import authRoutes from './routes/authRoutes.js';
import { Cookie } from "express-session";
import reviewsRoutes from './routes/reviewsRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
const app = express();
const port = 8080; // Express runs on this port
const FLASK_API_URL = 'http://localhost:5000'; // Flask API URL (Ensure Flask is running)

// Database connection
connectDb();

app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewsRoutes);
// Session configuration
const sessionOptions = {
  secret: 'mysupersecret@11222**&&&',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Middleware configuration
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Proxy Dash and inventory traffic through Express
app.use(
  ['/dash', '/inventory', '/set', '/set_token'],
  createProxyMiddleware({
    target: FLASK_API_URL,
    changeOrigin: true,
    ws: true,
    secure: false,
    onProxyReq(proxyReq, req, res) {
      // Optional: keep original host in headers
    },
  })
);

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.post('/show', async (req, res) => {
  try {
    const { user_id, n } = req.body;
     const parsedUserId = parseInt(user_id, 10);
     const number=parseInt(n,10)
    const response = await axios.post(
      `${FLASK_API_URL}/show`,
      {
        user_id: parsedUserId,
        n:number
      }
    );

    res.json(response.data); // Send back the sentiment result
  } catch (error) {
    console.error('Error in /sentiment route:', error);
    res.status(500).json({ message: 'Error in sentiment analysis' });
  }
});

app.post('/recommend', async (req, res) => {
  try {
    console.log("Requesting recommendations from Flask...");

    const recommendationResponse = await axios.post(
      `${FLASK_API_URL}/recommend`,
      {},
      { responseType: 'json' }
    );

    if (!recommendationResponse.data) {
      throw new Error("Empty response from recommendation API");
    }

    const { recommended_coffees, association_rules, ai_algorithm, session_index } = recommendationResponse.data;
    
    // Ensure session index is updated from Flask, not manually incremented
    req.session.sessionIndex = session_index;


    res.json({
      recommended_coffees,
      association_rules,
      ai_algorithm,
      session_index,
    });

  } catch (error) {
    console.error("Error in /recommend route:", error.message || error);
    res.status(500).json({ message: 'Error in getting recommendations', error: error.message });
  }
});


app.get('/download_pdf', async (req, res) => {
  try {
    const pdfResponse = await axios.get(`${FLASK_API_URL}/download_pdf`, {
      responseType: "arraybuffer",
    });

    if (!pdfResponse.data || pdfResponse.data.byteLength === 0) {
      throw new Error("PDF response is empty or invalid.");
    }

    console.log(`Received PDF. Size: ${pdfResponse.data.byteLength} bytes`);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="filtered_recommendations.pdf"');

    res.send(Buffer.from(pdfResponse.data));

  } catch (error) {
    console.error("Error in /download_pdf route:", error.message || error);
    res.status(500).json({ message: "Error in downloading PDF", error: error.message });
  }
});



// Route to forward sentiment analysis to Flask API
app.post('/sentiment', async (req, res) => {
  try {
    const { user_id, product, review } = req.body;
     const parsedUserId = parseInt(user_id, 10);
    const response = await axios.post(
      `${FLASK_API_URL}/sentiment`,
      {
        user_id: parsedUserId,
        product: product,
        review: review,
      }
    );

    res.json(response.data); // Send back the sentiment result
  } catch (error) {
    console.error('Error in /sentiment route:', error);
    res.status(500).json({ message: 'Error in sentiment analysis' });
  }
});
app.get("/sentiment-data", async (req, res) => {
  try {
    console.log("Fetching data from Flask...");
    const flaskResponse = await axios.get("http://127.0.0.1:5000/sentiment-data");
    
    console.log("Flask Response:", flaskResponse.data); // Debugging log
    res.json(flaskResponse.data); // Send JSON to frontend
  } catch (error) {
    console.error("Error fetching from Flask:", error.message);
    res.status(500).json({ error: "Failed to fetch data from Flask" });
  }
});

app.get("/",(req,res)=>{
    res.send("Hello root");
})

// app.get("/loign",async(req,res)=>{
//     let user= new User({
//         email:"abc@gmail.com",
//         username:"abc"
//     })

//     let registeredUser = await User.register(user,"helloworld");
//     res.send(registeredUser);
// })

app.post("/signup",async(req,res)=>{
    let {username,email,password} = req.body;
    try{
        let newUser = new User({
            username:username,
            email:email,
        })
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
    }catch(err){
        res.status(500).send(err.message);
    }
})

/*app.post("/login",passport.authenticate("local"),async(req,res)=>{
    console.log(req.body)
    res.send("Welcom");
})*/
app.post("/login", passport.authenticate("local"), (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ success: true, message: "Login successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});
// Start the server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
