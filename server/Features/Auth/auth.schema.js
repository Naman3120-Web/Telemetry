import * as v from "valibot";

export const RegisterationSchema = v.object({
  username: v.pipe(
    v.string("UserName is required"),
    v.minLength(5, "Minimum 5 Characters Required"),
    v.maxLength(13, "Maximum Characters Limit Reached"),
  ),
  password: v.pipe(v.string(), v.minLength(6, "Minimum Length Must Be 6")),
  email: v.pipe(v.string(), v.trim(), v.email("Enter A Valid Email")),
  DOB: v.pipe(
    v.string("DOB is Required"),
    v.isoDate("Invalid date format. Please use YYYY-MM-DD"),
    v.check(
      (val) => new Date(val) < new Date(),
      "Date of birth cannot be in the future",
    ),
  ),
});



export const LoginSchema = v.object(
  {
    
    email: v.pipe(v.string("Enter Your Registered Email"),v.trim(),v.email()),
    password:v.pipe(v.string("Enter Your Password"), v.minLength(6, "Minimum Length Must Be 6"))
  }
)