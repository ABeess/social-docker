import { Autocomplete, Avatar, Box, capitalize, Chip, Stack, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SyntheticEvent } from 'react';
import { getUserRecommend } from 'src/api/user.api';
import useRouter from 'src/hooks/useRouter';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setReceiver } from 'src/redux/slice/receiver.slice';
import { User } from 'src/types/Base';

export default function ChatNew() {
  const { params } = useRouter();
  const user = useAppSelector((state) => state.auth.user) as User;

  const dispatch = useAppDispatch();

  const { data: userRecommend, isLoading } = useQuery(
    ['RECEIVER_SELECT', { path: params.to }],
    () => getUserRecommend(user?.id),
    {
      enabled: params.to === 'new',
    }
  );

  const handleSelectAction = (_: SyntheticEvent<Element, Event>, value: User[]) => {
    dispatch(setReceiver(value.map((user) => user.id)));
  };

  return (
    <Stack direction="row" sx={{ width: 1 }} alignItems="center" spacing={1}>
      <Typography
        variant="subtitle2"
        sx={{
          whiteSpace: 'nowrap',
        }}
      >
        Send To:
      </Typography>
      <Autocomplete
        multiple
        fullWidth
        disableClearable={true}
        loading={isLoading}
        popupIcon=""
        sx={{
          '& 	.MuiAutocomplete-tag': {
            my: 0,
          },
        }}
        options={userRecommend?.users || []}
        onChange={handleSelectAction}
        filterSelectedOptions
        getOptionLabel={(option) => capitalize(`${option?.firstName} ${option?.lastName}`) || ''}
        renderTags={(value: User[], getTagProps) =>
          value.map((option: User, index: number) => (
            <Box key={option.id}>
              <Chip
                variant="filled"
                sx={{ my: 0 }}
                label={capitalize(`${option?.firstName} ${option?.lastName}`)}
                {...getTagProps({ index })}
              />
            </Box>
          ))
        }
        renderOption={(prop, option) => (
          <Box component="li" {...prop}>
            <Avatar src={option?.avatar || ''} sx={{ width: 35, height: 35 }} />
            <Typography variant="body1" color="text.secondary" ml={1}>
              {capitalize(`${option?.firstName} ${option?.lastName}`)}
            </Typography>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
            }}
          />
        )}
      />
    </Stack>
  );
}
