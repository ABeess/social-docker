import { GET_PROFILE_USER, UPDATE_PROFILE, UPLOAD_AVATAR } from 'src/graphql/userQuery';
import { ProfileInput } from 'src/types/InputValue';
import { UpdateProfileMutation, UploadAvatarMutation } from 'src/types/MutationResponse';
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

export interface IUploadAvatar {
  userId: string;
  url: string;
}
export const uploadAvatar = async ({ url, userId }: IUploadAvatar) => {
  const { uploadAvatar }: UploadAvatarMutation = await app.request(UPLOAD_AVATAR, {
    userId,
    url,
  });

  return uploadAvatar;
};
