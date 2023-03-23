import type { IRouter } from 'opine';
import listEndPoints from 'express-list-endpoints';

export function getEndPoints(root: string, router: IRouter) {
  const endPoints = listEndPoints(router).map(({ path, methods }) =>
    methods.map((method) => `${method} ${root}${path}`)
  ).flat();

  return endPoints;
}
