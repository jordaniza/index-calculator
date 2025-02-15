import React from 'react'
import { HeatMapDatum, ResponsiveHeatMap } from '@nivo/heatmap'
import { customTheme } from '../../../utils/theme'
import Tooltip from './tooltips'

type HeatmapTooltipProps = {
  xKey: string,
  yKey: string,
  value: string
};

export const HeatmapToolTip = (props: HeatmapTooltipProps): JSX.Element => (
  <Tooltip title={''}>
    <strong style={{ color: 'black' }}>
      {props.xKey} / {props.yKey}: {props.value}
    </strong>
  </Tooltip>
);

function heatMap({ data, keys, index }: { data: HeatMapDatum[], keys: string[], index: string }): JSX.Element {
  return (
    <ResponsiveHeatMap
        data={data}
        keys={keys}
        indexBy={index}
        tooltip={({ xKey, yKey, value }) => <HeatmapToolTip xKey={xKey} yKey={yKey} value={value}/>}
        forceSquare={true}
        theme={customTheme}
        padding={4}
        margin={{ top: 50, right: 0, bottom: 0, left: 50 }}
        colors="PuRd"
        axisTop={{ tickSize: 5, tickPadding: 5, tickRotation: -90, legend: '', legendOffset: 36 }}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
        }}
        cellOpacity={1}
        cellBorderWidth={4}
        animate={true}
        labelTextColor='black'
        motionStiffness={80}
        motionDamping={9}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.25}
    />
  )
}

export default heatMap
