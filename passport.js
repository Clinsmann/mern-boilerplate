const passport = require('passport');
const User = require('./models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) token = req.cookies["access_token"];
  return token;
};

/*for authorization*/
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() /*cookieExtractor*/,
  secretOrKey: process.env.JWT_SECRET
}, (payload, done) => {
  User.findById({_id: payload.sub}, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    else return done(null, false);
  });
}));

/*authenticated local strategy using username and password*/
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({username}, (err, user) => {
    /*if something went wrong with the database*/
    if (err) return done(err);
    /*if no user exist*/
    if (!user) return done(null, false);
    /*check if password is correct*/
    user.comparePassword(password, done);
  });
}));
