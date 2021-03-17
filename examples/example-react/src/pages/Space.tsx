import React from 'react';
import { View, Box } from '@styli/react';

export default () => {
  return (
    <View>
      <Box f-30 fontBold>
        Size
      </Box>
      <View space-10 row w-350 wrap>
        <View bgBlue20 s-100>
          space-10
        </View>
        <View bgBlue20 s-100>
          space-10
        </View>
        <View bgBlue20 s-100>
          space-10
        </View>
        <View bgBlue20 s-100>
          space-10
        </View>
        <View bgBlue20 s-100>
          space-10
        </View>
        <View bgBlue20 s-100>
          space-10
        </View>
      </View>

      <View spaceX-10 row debugChildren>
        <View bgBlue20 s-100>
          spaceX-10
        </View>
        <View bgBlue20 s-100>
          spaceX-10
        </View>
        <View bgBlue20 s-100>
          spaceX-10
        </View>
      </View>

      <View spaceY-10 column debugChildren>
        <View bgBlue20 s-100>
          spaceY-10
        </View>
        <View bgBlue20 s-100>
          spaceY-10
        </View>
        <View bgBlue20 s-100>
          spaceY-10
        </View>
      </View>
    </View>
  );
};