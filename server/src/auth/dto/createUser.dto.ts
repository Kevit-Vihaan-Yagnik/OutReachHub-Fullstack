export class CreateUserDto {
  name: string;
  password: string;
  contactInfo: {
    countryCode?: string;
    phoneNo: number;
    email: string;
  };
}