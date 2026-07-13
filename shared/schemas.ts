import z from "zod";

// ===== utilities ===== //
/**
 * Local 10-digit phone number (no country code, no leading `+`).
 * The form's visual input shows only the local number; the submit
 * handler prepends the country code (e.g. `+20` for Egypt) before
 * sending the request to the backend, which expects E.164.
 */
export const phoneNumberSchema = z
  .string()
  .regex(/^[1-9]\d{9}$/, "رقم جوال غير صالح");
// ===== utilities ===== //
//
//
//
// ===== login schema ===== //
export const loginSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
// ===== login schema ===== //
//
//
//
// ===== signup schema ===== //
export const signupSchema = z
  .object({
    firstName: z.string().min(2, "الاسم الأول مطلوب"),
    lastName: z.string().min(2, "اسم العائلة مطلوب"),
    phoneNumber: phoneNumberSchema,
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    passwordConfirmation: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
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
    newPassword: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    newPasswordConfirmation: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
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
export const carSellStepsSchema = z.object({
  step1: z.object({
    brand: z.string().min(1, "أختر الماركة"),
    model: z.string().min(1, "أختر الموديل"),
    year: z.string().min(1, "أختر سنة الصنع"),
    mileage: z.string().min(1, "أختر الكيلوميترات"),
    chassisNumber: z
      .string()
      .length(17, "رقم الشاصي يجب أن يكون 17 حرف")
      .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "رقم الشاصي غير صالح"),
  }),
  step2: z.object({
    address: z.string().min(6, "يجب أن لايقل العنوان عن 6 أحرف"),
  }),
  step3: z.object({
    date: z.string().min(1, "أختر التاريخ"),
    appointment: z
      .string({
        error: "أختر الميعاد",
      })
      .min(1, "أختر الميعاد"),
  }),
});

export type CarSellStepsSchemaType = z.infer<typeof carSellStepsSchema>;
// ===== car sell schema ===== //
//
//
//
// ===== contact us schema ===== //
export const contactSchema = z.object({
  name: z.string().min(2, "الاسم بالكامل مطلوب"),
  email: z.string().email("بريد غير صالح"),
  phoneNumber: phoneNumberSchema,
  messageType: z.string().min(1, "حدد نوع الرسالة"),
  message: z.string().min(10, "يجب أن لا تقل الرسالة عن 10 أحرف"),
});

export type ContactSchemaType = z.infer<typeof contactSchema>;
// ===== contact us schema ===== //
