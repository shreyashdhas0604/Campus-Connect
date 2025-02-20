// user-service/models/User.ts
// This is the User model file. This file contains the User class which is used to create User objects. The User class has the following properties:
import { Role,Div,Year,Department } from '@prisma/client';

export class User {
    constructor(
      public id: number,
      public email: string,
      public username: string,
      public name: string,
      public password: string,
      public department: Department,
      public role: Role = Role.student,
      public emailVerified: boolean = false,
      public verificationToken: string | null = null,
      public otp: number | null = null,
      public year: Year,
      public division: Div,
      public profilePic: string | null = null,
      public createdAt: Date = new Date(),
      public updatedAt: Date = new Date()
    ) {}
  }
  