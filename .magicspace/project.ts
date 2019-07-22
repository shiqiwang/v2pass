import {project} from '@magicspace/core';
import {AUTHORING} from './@constant';

export default project({
  name: 'v2pass',
  extends: [
    {
      name: '@magicspace/templates/general',
      options: {
        ...AUTHORING,
      },
    },
  ],
});
