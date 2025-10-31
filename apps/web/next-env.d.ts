/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
