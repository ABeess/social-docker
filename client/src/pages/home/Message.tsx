import { Card, Container, styled } from '@mui/material';
import Page from 'src/components/Page';
import { ChatContent, ChatSideBar } from 'src/sections/chat';

const RootStyled = styled('div')(() => ({}));

export default function Message() {
  return (
    <Page title="Message">
      <RootStyled>
        <Container maxWidth="lg">
          <Card sx={{ display: 'flex', height: '75vh' }}>
            <ChatSideBar />
            <ChatContent />
          </Card>
        </Container>
      </RootStyled>
    </Page>
  );
}
