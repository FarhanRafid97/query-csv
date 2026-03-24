import React, { memo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import TableTanstack from './result-duckdb/table';

interface ShowListResultProps {
  currentShowingHeadersMultiple: string[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentShowingDataMultiple: any[][][];
}

const ShowListResult: React.FC<ShowListResultProps> = ({
  currentShowingHeadersMultiple,
  currentShowingDataMultiple
}) => {
  console.log('ini currentShowingDataMultiple', currentShowingDataMultiple);
  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="data-0" className="w-full h-full flex flex-col">
        <TabsList className="w-full flex shrink-0  p-0 shadow-none">
          {currentShowingDataMultiple.map((_, index) => (
            <TabsTrigger key={index} value={`data-${index}`}>
              Result {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {currentShowingDataMultiple.map((data, index) => (
          <MemoizedTabContent key={index} heeaders={currentShowingHeadersMultiple[index]} data={data} index={index} />
        ))}
      </Tabs>
    </div>
  );
};

const TabContent = ({
  heeaders,
  data,
  index
}: {
  heeaders: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[][];
  index: number;
}) => {
  return (
    <TabsContent key={index} value={`data-${index}`} className="flex-1 min-h-0">
      <TableTanstack data={data} headers={heeaders} />
    </TabsContent>
  );
};
const MemoizedTabContent = memo(TabContent);

export default ShowListResult;
