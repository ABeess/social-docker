import { CircularProgress, IconButton, Input, InputAdornment, styled, SxProps } from '@mui/material';
import { ChangeEventHandler, Dispatch, KeyboardEvent } from 'react';
import EmojiPicker from 'src/components/EmojiPicker';
import Iconify from 'src/components/Iconify';

const RootStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const InputStyled = styled('div')(({ theme }) => ({
  borderTop: `1px dashed ${theme.palette.divider}`,
  minHeight: 56,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  bottom: 0,
  width: '100%',
}));

interface ChatInputProps {
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value: string;
  setValue: Dispatch<string>;
  sendSubmit: () => void;
  loading?: boolean;
  sx?: SxProps;
}

export default function StreamChatInput({ value, onChange, setValue, sendSubmit, loading, sx }: ChatInputProps) {
  const handleKeyUp = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      sendSubmit();
    }
  };
  return (
    <RootStyled sx={sx}>
      <InputStyled>
        <Input
          fullWidth
          disableUnderline
          value={value}
          onChange={onChange}
          onKeyUp={handleKeyUp}
          placeholder="Message"
          endAdornment={
            <InputAdornment position="start" sx={{ gap: 1, mr: 1 }}>
              <IconButton size="small">
                <Iconify icon="carbon:camera" />
              </IconButton>

              <EmojiPicker setValue={setValue} value={value} size="small" />

              {loading ? (
                <CircularProgress size={18} />
              ) : (
                <IconButton size="small" onClick={sendSubmit}>
                  <Iconify icon="fluent:send-20-regular" />
                </IconButton>
              )}
            </InputAdornment>
          }
        />
      </InputStyled>
    </RootStyled>
  );
}
