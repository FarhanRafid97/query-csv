import { FileIcon } from '@radix-ui/react-icons';
import { useRef } from 'react';
import { CSVLink } from 'react-csv';

const ExportCsv = ({ data, headers }: { data: object[]; headers: { label: string; key: string }[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  return (
    <>
      <CSVLink ref={ref} data={data} headers={headers} filename={`data-${new Date().toISOString()}.csv`}>
        <FileIcon className="w-2 h-2" />
        Save
      </CSVLink>
    </>
  );
};

export default ExportCsv;
