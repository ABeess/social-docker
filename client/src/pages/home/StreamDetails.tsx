import { Avatar, Box, Button, Divider, Stack, styled, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { listen, roomSocket } from 'src/api/listen.api';
import { getStreamDetail, unloadStream } from 'src/api/stream.api';
import StreamVideo from 'src/components/StreamVideo';
import useRouter from 'src/hooks/useRouter';
import { StreamChat } from 'src/sections/stream';
import { getRatio } from 'src/utils/getRatio';
import socket from 'src/utils/socket';

const RootStyled = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 10),
}));

export default function StreamDetails() {
  const [height, setHeight] = useState(600);
  const [count, setCount] = useState(0);
  const { params, query } = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const { mutate } = useMutation(() => unloadStream(query.target_id as string));

  useEffect(() => {
    window.onbeforeunload = (e) => {
      // socket.emit('EVENT_LEAVE_STREAM', query.target_id);
      mutate();
      e.preventDefault();
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const { data, isLoading } = useQuery(
    ['STREAM_DETAIL', { stream_id: query.target_id }],
    () => getStreamDetail(query.target_id as string),
    {
      enabled: !!query.target_id,
    }
  );

  console.log(params.stream_key as string);

  useEffect(() => {
    if (query.target_id) {
      roomSocket('EVENT_JOIN_STREAM', query.target_id);
    }

    listen('EVENT_JOIN_STREAM', async (data: { count: number }) => {
      setCount(data.count);
    });

    return () => {
      socket.emit('EVENT_LEAVE_STREAM', query.target_id);
    };
  }, [query]);

  useEffect(() => {
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();

      setHeight(
        getRatio({
          width,
          ratio: '16/9',
        })
      );
    }
  }, [ref.current]);

  return (
    <RootStyled>
      <Grid container spacing={2}>
        <Grid xs={9} ref={ref}>
          {!isLoading && <StreamVideo autoPlay controls sx={{ height }} count={count} url={data?.stream.url} />}
        </Grid>
        <Grid xs={3}>
          <StreamChat />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid xs={9}>
          <Typography variant="h6">{data?.stream.title}</Typography>
          {data && (
            <Typography variant="body2" color="text.secondary">
              {` Bắt đầu phát trực tiếp vào ${format(
                new Date(data?.stream.createdAt as unknown as string),
                'MM/dd/yyyy'
              )}`}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src="https://storage.googleapis.com/upload-file-c/28903db71a1f42349ebdbdfcd7f0d2b0.jpg" />
              <Box>
                <Typography variant="subtitle1">{`${data?.stream.user.firstName} ${data?.stream.user.lastName}`}</Typography>
                <Typography component="p" variant="caption">
                  Abees
                </Typography>
              </Box>
            </Stack>
            <Button variant="contained">Flower</Button>
          </Stack>

          <Box sx={{ ml: 6, mt: 3 }}>
            <Typography>{data?.stream.description}</Typography>
          </Box>
        </Grid>
        <Grid xs={3}></Grid>
      </Grid>
    </RootStyled>
  );
}
