import * as React from 'react'
import {useFetcher} from 'remix'
import {useRootData} from '~/utils/use-root-data'
import {ArrowButton} from '~/components/arrow-button'
import {Field} from '~/components/form-elements'
import {CheckIcon} from '~/components/icons/check-icon'
import type {ActionData} from './types'

function ConvertKitForm({
  formId,
  convertKitTagId,
  convertKitFormId,
}: {formId: string} & (
  | {convertKitTagId?: never; convertKitFormId: string}
  | {convertKitTagId: string; convertKitFormId?: never}
  | {convertKitTagId: string; convertKitFormId: string}
)) {
  const convertKit = useFetcher()
  const formRef = React.useRef<HTMLFormElement>(null)
  const convertKitData: ActionData | null =
    convertKit.type === 'done' ? convertKit.data : null
  React.useEffect(() => {
    if (formRef.current && convertKitData?.status === 'success') {
      formRef.current.reset()
    }
  }, [convertKitData])

  const {user, userInfo} = useRootData()

  const alreadySubscribed = userInfo?.convertKit?.tags.some(
    ({id}) => id === convertKitTagId,
  )

  if (alreadySubscribed) {
    return (
      <div>{`Actually, it looks like you're already signed up to be notified.`}</div>
    )
  }

  const success =
    convertKit.type === 'done' && convertKitData?.status === 'success'

  return (
    <convertKit.Form
      ref={formRef}
      action="/action/convert-kit"
      className="mt-8 space-y-4"
      method="post"
      noValidate
    >
      <input type="hidden" name="formId" value={formId} />
      <input type="hidden" name="convertKitTagId" value={convertKitTagId} />
      <input type="hidden" name="convertKitFormId" value={convertKitFormId} />
      <Field
        name="firstName"
        label="First name"
        error={
          convertKitData?.status === 'error'
            ? convertKitData.errors.firstName
            : null
        }
        autoComplete="firstName"
        defaultValue={user?.firstName}
        required
        disabled={convertKit.state !== 'idle' || success}
      />

      <Field
        name="email"
        label="Email"
        autoComplete="email"
        error={
          convertKitData?.status === 'error'
            ? convertKitData.errors.email
            : null
        }
        defaultValue={user?.email}
        disabled={convertKit.state !== 'idle' || success}
      />

      {success ? (
        <div className="flex">
          <CheckIcon />
          <p className="text-secondary">
            {userInfo?.convertKit
              ? `Sweet, you're all set`
              : `Sweet, check your email for confirmation.`}
          </p>
        </div>
      ) : (
        <ArrowButton className="pt-4" type="submit" direction="right">
          Sign me up
        </ArrowButton>
      )}
    </convertKit.Form>
  )
}

export {ConvertKitForm}
