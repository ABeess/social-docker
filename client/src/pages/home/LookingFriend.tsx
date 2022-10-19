import { Container } from '@mui/material';
import Page from 'src/components/Page';
import { FiendRequest, FriendRecommend, FriendShipWaiting } from 'src/sections/looking-friend';

export default function LookingFriend() {
  return (
    <Page title="Friend">
      <Container maxWidth="lg">
        <FiendRequest />
        <FriendShipWaiting />
        <FriendRecommend />
      </Container>
    </Page>
  );
}
