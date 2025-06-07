import { userProfiles } from '../controllers/auth.js';
import { middlewares } from './../middlewares/userAuth.js';

export const authRoutes = (router) => {
  router.post('/auth/register', userProfiles.register);
  router.post('/auth/login', userProfiles.login);
  router.get('/auth/me', middlewares.auth, userProfiles.getUser);
  router.put('/auth/update', middlewares.auth, userProfiles.updateProfile);
  router.post('/auth/logout', middlewares.auth, userProfiles.logout);
};