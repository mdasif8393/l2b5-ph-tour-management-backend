import httpStatus from "http-status-codes";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import AppError from "../errorHelpers/AppError";

// google login middleware
passport.use(
  // initialize google authentication
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      // our custom works
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let isUserExists = await User.findOne({ email });
        // create user in database

        if (isUserExists && !isUserExists.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
          return done(null, false, { message: "User is not verified" });
        }

        if (
          (isUserExists && isUserExists.isActive === IsActive.INACTIVE) ||
          (isUserExists && isUserExists.isActive === IsActive.BLOCKED)
        ) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User inActive")
          return done(null, false, { message: "User is inactive or blocked" });
        }

        if (isUserExists && isUserExists.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
          return done(null, false, { message: "User is  deleted" });
        }

        if (!isUserExists) {
          isUserExists = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExists);
      } catch (error) {
        console.log("Google strategy error", error);
        return done(error);
      }
    }
  )
);

// credential login middleware
passport.use(
  new LocalStrategy(
    // rename usernameField to email
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExists = await User.findOne({ email });

        // if user exists in database then show error
        if (!isUserExists) {
          return done(null, false, { message: "User does not exists" });
        }

        if (!isUserExists.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
          return done("User is not verified");
        }

        if (isUserExists.isActive === IsActive.INACTIVE) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User inActive");
          return done(`User inActive`);
        }

        if (isUserExists.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
          return done(`User is deleted`);
        }

        // check user is google authenticated user or not
        const isGoogleAuthenticated = isUserExists.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExists.password) {
          return done(null, false, {
            message:
              "Your are authenticated with Google. if we want to log in with credential then 1st log in with google and then set your password",
          });
        }

        // if password match
        const isPasswordMatched = await bcrypt.compare(
          password as string,
          isUserExists.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "password does not match" });
        }
        return done(null, isUserExists);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

// serialize session
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// deserialize session
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
