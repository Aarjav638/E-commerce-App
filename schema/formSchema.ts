import {z} from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .min(3)
    .refine(name => /^[a-zA-Z ]+$/.test(name), {
      message: 'Name must only contain alphabets',
    }),
  email: z.string().email(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string().min(6).max(6),
  phone: z
    .string()
    .min(10, {message: 'Phone number must be 10 digits'})
    .max(10, {message: 'Phone number must be 10 digits'})
    .refine(phone => /^\d{10}$/.test(phone), {
      message: 'Phone number must be a valid 10-digit number',
    }),
  card: z.string(),
  expiry: z.string().refine(
    date => {
      const [month, year] = date.split('/');
      if (!month || !year) {
        return false;
      }

      const monthInt = parseInt(month, 10);
      if (monthInt < 1 || monthInt > 12) {
        return false;
      }
      const currentDate = new Date();
      const expiryDate = new Date(parseInt(year, 10), monthInt - 1);

      return (
        expiryDate >=
        new Date(currentDate.getFullYear(), currentDate.getMonth())
      );
    },
    {
      message:
        'Expiry date must be in the format MM/YYYY and must be in the future',
    },
  ),
  cvv: z.string().min(3).max(3),
});
