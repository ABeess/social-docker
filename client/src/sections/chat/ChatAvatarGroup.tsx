import { Avatar, AvatarGroup, Badge } from '@mui/material';

interface ChatAvatarGroupProp {
  type: 'private' | 'groups';
  mainAvatar: string;
  subAvatar: string;
}

export default function ChatAvatarGroup({ type, mainAvatar, subAvatar }: ChatAvatarGroupProp) {
  return (
    <>
      {type === 'private' ? (
        <Avatar src={mainAvatar} />
      ) : (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <AvatarGroup>
              <Avatar src={mainAvatar} sx={{ width: 24, height: 24 }} />
            </AvatarGroup>
          }
        >
          <Avatar src={subAvatar} />
        </Badge>
      )}
    </>
  );
}
