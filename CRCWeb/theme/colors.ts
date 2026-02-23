const colors = {
  red: {
    100: '#ffe6e9',
    200: '#fca4b1',
    300: '#ff4757',
    400: '#fc2336',
    500: '#d4192a',
  },
  blue: {
    100: '#d9f0ff',
    200: '#bbe2fc',
    300: '#6e94eb',
    400: '#4c7ff5',
    500: '#2462f2',
  },
  white: '#ffffff',
  whiteTransparent: (transparency: number) => `rgba(255, 255, 255, ${transparency})`,
  grey: {
    100: '#e0e0e0',
    200: '#bdbdbd',
    300: '#919191',
    400: '#575757',
    500: '#212121',
  },
  green: {
    100: '#b3ffb3',
    200: '#4dff4d',
    300: '#00ff00',
    400: '#00cc00',
    500: '#009900',
  },
  divider: '#c9c9c9',
};

export default colors;
