const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Create express app
const app = express();
const PORT = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'your-secret-key', // Replace with a secure key in a real application
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Dummy user data (In a real application, use a database)
const users = [
    { username: 'admin', password: 'password123' }, // Replace with hashed passwords in a real application
    { username: 'user', password: 'mypassword' }
];

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.redirect('/admin.html');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.redirect('/login.html');
    });
});

app.get('/admin.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
