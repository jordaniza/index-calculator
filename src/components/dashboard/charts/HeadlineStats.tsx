import { HeadlineStat } from "@/types/indexCalculator";

const Headline = ({ data }: { data: HeadlineStat[] }): JSX.Element => (
  <div className="w-full stats flex-wrap flex sm:grid">
    {data.map(d => (
      <div key={d.title} className="stat place-items-center place-content-center">
        <div className="stat-title">{ d. title }</div> 
        <div className={ d.text ? `stat-value ${d.text}` : 'stat-value' }>{ d.value }</div> 
        {d.change && <div className="stat-desc">{ d.change }</div>}
      </div> 
    ))}
  </div>
);

export default Headline