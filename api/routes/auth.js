import { userProfiles } from '../controllers/auth.js'
import { asyncHandler, validate } from '../middlewares/validate.js'
import { authValidators } from '../validators/authValidator.js'
import { middlewares } from './../middlewares/userAuth.js'

export const authRoutes = router => {
  router.post(
    '/register',
    validate(authValidators.registerSchema),
    asyncHandler(userProfiles.register)
  )
  router.post(
    '/login',
    validate(authValidators.loginSchema),
    asyncHandler(userProfiles.login)
  )
  router.get('/me', middlewares.auth, asyncHandler(userProfiles.getUser))
  router.put(
    '/update-email',
    validate(authValidators.updateEmailSchema),
    middlewares.auth,
    asyncHandler(userProfiles.updateEmail)
  )
  router.put(
    '/update-password',
    validate(authValidators.updatePasswordSchema),
    middlewares.auth,
    asyncHandler(userProfiles.updatePassword)
  )
  router.put(
    '/update',
    validate(authValidators.updateProfileSchema),
    middlewares.auth,
    asyncHandler(userProfiles.updateProfile)
  )
  router.post('/logout', middlewares.auth, asyncHandler(userProfiles.logout))
}
