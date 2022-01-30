import { Option, SelectSearch } from '../src/components/ui/SelectSearch'
import { useState } from 'react'
import IndexForm from '../src/components/form'
import { HelpIcon } from '@/components/ui/HelpIcon';

export default function Home() {
  const [inputValue, setInputValue] = useState<Option>({} as Option);
  const [submit, setSubmit] = useState(0);
  return (
    <div className="hero min-h-screen bg-base-200 w-screen">
      <div className="text-center min-w-[50%]	hero-content flex flex-col">
        <div className="card
          col-span-1
          row-span-3
          w-screen sm:w-full
          shadow-lg 
          xl:col-span-2
          bg-base-100">
        <a
          rel="noreferrer"
          target="_blank"
          href="https://www.notion.so/piedao/Index-Tracker-User-Guide-30dff8814a4d40879fa37fde110ca3d7">
          <HelpIcon className="absolute top-5 right-5" height="25" width="25"/>
        </a>
          <div className="card-body p-5 sm:p-10">
            <h2 className="mt-4 mb-2 text-4xl font-bold card-title">Tiramisu</h2>
            <h2 className="my-5 text-3xl font-bold card-subtitle">PieDAO Index Calculator</h2>
            <span className="flex justify-center">
            <p className="mb-2 card-subtitle" style={{ maxWidth: '500px', textAlign: 'center' }}>
              Use the controls below to add coins to a custom index, then hit `Submit` to compute and visualize the performance and risk metrics of the index.
              If you need help, click the icon in the top right to view the user guide.
            </p>
            </span>
            <div className="my-5">
            <SelectSearch
              value={inputValue}
              setValue={setInputValue}
              submit={submit}
              setSubmit={setSubmit}
              />
            </div>
            <IndexForm coin={inputValue} submit={submit}/>
          </div>
        </div>
      </div>
    </div>
  )
}
