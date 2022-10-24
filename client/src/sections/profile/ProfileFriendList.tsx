import { styled } from '@mui/material';

const RootStyled = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const ProfileFriendList = () => {
  console.log('first');
  // const { data } = useGetFriendQuery({
  //   variables: {
  //     userId: query?.id as string,
  //     query: {
  //       limit: 10,
  //     },
  //   },
  // });

  // useEffect(() => {
  //   if (data) {
  //     setFriendState(data.getFriends as GetFriendResponse);
  //   }
  // }, [data]);

  // console.log(data);

  return (
    <RootStyled>
      {/* <Card sx={{ px: 2, py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Friend</Typography>
          <TextField
            size="small"
            label="Search friend"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="ei:search" sx={{ width: 24, height: 24 }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box mt={2}>
          <Grid container spacing={2}>
            {[...Array(10)].map((item, index) => (
              <Grid key={index} xs={6}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Image src={item?.avatar || ''} sx={{ height: 80, width: 80, borderRadius: 1 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flex: 1 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ textTransform: 'capitalize' }}
                      >{`${item?.firstName} ${item?.lastName}`}</Typography>
                      <Typography variant="caption">18/11/200</Typography>
                    </Box>
                    <IconButtonAnimate>
                      <Iconify icon="bx:dots-horizontal-rounded" />
                    </IconButtonAnimate>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card> */}
    </RootStyled>
  );
};
