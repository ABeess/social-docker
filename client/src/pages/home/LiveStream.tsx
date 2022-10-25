/* eslint-disable jsx-a11y/media-has-caption */

import { alpha, Avatar, Box, Card, Container, styled, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { getStreams } from 'src/api/stream.api';
import { PlayCircleOutlineIcon } from 'src/components/icons';
import StreamVideo from 'src/components/StreamVideo';
import TextMaxLine from 'src/components/TextMaxLine';
import useRouter from 'src/hooks/useRouter';
import { PATH_PAGE } from 'src/routes/path';
import { getRatio } from 'src/utils/getRatio';

const OverlayStyled = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: alpha(theme.palette.grey[500], 0.08),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default function LiveStream() {
  const [height, setHeight] = useState(0);
  const { data, isLoading } = useQuery(['STREAM'], () => getStreams());

  const [hover, setHover] = useState(0);
  const { push } = useRouter();

  const ref = useRef<HTMLDivElement>(null);

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

  const handleMouseMove = (id: number) => {
    setHover(id);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const handleClick = (key: string, targetId: string) => {
    push(PATH_PAGE.liveDetail(key, targetId));
  };

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {!isLoading &&
            data?.streams.map((item, index) => (
              <Grid key={index} xs={4} ref={ref}>
                <Card
                  ref={ref}
                  onMouseEnter={() => handleMouseMove(index + 1)}
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <StreamVideo
                    sx={{
                      height: height,
                    }}
                    url={item.url}
                  ></StreamVideo>
                  {hover === index + 1 && (
                    <OverlayStyled onClick={() => handleClick(item.streamKey, item.id)}>
                      <PlayCircleOutlineIcon
                        sx={{ width: 50, height: 50, color: (theme) => theme.palette.common.white }}
                      />
                    </OverlayStyled>
                  )}
                </Card>
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <Avatar src={item.user.avatar} />
                  <Box>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <TextMaxLine line={1} variant="caption">
                      {item.description}
                    </TextMaxLine>
                  </Box>
                </Stack>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
}
