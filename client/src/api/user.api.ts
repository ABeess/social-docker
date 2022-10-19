import { GET_PROFILE_USER, UPDATE_PROFILE } from 'src/graphql/userQuery';
import { ProfileInput } from 'src/types/InputValue';
import { UpdateProfileMutation } from 'src/types/MutationResponse';
import { ProfileUserQuery } from 'src/types/QueryResponse';
import app from 'src/utils/graphqlRequest';

export const getProfile = async (userId: string) => {
  const { getProfileUser }: ProfileUserQuery = await app.request(GET_PROFILE_USER, {
    userId,
  });
  return getProfileUser;
};

export const updateProfile = async (data: ProfileInput) => {
  const { updateProfile }: UpdateProfileMutation = await app.request(UPDATE_PROFILE, {
    data,
  });
  return updateProfile;
};
