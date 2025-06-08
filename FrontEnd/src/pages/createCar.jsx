import { Form, Formik } from 'formik'
import CustomInput from '../components/customInput'
import { useCreateCar } from '../hooks/carHook'

export default function CreateCarPage () {
  const createCar = useCreateCar()

  const createCarHandler = async values => {
    try {
      await createCar(values)
    } catch (error) {
      console.error(error)
    }
  }

  const initialValues = {
    regNum: '',
    name: '',
    address: '',
    genre: '',
    mark: '',
    type: '',
    chassisNumber: '',
    firstYear: '',
    energy: '',
    numberOfSeats: '',
    hpRating: '',
    carryingCapacity: ''
  }

  const ENERGY_TYPES = [
    { label: 'Essence', key: 'ESS' },
    { label: 'Diesel', key: 'GAS' }
  ]

  return (
    <div className='max-w-2xl mx-auto p-6 mt-10 bg-white rounded shadow-md'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>
        Create Car Profile
      </h2>

      <p className='text-sm text-gray-700 mb-6 text-center'>
        <span className='font-bold text-red-500'>*</span> Please enter your car
        details as on your
        <span className='italic'> certificat d'immatriculation </span>
        (registration certificate)
        <span className='font-bold text-red-500'>*</span>
      </p>

      <Formik onSubmit={createCarHandler} initialValues={initialValues}>
        {({
          values,
          handleBlur,
          handleChange,
          isSubmitting,
          isValid,
          errors,
          touched
        }) => (
          <Form className='space-y-4'>
            <CustomInput
              name='regNum'
              id='regNum'
              type='text'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.regNum}
              error={errors}
              touched={touched}
              autoComplete='off'
              label='(Registration number)'
              placeholder="N° d'immaticulation (Registration number)"
              autoCapitalize='characters'
            />

            <CustomInput
              name='name'
              id='name'
              type='text'
              placeholder='Nom (Name)'
              label='Nom (Name)'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              error={errors}
              touched={touched}
              autoComplete='off'
              autoCapitalize='characters'
            />

            <CustomInput
              name='address'
              id='address'
              type='text'
              placeholder='Addresse (Address)'
              label='Addresse (Address)'
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors}
              touched={touched}
              autoComplete='off'
              autoCapitalize='characters'
            />

            <CustomInput
              id='genre'
              name='genre'
              type='text'
              placeholder='Genre de vehicule (Type of vehicle)'
              label='Genre de vehicule (Type of vehicle)'
              value={values.genre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors}
              touched={touched}
              autoComplete='off'
              autoCapitalize='characters'
            />

            <CustomInput
              id='mark'
              name='mark'
              type='text'
              placeholder='Marque du vehicule (Make)'
              label='Marque du vehicule (Make)'
              value={values.mark}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors}
              touched={touched}
              autoComplete='off'
              autoCapitalize='characters'
            />

            <CustomInput
              id='type'
              name='type'
              type='text'
              placeholder='Type de vehicule (Model)'
              label='Type de vehicule (Model)'
              value={values.type}
              error={errors}
              touched={touched}
              autoComplete='off'
              autoCapitalize='characters'
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <CustomInput
              id='chassisNumber'
              name='chassisNumber'
              type='text'
              label='N° Chassis (Chassis Number)'
              placeholder='N° Chassis (Chassis Number)'
              value={values.chassisNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              autoCapitalize='characters'
              autoComplete='off'
              error={errors}
              touched={touched}
            />

            <CustomInput
              id='firstYear'
              name='firstYear'
              type='date'
              placeholder='Date 1ére mise en circulation (Date of first use on road)'
              label='Date 1ére mise en circulation (Date of first use on road)'
              value={values.firstYear}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors}
              touched={touched}
              autoComplete='off'
            />

            <CustomInput
              id='energy'
              name='energy'
              as='select'
              value={values.energy}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Source d'energie (Method of propulsion)"
              error={errors}
              touched={touched}
            >
              <option value=''>Source d'energie (Method of propulsion)</option>
              {ENERGY_TYPES.map(fuel => (
                <option key={fuel.key} value={fuel.key}>
                  {fuel.label}
                </option>
              ))}
            </CustomInput>

            <CustomInput
              id='numberOfSeats'
              name='numberOfSeats'
              type='number'
              label='Places assises (N° of seats)'
              placeholder='Places assises (N° of seats)'
              value={values.numberOfSeats}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='off'
              error={errors}
              touched={touched}
            />

            <CustomInput
              id='hpRating'
              name='hpRating'
              type='number'
              label='Pussiance administrative (Official H.P. rating) (CV)'
              placeholder='Pussiance administrative (Official H.P. rating) (CV)'
              value={values.hpRating}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='off'
              error={errors}
              touched={touched}
            />

            <CustomInput
              id='carryingCapacity'
              name='carryingCapacity'
              type='number'
              placeholder='Charge Utile (Carrying capacity) (KG)'
              label='Charge Utile (Carrying capacity) (KG)'
              value={values.carryingCapacity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors}
              touched={touched}
              autoComplete='off'
            />

            <div className='pt-4'>
              <button
                type='submit'
                disabled={isSubmitting || !isValid}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 transition'
              >
                Create Car Profile
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
