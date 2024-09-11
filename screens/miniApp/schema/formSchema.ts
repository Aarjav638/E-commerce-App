import {z} from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Name must be at least 3 characters\n'})
    .refine(name => /^[a-zA-Z ]+$/.test(name), {
      message: 'Name must only contain alphabets',
    }),
  email: z.string().email(),
  phone: z
    .string()
    .min(10, {message: 'Phone number must be 10 digits\n'})
    .max(10, {message: 'Phone number must be 10 digits\n'})
    .refine(phone => /^\d{10}$/.test(phone), {
      message: 'Phone number must be a valid 10-digit number',
    }),
  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters,\n'})
    .refine(
      password =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/.test(
          password,
        ),
      {
        message:
          'Password must contain at least one uppercase letter\n, one lowercase letter\n, one special Character and one number',
      },
    ),
});

export type RegistrationFormState = z.infer<typeof formSchema>;

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters,\n'})
    .refine(
      password =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/.test(
          password,
        ),
      {
        message:
          'Password must contain at least one uppercase letter\n, one lowercase letter\n, one special Character and one number',
      },
    ),
});
export type LoginFormState = z.infer<typeof LoginFormSchema>;
