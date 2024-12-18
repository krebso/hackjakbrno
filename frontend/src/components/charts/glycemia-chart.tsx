"use client";

import React from "react";

import { InputLabel } from "../input-label";
import { GlycemiaResponse } from "@/api/fetch/glycemia";
import { DatePicker } from "../ui/datepicker";

import { OptionSelect, SelectOption } from "../option-select";
import { StreamChartContent } from "./content/stream-chart";
import {
  GlycemiaChartParams,
  useGlycemiaState,
} from "@/lib/queryParsers/glycemia";
import { endOfDay, max } from "date-fns";

type GlycemiaChartProps = {
  response: GlycemiaResponse;
};

export const GlycemiaChart = ({ response }: GlycemiaChartProps) => {
  const [state, setState] = useGlycemiaState();
  const interval = parseInt(state.dataInterval);

  const intervalOptions: SelectOption<GlycemiaChartParams["dataInterval"]>[] = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
  ];

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Glycemia Chart</h2>
        <div className="flex items-center gap-4  mb-4">
          <InputLabel label="From">
            <DatePicker
              date={state?.from}
              fromDate={new Date(response.min_timestamp)}
              toDate={new Date(response.max_timestamp)}
              setDate={(date) =>
                setState({ ...state, from: date ?? new Date(0) })
              }
            />
          </InputLabel>
          <InputLabel label="To">
            <DatePicker
              date={state?.to}
              fromDate={max([new Date(response.min_timestamp), state.from])}
              toDate={new Date(response.max_timestamp)}
              setDate={(date) =>
                setState({ ...state, to: date ? endOfDay(date) : new Date() })
              }
            />
          </InputLabel>

          <InputLabel label="Data interval">
            <OptionSelect<GlycemiaChartParams["dataInterval"]>
              options={intervalOptions}
              defaultValue={state?.dataInterval ?? "15"}
              onValueChange={(value) =>
                setState({ ...state, dataInterval: value })
              }
            />
          </InputLabel>
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <StreamChartContent
          data={response.data}
          interval={interval}
          yAxisLabel="Blood Glucose Level (mmol/l)"
        />
      </div>
    </div>
  );
};
