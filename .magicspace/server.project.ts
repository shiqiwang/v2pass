import {project} from '@magicspace/core';
import {AUTHORING} from './@constant';

export default project({
  name: '@v2pass/server',
  path: 'packages/server',
  extends: [
    {
      name: '@magicspace/templates/typescript',
      options: {
        ...AUTHORING,
        projectType: 'program',
      },
    },
  ],
});
