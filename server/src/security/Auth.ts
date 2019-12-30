import passport from 'passport';
import {Express} from 'express';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import Secrets from '../../../secrets';

type GoogleEmail = {
  value: string;
  verified: boolean;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: Secrets.googleKey,
      clientSecret: Secrets.googleSecret,
      callbackURL: 'http://localhost:8081/auth/google/callback',
    },
    (token, tokenSecret, profile, done) => {
      const verifiedEmail = profile?.emails.find(
        (e: GoogleEmail) => e.verified
      );
      if (verifiedEmail) {
        console.log('Found user:', {email: verifiedEmail.value});
        done(null, {email: verifiedEmail.value});
      } else {
        done('No verified email in google account');
      }
    }
  )
);

export function useSecurity(express: Express) {
  express.use(passport.initialize());

  // use Google OAUTH2
  express.get(
    '/auth/google',
    passport.authenticate('google', {session: false, scope: ['email']})
  );
  express.get('/auth/google/callback', (req, res, next) =>
    passport.authenticate('google', (err, user, info) => {
      res.json(user);
    })(req, res, next)
  );
}
