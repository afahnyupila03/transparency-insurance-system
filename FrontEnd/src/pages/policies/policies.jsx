import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  useCalculatePolicy,
  usePolicy,
  useSavePolicy
} from '../../hooks/policyHook'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Form, Formik } from 'formik'
import CustomInput from '../../components/customInput'
import { format, addMonths } from 'date-fns'
import * as Yup from 'yup'

export default function PoliciesPage () {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const zone = searchParams.get('zone')

  const { data, isLoading, isError, error } = usePolicy(id, zone)

  const [showModal, setShowModal] = useState(false)

  const closeModalHandler = () => setShowModal(false)

  const {
    calculate,
    data: quotationData,
    isPending,
    isSuccess
  } = useCalculatePolicy(id, zone)

  const { saveQuotation } = useSavePolicy(id, zone)

  useEffect(() => {
    if (data) {
      const { car, location, policy, dta, responsibilities } = data.data
      console.log({ car, location, policy, dta, responsibilities })
    }
  }, [data])

  if (isLoading)
    return <p className='text-center mt-20'>Loading vehicle policies...</p>
  if (isError)
    return <p className='text-center text-red-600 mt-20'>{error.message}</p>

  const { car, location, policy, dta, responsibilities = [] } = data.data
  const {
    name,
    address,
    regNum,
    energy,
    hpRating,
    genre,
    numberOfSeats,
    chassisNumber,
    mark,
    type
  } = car

  const { name: city, type: zoneType } = location

  const {
    energy: policyEnergy,
    hpRange: { min, max },
    price,
    type: policyType,
    zone: policyZone,
    withTrailer
  } = policy

  const [accessoires, fichieCentral, cateRose] = [
    'ACCESSOIRES',
    'Fichie Central',
    'Cate Rose'
  ].map(name => responsibilities.find(res => res.name === name))

  const calculationValidation = Yup.object().shape({
    period: Yup.string().required('Insurance period is required!')
  })
  const calculateQuotationHandler = async (values, actions) => {
    let payload
    if (values.includeDta === true) {
      payload = {
        tariff: values.tariff,
        acc: values.acc,
        cr: values.cr,
        fc: values.fc,
        dta: values.dta,
        period: values.period,
        startDate: values.startDate,
        endDate: values.endDate
      }
    } else {
      payload = {
        tariff: values.tariff,
        acc: values.acc,
        fc: values.fc,
        cr: values.cr,
        period: values.period,
        startDate: values.startDate,
        endDate: values.endDate
      }
    }

    console.log('calculator values: ', values)
    console.log('payload values: ', payload)
    await calculate(payload)
    actions.setSubmitting(false)
    setShowModal(true)
  }

  const saveInsuranceQuotation = async values => {
    console.log('values to be saved', values)

    const payload = values
    await saveQuotation(payload)
    setShowModal(false)
    navigate('/cars', { replace: true })
  }

  return (
    <React.Fragment>
      <Modal
        showModal={showModal}
        isPending={isPending}
        isSuccess={isSuccess}
        quotationData={quotationData}
        tariff={price}
        acc={accessoires.price}
        fc={fichieCentral.price}
        cr={cateRose.price}
        dta={dta.price}
        closeModalHandler={closeModalHandler}
        calculateQuotationHandler={calculateQuotationHandler}
        validations={calculationValidation}
        saveQuotationHandler={saveInsuranceQuotation}
      />
      <div className='min-h-screen w-full px-6 py-10 bg-gray-50 text-gray-800 space-y-10'>
        {/* Owner & Car Info */}
        <section className='bg-white p-6 rounded-xl shadow-md space-y-4'>
          <h2 className='text-xl font-semibold text-blue-700'>
            Owner & Car Information
          </h2>
          <hr />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <p>
                <strong>Owner:</strong> {name}
              </p>
              <p>
                <strong>Address:</strong> {address}
              </p>
            </div>

            <div className='space-y-1'>
              <p>
                <strong>Registration N°:</strong> {regNum}
              </p>
              <p>
                <strong>Chassis N°:</strong> {chassisNumber.slice(-6)}
              </p>
              <p>
                <strong>Energy:</strong> {energy}
              </p>
              <p>
                <strong>Mark (Model):</strong> {`${mark} (${type})`}
              </p>
              <p>
                <strong>H.P. Rating:</strong> {hpRating} CV
              </p>
              <p>
                <strong>Genre:</strong> {genre}
              </p>
              <p>
                <strong>N° of Seats:</strong> {numberOfSeats}
              </p>
            </div>
          </div>
        </section>

        {/* Grid Layout for Remaining Sections */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Location Info */}
          <section className='bg-white p-6 rounded-xl shadow-md space-y-2'>
            <h2 className='text-xl font-semibold text-blue-700'>
              Location to be Insured
            </h2>
            <hr />
            <p>
              <strong>City:</strong> {city}
            </p>
            <p>
              <strong>Zone:</strong> {zoneType}
            </p>
          </section>

          {/* Policy Info */}
          <section className='bg-white p-6 rounded-xl shadow-md space-y-2'>
            <h2 className='text-xl font-semibold text-blue-700'>
              Policy Information
            </h2>
            <hr />
            <div className='text-sm space-y-1'>
              <p>
                <strong>Policy Category:</strong> {policyType}
              </p>
              <p>
                <strong>Policy Zone:</strong> {policyZone}
              </p>
              <p>
                <strong>Energy (With Trailer):</strong> {policyEnergy}
                <span className='ml-1 capitalize text-gray-600'>
                  ({withTrailer.toString()})
                </span>
              </p>
              <p>
                <strong>H.P. Range:</strong> {`${min} CV - ${max} CV`}
                <span className='ml-2'>
                  → <strong>{price.toLocaleString()}</strong>
                </span>
              </p>
            </div>
          </section>

          {/* Responsibilities */}
          <section className='bg-white p-6 rounded-xl shadow-md'>
            <h2 className='text-xl font-semibold text-blue-700 mb-2'>
              Responsibilities
            </h2>
            <hr />
            <ul className='space-y-1 text-sm list-disc list-inside'>
              {responsibilities.map(res => (
                <li key={res._id}>
                  <span className='font-medium'>{res.name}:</span>{' '}
                  {res.price.toLocaleString()} FCFA
                </li>
              ))}
            </ul>
          </section>

          {/* D.T.A Information */}
          <section className='bg-white p-6 rounded-xl shadow-md space-y-2'>
            <h2 className='text-xl font-semibold text-blue-700'>
              D.T.A Information
            </h2>
            <hr />
            <p>
              <strong>H.P. Range:</strong>{' '}
              {`${dta.hpRange.min} CV - ${dta.hpRange.max} CV`}
            </p>
            <p>
              <strong>Price:</strong> {dta.price.toLocaleString()} FCFA
            </p>
          </section>
        </div>

        {/* Show Modal Button. */}
        <div>
          <button
            type='button'
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => setShowModal(true)}
          >
            Calculate
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

const insurancePeriods = [
  { id: 2, key: 2, label: '2 Months' },
  { id: 4, key: 4, label: '4 Months' },
  { id: 6, key: 6, label: '6 Months' },
  { id: 8, key: 8, label: '8 Months' },
  { id: 10, key: 10, label: '10 Months' },
  { id: 12, key: 12, label: '12 Months' }
]

function useUpdateDates (values, setFieldValue) {
  useEffect(() => {
    if (values.period) {
      const today = new Date()
      const formattedToday = format(today, 'yyyy-MM-dd')
      const end = addMonths(today, Number(values.period))
      const formattedEnd = format(end, 'yyyy-MM-dd')
      setFieldValue('startDate', formattedToday)
      setFieldValue('endDate', formattedEnd)
    }
  }, [values.period, setFieldValue])

  useEffect(() => {
    if (values.startDate && values.period) {
      const newStart = new Date(values.startDate)
      const newEnd = addMonths(newStart, Number(values.period))
      setFieldValue('endDate', format(newEnd, 'yyyy-MM-dd'))
    }
  }, [values.startDate, values.period, setFieldValue])
}

export const InsuranceForm = ({
  initialValues,
  calculateQuotationHandler,
  validations
}) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validations}
      onSubmit={calculateQuotationHandler}
    >
      {formikProps => {
        const {
          values,
          setFieldValue,
          handleChange,
          handleBlur,
          errors,
          touched,
          isSubmitting,
          isValid
        } = formikProps

        useUpdateDates(values, setFieldValue)

        return (
          <Form>
            <CustomInput
              as='select'
              id='period'
              name='period'
              value={values.period}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.period && errors.period ? errors.period : ''}
              label='Please select period to be insured.'
            >
              <option value=''>Select period to be insured.</option>
              {insurancePeriods.map(period => (
                <option key={period.id} value={period.key}>
                  {period.label}
                </option>
              ))}
            </CustomInput>

            <div className='flex justify-around'>
              <CustomInput
                type='date'
                name='startDate'
                id='startDate'
                label='Start date'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.startDate}
                error={
                  touched.startDate && errors.startDate ? errors.startDate : ''
                }
                min={todayStr}
              />

              <CustomInput
                type='date'
                name='endDate'
                id='endDate'
                label='End date'
                error={errors}
                touched={touched}
                value={values.endDate}
                readOnly
              />
            </div>

            <div>
              <CustomInput
                type='checkbox'
                name='includeDta'
                id='includeDta'
                placeholder='Include D.T.A Fees'
                value={values.includeDta}
                error={errors}
                touched={touched}
                label={`Include D.T.A Fees (${values.includeDta})`}
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting || !isValid}
              className={`mt-4 w-full px-4 py-2 rounded-md text-white font-semibold transition duration-200 ease-in-out
    ${
      isSubmitting || !isValid
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 cursor-pointer'
    }
  `}
            >
              Calculate
            </button>
          </Form>
        )
      }}
    </Formik>
  )
}

export const calculatePeriod = validPeriod => {
  switch (validPeriod) {
    case 2:
      return 0.2
    case 4:
      return 0.4
    case 6:
      return 0.6
    case 8:
    case 10:
      return 0.8
    case 12:
    default:
      return null
  }
}

const CalculatedInsurance = ({ data, saveQuotationHandler }) => {
  const {
    acc,
    cr,
    discount,
    endDate,
    fc,
    startDate,
    tariff,
    validPeriod,
    vat,
    total
  } = data.data

  const period = calculatePeriod(validPeriod)

  return (
    <div className='p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-md space-y-4'>
      <div>
        <h3 className='text-xl font-bold text-gray-800 mb-2'>
          Insurance Quotation
        </h3>
        <hr className='border-t border-gray-200 mb-4' />
      </div>
      <div>
        <div>
          <h3 className='text-xl font-bold text-gray-800 mb-2'>
            Insurance duration
          </h3>
          <hr className='border-t border-gray-200 mb-4' />
        </div>
        <div className='space-y-2 text-gray-700 text-sm flex justify-around'>
          <p>
            <strong>Duration:</strong> <span>{validPeriod} Months</span>
          </p>
          <p>
            <strong>Start date:</strong> <span>{startDate}</span>
          </p>
          <p>
            <strong>End date:</strong> <span>{endDate}</span>
          </p>
        </div>
      </div>
      <div className='space-y-2 text-gray-700 text-sm'>
        <p>
          <strong>Tariff:</strong> {tariff.toLocaleString()}
        </p>
        <p>
          <strong>Prem Net (PN):</strong> {tariff} - 0.1
          {period !== null ? ` × ${period}` : ''} ={' '}
          <span className='font-medium'>
            {Math.ceil(discount).toLocaleString()}
          </span>
        </p>
        <p>
          <strong>Fichier Central (FC):</strong> {fc.toLocaleString()} FCFA
        </p>
        <p>
          <strong>Accessoires (ACC):</strong> {acc.toLocaleString()} FCFA
        </p>
        <p>
          <strong>VAT (taxes):</strong> (PN + FC + ACC) × 0.1925 ={' '}
          <span className='font-medium'>
            {Math.ceil(vat).toLocaleString()} FCFA
          </span>
        </p>
        <p>
          <strong>Cate Rose (CR):</strong> {cr.toLocaleString()} FCFA
        </p>
        <p className='text-lg font-semibold text-blue-700'>
          Total Quotation: {Math.ceil(total).toLocaleString()} FCFA
        </p>
      </div>
      <div className='pt-4 text-right'>
        <button
          type='button'
          onClick={() => saveQuotationHandler(data.data)}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
        >
          Save Quotation
        </button>
      </div>
    </div>
  )
}

const Modal = ({
  showModal,
  closeModalHandler,
  tariff,
  acc,
  cr,
  fc,
  dta,
  validations,
  calculateQuotationHandler,
  isSuccess,
  quotationData,
  saveQuotationHandler
}) => {
  useEffect(() => {
    if (quotationData && isSuccess) {
      console.log('Calculated quotation: ', quotationData.data)
    }
  }, [quotationData, isSuccess])

  return (
    <Dialog
      open={showModal}
      onClose={closeModalHandler}
      className='relative z-10'
    >
      <DialogBackdrop className='fixed inset-0 bg-gray-500/75' />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
            <div className='p-4'>
              {quotationData && isSuccess ? (
                <CalculatedInsurance
                  data={quotationData}
                  saveQuotationHandler={saveQuotationHandler}
                />
              ) : (
                <InsuranceForm
                  initialValues={{
                    period: '',
                    startDate: '',
                    endDate: '',
                    tariff,
                    acc,
                    cr,
                    fc,
                    dta,
                    includeDta: false
                  }}
                  calculateQuotationHandler={calculateQuotationHandler}
                  validations={validations}
                />
              )}
            </div>

            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
              <button
                onClick={closeModalHandler}
                className='mt-3 inline-flex justify-center bg-white px-3 py-2 text-sm text-gray-900 border rounded sm:mt-0 sm:ml-3'
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
