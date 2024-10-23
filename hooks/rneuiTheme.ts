import { Platform } from 'react-native';
import { lightColors, createTheme } from '@rneui/themed';

export const theme = createTheme({
    lightColors: {
        ...Platform.select({
            default: lightColors.platform.android,
            ios: lightColors.platform.ios,
        }),
    },
    components: {
        
    },
});

export default theme;