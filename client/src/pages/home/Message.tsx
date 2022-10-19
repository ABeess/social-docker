import { Card, Container, styled } from '@mui/material';
import { ChatContent, ChatSideBar } from 'src/sections/chat';

const RootStyled = styled('div')(() => ({}));

export default function Message() {
  return (
    <RootStyled>
      <Container maxWidth="lg">
        <Card sx={{ display: 'flex', height: '75vh' }}>
          <ChatSideBar />
          <ChatContent />
        </Card>
      </Container>
    </RootStyled>
  );
}
