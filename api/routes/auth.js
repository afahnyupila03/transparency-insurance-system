import { userProfiles } from '../controllers/auth.js'
import { middlewares } from './../middlewares/userAuth.js'

export const authRoutes = router => {
  router.post('/register', userProfiles.register)
  router.post('/login', userProfiles.login)
  router.get('/me', middlewares.auth, userProfiles.getUser)
  router.put('/update', middlewares.auth, userProfiles.updateProfile)
  router.post('/logout', middlewares.auth, userProfiles.logout)
}
