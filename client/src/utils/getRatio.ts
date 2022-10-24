interface GetRatioParam {
  width: number;
  ratio: '4/3' | '3/4' | '6/4' | '4/6' | '16/9' | '9/16' | '21/9' | '9/21' | '1/1';
}
export const getRatio = ({ width, ratio }: GetRatioParam) =>
  ({
    '4/3': (width * 3) / 4,
    '3/4': (width * 4) / 3,
    '6/4': (width * 4) / 6,
    '4/6': (width * 6) / 4,
    '16/9': (width * 9) / 16,
    '9/16': (width * 16) / 9,
    '21/9': (width * 9) / 21,
    '9/21': (width * 21) / 9,
    '1/1': width,
  }[ratio]);
