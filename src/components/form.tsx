/* eslint-disable jsx-a11y/accessible-emoji */
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { IndexCalculator } from '../classes/IndexCalculator'
import { convertToStoreData, StoreContext } from '../context/StoreContext'
import { useContext, useEffect, useRef } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Option } from './ui/SelectSearch'
import { Store } from '@/types/store'
import SaveJSONButton, { copyToClipboard } from './ui/SaveJSON'
import { ERROR_MESSAGES, TOOLTIPS } from '@/utils/constants'
import { HelpIcon } from './ui/HelpIcon'
import ErrorMessage from './ui/ErrorMessage'
import { FormApi, ValidationErrors } from 'final-form'

const hasExpectedFields = (index: IndexCalculator): boolean => {
  return Boolean(index.SHARPERATIO && index.STDEV && index.VARIANCE);
}

const stripJSON = (str: string) => str
  .replaceAll("{", '')
  .replaceAll("}", '')
  .replaceAll("[", '')
  .replaceAll("]", '')
  .replaceAll(":", ' : ')
  .replaceAll('","', '" : "')

const getFirstError = (errors: ValidationErrors): string => {
  let errObj: unknown;
  if (errors && errors.portfolio) {
    errObj = errors.portfolio.find((p: unknown) => p);
  } else if (errors) {
    errObj = Object.entries(errors).find((e: unknown) => e);
  } else {
    errObj = { error: "Unknown Error" }
  }
  return stripJSON(JSON.stringify(errObj));
}

const onSubmit = async (values: any, router: NextRouter, setStore?: (store: Store) => void) => {
  try {
    const {
      portfolio,
      computeWeights,
      maxWeight,
      sentimentScore,
      useJson,
      textarea,
      sentimentWeight,
      days,
      exportJSON
    } = values;
    let stop = false;
    let data;
    try {
      data = useJson ? JSON.parse(textarea) : portfolio;
    } catch (e) {
      stop = true;
      alert(ERROR_MESSAGES.INVALIDJSON)
    }
    if(stop) return;
    const indexCalculator = new IndexCalculator(data, maxWeight ? maxWeight : '1', sentimentScore ? sentimentWeight : '0.0', days ? days : 30)
    try {
      await indexCalculator.pullData(data)
    } catch {
      throw new Error(ERROR_MESSAGES.INCORRECTCOINID)
    }
    try {
      indexCalculator.computeAll({
        adjustedWeight: computeWeights,
        sentimentWeight: sentimentScore,
        computeWeights: computeWeights,
      });
    } catch {
      throw new Error(ERROR_MESSAGES.CALCULATIONISSUE)
    }
    if (!hasExpectedFields(indexCalculator)) throw new Error(ERROR_MESSAGES.NOTENOUGHDATA);
    const newStoreData = convertToStoreData(indexCalculator);
    if (newStoreData && setStore) {
      if (exportJSON) copyToClipboard(JSON.stringify(indexCalculator.dataSet), "Copied underlying data to the clipboard");
      setStore(newStoreData);
      router.push('/dashboard');
    };
  } catch (err) {
    console.warn(err);
    alert(err)
  } 
}

const initialFormState = {
  portfolio: [{
    name: 'ETH',
    coingeckoId: 'ethereum',
  }], 
  computeWeights: true,
  sentimentScore: false,
  useJson: false
}

export default function IndexForm(props: { coin: Option, submit: number }) {
  const formRef: React.MutableRefObject<FormApi> = useRef({} as FormApi);
  const { setStore } = useContext(StoreContext);
  const router = useRouter();

  useEffect(() => {
    const { label, value } = props.coin;
    if (label && value) {
      formRef.current.mutators.push('portfolio', {
        name: props.coin.label,
        coingeckoId: props.coin.value
      });  
    };
  }, [props.coin, props.submit]);

  return (
    <Form
      initialValuesEqual={() => true}
      onSubmit={(v) => onSubmit(v, router, setStore)}
      initialValues={initialFormState}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop },
        },
        pristine,
        form,
        submitting,
        values,
      }) => {
        formRef.current = form;
        const valid = form.getState().valid && form.getState().values.portfolio.length > 0;
        const errors = form.getState().errors;
        const hasErrors = errors && Object.entries(errors).length > 0;      
        return (
          <form 
            onSubmit={handleSubmit}>
            { values && values.useJson ?
              <div className="items-end mb-4 w-full h-full">
                <div className="form-control">
                  <Field
                    className="input input-primary w-full h-full input-bordered textarea"
                    name={`textarea`}
                    component="textarea"
                  />
                </div>
              </div>
            : <>
                <FieldArray name="portfolio">
                  {({ fields }) => fields.map((name, index) => (
                    <div className="flex flex-grow justify-between items-center" key={name}>
                      <span className="flex w-[90%] sm:space-x-3 justify-center sm:justify-start flex-wrap">
                      <div className="form-control mb-3 mr-1 w-full sm:w-48">
                        <Field
                          className="input input-primary input-bordered "
                          name={`${name}.name`}
                          component="input"
                          placeholder="Name"
                          validate={v => v ? undefined : 'Missing Input'}
                          />
                      </div>
                      <div className="form-control mr-1 w-full sm:w-48">
                        <Field
                          className="input input-primary input-bordered min-w-95"
                          name={`${name}.coingeckoId`}
                          placeholder="Coingecko ID"
                          component="input"
                          validate={v => v ? undefined : 'Missing Input'}
                          />
                      </div>
                      {values && values.computeWeights === false ?
                        <div className="form-control">
                          <Field
                            className={`input input-primary input-bordered`}
                            name={`${name}.RATIO`}
                            component="input"
                            placeholder="Ratio"
                            type="number"
                            validate={v => (v <= 1 && v > 0) ? undefined : 'Must be between 0 and 1'}
                            />
                        </div>
                        : ''}
                      {values && values.sentimentScore ?
                        <div className="form-control">
                          <Field
                            className={`input input-primary input-bordered`}
                            name={`${name}.sentimentScore`}
                            component="input"
                            placeholder="Score"
                            type="number"
                            validate={v => (v <= 12 && v > 0) ? undefined : 'Sentiment score is from 1 to 12'}
                            />
                        </div>
                        : ''}
                      </span>
                      <span className="flex flex-end w-[9%] mr-1">
                      <button
                        type="button"
                        onClick={() => fields.remove(index)}
                        className={`btn btn-square btn-ghost`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-6 h-6 stroke-current text-error"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                      </span>
                    </div>
                  ))}
                </FieldArray>
                <div className="justify-start space-x-2 my-1 card-actions">
                  <button className="btn btn-primary " type="button" onClick={() => {
                    push('portfolio', undefined)}
                  }>
                    Add Coin Manually
                  </button>
                  <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="useJson"
                    component="input"
                    type="checkbox"
                    placeholder=""
                    id="useJson" />
                  <label htmlFor="sentimentScore" className="label">
                    <span className="label-text">Advanced Editor</span>
                  </label>
                </div>                  
                </div>
              </>
              }
              <div className="divider"/>
              <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="computeWeights"
                    component="input"
                    type="checkbox"
                    placeholder="Ratio"
                    id="computeWeights" />
                  <label htmlFor="computeWeights" className="label">
                    <span className="label-text">Compute Weights Automatically</span>
                    <div className="tooltip tooltip-top" data-tip={TOOLTIPS.COMPUTE_WEIGHTS}>
                      <HelpIcon className="ml-2"/>
                    </div>
                  </label>
                </div>
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="sentimentScore"
                    component="input"
                    type="checkbox"
                    placeholder="Ratio"
                    id="sentimentScore"
                    />
                  <label htmlFor="sentimentScore" className="label">
                    <span className="label-text">Use Sentiment Score</span>
                    <div className="tooltip tooltip-top" data-tip={TOOLTIPS.SENTIMENT_SCORE}>
                      <HelpIcon className="ml-2"/>
                    </div>
                  </label>
                </div>
                { values && values.sentimentScore ? 
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1 w-7 text-center text-black"
                    name="sentimentWeight"
                    component="input"
                    placeholder="1"
                    id="sentimentWeight"
                    validate={v => (v <= 1 && v > 0) ? undefined : 'Must be between 0 and 1'}
                    />
                  <label htmlFor="sentimentWeight" className="label">
                    <span className="label-text">Sentiment Weights</span>
                  </label>
                </div>
                : '' }
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="exportJSON"
                    component="input"
                    type="checkbox"
                    placeholder=""
                    id="exportJSON" />
                  <label htmlFor="exportJSON" className="label">
                    <span className="label-text">Copy data on Submit</span>
                    <div className="tooltip tooltip-top" data-tip={TOOLTIPS.EXPORTJSON}>
                      <HelpIcon className="ml-2"/>
                    </div>                          
                  </label>
                </div>                 
                {values && values.computeWeights ? <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1 w-10 text-center text-black"
                    name="maxWeight"
                    component="input"
                    placeholder="1"
                    id="maxWeight"
                    validate={v => v ? (v <= 1 && v > 0) ? undefined : 'Must be between 0 and 1' : undefined }
                    />
                  <label htmlFor="maxWeight" className="label">
                    <span className="label-text">Max Weights</span>
                    <div className="tooltip tooltip-top" data-tip={TOOLTIPS.MAX_WEIGHTS}>
                      <HelpIcon className="ml-2"/>
                    </div>                    
                  </label>
                </div>
                : '' }
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1 w-10 text-center text-black"
                    name="days"
                    component="input"
                    placeholder="30"
                    id="days" 
                    />
                  <label htmlFor="days" className="label">
                    <span className="label-text">Number of Days</span>
                    <div className="tooltip tooltip-top" data-tip={TOOLTIPS.DAYS}>
                      <HelpIcon className="ml-2"/>
                    </div>                          
                  </label>
                </div>                               
                  {
                    hasErrors && <ErrorMessage
                      error={`Error in field ${getFirstError(errors)}`}
                    />
                  }
              <div className="divider"/>
                <div className="card-actions justify-between">
                  <SaveJSONButton data={form.getState().values} />
                  <div className="justify-end space-x-2">
                  <button
                    className={`btn btn-primary ${submitting && 'loading'}`}
                    type="submit"
                    disabled={!valid || submitting}
                  >
                    Submit
                  </button>
                  <button
                    className={`btn btn-primary ${submitting && 'loading'}`}
                    type="button"
                    onClick={form.reset}
                    disabled={submitting}
                  >
                    Reset
                  </button>
                </div>
              </div>
          </form>
        )
      }}
    />
  )
}
