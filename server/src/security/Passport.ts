import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import Secrets from '../secrets';

passport.use(
  new GoogleStrategy(
    {
      clientID: Secrets.googleKey,
      clientSecret: Secrets.googleSecret,
      callbackURL: 'http://localhost:8081/auth/google/callback',
    },
    (token, tokenSecret, profile, done) => {
      console.log(token, tokenSecret, profile, done);
    }
  )
);

const Auth = passport;
export default Auth;
