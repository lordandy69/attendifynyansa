//@ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { supabaseClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { format, parseISO } from 'date-fns';
import { studentsJoinedArray } from '@/types/types';

type ClassData = Database['public']['Tables']['classes']['Row'];

type ChartDataPoint = {
  creationTime: string;
  className: string;
  studentCount: number;
};

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

const chartConfig: ChartConfig = {
  studentCount: {
    label: 'Students',
    color: 'hsl(var(--chart-1))',
  },
};

export function ClassesPerDayChart({ acd }: { acd: all_class_data[] }) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = supabaseClient();
      const { data: classes, error } = await supabase
        .from('classes')
        .select('*')
        // .eq('teacher_id', teacherId)
        .order('class_start', { ascending: true });

      if (error) {
        console.error('Error fetching class data:', error);
        return;
      }

      const newChartData: ChartDataPoint[] = acd.map(
        (classItem: ClassData) => ({
          creationTime: format(
            parseISO(classItem?.class_start!),
            'dd MMM yyyy'
          ),
          className: classItem.class_name!,
          studentCount: !classItem.students_joined
            ? 0
            : classItem.students_joined.length,
        })
      );

      console.log(newChartData);
      setChartData(newChartData);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [acd]);

  return (
    <div className='flex flex-col space-y-2'>
      <div>
        <p className='text-neutral-500 text-sm'>
          Showing number of students joined class
        </p>
      </div>
      <div className='w-full'>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='creationTime'
                label={{ value: 'Class Creation Time', position: 'bottom' }}
              />
              <YAxis
                label={{
                  value: 'Number of Students',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator='line' />}
              />
              <Area
                type='monotone'
                dataKey='studentCount'
                name='Students'
                stroke='var(--color-studentCount)'
                fill='var(--color-studentCount)'
                fillOpacity={0.4}
              />
              {/* <Legend /> */}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
