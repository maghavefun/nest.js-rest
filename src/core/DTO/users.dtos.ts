export interface UserCreatingDTO {
  name: string;
  surname?: string;
  email: string;
  pass_hash: string;
  salt: string;
}
