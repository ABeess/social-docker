import { Avatar, AvatarProps } from '@mui/material';
import { useAppSelector } from 'src/redux/hooks';
import createAvatar from '../utils/createAvatar';

export default function MyAvatar({ sx, ...other }: AvatarProps) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Avatar
      src={user?.avatar || ''}
      color="primary"
      sx={{
        width: 40,
        height: 40,
        bgcolor: () => createAvatar('abees'),
        ...sx,
      }}
      {...other}
    >
      {createAvatar('abees').name}
    </Avatar>
  );
}
