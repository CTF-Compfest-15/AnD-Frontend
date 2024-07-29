import useTitle from "@/components/hook/useTitle";
import { useContestContext } from "@/components/module/ContestContext";
import AttackMapPage from "@/components/module/attackmap/AttackMapPage";

export default function AttackMap() {
  const { contest } = useContestContext();
  useTitle(`Attack Map | ${contest.event_name}`);
  return (
      <div className="flex flex-col min-h-screen p-4 container mx-auto gap-4">
        <div className="justify-between flex">
          <h1 className="text-3xl font-bold">Attack Map</h1>
          <strong className="font-bold text-2xl">
            {contest.event_status === "finished" ? (
              "Event Finished!"
            ) : contest.event_status === "not started" ? (
              "Not Started"
            ) : contest.event_status === "running" ? (
              <>
                {contest.number_round > 1
                  ? `Round: ${contest.current_round}`
                  : ""}
                {contest.number_round > 1 && contest.number_tick > 1 && " / "}
                {contest.number_tick > 1
                  ? `Tick: ${contest.current_tick}`
                  : ""}
              </>
            ) : contest.event_status === "paused" ? (
              <>
                {"Paused ("}
                {contest.number_round > 1
                  ? `Round: ${contest.current_round}`
                  : ""}
                {contest.number_round > 1 && contest.number_tick > 1 && " / "}
                {contest.number_tick > 1
                  ? `Tick: ${contest.current_tick}`
                  : ""}
                {")"}
              </>
            ) : (
              "Unknown event state"
            )}
          </strong>
        </div>
        <AttackMapPage />
      </div>
  );
}
