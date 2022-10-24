import { GET_PROFILE_USER, UPDATE_PROFILE, UPDATE_THUMBNAIL, UPLOAD_AVATAR } from 'src/graphql/userQuery';
import { ProfileInput } from 'src/types/InputValue';
import { UpdateProfileMutation, UploadAvatarMutation, UploadThumbnailMutation } from 'src/types/MutationResponse';
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

export interface IUploadImage {
  userId: string;
  url: string;
}
export const uploadAvatar = async ({ url, userId }: IUploadImage) => {
  const { uploadAvatar }: UploadAvatarMutation = await app.request(UPLOAD_AVATAR, {
    userId,
    url,
  });

  return uploadAvatar;
};

export const updateThumbnail = async (data: IUploadImage) => {
  const { updateThumbnail }: UploadThumbnailMutation = await app.request(UPDATE_THUMBNAIL, {
    data,
  });
  return updateThumbnail;
};
