export const transmission_options = [
  { label: "ناقل حركة  1", value: "1" },
  { label: "ناقل حركة  2", value: "2" },
];

export const kilometer_options = [
  { label: "كيلو متر  1", value: "1" },
  { label: "كيلو متر  2", value: "2" },
  { label: "كيلو متر  3", value: "3" },
];

export const model_options = [
  { label: "موديل  1", value: "1" },
  { label: "موديل  2", value: "2" },
  { label: "موديل  3", value: "3" },
];

export const release_options = [
  { label: "اصدار  1", value: "1" },
  { label: "اصدار  2", value: "2" },
  { label: "اصدار  3", value: "3" },
];

export const condition_options = [
  { label: "حالة  1", value: "1" },
  { label: "حالة  2", value: "2" },
  { label: "حالة  3", value: "3" },
];

export const brand_options = [
  { label: "ماركة  1", value: "1" },
  { label: "ماركة  2", value: "2" },
  { label: "ماركة  3", value: "3" },
];

export const filterFields = [
  {
    label: "ناقل الحركة",
    placeholder: "أوتوماتيك / مانيوال",
    options: transmission_options,
  },
  {
    label: "الكيلومتر(كم)",
    placeholder: "منذ سنة",
    options: kilometer_options,
  },
  { label: "الموديل", placeholder: "حدد الموديل", options: model_options },
  { label: "الإصدار", placeholder: "منذ سنة", options: release_options },
  { label: "الحالة", placeholder: "جديد / مستعمل", options: condition_options },
  { label: "الماركة", placeholder: "حدد الماركة", options: brand_options },
];
