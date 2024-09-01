//@ts-nocheck
'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { studentsJoinedArray } from '@/types/types';

export const description =
  'A stacked area chart showing number of students per class over time';

const chartConfig = {
  students: {
    label: 'Students',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type all_class_data = {
  class_end: string | null;
  class_id: string | null;
  class_name: string | null;
  class_start: string | null;
  course_code: string | null;
  created_at: string;
  id: number;
  location: string | null;
  students_joined: studentsJoinedArray[] | null;
  teacher_id: string | null;
  teacher_name: string | null;
};

export function ClassesPerTimeChart({ acd }: { acd: all_class_data[] }) {
  // Ensure acd is not null or undefined
  const chartData =
    acd
      ?.map((classData) => ({
        time: classData.class_start
          ? format(new Date(classData.class_start), 'dd MMM yyyy')
          : '',
        class: classData.class_name,
        students: classData.students_joined?.length || 0,
        rawTime: classData.class_start, // Keep raw time for sorting
      }))
      .sort((a, b) =>
        a.rawTime && b.rawTime
          ? new Date(a.rawTime).getTime() - new Date(b.rawTime).getTime()
          : 0
      ) || [];

  return (
    <div className='card'>
      <div className='card-header'>
        <p className='card-title'>Area Chart - Stacked</p>
        <p className='card-description'>
          Showing number of students per class over time
        </p>
      </div>
      <div className='card-content'>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='time'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickCount={10} // Adjust this value as needed
              domain={[0, 'dataMax']}
              tickFormatter={(tick) => (tick % 1 === 0 ? tick : '')} // Ensure only whole numbers are displayed
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='students'
              type='natural'
              fill='var(--color-students)'
              fillOpacity={0.4}
              stroke='var(--color-students)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </div>
      <div className='card-footer'>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              January - June 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
