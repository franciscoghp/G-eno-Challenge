export interface ResponseCuit {
  data: {
    name: string;
    surname: string;
    birthday: string;
    scoring: {
      confidence: number;
      approved: boolean;
    };
  };
  success: boolean;
  message: string;
}
