/* eslint-disable jsx-a11y/media-has-caption */

import { alpha, Card, Container, styled } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { getStreams } from 'src/api/stream.api';
import { PlayCircleOutlineIcon } from 'src/components/icons';
import StreamVideo from 'src/components/StreamVideo';
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

  const handleClick = () => {
    push(PATH_PAGE.liveDetail('123', '321'));
  };

  console.log(data);

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {!isLoading &&
            [...Array(10)].map((_, index) => (
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
                    src="https://storage.googleapis.com/upload-file-c/900a88e351a84e79bffb795186cd5de9.mp4"
                  ></StreamVideo>
                  {hover === index + 1 && (
                    <OverlayStyled onClick={handleClick}>
                      <PlayCircleOutlineIcon
                        sx={{ width: 50, height: 50, color: (theme) => theme.palette.common.white }}
                      />
                    </OverlayStyled>
                  )}
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
}
