import React from 'react';
import { PropsWithChildren } from 'react-transition-group/node_modules/@types/react';

export const copyToClipboard = (data: string, message: string) => {
  const el = document.createElement('textarea');
  el.value = data;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert(message)
};

const SaveJSONButton = (props: { data: { portfolio: Array<any> } }): JSX.Element => {
  let latest: string | null = null;
  if (typeof window !== 'undefined') {
    latest = localStorage.getItem('latest');
  }

  const fromLocal = () => {
    const _latest = localStorage.getItem('latest')
    _latest ? copyToClipboard(_latest, 'Copied most recent index to clipboard') : alert('Couldn\'t find previous index');
  }
  const click = () => {
    if (!props.data || props.data.portfolio.length === 0) {
      alert('Nothing to Copy')
    } else {
      const portfolio = JSON.stringify(props.data.portfolio);
      copyToClipboard(portfolio, 'Saved Index to local storage, you can retrieve it by hitting "load saved index"');
      localStorage.setItem('latest', portfolio);
    }
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary" 
        onClick={click}>Save Index
      </button>
      {
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!latest} 
          onClick={fromLocal}>Load Saved Index
        </button>
      }
    </>
  )
}

export const CopyChartJSON = (props: { data: unknown[] }): JSX.Element => {
  const click = () => {
    const data = JSON.stringify(props.data);
    copyToClipboard(data, 'Exported JSON to clipboard');
  }
  return (
      <button
        type="button"
        className="btn btn-primary btn-xs absolute sm:right-5 sm:top-5 bottom-5  max-w-1/2" 
        onClick={click}>Export
      </button>
    )
}

export default SaveJSONButton;

