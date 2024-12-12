'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/Calendar';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-400">RELEASE DATE*</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full h-12 justify-start text-left font-normal bg-zinc-900/50 border-white/10',
              !date && 'text-zinc-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-white opacity-70" />
            {date ? format(date, 'PPP') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="p-3"
            classNames={{
              months: 'space-y-4',
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'text-sm font-medium text-zinc-100',
              nav: 'space-x-1 flex items-center',
              nav_button:
                'h-7 w-7 bg-transparent p-0 text-zinc-400 hover:text-zinc-100',
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell:
                'text-zinc-500 rounded-md w-9 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-zinc-800/50 [&:has([aria-selected])]:bg-zinc-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day: cn(
                'h-9 w-9 p-0 font-normal',
                'text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100',
                'rounded-md transition-colors'
              ),
              day_range_end: 'day-range-end',
              day_selected:
                'bg-white text-zinc-900 hover:bg-white hover:text-zinc-900 focus:bg-white focus:text-zinc-900 rounded-md',
              day_today: 'bg-zinc-800 text-zinc-100',
              day_outside:
                'day-outside text-zinc-500 opacity-50 aria-selected:bg-zinc-800/50 aria-selected:text-zinc-100 aria-selected:opacity-30',
              day_disabled: 'text-zinc-500',
              day_range_middle:
                'aria-selected:bg-zinc-800 aria-selected:text-zinc-100',
              day_hidden: 'invisible',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
