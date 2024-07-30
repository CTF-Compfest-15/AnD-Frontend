import { Checker, CheckerResponse } from "@/types/checker";
import {
  getAdmin,
  useAdminChallenges,
  useAdminTeams,
} from "@/components/fetcher/admin";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/module/common/Pagination/Pagination";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

const checkerResultMap: { [index: number]: string } = {
  0: "Fail",
  1: "Ok",
};

interface CheckerRowProps {
  data: Checker;
}

function FilterPanel() {
  const router = useRouter();
  const { isLoading: challengesLoad, data: challenges } = useAdminChallenges();
  const { isLoading: teamsLoad, data: teams } = useAdminTeams();
  const searchParams = useSearchParams();
  const filterRef: { [index: string]: any } = {
    result: useRef<HTMLSelectElement>(null),
    team_id: useRef<HTMLSelectElement>(null),
    challenge_id: useRef<HTMLSelectElement>(null),
  };

  const resetFiltering = () => {
    router.push("/admin/checker");
    for (const key in filterRef) {
      if (filterRef[key].current === undefined) continue;
      filterRef[key].current.value = "*";
    }
  };

  const applyFiltering = () => {
    const query: { [index: string]: any } = {};
    for (const key in filterRef) {
      if (filterRef[key].current === undefined) continue;
      if (filterRef[key].current.value === "*") continue;
      query[key] = filterRef[key].current.value;
    }

    router.push({
      pathname: "/admin/checker",
      query: query,
    });
  };

  return (
    <div className="border-solid border-2 border-slate-700 rounded-md mb-5 p-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Result</span>
          </label>
          <select
            ref={filterRef["result"]}
            value={searchParams.get("result") ?? undefined}
            className="select select-bordered"
          >
            <option>*</option>
            <option value="0">Fail</option>
            <option value="1">Ok</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Challenge</span>
          </label>
          <select
            ref={filterRef["challenge_id"]}
            value={searchParams.get("challenge") ?? undefined}
            className="select select-bordered"
          >
            <option>*</option>
            {challengesLoad ? (
              <></>
            ) : (
              <>
                {challenges?.data.map((challenge) => (
                  <option
                    value={challenge.id}
                    key={"chall-opt-" + challenge.id}
                  >
                    {challenge.title}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Team</span>
          </label>
          <select
            ref={filterRef["team_id"]}
            value={searchParams.get("team") ?? undefined}
            className="select select-bordered"
          >
            <option>*</option>
            {teamsLoad ? (
              <></>
            ) : (
              <>
                {teams?.data.map((team) => (
                  <option value={team.id} key={"team-opt-" + team.id}>
                    {team.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2 my-4">
        <button onClick={resetFiltering} className="btn btn-secondary">
          Reset
        </button>
        <button onClick={applyFiltering} className="btn btn-primary">
          Apply filter
        </button>
      </div>
    </div>
  );
}

function CheckerRow({ data }: CheckerRowProps) {
  return (
    <tr>
      <th>{data.id}</th>
      <td>{data.time_created}</td>
      <td>{data.challenge_name}</td>
      <td>{data.team_name}</td>
      <td>{checkerResultMap[data.result] ?? "undefined"}</td>
      <td>
        <pre>{data.detail}</pre>
      </td>
    </tr>
  );
}

function CheckerPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, data } = useQuery({
    queryKey: ["checkers", searchParams.toString()],
    queryFn: () =>
      getAdmin<CheckerResponse>("admin/checkresults/", {
        searchParams: searchParams,
      }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div>
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Challenge</th>
              <th>Team</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.data?.map((checker) => (
              <CheckerRow data={checker} key={"checker-" + checker.id} />
            ))}
          </tbody>
        </table>
        <Pagination
          activePage={data?.data.current_page ?? 1}
          prevPage={data?.data.prev_page}
          nextPage={data?.data.next_page}
        />
      </div>
    </div>
  );
}

export default function CheckerPage() {
  return (
    <div className="px-4 justify-center w-full">
      <div className="flex flex-row justify-between">
        <h2 className="py-2 text-2xl font-bold">Checker</h2>
      </div>
      <FilterPanel />
      <CheckerPanel />
    </div>
  );
}
