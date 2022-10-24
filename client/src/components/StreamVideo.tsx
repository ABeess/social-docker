import { useEffect, useRef, useState } from 'react';

import { CardMedia, CardMediaProps, Stack, styled, Typography } from '@mui/material';
import flv from 'flv.js';
import { VisibilityIcon } from './icons';

interface StreamVideoProps extends CardMediaProps<'video'> {
  url?: string;
  count?: number;
}

const RootStyled = styled('div')(() => ({
  position: 'relative',
}));

const LiveStyled = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

const CardMediaStyled = styled(CardMedia)(({ theme }) => ({
  maxHeight: theme.breakpoints.values.sm,
  objectFit: 'contain',
  backgroundColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
})) as typeof CardMedia;

export default function StreamVideo({ url, count = 0, ...other }: StreamVideoProps) {
  const [playerMedia, setPlayerMedia] = useState<flv.Player | null>(null);

  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (flv.isSupported() && url) {
      // const player =
      setPlayerMedia(
        flv.createPlayer({
          type: 'flv',
          url,
        })
      );
    }
  }, [url]);

  useEffect(() => {
    if (playerMedia && ref.current) {
      playerMedia.attachMediaElement(ref.current as HTMLVideoElement);
      playerMedia.load();
      playerMedia.play();
    }
    return () => {
      playerMedia?.unload();
    };
  }, [playerMedia, ref.current]);

  return (
    <RootStyled>
      <LiveStyled>
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            bgcolor: (theme) => theme.palette.error.main,
            py: 0.3,
            px: 1,
            borderRadius: 0.5,
            color: 'white',
          }}
        >
          Live
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <VisibilityIcon sx={{ width: 18, height: 18 }} />
          <Typography variant="caption">{count}</Typography>
        </Stack>
      </LiveStyled>
      <CardMediaStyled className="liveVideo" component="video" ref={ref} {...other}></CardMediaStyled>
    </RootStyled>
  );
  // return <CardMedia className="liveVideo" component="video" {...other} />;
}
