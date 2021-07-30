import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import passport from 'passport';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exeption.filter';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT);
}
bootstrap();
