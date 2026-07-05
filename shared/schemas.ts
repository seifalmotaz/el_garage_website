import z from "zod";

// ===== utilities ===== //
export const phoneNumberSchema = z
  .string()
  .regex(/^\+?[1-9]\d{9}$/, "رقم جوال غير صالح");
// ===== utilities ===== //
//
//
//
// ===== login schema ===== //
export const loginSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: z.string().min(2, "كلمة مرور غير صالحة"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
// ===== login schema ===== //
//
//
//
// ===== signup schema ===== //
export const signupSchema = z
  .object({
    fullName: z.string().min(2, "الاسم بالكامل مطلوب"),
    email: z.string().email("بريد غير صالح"),
    phoneNumber: phoneNumberSchema,
    password: z.string().min(2, "كلمة مرور غير صالحة"),
    passwordConfirmation: z.string().min(2, "كلمة مرور غير صالحة"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "تأكيد كلمة المرور غير متطابقة",
    path: ["passwordConfirmation"], // error shows here
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;
// ===== signup schema ===== //
//
//
//
// ===== forget password schema ===== //
export const forgetPasswordSchema = z.object({
  phoneNumberOrEmail: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .refine(
      (value) =>
        z.string().email().safeParse(value).success ||
        phoneNumberSchema.safeParse(value).success,
      {
        message: "رقم جوال غير صالح أو بريد غير صالح",
      },
    ),
});

export type ForgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(4, "يجب ان يحتوي كود التحقق على اربع ارقام")
    .regex(/^\d+$/, "يجب ان يحتوي كود التحقق على اربع ارقام"),
});

export type VerifyCodeSchemaType = z.infer<typeof verifyCodeSchema>;

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(2, "كلمة مرور غير صالحة"),
    newPasswordConfirmation: z.string().min(2, "كلمة مرور غير صالحة"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "تأكيد كلمة المرور غير متطابقة",
    path: ["newPasswordConfirmation"], // error shows here
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
// ===== forget password schema ===== //
//
//
//
// ===== car sell schema ===== //
export const carSellFirstStepSchema = z.object({
  brand: z.string().min(1, "أختر الماركة"),
  model: z.string().min(1, "أختر الموديل"),
  year: z.string().min(1, "أختر سنة الصنع"),
  mileage: z.string().min(1, "أختر الكيلوميترات"),
  chassisNumber: z
    .string()
    .length(17, "رقم الشاصي يجب أن يكون 17 حرف")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "رقم الشاصي غير صالح"),
});

export type CarSellFirstStepSchemaType = z.infer<typeof carSellFirstStepSchema>;
// ===== car sell schema ===== //
