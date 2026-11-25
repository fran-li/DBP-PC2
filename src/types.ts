
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}



export interface Activities{
  id: number;
  name: string;
  discipline : string;
  date: Date;
  vacancies: number;
  description: string;
  location: string;
}

export interface Item{
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}
export interface Enrollment{
  experienceLevel: string;
}

export interface EnrollmentResponse{
  id : number;
  resourceId:  number;
  resourceName: string;
  status: string ;//(ACTIVE);
  experienceLevel: string;

}

export interface ApiErrorBody {
  code: string;
  message: string;
}