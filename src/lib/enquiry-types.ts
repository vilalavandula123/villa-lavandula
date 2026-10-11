export type EnquiryField =
  | "arrival"
  | "departure"
  | "adults"
  | "children"
  | "childrenAges"
  | "pets"
  | "name"
  | "email"
  | "phone"
  | "message";

export type EnquiryErrorCode =
  | "arrivalRequired"
  | "arrivalPast"
  | "departureRequired"
  | "departureOrder"
  | "rangeTooFar"
  | "adults"
  | "adultsMax"
  | "children"
  | "name"
  | "email"
  | "phone"
  | "tooLong";

export type EnquiryValues = Partial<Record<EnquiryField, string>>;

export type EnquiryState = {
  status: "idle" | "invalid" | "success" | "not_configured" | "rate_limited" | "failed" | "spam";
  errors?: Partial<Record<EnquiryField, EnquiryErrorCode>>;
  values?: EnquiryValues;
  /** сменя се при всеки отговор, за да се обнови формата */
  stamp: number;
};

export const initialEnquiryState: EnquiryState = { status: "idle", stamp: 0 };
