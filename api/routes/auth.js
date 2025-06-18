import { userProfiles } from '../controllers/auth.js'
import { asyncHandler, validate } from '../middlewares/validate.js'
import { authValidators } from '../validators/authValidator.js'
import { authAuthorization } from './../middlewares/auth/userAuth.js'

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
  router.put(
    '/update-status',
    authAuthorization.auth,
    validate(authValidators.updateProfileSchema),
    asyncHandler(userProfiles.updateProfileStatus)
  )
  router.get('/me', authAuthorization.auth, asyncHandler(userProfiles.getUser))
  router.put(
    '/update-email',
    authAuthorization.auth,
    validate(authValidators.updateEmailSchema),
    asyncHandler(userProfiles.updateEmail)
  )
  router.put(
    '/update-password',
    validate(authValidators.updatePasswordSchema),
    authAuthorization.auth,
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
    authAuthorization.auth,
    asyncHandler(userProfiles.updateProfile)
  )
  router.post(
    '/logout',
    authAuthorization.auth,
    asyncHandler(userProfiles.logout)
  )
}
