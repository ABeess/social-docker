import { Skeleton, Stack } from '@mui/material';

export default function ChatHeaderSkeleton() {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Skeleton variant="circular" width={40} height={40} />
      <Stack>
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="text" width={120} height={20} />
      </Stack>
    </Stack>
  );
}
