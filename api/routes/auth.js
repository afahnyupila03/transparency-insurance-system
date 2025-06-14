import { userProfiles } from '../controllers/auth.js'
import { asyncHandler } from '../middlewares/validate.js'
import { middlewares } from './../middlewares/userAuth.js'

export const authRoutes = router => {
  router.post('/register', userProfiles.register)
  router.post('/login', asyncHandler(userProfiles.login))
  router.get('/me', middlewares.auth, asyncHandler(userProfiles.getUser))
  router.put(
    '/update-email',
    middlewares.auth,
    asyncHandler(userProfiles.updateEmail)
  )
  router.put(
    '/update-password',
    middlewares.auth,
    asyncHandler(userProfiles.updatePassword)
  )
  router.put(
    '/update',
    middlewares.auth,
    asyncHandler(userProfiles.updateProfile)
  )
  router.post('/logout', middlewares.auth, asyncHandler(userProfiles.logout))
}
