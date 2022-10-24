import { Button, Card, Container, Input, Stack, styled, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { createStream } from 'src/api/stream.api';
import { DoneIcon, VideoCameraBackOutlinedIcon, VideocamRoundedIcon } from 'src/components/icons';
import StreamVideo from 'src/components/StreamVideo';
import useRouter from 'src/hooks/useRouter';
import useSocket from 'src/hooks/useSocket';
import { useAppSelector } from 'src/redux/hooks';
import { PATH_PAGE } from 'src/routes/path';
import { Maybe } from 'src/types';
import { User } from 'src/types/Base';
import { CreateStreamInput } from 'src/types/InputValue';
import { getRatio } from 'src/utils/getRatio';
import socket from 'src/utils/socket';

const InputStyled = styled(Input)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  minWidth: 120,
}));

const RootStyled = styled('div')(() => ({}));

const NonVideoStyled = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  height: getRatio({
    width: 820,
    ratio: '16/9',
  }),
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}));

interface StreamData {
  id: string;
  url: string;
}

export default function CreateStream() {
  const { query, push } = useRouter();
  const user = useAppSelector((state) => state.auth.user) as User;

  const [copies, setCopies] = useState<string>('');

  const [streamData, setStreamData] = useState<Maybe<StreamData>>(null);

  const [start, setStart] = useState(false);

  const serverUrl = import.meta.env.VITE_APP_LIVE_STREAM_LINK;

  const handleCopy = (text: string) => {
    setCopies(text);

    setTimeout(() => {
      setCopies('');
    }, 1200);
  };

  const startStream = useSocket<StreamData>('START_STREAM');
  const stopStream = useSocket<{ id: string }>('STOP_STREAM');

  useEffect(() => {
    if (startStream) {
      setStart(true);
      setStreamData(startStream);
    }
  }, [startStream]);

  useEffect(() => {
    if (stopStream) {
      setStart(false);
    }
  }, [stopStream]);

  useEffect(() => {
    if (query.target_id) {
      socket.emit('CREATE_LIVE', query.target_id);
    }
    return () => {
      socket.emit('LEAVE_ROOM', query.target_id);
    };
  }, [query]);

  const { mutate } = useMutation((values: CreateStreamInput) => createStream(values), {
    onSuccess({ data }) {
      push(PATH_PAGE.liveDetail(data.streamKey, data.id), {
        state: data.url,
      });
    },
  });

  const handleSubmit = () => {
    start &&
      mutate({
        description: 'description',
        title: 'title',
        url: streamData?.url as string,
        streamKey: query?.target_id as string,
        clientId: streamData?.id as string,
        user: user,
      });
  };

  return (
    <RootStyled>
      <Container maxWidth="md">
        <Stack spacing={2}>
          <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" />
            <TextField label="Discretion" multiline rows={4} />
          </Card>
          <Card sx={{ p: 2, pb: 3 }}>
            <Typography variant="subtitle2">Thiết lập phần mềm phát trực tiếp</Typography>
            <Typography variant="body2" color="text.secondary">
              Sao chép và dán khóa luồng này vào phần mềm phát trực tiếp bạn đang dùng.
            </Typography>

            <Typography variant="h6" mt={1} mb={1}>
              Khóa luồng
            </Typography>
            <Stack direction="row" spacing={1}>
              <InputStyled disableUnderline value={query?.target_id as string} />
              <CopyToClipboard text={query?.target_id as string} onCopy={(text) => handleCopy(text)}>
                <Button variant="contained" size="small">
                  {copies === query.target_id ? <DoneIcon /> : `copy`}
                </Button>
              </CopyToClipboard>
            </Stack>
            <Typography variant="h6" mt={1} mb={1}>
              URL máy chủ
            </Typography>

            <Stack direction="row" spacing={1}>
              <InputStyled disableUnderline value={serverUrl} />
              <CopyToClipboard text={serverUrl} onCopy={(text) => handleCopy(text)}>
                <Button variant="contained" size="small">
                  {copies === serverUrl ? <DoneIcon /> : `copy`}
                </Button>
              </CopyToClipboard>
            </Stack>
          </Card>

          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2">Video</Typography>
            {streamData && start ? (
              <StreamVideo url={streamData.url} />
            ) : (
              <NonVideoStyled>
                <VideoCameraBackOutlinedIcon sx={{ width: 50, height: 50 }} />
                <Typography variant="body1" mt={1}>
                  Kết nối phần mềm phát trực tiếp để lên sóng
                </Typography>
              </NonVideoStyled>
            )}

            <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
              <Button variant="contained">Quay lại</Button>
              <Button variant="contained" disabled={!start} startIcon={<VideocamRoundedIcon />} onClick={handleSubmit}>
                Phát trực tiếp
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </RootStyled>
  );
}
