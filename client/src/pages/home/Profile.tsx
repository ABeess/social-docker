import { Container } from '@mui/material';
import { ProfileTabs, ProfileThumbnail } from 'src/sections/profile';

export default function Profile() {
  // useQuery(['PROFILE_USER', { user_id: user?.id as string }], () => getProfile(user?.id as string), {
  //   onSuccess(data) {
  //     dispatch(setEnable('profile'));

  //     if (user?.id === params.id) {
  //       dispatch(updateProfileRedux(data.user.profile as UserProfile));
  //     }
  //   },
  //   enabled: isAuthenticated,
  // });

  return (
    <Container maxWidth="lg">
      <ProfileThumbnail />
      <ProfileTabs />
    </Container>
  );
}
