import React, { ReactNode } from 'react'

interface PanelProps {
  title: string;
  size?: string;
  children: ReactNode
}

function Panel(props: PanelProps): JSX.Element {
  const className = `card bordered overflow-x-auto ${props.size ?? 'h-96' }`;
  return (
    <div className={className} style={{ minHeight: "600px" }}>
      <div className="card-body min-w-[1000px]">
        <h2 className="card-title">{ props.title }</h2>       
        { props.children }
      </div>
    </div> 
  )
}

export default Panel
