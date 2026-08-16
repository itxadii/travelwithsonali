declare module "next-sanity/studio" {
  import { ComponentType } from "react";
  import { Config } from "sanity";

  export interface NextStudioProps {
    config: Config;
    unstable_globalZone?: boolean;
  }

  export const NextStudio: ComponentType<NextStudioProps>;
}
