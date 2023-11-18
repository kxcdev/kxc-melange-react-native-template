import { FunctionComponent } from "react";

export { step1_title } from "./output/jsland/apps/mobile-app/melsrc/entrypoint";
import * as entrypoint from "./output/jsland/apps/mobile-app/melsrc/entrypoint";

export const OCamlSection = {
  sectionTitle: entrypoint.OCaml_section.section_title,
  Body: entrypoint.OCaml_section.body$p as FunctionComponent<{
    initialCounterValue?: number;
  }>,
};

export const AccumulatorExample: FunctionComponent<{
  initialAccumulatorValue?: number;
}> = entrypoint.Accumulator_example.body$p;
