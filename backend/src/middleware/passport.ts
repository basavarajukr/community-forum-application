import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import prisma from '../prisma'; 

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secretkey', 
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload: { userId: number }, done: VerifiedCallback) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.userId },
      });

      if (user) {
        console.log(`User found: ${user.name}`);
        return done(null, user);
      }

      console.log('User not found');
      return done(null, false);
    } catch (err) {
      console.error('Error during JWT authentication:', err);
      return done(err as Error, false);
    }
  })
);


export default passport;
