import { Avatar, Box, styled, Typography } from '@mui/material';
import { User } from 'src/types/Base';

const RootStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

interface StreamChatItemProp {
  message: string;
  sender: User;
}

export default function StreamChatItem({ sender, message }: StreamChatItemProp) {
  return (
    <RootStyled>
      <Avatar src={sender.avatar} sx={{ width: 24, height: 24, mt: 0.5 }} />
      <Box>
        <Typography component="span" variant="subtitle2" color="text.secondary" mr={1}>
          {`${sender.firstName} ${sender.lastName}`}
        </Typography>
        <Typography component="span" variant="body2">
          {message}
        </Typography>
      </Box>
    </RootStyled>
  );
}
