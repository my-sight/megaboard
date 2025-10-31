"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface OverviewSummary {
  activeProjects: number;
  teamFlowItems: number;
  escalations: number;
  topTopics: number;
}

const CHART_COLORS = {
  projects: "#0d8eff",
  flow: "#38a8ff",
  escalations: "#ff7043",
  topics: "#4caf50"
};

export function OverviewCharts({ summary }: { summary: OverviewSummary }) {
  const data = [
    { name: "Projekte", value: summary.activeProjects, fill: CHART_COLORS.projects },
    { name: "Flow Items", value: summary.teamFlowItems, fill: CHART_COLORS.flow },
    { name: "Eskalationen", value: summary.escalations, fill: CHART_COLORS.escalations },
    { name: "Top Themen", value: summary.topTopics, fill: CHART_COLORS.topics }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "rgba(13, 142, 255, 0.1)" }} />
          <Bar dataKey="value" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
