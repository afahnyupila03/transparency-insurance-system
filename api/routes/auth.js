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
  router.post(
    '/request-password-reset',
    // middlewares.auth, // A user can't be authenticated and requesting a password reset.
    validate(authValidators.requestRestPasswordSchema),
    asyncHandler(userProfiles.requestPasswordReset)
  )
  router.post(
    '/reset-password',
    validate(authValidators.resetPasswordSchema),
    asyncHandler(userProfiles.resetPassword)
  )
  router.put(
    '/update',
    validate(authValidators.updateProfileSchema),
    middlewares.auth,
    asyncHandler(userProfiles.updateProfile)
  )
  router.post('/logout', middlewares.auth, asyncHandler(userProfiles.logout))
}
