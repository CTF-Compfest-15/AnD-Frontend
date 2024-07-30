import React, { ReactElement, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputRow } from "../common/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdmin, patchAdmin } from "@/components/fetcher/admin";
import { ChallengeDetail } from "@/types/challenge";

type ChallengeFormAttr = Omit<ChallengeDetail, "visibility" | "description_raw"> & {
  visibility: string;
  testcase?: File;
  artifact?: File;
}

interface ChallengeFormProps {
  mode: "new" | "update";
  chall?: ChallengeFormAttr;
  challId?: number;
  onSave?: () => void;
}

function ChallengeForm({ chall, mode, challId, onSave }: ChallengeFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ChallengeFormAttr>({
    defaultValues: chall,
  });
  const updateOrCreateMutation = useMutation({
    mutationFn: (data: ChallengeFormAttr) => {
      console.log(data);
      const testcaseFile = data.testcase;
      const artifactFile = data.artifact;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => (
          value !== "" && value != undefined && key != "testcase" && key != "artifact"
        ))
      );
      const finalChallData = {
        ...cleanData,
        visibility: data.visibility.split(",").map((val) => Number(val)),
      };

      if (mode == "new") {
        const formData = new FormData();
        if (testcaseFile) {
          formData.append('testcase[0]', testcaseFile);
        }
        if (artifactFile) {
          formData.append('artifact[0]', artifactFile);
        }
        formData.append("data", JSON.stringify([finalChallData]));
        return postAdmin("admin/challenges/", { body: formData })
      }
      
      return patchAdmin(`admin/challenges/${challId}`, { json: finalChallData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["challenges"]});
      queryClient.invalidateQueries({queryKey: ["challenge", challId]});
    },
  });

  return (
    <FormProvider {...form}>
      <h4 className="font-bold text-xl">Challenge Edit</h4>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateOrCreateMutation.mutate(data);
          onSave?.();
        })}
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Challenge ID</span>
          </label>
          <input
            type="number"
            value={challId}
            className="input input-bordered"
            readOnly
            disabled
          />
        </div>
        <InputRow
          name="slug"
          label="Slug"
          errorMessage={form.formState.errors.slug?.message ?? ""}
          control={form.control}
        />
        <InputRow
          name="title"
          label="Title"
          errorMessage={form.formState.errors.title?.message ?? ""}
          control={form.control}
        />
        <InputRow
          name="description"
          label="Description"
          errorMessage={form.formState.errors.description?.message ?? ""}
          control={form.control}
          textarea
        />
        <InputRow
          type="number"
          name="num_service"
          label="Number Service"
          errorMessage={form.formState.errors.num_service?.message ?? ""}
          control={form.control}
        />
        <InputRow
          type="number"
          name="num_flag"
          label="Number Flag"
          errorMessage={form.formState.errors.num_flag?.message ?? ""}
          control={form.control}
        />
        <InputRow
          type="number"
          name="point"
          label="Point(s)"
          errorMessage={form.formState.errors.point?.message ?? ""}
          control={form.control}
        />
        <InputRow
          name="visibility"
          label="Rounds Visible (divided by comma)"
          errorMessage={form.formState.errors.visibility?.message ?? ""}
          control={form.control}
        />
        <InputRow
          name="artifact"
          label={`Artifact (zip file): ${chall?.artifact_checksum ?? ""}`}
          type="file"
          control={form.control}
          errorMessage={form.formState.errors.artifact?.message ?? ""}
        />

        <InputRow
          name="testcase"
          label={`Testcase (zip file): ${chall?.testcase_checksum ?? ""}`}
          type="file"
          control={form.control}
          errorMessage={form.formState.errors.testcase?.message ?? ""}
        />

        <div className="flex flex-row justify-end pt-4">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function ChallengeFormModal({
  chall,
  challId,
  btn,
  mode,
}: ChallengeFormProps & {
  btn: ReactElement,
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a onClick={() => ref.current?.showModal()}>{btn}</a>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <ChallengeForm
            mode={mode}
            chall={chall}
            challId={challId}
            onSave={() => ref.current?.close()}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
