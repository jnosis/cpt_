import { Router } from 'opine';
import { getEndPoints } from '~/util/endpoints.ts';
import log from '~/util/logger.ts';
import { convertToMessage } from '~/util/message.ts';

const router = Router();

type API = { path: string; router: typeof router };

export default function apiRouter(apis: API[]) {
  const endPoints: { [path: string]: string[] } = {};

  apis.forEach((api) => {
    endPoints[api.path] = getEndPoints(`/api${api.path}`, api.router);
    router.use(api.path, api.router);
  });

  router.get('/', (req, res) => {
    const { method, originalUrl } = req;

    const msg = convertToMessage({ method, baseUrl: originalUrl, status: 200 });
    log.debug(msg);
    res.send(endPoints);
  });

  return router;
}
