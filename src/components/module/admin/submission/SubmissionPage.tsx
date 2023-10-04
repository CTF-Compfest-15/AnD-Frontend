import { Submission, SubmissionResponse } from "@/types/submission";
import { getAdmin } from "@/components/fetcher/admin";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/module/common/Pagination/Pagination";

interface SubmissionRowProps {
  data: Submission;
}

function SubmissionRow({ data }: SubmissionRowProps) {
  return (
    <tr>
      <th>{data.id}</th>
      <td>{data.time_created}</td>
      <td>{data.challenge_name}</td>
      <td>{data.team_name}</td>
      <td>{data.value}</td>
      <td>{data.verdict ? "Valid" : "Invalid"}</td>
    </tr>
  );
}

function SubmissionPanel() {
  const searchParams = useSearchParams();
  const { isLoading, data } = useQuery({
    queryKey: ["submissions", searchParams.toString()],
    queryFn: () =>
      getAdmin<SubmissionResponse>("admin/submission/", {
        searchParams: searchParams,
      }),
  });

  return (
    <div>
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div>
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Challenge</th>
                <th>Team</th>
                <th>Value</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.submissions.map((submission) => (
                <SubmissionRow
                  data={submission}
                  key={"submission-" + submission.id}
                />
              ))}
            </tbody>
          </table>
          <Pagination
            activePage={data?.data.current_page ?? 1}
            prevPage={data?.data.prev_page}
            nextPage={data?.data.next_page}
          />
        </div>
      )}
    </div>
  );
}

export default function SubmissionPage() {
  return (
    <div className="px-4 justify-center w-full">
      <div className="flex flex-row justify-between">
        <h2 className="py-2 text-2xl font-bold">Submission</h2>
      </div>
      <SubmissionPanel />
    </div>
  );
}
