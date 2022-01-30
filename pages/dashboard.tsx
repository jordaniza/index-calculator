import React from 'react'
import HeatMap from '../src/components/dashboard/charts/HeatMap'
import { LineChart, TimeSeriesLineChart } from '../src/components/dashboard/charts/LineChart'
import PieChart from '../src/components/dashboard/charts/PieChart'
import Panel from '../src/components/ui/Panel'
import { StoreContext } from '../src/context/StoreContext'
import KPITable from '../src/components/dashboard/charts/KPITable'
import TitleCard from '../src/components/ui/TitleCard'
import { StoreContextProps } from '../src/context/StoreContext'
import HeadlineStats from '@/components/dashboard/charts/HeadlineStats'
import { CopyChartJSON } from '@/components/ui/SaveJSON'

function Dashboard() {
  const { store } = React.useContext<StoreContextProps>(StoreContext);
  return (
    <div className="h-screen">
      <TitleCard />
      <HeadlineStats data={store.tables.headlines} />
      <Panel size="h-1/2 m-2 overflow-x-auto" title="Performance Line Chart">
          <CopyChartJSON data={store.lines.performance} />
          <TimeSeriesLineChart data={store.lines.performance} index='% Change'/>
      </Panel>      
      <Panel size="h-1/2 m-2 overflow-x-auto" title="Backtesting Returns Line Chart">
          <CopyChartJSON data={store.lines.returns} />
          <LineChart data={store.lines.returns} index='% Change' />
      </Panel>
      <div className="card bordered m-2" >
        <div className="card-body flex flex-col">
          <CopyChartJSON data={[store.pies]} />
          <h2 className="card-title sm:text-left text-center">Portfolio Split and Risk</h2>       
        </div>
        <div className="flex h-full mb-10 flex-row flex-wrap justify-center items-center">
          <div className="w-1/3 m-3 h-96 flex flex-col" style={{ minWidth: '400px' }}>
            <h3 className="ml-2 w-full mb-3 sm:text-left text-center">Starting Asset Ratios:</h3>
            <PieChart data={store.pies.ratio}/>
          </div>
          <div className="w-1/3 m-3 h-96 flex flex-col" style={{ minWidth: '400px' }}>
            <h3 className="ml-2 w-full mb-3 sm:text-left text-center">Marginal Contribution to Total Risk:</h3>
            <PieChart data={store.pies.mctr}/>
          </div>
        </div>
      </div>      
      <div className="card bordered m-2" >
        <div className="card-body flex flex-col">
          <CopyChartJSON data={[store.heatmaps.correlation]} />
          <h2 className="card-title">Asset Co-relationships</h2>       
        </div>
        <div className="flex h-full mb-10 flex-row flex-wrap justify-center items-center">
          <div className="w-1/3 m-3 h-96 flex flex-col" style={{ minWidth: '400px' }}>
            <HeatMap
              data={store.heatmaps.correlation.data}
              keys={store.heatmaps.correlation.keys}
              index={store.heatmaps.correlation.index}
            />
          </div>
        </div>
      </div>
      <div className="card bordered m-2 p-2">
        <div className="mt-2 flex align-center">
          <h3 className="card-title ml-5 w-full mb-3">Summary Metrics</h3>  
          <CopyChartJSON data={store.tables.kpi} />
        </div>
        <KPITable data={store.tables.kpi} />
      </div>      
    </div>
  )
}

export default Dashboard
