const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const mainRouter = require('./routes/mainRouter');


const app = express();

const db = new sqlite3.Database('./database.db');

// Создаем таблицу пользователей, если она не существует
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT
  )
`);

// Настройка middleware для обработки данных из форм
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Настройка сессий с использованием SQLiteStore
app.use(session({
  store: new SQLiteStore(),  // Хранение сессий в SQLite
  secret: 'yourSecretKey',   // Ваш секретный ключ
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Инициализация Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Настройка локальной стратегии для Passport.js
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error("Database error:", err);
      return done(err);
    }
    if (!user) {
      console.log("Login failed: incorrect email");
      return done(null, false, { message: 'Incorrect email.' });
    }

    bcrypt.compare(password, user.password, (err, res) => {
      if (err) {
        console.error("Bcrypt comparison error:", err);
        return done(err);
      }
      if (res) {
        console.log("Login successful");
        return done(null, user);
      } else {
        console.log("Login failed: incorrect password");
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

// Сериализация пользователя для сохранения в сессии
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Десериализация пользователя по id из сессии
passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    done(err, user);
  });
});

// Маршрут для регистрации нового пользователя
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Хэширование пароля перед сохранением
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    
    // Сохранение нового пользователя в базе данных
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err) => {
      if (err) return res.status(500).json(err.message);
      res.redirect('/login');
    });
  });
});

// Маршрут для входа пользователя
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Handle server errors
      return next(err);
    }
    if (!user) {
      // If authentication fails, display the error message from 'info'
      return res.render('login', { message: info.message });
    }
    // If authentication is successful, log in the user
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect to the dashboard after a successful login
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});


app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});


// Маршрут для защищенной страницы (требует авторизации)
app.get('/dashboard', (req, res) => {

    res.redirect('/');

});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');  // Измените 'jade' на 'pug'

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // Proceed to the next middleware or route handler
  }
  res.redirect('/login'); // Redirect to the login page if not authenticated
}

app.get('/login', (req, res) => {
  res.render('login'); // Render login form
});

app.get('/register', (req, res) => {
  res.render('register'); // Render register form
});

app.use(ensureAuthenticated);
app.use('/', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
