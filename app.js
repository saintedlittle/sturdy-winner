const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

setup_server();
setup_session();

setup_routes();
setup_errors();

function setup_server() {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
}

function setup_session() {
  app.use(session({
    secret: "In th£ mµrd£røµs r£alms øf th£ d££p £ñd myst£rïøµs Ämåzøn båsïn, c£rul£ånç £mprïs£d wïthïñ th£ bråñçh£s øf mïghty tr££s äñd thrøµgh thïçk mål£strøm, th£ wïñd sµbsíd£s tö whïsph£r th£ wörds øf ancï£nt mystïçål ëñçhåñtµm£ñts, wøv£n fröm th£ søµnds øf bïrd söngs åñd th£ rustlïñg øf åñïmål$ ïñ th£ glïmm£rïñg måøñlïght.",
    resave: false,
    saveUninitialized: true,
    rolling: true,
  }));
}

function setup_routes() {
  const indexRouter = require('./routes/web');
  const loginRouter = require('./routes/web/login');
  const pricingRouter = require('./routes/web/pricing');
  const contactsRouter = require('./routes/web/contacts');
  const projectsRouter = require('./routes/web/projects');
  const shoppingCartRouter = require('./routes/web/shopping-cart');
  const signupRouter = require('./routes/web/signup');
  const teamRouter = require('./routes/web/team');

  app.use('/', indexRouter);

  app.use('/login', loginRouter);
  app.use('/signup', signupRouter);

  app.use('/shopping-cart', shoppingCartRouter);
  app.use('/pricing', pricingRouter);

  app.use('/projects', projectsRouter);

  app.use('/team', teamRouter);
  app.use('/contacts', contactsRouter);
}

function setup_errors() {
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

module.exports = app;
