import { LOGIN_QUERY, LOGOUT_QUERY, REGISTER_QUERY } from 'src/graphql/authQuery';
import { LoginValues, RegisterValues } from 'src/types/InputValue';
import { LoginMutation, LogoutMutation, RegisterMutation } from 'src/types/MutationResponse';
import { UserResponse } from 'src/types/Response';
import app from 'src/utils/graphqlRequest';

export const loginRequest = async (data: LoginValues): Promise<UserResponse> => {
  const response: LoginMutation = await app.request(LOGIN_QUERY, {
    data,
  });

  return response.login;
};

export const registerRequest = async (data: RegisterValues): Promise<UserResponse> => {
  const response: RegisterMutation = await app.request(REGISTER_QUERY, {
    data,
  });
  return response.register;
};

export const logoutRequest = async () => {
  const { logout }: LogoutMutation = await app.request(LOGOUT_QUERY);
  return logout;
};
