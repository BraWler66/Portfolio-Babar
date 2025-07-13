export type BuildLog = {
  date: string
  title: string
  content: string
  project?: string
  tags: string[]
  status?: 'completed' | 'in-progress' | 'planned'
  impact?: string
  challenges?: string[]
  nextSteps?: string[]
}

export const buildLogs: BuildLog[] = [
  // {
  //   date: "2023-09-15",
  //   title: "Solving state management in DecentralWatch",
  //   content: "Today I refactored the state management in DecentralWatch to use Zustand. This simplified a lot of the component logic and fixed several race conditions we were seeing with the previous Redux setup. Need to write tests to make sure everything's solid.",
  //   project: "DecentralWatch",
  //   tags: ["Zustand", "Refactor", "State Management"],
  //   status: "completed",
  //   impact: "Reduced bundle size by 15% and improved state update performance by 40%",
  //   challenges: ["Migrating existing Redux state", "Handling async operations"],
  //   nextSteps: ["Write comprehensive tests", "Document the new state management pattern"]
  // },
]