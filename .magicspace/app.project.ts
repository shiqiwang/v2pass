import {project} from '@magicspace/core';
import {AUTHORING} from './@constant';

export default project({
  name: '@v2pass/app',
  path: 'packages/app',
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
